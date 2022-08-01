locals {
  sequencer_env_vars = [
    { name = "SEQ_CONFIG", value = local.local_sequencer_config },
    { name = "ENVIRONMENT", value = var.environment },
    { name = "STAGE", value = var.stage },
    { name = "DD_PROFILING_ENABLED", value = "true" },
    { name = "DD_ENV", value = var.stage },
    { name = "DD_SERVICE", value = "sequencer-${var.environment}" }
  ]
  router_env_vars = [
    { name = "NXTP_CONFIG", value = local.local_router_config },
    { name = "ENVIRONMENT", value = var.environment },
    { name = "STAGE", value = var.stage },
    { name = "DD_PROFILING_ENABLED", value = "true" },
    { name = "DD_ENV", value = var.stage },
    { name = "DD_SERVICE", value = "router-${var.environment}" }
  ]
  lighthouse_env_vars = [
    { name = "NXTP_CONFIG", value = local.local_lighthouse_config },
    { name = "ENVIRONMENT", value = var.environment },
    { name = "STAGE", value = var.stage }
  ]
  web3signer_env_vars = [
    { name = "WEB3_SIGNER_PRIVATE_KEY", value = var.web3_signer_private_key },
    { name = "WEB3SIGNER_HTTP_HOST_ALLOWLIST", value = "*" }
  ]
}

locals {
  local_sequencer_config = jsonencode({
    redis = {
      host = module.sequencer_cache.redis_instance_address,
      port = module.sequencer_cache.redis_instance_port
    }

    server = {
      adminToken = var.admin_token_router
    }

    logLevel = "debug"
    chains = {
      "1111" = {
        providers = ["https://eth-rinkeby.alchemyapi.io/v2/${var.rinkeby_alchemy_key_0}", "https://rpc.ankr.com/eth_rinkeby"]
        assets = [
          {
            name    = "TEST"
            address = "0x3ffc03f05d1869f493c7dbf913e636c6280e0ff9"
          }
        ]
      }
      "3331" = {
        providers = ["https://eth-goerli.alchemyapi.io/v2/${var.goerli_alchemy_key_0}", "https://rpc.ankr.com/eth_goerli"]
        assets = [
          {
            name    = "TEST"
            address = "0x26FE8a8f86511d678d031a022E48FfF41c6a3e3b"
          }
        ]
      }
      "9991" = {
        providers = ["https://polygon-testnet.blastapi.io/${var.mumbai_blast_key_0}", "https://rpc.ankr.com/polygon_mumbai"]
        assets = [
          {
            name    = "TEST"
            address = "0x21c5a4dAeAf9625c781Aa996E9229eA95EE4Ff77"
          },
          {
            name    = "WETH"
            address = "0x4E2FCcA06dA37869047d84b82364d1831E5aa7E1"
          }
        ]
      }
    }

    environment = var.stage
    messageQueue = {
      connection = {
        uri = "amqps://${var.rmq_mgt_user}:${var.rmq_mgt_password}@${module.centralised_message_queue.aws_mq_amqp_endpoint}"
      }
      exchanges = [
        {
          name           = "sequencerX"
          type           = "direct"
          publishTimeout = 1000
          persistent     = true
          durable        = true
        }
      ]
      queues = [
        {
          name       = "1111"
          limit      = 3
          queueLimit = 10000
          subscribe  = true
        },
        {
          name       = "3331"
          limit      = 3
          queueLimit = 10000
          subscribe  = true
        },
        {
          name       = "9991"
          limit      = 3
          queueLimit = 10000
          subscribe  = true
        }
      ]
      bindings = [
        {
          exchange = "sequencerX"
          target   = "1111"
          keys     = ["1111"]
        },
        {
          exchange = "sequencerX"
          target   = "3331"
          keys     = ["3331"]
        },
        {
          exchange = "sequencerX"
          target   = "9991"
          keys     = ["9991"]
        }
      ]
      executerTimeout = 300000
      publisher       = "sequencerX"
    }
  })
}


locals {
  local_router_config = jsonencode({
    redis = {
      host = module.router_cache.redis_instance_address,
      port = module.router_cache.redis_instance_port
    },
    logLevel     = "debug"
    sequencerUrl = "https://${module.sequencer_publisher.service_endpoint}"
    server = {
      adminToken = var.admin_token_router
      pub = {
        port = 8080
      }
      sub = {
        port = 8080
      }
    }
    chains = {
      "1111" = {
        providers = ["https://eth-rinkeby.alchemyapi.io/v2/${var.rinkeby_alchemy_key_0}", "https://rpc.ankr.com/eth_rinkeby"]
        assets = [
          {
            name    = "TEST"
            address = "0x3ffc03f05d1869f493c7dbf913e636c6280e0ff9"
          }
        ]
      }
      "3331" = {
        providers = ["https://eth-goerli.alchemyapi.io/v2/${var.goerli_alchemy_key_0}", "https://rpc.ankr.com/eth_goerli"]
        assets = [
          {
            name    = "TEST"
            address = "0x26FE8a8f86511d678d031a022E48FfF41c6a3e3b"
          }
        ]
      }
      "9991" = {
        providers = ["https://polygon-testnet.blastapi.io/${var.mumbai_blast_key_0}", "https://rpc.ankr.com/polygon_mumbai"]
        assets = [
          {
            name    = "TEST"
            address = "0x21c5a4dAeAf9625c781Aa996E9229eA95EE4Ff77"
          },
          {
            name    = "WETH"
            address = "0x4E2FCcA06dA37869047d84b82364d1831E5aa7E1"
          }
        ]
      }
    }
    web3SignerUrl    = "https://${module.web3signer.service_endpoint}"
    environment      = var.stage
    nomadEnvironment = var.nomad_environment
    messageQueue = {
      uri = "amqps://${var.rmq_mgt_user}:${var.rmq_mgt_password}@${module.centralised_message_queue.aws_mq_amqp_endpoint}"
    }
  })
}

locals {
  local_lighthouse_config = jsonencode({
    logLevel = "debug"
    chains = {
      "1111" = {
        providers = ["https://eth-rinkeby.alchemyapi.io/v2/${var.rinkeby_alchemy_key_1}"]
      }
      "3331" = {
        providers = ["https://eth-goerli.alchemyapi.io/v2/${var.goerli_alchemy_key_1}"]
      }
      "9991" = {
        providers = ["https://polygon-testnet.blastapi.io/${var.mumbai_blast_key_0}", "https://rpc.ankr.com/polygon_mumbai"]
      }
    }
    environment = var.stage
  })
}
