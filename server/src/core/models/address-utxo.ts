import { CSL } from '../cardano-serialization-lib';
import { Serializable, toObject } from './serializable';
import { TxValueModel, Props as TxValueProps, TxValue } from './tx-value';

interface Props {
  readonly address: string;
  readonly txHash: string;
  readonly outputIndex: number;
  readonly value: TxValueModel;
}

type Serialized = Omit<Props, 'value'> & {
  value: TxValueProps;
};

export interface AddressUtxoModel
  extends Props,
    Serializable<AddressUtxo, Serialized> {
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

  serialize(): Serialized {
    return toObject({
      address: this.address,
      outputIndex: this.outputIndex,
      txHash: this.txHash,
      value: this.value.serialize(),
    });
  }

  deserialize({
    address,
    outputIndex,
    txHash,
    value,
  }: Serialized): AddressUtxo {
    return new AddressUtxo({
      address,
      outputIndex,
      txHash,
      value: new TxValue({ ...value }),
    });
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
