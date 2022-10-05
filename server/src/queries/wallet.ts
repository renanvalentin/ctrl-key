import { uniqWith, eqProps } from 'ramda';
import { AddressModel, TxDirections, Wallet, WalletModel } from '@ctrl-k/core';

import * as gql from '../resolvers-types';
import { Context } from 'src/context';

const getTxs = async (addresses: AddressModel[]) => {
  const txs = await (
    await Promise.all(addresses.map(addr => addr.transactions()))
  ).flatMap(tx => tx);

  return uniqWith(eqProps('hash'), txs);
};

export class WalletQuery {
  static async byStakeAddress(stakeAddress: string): Promise<WalletModel> {
    const wallet = new Wallet({ stakeAddress });

    return wallet;
  }

  static async balance(wallet: WalletModel, { accountDataLoader }: Context) {
    const account = await accountDataLoader.load(wallet.stakeAddress);
    return account.balance.toString();
  }

  static async marketPrice({ coingeckoDataLoader }: Context) {
    const { cardano } = await coingeckoDataLoader.load('usd');
    return cardano.usd;
  }

  static async txs(
    wallet: WalletModel,
    { accountDataLoader }: Context,
  ): Promise<gql.Tx[]> {
    const account = await accountDataLoader.load(wallet.stakeAddress);

    const addresses = await account.addresses();

    const txs = await getTxs(addresses);

    const txViewRequests = txs.map(async tx => {
      const utxo = await tx.utxo();
      const direciton = utxo.direction(addresses);
      const amount = utxo.txValue(addresses);

      return {
        type:
          direciton === TxDirections.Incoming
            ? gql.TxDirection.Incoming
            : gql.TxDirection.Outgoing,
        amount: amount.lovelace.toString(),
        fees:
          direciton === TxDirections.Incoming ? undefined : tx.fees.toString(),
        date: tx.blockTime,
        id: tx.hash,
      };
    });

    return Promise.all(txViewRequests);
  }
}
