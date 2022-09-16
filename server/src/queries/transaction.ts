import { Wallet, TxValue, TransactionBulder } from '@ctrl-k/core';
import * as gql from '../resolvers-types';

export class TransactionQuery {
  static async buildTx(
    stakeAddress: string,
    value: gql.TxValue,
    paymentAddress: string,
  ) {
    const wallet = new Wallet({ stakeAddress });
    const account = await wallet.account();

    const addresses = await account.addresses();

    const utxo = await (
      await Promise.all(addresses.map(addr => addr.utxos()))
    ).flatMap(utxo => utxo.map(u => u.toTransactionUnspentOutput()));

    const txValue = new TxValue({
      lovelace: BigInt(value.lovelace),
      assets: value.assets.map(a => ({
        hex: a.hex,
        quantity: BigInt(a.quantity),
      })),
    });

    const inputs = TransactionBulder.createTransactionUnspentOutputs(utxo);
    const config = TransactionBulder.createConfig();
    const output = TransactionBulder.createTransactionOutput(
      txValue,
      paymentAddress,
    );
    const changeAddress = TransactionBulder.createChangeAddress(
      addresses[0].address,
    );

    const txBody = TransactionBulder.buildTx({
      inputs,
      output,
      config,
      changeAddress,
    });

    return {
      hex: txBody.to_hex(),
    };
  }
}
