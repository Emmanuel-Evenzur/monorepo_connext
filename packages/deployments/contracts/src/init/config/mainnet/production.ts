import { InitConfig } from "../../helpers";

export const MAINNET_PRODUCTION_INIT_CONFIG: InitConfig = {
  hub: "6648936", // MAINNET
  supportedDomains: [
    "6648936", // MAINNET
    "1869640809", // OPTIMISM
    "1886350457", // POLYGON
    // "1634886255", // ARBITRUM ONE
    "6450786", // BNB
    "6778479", // GNOSIS
  ],
  liquidity: true,
  assets: [
    {
      name: "USDC",
      canonical: {
        domain: "6648936",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
      },
      representations: {
        "1869640809": {
          local: "0xFF748Daa6C2eAa1d3Ac78D2Ce8Ab84c25a53e68A",
          adopted: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        },
        "1886350457": {
          local: "0x6653e37db7eEEe514ACD0998f66e66c75F216699",
          adopted: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        },
        // "1634886255": {
        //   local: "0x85fb8e2903ad92a2ab0c6a725806636666ee2ab4",
        //   adopted: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        // },
        "6450786": {
          local: "0x58B04866a734677bC66fC2Bf405860D658Ae4a05",
          adopted: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        },
        "6778479": {
          local: "0x7e0F3216A74888E8eE3C839C27db1b4a3D8C1CC3",
          adopted: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
        },
      },
    },
    {
      name: "WETH",
      canonical: {
        domain: "6648936",
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: 18,
      },
      representations: {
        "1869640809": {
          local: "0x30E049eda6Da0cc0b4F5e39B51FD25666E38b24E",
          adopted: "0x4200000000000000000000000000000000000006",
        },
        "1886350457": {
          local: "0xd824518dF03a41d7124115799f78973A603D42f7",
          adopted: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        },
        // "1634886255": {
        //   local: "0xfd5c16a50b717338cbcb44e34e10d735709e9cb9",
        //   adopted: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        // },
        "6450786": {
          local: "0xcEc11a1963BBA00e18255Ba590623cD99Ed38D42",
          adopted: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        },
        "6778479": {
          local: "0x475e647B3E31585466506bd36c6a59822DC32A08",
          adopted: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
        },
      },
    },
    {
      name: "KP3R",
      canonical: {
        domain: "6648936",
        address: "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44",
        decimals: 18,
      },
      representations: {
        // optimism
        "1869640809": {
          local: "0x3975e0292bEF3Fca8feF414f01E120652Ac60A69",
          adopted: "0x3975e0292bEF3Fca8feF414f01E120652Ac60A69",
        },
        // polygon
        "1886350457": {
          local: "0xE810e6F30A2dF7677aFDc13a3746D132295E7b0D",
          adopted: "0xE810e6F30A2dF7677aFDc13a3746D132295E7b0D",
        },
        // bnb
        "6450786": {
          local: "0x14b72bef1447c9eaececf7baeb9cf2c63910819f",
          adopted: "0x14b72bef1447c9eaececf7baeb9cf2c63910819f",
        },
        // gnosis
        "6778479": {
          local: "0x98a8dfc12cb844e199993c75acd6856960eb6186",
          adopted: "0x98a8dfc12cb844e199993c75acd6856960eb6186",
        },
      },
    },
    {
      name: "kLP",
      canonical: {
        domain: "6648936",
        address: "0x3f6740b5898c5D3650ec6eAce9a649Ac791e44D7",
        decimals: 18,
      },
      representations: {
        // optimism
        "1869640809": {
          local: "0xafe2bbc98af9fcff73596ebe1327b27d8a16d06b",
          adopted: "0xafe2bbc98af9fcff73596ebe1327b27d8a16d06b",
        },
        // polygon
        "1886350457": {
          local: "0x9902932c0a200ad16a19ad6863baa72f19409780",
          adopted: "0x9902932c0a200ad16a19ad6863baa72f19409780",
        },
        // bnb
        "6450786": {
          local: "0x9d1cae770ecca019ea36c4ddfcbe114c754e14ed",
          adopted: "0x9d1cae770ecca019ea36c4ddfcbe114c754e14ed",
        },
        // gnosis
        "6778479": {
          local: "0xf2b1aa2bea51460c7083b430cdda0c990eddb5fa",
          adopted: "0xf2b1aa2bea51460c7083b430cdda0c990eddb5fa",
        },
      },
    },
  ],
  agents: {
    watchers: {
      allowlist: ["0xade09131C6f43fe22C2CbABb759636C43cFc181e"],
    },
    routers: {
      allowlist: ["0xF26c772C0fF3a6036bDdAbDAbA22cf65ECa9F97c"],
    },
    sequencers: {
      allowlist: ["0x4fFA5968857a6C8242E4A6Ded2418155D33e82E7"],
    },
    relayers: {
      allowlist: [
        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
        "0x935AaAe0f5b02007c08512F0629a9d37Af2E1A47",
        "0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007",
        "0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE",
        "0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78",
        "0x43728A95386D64384C76Afd416Dcc8118869BA6c",
        "0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6",
      ],
    },
  },
};
