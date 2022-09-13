import { TxValue } from '../cardano';

interface Props {
  readonly txHash: string;
  readonly outputIndex: number;
  readonly value: TxValue;
}

export interface AddressUtxoModel extends Props {}

export class AddressUtxo implements AddressUtxoModel {
  readonly txHash: string;
  readonly outputIndex: number;
  readonly value: TxValue;

  constructor({ outputIndex, txHash, value }: Props) {
    this.outputIndex = outputIndex;
    this.txHash = txHash;
    this.value = value;
  }
}
