import { api } from '../blockfrost';
import { Tx, TxModel } from './tx';

export interface AddressModel {
  readonly address: string;
  transactions(): Promise<Tx[]>;
}

export class Address implements AddressModel {
  readonly address: string;

  constructor(address: string) {
    this.address = address;
  }

  async transactions(): Promise<TxModel[]> {
    const addrTxs = await api.addressesTransactions(this.address);
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
