import { CSL } from '../cardano-serialization-lib';
import { TxValueModel } from './tx-value';

interface Props {
  readonly address: string;
  readonly txHash: string;
  readonly outputIndex: number;
  readonly value: TxValueModel;
}

export interface AddressUtxoModel extends Props {
  toTransactionUnspentOutput: () => CSL.TransactionUnspentOutput;
}

export class AddressUtxo implements AddressUtxoModel {
  readonly txHash: string;
  readonly outputIndex: number;
  readonly value: TxValueModel;
  readonly address: string;

  constructor({ outputIndex, txHash, value, address }: Props) {
    this.outputIndex = outputIndex;
    this.txHash = txHash;
    this.value = value;
    this.address = address;
  }

  toTransactionUnspentOutput = () =>
    CSL.TransactionUnspentOutput.new(
      CSL.TransactionInput.new(
        CSL.TransactionHash.from_bytes(Buffer.from(this.txHash, 'hex')),
        this.outputIndex,
      ),
      CSL.TransactionOutput.new(
        CSL.Address.from_bech32(this.address),
        this.value.toValue(),
      ),
    );
}
