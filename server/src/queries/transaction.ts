import {
  Wallet,
  TxValue,
  TransactionBulder,
  api,
  Epoch,
  Block,
} from '@ctrl-k/core';
import debug from 'debug';
import { Context } from '../context';
import * as gql from '../resolvers-types';

const logger = debug('queries:transaction');

export class TransactionQuery {
  static async buildTx(
    stakeAddress: string,
    value: gql.TxValue,
    paymentAddress: string,
  ): Promise<gql.TxBody> {
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

      const paymentAddresses: gql.TxOutput[] = Array.from({
        length: txBody.outputs().len(),
      })
        .map((_, idx) => {
          const output = txBody.outputs().get(idx);
          const amount = output.amount();

          return {
            address: output.address().to_bech32(),
            amount: {
              lovelace: amount.coin().to_str(),
            },
          };
        })
        .filter(o => o.address !== changeAddress.to_bech32());

      return {
        hex: txBody.to_hex(),
        witnessesAddress: inputAddresses,
        summary: {
          fees: txBody.fee().to_str(),
          paymentAddresses,
        },
      };
    } catch (err) {
      logger('buildTx:err', err);

      throw err;
    }
  }

  static async submitTx(
    tx: string,
    { pendingTxs }: Context,
  ): Promise<{ hash: string }> {
    try {
      logger('submitTx');
      const hash = await api.txSubmit(Buffer.from(tx, 'hex'));
      pendingTxs.add(hash);
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
