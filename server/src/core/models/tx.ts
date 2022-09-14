import { Utxo, UtxoModel } from './utxo';
import { api, amountToValue } from '../blockfrost';

export interface TxModel {
  readonly hash: string;
  readonly blockTime: number;
  readonly fees: number;
  utxo(): Promise<UtxoModel>;
}

export class Tx implements TxModel {
  readonly hash: string;
  readonly blockTime: number;
  readonly fees: number;

  constructor(tx: { hash: string; blockTime: number; fees: number }) {
    this.hash = tx.hash;
    this.blockTime = tx.blockTime;
    this.fees = tx.fees;
  }

  async utxo(): Promise<UtxoModel> {
    const utxo = await api.txsUtxos(this.hash);

    return new Utxo({
      inputs: utxo.inputs.map(txin => ({
        address: txin.address,
        value: amountToValue(txin.amount),
      })),
      outputs: utxo.outputs.map(txOut => ({
        address: txOut.address,
        value: amountToValue(txOut.amount),
      })),
    });
  }
}
