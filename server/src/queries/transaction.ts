import {
  Wallet,
  TxValue,
  TransactionBulder,
  api,
  Epoch,
  Block,
} from '@ctrl-k/core';
import debug from 'debug';
import * as gql from '../resolvers-types';

const logger = debug('queries:transaction');

export class TransactionQuery {
  static async buildTx(
    stakeAddress: string,
    value: gql.TxValue,
    paymentAddress: string,
  ) {
    try {
      const block = await Block.latest();
      const epoch = await Epoch.latest();
      const parameters = await epoch.paramters();
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
      const config = TransactionBulder.createConfig(parameters);
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
        ttl: block.slot + 3600 * 6,
      });

      logger('buildTx', txBody);

      const inputAddresses = TransactionBulder.getInputAddresses(
        txBody.inputs(),
        utxo,
      );

      return {
        hex: txBody.to_hex(),
        witnessesAddress: inputAddresses,
      };
    } catch (err) {
      logger('buildTx:err', err);

      throw err;
    }
  }

  static async submitTx(tx: string): Promise<{ hash: string }> {
    try {
      logger('submitTx');
      const hash = await api.txSubmit(Buffer.from(tx, 'hex'));
      logger('submitTx:response', hash);
      return {
        hash,
      };
    } catch (err) {
      logger('submitTx:error', err);
      throw err;
    }
  }
}
