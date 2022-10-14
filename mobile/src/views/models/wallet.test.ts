/** @jest-environment setup-polly-jest/jest-environment-node */
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { HotWallet } from '@ctrlK/core';
import fetch from 'cross-fetch';
import { WalletViewModel } from './wallet';
import * as fixtures from './wallet.fixture';
import { autoSetupPolly, encryptRecord } from '../../polly';
import { DescriptorEvent, Device, Observer } from '@ledgerhq/hw-transport';
import { createApolloClient } from '../../apollo';
import { SUBSCRIPTION_PENDING_TX } from './queries';

jest.mock('../../core/cardano-serialization-lib', () => ({
  __esModule: true,
  ...require('../../__tests__/cardano-serialization-lib'),
}));

jest.mock('@ledgerhq/react-native-hw-transport-ble', () => ({
  __esModule: true,
  default: {
    listen: (observer: Observer<DescriptorEvent<Device>>) => {
      observer.next({
        type: 'add',
        descriptor: jest.fn(),
        device: jest.fn(),
      });

      observer.complete();
    },
    open: jest.fn(),
  },
}));

describe('wallet view model', () => {
  let context = autoSetupPolly();

  beforeEach(() => encryptRecord(context));

  it('wallet summary', async () => {
    const name = 'w';
    const summary = WalletViewModel.summary(name, fixtures.wallet);

    expect(summary).toEqual({
      name: 'w',
      marketPrice: '40.48 USD',
      balance: '11.54 ADA',
      txs: [
        {
          type: 'withdrawal',
          amount: '-2.18 ADA',
          fees: '0.18 ADA',
          id: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
          date: '2022/09/08 08:58:10 PM',
        },
        {
          type: 'received',
          amount: '10.00 ADA',
          fees: undefined,
          id: '378eac004bdec2421456d507b8549eedd69955182e29d469c3b2833f6473d5ce',
          date: '2022/09/08 08:56:47 PM',
        },
        {
          type: 'withdrawal',
          amount: '-1.28 ADA',
          fees: '0.17 ADA',
          id: '03bb413faf369b8990b95eb5c0f1ca08c0f8199ea32b31ea7501f70f3c60ba89',
          date: '2022/09/07 10:08:00 PM',
        },
        {
          type: 'received',
          amount: '5.00 ADA',
          fees: undefined,
          id: '7b94e19a39d437ea8ae8a836309b1c39f9b549f0cd02eefd271ee83975ac5893',
          date: '2022/09/07 09:45:57 PM',
        },
        {
          type: 'withdrawal',
          amount: '-2.00 ADA',
          fees: '0.89 ADA',
          id: '86b6173a53568e464bafce315ec6f61de0d5c180e144d9c2c57b86bb012fc0d2',
          date: '2022/09/07 09:44:22 PM',
        },
        {
          type: 'received',
          amount: '2.00 ADA',
          fees: undefined,
          id: '87eb5358c1480739beed120e99e43ffc7e2c4a518bfb0a07c268a47e1db08b5b',
          date: '2022/09/06 09:28:14 PM',
        },
      ],
    });
  });

  it('generates wallets carousel', async () => {
    const client = createApolloClient(fetch);

    const password = 'pass';

    const seedWords = process.env.MNEMONIC;

    const name = 'w';

    const wallet = await HotWallet.create({
      name,
      seedWords,
      password,
    });

    const wallets: HotWallet[] = [wallet];

    const viewModel = new WalletViewModel(client);

    const carousel = await viewModel.walletsCarousel(wallets);

    expect(carousel).toEqual([
      {
        id: expect.any(String),
        name: 'w',
        balance: '93.67 ADA',
        marketPrice: '40.27',
        currency: 'USD',
      },
    ]);
  });

  it('generates wallets carousel', async () => {
    const client = createApolloClient(fetch);

    const password = 'pass';

    const seedWords = process.env.MNEMONIC;

    const name = 'w';

    const wallet = await HotWallet.create({
      name,
      seedWords,
      password,
    });

    const wallets: HotWallet[] = [wallet];

    const viewModel = new WalletViewModel(client);

    const carousel = await viewModel.walletsCarousel(wallets);

    expect(carousel).toEqual([
      {
        id: expect.any(String),
        name: 'w',
        balance: '93.67 ADA',
        marketPrice: '40.27',
        currency: 'USD',
      },
    ]);
  });

  it.skip('subscribe to pending txs', async () => {
    const client = createApolloClient(fetch);

    const password = 'pass';

    const seedWords = process.env.MNEMONIC;

    const name = 'w';

    const wallet = await HotWallet.create({
      name,
      seedWords,
      password,
    });

    const viewModel = new WalletViewModel(client);

    const { hex, summary, witnessesAddress } = await viewModel.buildTx(wallet, {
      lovelace: '2000000',
      paymentAddress:
        'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
    });

    const txHash = await viewModel.signTx(
      wallet,
      {
        hex,
        password,
        witnessesAddress,
      },
      {
        hex,
        summary,
        witnessesAddress,
      },
    );

    expect(txHash).toEqual([
      {
        id: expect.any(String),
        name: 'w',
        balance: '93.67 ADA',
        marketPrice: undefined,
        currency: 'USD',
      },
    ]);
  }, 10_000_000);
});
