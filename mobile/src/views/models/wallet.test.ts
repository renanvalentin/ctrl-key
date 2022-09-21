import { WalletViewModel } from './wallet';
import * as fixtures from './wallet.fixture';

jest.mock('../../core/cardano-serialization-lib', () => ({
  __esModule: true,
  ...require('../../__tests__/cardano-serialization-lib'),
}));

it('wallet summary', async () => {
  const name = 'w';
  const summary = WalletViewModel.summary(name, fixtures.wallet);

  expect(summary).toEqual({
    name,
    balance: '11.538668 ADA',
    marketPrice: expect.any(String),
    txs: [
      {
        type: 'withdrawal',
        amount: '-2.182221 ADA',
        fees: '0.182221 ADA',
        date: '2022/09/08 08:58:10 PM',
        id: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
      },
      {
        type: 'received',
        amount: '10.000000 ADA',
        date: '2022/09/08 08:56:47 PM',
        id: '378eac004bdec2421456d507b8549eedd69955182e29d469c3b2833f6473d5ce',
        fees: undefined,
      },
      {
        type: 'withdrawal',
        amount: '-1.279111 ADA',
        fees: '0.171441 ADA',
        date: '2022/09/07 10:08:00 PM',
        id: '03bb413faf369b8990b95eb5c0f1ca08c0f8199ea32b31ea7501f70f3c60ba89',
      },
      {
        type: 'received',
        amount: '5.000000 ADA',
        date: '2022/09/07 09:45:57 PM',
        id: '7b94e19a39d437ea8ae8a836309b1c39f9b549f0cd02eefd271ee83975ac5893',
        fees: undefined,
      },
      {
        type: 'withdrawal',
        amount: '-2.000000 ADA',
        fees: '0.892330 ADA',
        date: '2022/09/07 09:44:22 PM',
        id: '86b6173a53568e464bafce315ec6f61de0d5c180e144d9c2c57b86bb012fc0d2',
      },
      {
        type: 'received',
        amount: '2.000000 ADA',
        date: '2022/09/06 09:28:14 PM',
        id: '87eb5358c1480739beed120e99e43ffc7e2c4a518bfb0a07c268a47e1db08b5b',
        fees: undefined,
      },
    ],
  });
});
