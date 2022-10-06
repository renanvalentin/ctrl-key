import { TxDirection, Wallet } from '@ctrl-k/schema';

export const wallet: Wallet = {
  balance: '11538668',
  marketPrice: 40.48,
  txs: [
    {
      type: TxDirection.Outgoing,
      amount: '-2182221',
      fees: '182221',
      date: 1662685090,
      id: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
    },
    {
      type: TxDirection.Incoming,
      amount: '10000000',
      fees: null,
      date: 1662685007,
      id: '378eac004bdec2421456d507b8549eedd69955182e29d469c3b2833f6473d5ce',
    },
    {
      type: TxDirection.Outgoing,
      amount: '-1279111',
      fees: '171441',
      date: 1662602880,
      id: '03bb413faf369b8990b95eb5c0f1ca08c0f8199ea32b31ea7501f70f3c60ba89',
    },
    {
      type: TxDirection.Incoming,
      amount: '5000000',
      fees: null,
      date: 1662601557,
      id: '7b94e19a39d437ea8ae8a836309b1c39f9b549f0cd02eefd271ee83975ac5893',
    },
    {
      type: TxDirection.Outgoing,
      amount: '-2000000',
      fees: '892330',
      date: 1662601462,
      id: '86b6173a53568e464bafce315ec6f61de0d5c180e144d9c2c57b86bb012fc0d2',
    },
    {
      type: TxDirection.Incoming,
      amount: '2000000',
      fees: null,
      date: 1662514094,
      id: '87eb5358c1480739beed120e99e43ffc7e2c4a518bfb0a07c268a47e1db08b5b',
    },
  ],
};
