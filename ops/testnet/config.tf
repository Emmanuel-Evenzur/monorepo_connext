locals {
  local_sequencer_config = jsonencode({
    redis =  {
      host: module.sequencer_cache.redis_instance_address,
      port: module.sequencer_cache.redis_instance_port
    },
    "logLevel" = "debug"
    "chains" = {
      "2000" = {
        "providers" = ["https://eth-rinkeby.alchemyapi.io/v2/${var.rinkeby_alchemy_key_0}"]
        "subgraph" = {
          "runtime"   = ["https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-rinkeby"]
          "analytics" = [""]
        }
        "assets" = [{
          "name"    = "TEST"
          "address" = "0xcF4d2994088a8CDE52FB584fE29608b63Ec063B2"
        }]
      }
      "3000" = {
        "providers" = ["https://eth-kovan.alchemyapi.io/v2/${var.kovan_alchemy_key_0}"]
        "subgraph" = {
          "runtime" = ["https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-kovan"]
          "analytics" : [""]
        }
        "assets" = [{
          "name"    = "TEST"
          "address" = "0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F"
        }]
      }
    }
  })
}


locals {
  local_router_config = jsonencode({
    redis =  {
      host: module.router_cache.redis_instance_address,
      port: module.router_cache.redis_instance_port
    },
    logLevel     = "debug"
    sequencerUrl = "https://${module.sequencer.service_endpoint}"
    server = {
      adminToken = var.admin_token_router
      port       = 8080
    }
    chains = {
      2000 = {
        providers = ["https://eth-rinkeby.alchemyapi.io/v2/${var.rinkeby_alchemy_key_1}"]
        subgraph = {
          runtime = ["https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-rinkeby"]
          analytics : [""]
        }
        assets = [
          {
            name    = "TEST"
            address = "0xcF4d2994088a8CDE52FB584fE29608b63Ec063B2"
          }
        ]
      }
      3000 = {
        "providers" = ["https://eth-kovan.alchemyapi.io/v2/${var.kovan_alchemy_key_1}"]
        subgraph = {
          runtime   = ["https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-kovan"]
          analytics = [""]
        }
        assets = [
          {
            name    = "TEST"
            address = "0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F"
          }
        ]
      }
    }
    mnemonic = var.mnemonic
  })
}
