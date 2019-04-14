"use strict";
// tslint:disable:object-literal-sort-keys
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
  networks: {
    mainnet: {
      bip32: {
        private: 46090600,
        public: 46089520,
      },
      name: 'mainnet',
      nethash: 'a28cfbd5475471d9c23186976b17a482138de2c6edfc7daf0919a159d2c524e6',
      token: 'KAPU',
      symbol: 'ʞ',
      version: 0x2D,
      explorer: 'http://explorer.kapu.one',
      wif: 0xaa,
      p2pPort: 9701,
      apiPort: 9702,
      p2pVersion: '2.0.0',
      isV2: true,
      activePeer: {
        ip: '51.15.136.166',
        port: 9702,
      },
      peers: [
        {
          ip: '51.15.136.166',
          port: 9702
        },
        {
          ip: '51.15.84.139',
          port: 9702
        },
        {
          ip: '13.80.106.203',
          port: 9702
        },
        {
          ip: '51.15.90.150',
          port: 9702
        },
        {
          ip: '51.15.113.226',
          port: 9702
        },
        {
          ip: '51.15.115.99',
          port: 9702
        },
        {
          ip: '137.74.20.83',
          port: 9702
        }
      ],
    },
    devnet: {
      bip32: {
        public: 0x043587cf,
        private: 0x04358394,
      },
      name: 'devnet',
      nethash: 'f1ef11be7a879671b3019a785c9a2c9dbd9d800b05644d26ad132275ffe2dd48',
      token: 'KAPU',
      symbol: 'Dʞ',
      version: 0x50,
      explorer: 'https://explorer.devnet.kapunode.net',
      wif: 0xba,
      p2pPort: 9701,
      apiPort: 9702,
      p2pVersion: '2.0.0',
      isV2: true,
      activePeer: {
        ip: '199.247.24.132',
        port: 4100,
      },
      peers: [
      ],
    },
  },
  blockchain: {
    interval: 8,
    delegates: 51,
    date: new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0)),
  },
};
//# sourceMappingURL=index.js.map

console.log('using kapu costum content');
