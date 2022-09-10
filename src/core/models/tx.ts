import { Utxo, UtxoModel } from './utxo';
import { api } from '../blockfrost';

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

    type Amount = {
      unit: string;
      quantity: string;
    };

    const findLovelace = (amount: Amount[]) => {
      const lovelace = amount.find(asset => asset.unit === 'lovelace');

      if (lovelace) {
        return BigInt(lovelace.quantity);
      }

      return 0n;
    };

    const findAssets = (amount: Amount[]) => {
      return amount
        .filter(asset => asset.unit !== 'lovelace')
        .map(asset => ({
          hex: asset.unit,
          quantity: BigInt(asset.quantity),
        }));
    };

    return new Utxo({
      inputs: utxo.inputs.map(txin => ({
        address: txin.address,
        lovelace: findLovelace(txin.amount),
        assets: findAssets(txin.amount),
      })),
      outputs: utxo.outputs.map(txOut => ({
        address: txOut.address,
        lovelace: findLovelace(txOut.amount),
        assets: findAssets(txOut.amount),
      })),
    });
  }
}
