export interface UnsignedTx {
  hex: string;
  witnessesAddress: string[];
  password: string;
}

export interface TxBody {
  hex: string;
  witnessesAddress: string[];
  summary: TxBodySummary;
}

export type TxBodySummary = {
  fees: string;
  paymentAddresses: Array<TxOutput>;
};

export type TxOutput = {
  address: string;
  amount: Amount;
};

export type Amount = {
  lovelace: string;
};

export interface Tx {
  type: 'received' | 'withdrawal';
  amount: string;
  fees?: string;
  date: string;
  id: string;
}

export interface Summary {
  name: string;
  balance: string;
  marketPrice: string;
  txs: Tx[];
}

export interface BuildTxArgs {
  paymentAddress: string;
  lovelace: string;
}
