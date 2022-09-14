import { amountToValue, api } from '../blockfrost';
import { AddressUtxo } from './address-utxo';
import { Tx, TxModel } from './tx';

export interface AddressModel {
  readonly address: string;
  transactions(): Promise<Tx[]>;
  utxos(): Promise<AddressUtxo[]>;
}

export class Address implements AddressModel {
  readonly address: string;

  constructor(address: string) {
    this.address = address;
  }

  async utxos(): Promise<AddressUtxo[]> {
    const utxos = await api.addressesUtxosAll(this.address);
    return utxos.map(
      utxo =>
        new AddressUtxo({
          txHash: utxo.tx_hash,
          outputIndex: utxo.output_index,
          value: amountToValue(utxo.amount),
        }),
    );
  }

  async transactions(): Promise<TxModel[]> {
    const addrTxs = await api.addressesTransactions(this.address, {
      order: 'desc',
    });
    const txs = await Promise.all(addrTxs.map(tx => api.txs(tx.tx_hash)));
    return txs.map(
      tx =>
        new Tx({
          hash: tx.hash,
          blockTime: tx.block_time,
          fees: Number(tx.fees),
        }),
    );
  }
}
