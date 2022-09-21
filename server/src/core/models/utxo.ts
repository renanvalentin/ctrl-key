import { EncodedAsset, TxValueModel, TxValue } from './tx-value';
import { AddressModel } from './address';
import { Serializable, toObject } from './serializable';

export interface TxIn {
  address: string;
  value: TxValueModel;
}

export interface TxOut {
  address: string;
  value: TxValueModel;
}

export enum TxDirections {
  Outgoing = 'Outgoing',
  Incoming = 'Incoming',
}

interface Props {
  readonly inputs: TxIn[];
  readonly outputs: TxOut[];
}

export interface UtxoModel extends Serializable<UtxoModel, Props>, Props {
  direction(addresses: AddressModel[]): TxDirections;
  txValue(addresses: AddressModel[]): TxValueModel;
}

export class Utxo implements UtxoModel {
  readonly inputs: TxIn[];
  readonly outputs: TxOut[];

  constructor(utxo: { inputs: TxIn[]; outputs: TxOut[] }) {
    this.inputs = utxo.inputs;
    this.outputs = utxo.outputs;
  }

  serialize(): Props {
    return toObject<Props>({
      inputs: this.inputs,
      outputs: this.outputs,
    });
  }

  deserialize({ inputs, outputs }: Props) {
    return new Utxo({ inputs, outputs });
  }

  direction(fromAddresses: AddressModel[]): TxDirections {
    const inAddresses = new Set(this.inputs.map(x => x.address));
    const outAddresses = new Set(this.outputs.map(x => x.address));

    if (fromAddresses.find(addr => inAddresses.has(addr.address))) {
      return TxDirections.Outgoing;
    }

    if (fromAddresses.some(addr => outAddresses.has(addr.address))) {
      return TxDirections.Incoming;
    }

    throw new Error('Unhandled tx case');
  }

  txValue(fromAddresses: AddressModel[]): TxValueModel {
    const direction = this.direction(fromAddresses);
    const fromAddressesSet = new Set(fromAddresses.map(addr => addr.address));

    switch (direction) {
      case TxDirections.Incoming: {
        const output = this.outputs.find(o => fromAddressesSet.has(o.address));

        if (!output) {
          throw new Error("Couldn't locate any output for addresses");
        }

        return output.value;
      }

      case TxDirections.Outgoing: {
        const inputs = this.inputs
          .filter(o => fromAddressesSet.has(o.address))
          .reduce((acc, i) => i.value.lovelace + acc, 0n);

        const outputs = this.outputs
          .filter(o => fromAddressesSet.has(o.address))
          .reduce((acc, i) => i.value.lovelace + acc, 0n);

        const assetsInput = this.inputs.flatMap(i => i.value.assets);

        const assetsOutput = new Map(
          this.outputs
            .filter(o => fromAddressesSet.has(o.address))
            .flatMap(i =>
              i.value.assets.map(({ hex, quantity }) => [hex, quantity]),
            ),
        );

        const assets = assetsInput.map(({ hex, quantity }): EncodedAsset => {
          const outputQuantity = assetsOutput.get(hex);
          if (!outputQuantity) {
            return {
              hex,
              quantity: quantity * -1n,
            };
          }

          return {
            hex,
            quantity: (quantity - outputQuantity) * -1n,
          };
        });

        const lovelace = inputs - outputs;

        return new TxValue({
          lovelace: lovelace * -1n,
          assets: assets,
        });
      }

      default:
        throw new Error('Unhandled tx case');
    }
  }
}
