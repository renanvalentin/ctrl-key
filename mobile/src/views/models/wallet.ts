import BigNumber from 'bignumber.js';
import {
  HotWallet,
  WalletModel,
  LedgerConnector,
  Descriptor,
} from '@ctrlK/core';
import { format, fromUnixTime } from 'date-fns';
import {
  Query,
  QueryBuildTxArgs,
  QuerySubmitTxArgs,
  QueryWalletArgs,
  QueryWalletsArgs,
  TxDirection,
  Wallet as WalletSchema,
} from '@ctrl-k/schema';
import * as Types from '../../components/pages/data';
import { ApolloClient } from '@apollo/client';
import { GET_BUILD_TX, GET_SUBMIT_TX, GET_TXS, GET_WALLETS } from './queries';
import { Summary, TxBody, UnsignedTx } from './types';

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
  },
});

const displayUnit = (value: string, decimals = 6) => {
  return Number(value) / 10 ** decimals;
};

const formatValue = (value: string) => new BigNumber(displayUnit(value));

const toADA = (value: string): string =>
  formatValue(value).toFormat(2) + ' ADA';

export class WalletViewModel {
  constructor(readonly apolloClient: ApolloClient<object>) {}

  static summary(name: string, data: WalletSchema): Summary {
    return {
      name,
      marketPrice: data.marketPrice + ' USD',
      balance: toADA(data.balance),
      txs: data.txs.map(tx => ({
        type: tx.type === TxDirection.Incoming ? 'received' : 'withdrawal',
        amount: toADA(tx.amount),
        fees: tx.fees ? toADA(tx.fees) : undefined,
        id: tx.id,
        date: format(fromUnixTime(tx.date), 'yyyy/MM/dd hh:mm:ss a'),
      })),
    };
  }

  async walletsCarousel(data: WalletModel[]): Promise<Types.Main.Wallet[]> {
    const stakeAddresses = data.map(w => w.stakeAddress);

    const {
      data: { wallets },
    } = await this.apolloClient.query<
      { wallets: Query['wallets'] },
      QueryWalletsArgs
    >({
      query: GET_WALLETS,
      variables: {
        stakeAddresses,
      },
    });

    return wallets.map(
      (w, idx) =>
        new Types.Main.Wallet(
          data[idx].id,
          data[idx].name,
          toADA(w.balance),
          formatValue(w.balance).multipliedBy(w.marketPrice).toFormat(2),
          'USD',
        ),
    );
  }

  async txs(data: WalletModel): Promise<Types.Main.Tx[]> {
    console.log(data.id);
    const {
      data: { wallet },
    } = await this.apolloClient.query<
      { wallet: Query['wallet'] },
      QueryWalletArgs
    >({
      query: GET_TXS,
      variables: {
        stakeAddress: data.stakeAddress,
      },
    });

    return wallet.txs.map(tx => ({
      type: tx.type === TxDirection.Incoming ? 'received' : 'withdrawal',
      amount: toADA(tx.amount),
      fees: tx.fees ? toADA(tx.fees) : undefined,
      id: tx.id,
      date: format(fromUnixTime(tx.date), 'yyyy/MM/dd hh:mm:ss a'),
    }));
  }

  async buildTx(
    wallet: WalletModel,
    { lovelace, paymentAddress }: Types.Send.FormData,
  ): Promise<TxBody> {
    const {
      data: {
        buildTx: { hex, witnessesAddress, summary },
      },
    } = await this.apolloClient.query<
      { buildTx: Query['buildTx'] },
      QueryBuildTxArgs
    >({
      query: GET_BUILD_TX,
      variables: {
        paymentAddress: paymentAddress,
        stakeAddress: wallet.stakeAddress,
        value: { lovelace: lovelace, assets: [] },
      },
    });

    return { hex, witnessesAddress, summary };
  }

  async signTx(
    wallet: WalletModel,
    { hex, password, witnessesAddress }: UnsignedTx,
  ): Promise<string> {
    const signedTx = await wallet.signTx(hex, password, witnessesAddress);

    const txBytes = await signedTx.to_bytes();

    const {
      data: {
        submitTx: { hash },
      },
    } = await this.apolloClient.query<
      { submitTx: Query['submitTx'] },
      QuerySubmitTxArgs
    >({
      query: GET_SUBMIT_TX,
      variables: {
        tx: Buffer.from(txBytes).toString('hex'),
      },
    });

    return hash;
  }

  static async tryUnlockPrivateKey(
    wallet: WalletModel,
    password: string,
  ): Promise<boolean> {
    return wallet.tryUnlockPrivateKey(password);
  }

  static txSummary(txBody: TxBody): {
    address: string;
    lovelace: string;
    fees: string;
  } {
    const { address, amount } = txBody.summary.paymentAddresses[0];
    return {
      address,
      fees: toADA(txBody.summary.fees),
      lovelace: toADA(amount.lovelace),
    };
  }

  static validateMnemonic(mnemonic: string): boolean {
    return HotWallet.validateMnemonic(mnemonic);
  }

  static importLedger() {
    return LedgerConnector.monitor();
  }

  static async getLedgerDeviceInfo(descriptor: Descriptor) {
    return LedgerConnector.exportExtendedPublicKey(descriptor);
  }
}
