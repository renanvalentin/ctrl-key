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
      console.log(err);
      logger('buildTx:err', err);

      throw err;
    }
  }

  static async submitTx(tx: string): Promise<{ hash: string }> {
    try {
      // 84a40081825820e7e9e5d74f2c5a00828cd1f638ec0991ea198d30a55c6fccb81f8ea32b425f040101828258390092613032ecc6c1c2cf451e752b0a222dd8a70370db79bdf4721cc70826a4f8878feff4878c22176dc43a93ba8af53c9b75124dadcf419cfa1a001e8480825839005f697c1763c12a954abef22ae9f31c81940918042888bafdd69310bceb3e46c7d6757671dac59595da308218a269bba846787b5b3eac8d72821a05629e81a1581c789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1a1496861707079636f696e02021a0002990d031a04229435a10081825820bf6376ac22e13ac206b33cb768f86d2b53a21a001825f780a299b5b41173ad6f58404852585ca64dcfa8d536a75c4d1b3b53964247c1f00be58bc6cb6aad9ed921358cbbe3d2d9ba19fe8653256234117c0750c8cf03fdf5478d1a6e7f434b8a0d02f5f6
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

/*
stakeAddress + tx hash

criar um canal entre o stakeAddress e configurar webhook para ver se aquela tx hash pertence ao stake address



*/
