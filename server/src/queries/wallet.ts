import { uniqWith, eqProps } from 'ramda';
import { AddressModel, TxDirections, Wallet } from '@ctrl-k/core';
import * as gql from '../resolvers-types';

const getTxs = async (addresses: AddressModel[]) => {
  const txs = await (
    await Promise.all(addresses.map(addr => addr.transactions()))
  ).flatMap(tx => tx);

  return uniqWith(eqProps('hash'), txs);
};

export class WalletQuery {
  static async byStakeAddress(stakeAddress: string): Promise<gql.Wallet> {
    const wallet = new Wallet({ stakeAddress });
    const account = await wallet.account();

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

    const txsViews = await Promise.all(txViewRequests);

    return {
      balance: account.balance.toString(),
      txs: txsViews,
    };
  }
}
