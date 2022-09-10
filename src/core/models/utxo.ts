import { AddressModel } from './address';

interface EncodedAsset {
  hex: string;
  quantity: bigint;
}

export interface TxIn {
  address: string;
  lovelace: bigint;
  assets: EncodedAsset[];
}

export interface TxOut {
  address: string;
  lovelace: bigint;
  assets: EncodedAsset[];
}

export enum TxDirections {
  Outgoing = 'Outgoing',
  Incoming = 'Incoming',
}

export interface UtxoModel {
  readonly inputs: TxIn[];
  readonly outputs: TxOut[];
  direction(addresses: AddressModel[]): TxDirections;
  txValue(addresses: AddressModel[]): {
    lovelace: bigint;
    assets?: EncodedAsset[];
  };
}

export class Utxo implements UtxoModel {
  readonly inputs: TxIn[];
  readonly outputs: TxOut[];

  constructor(utxo: { inputs: TxIn[]; outputs: TxOut[] }) {
    this.inputs = utxo.inputs;
    this.outputs = utxo.outputs;
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

  txValue(fromAddresses: AddressModel[]): {
    lovelace: bigint;
    assets?: EncodedAsset[] | undefined;
  } {
    const direction = this.direction(fromAddresses);
    const fromAddressesSet = new Set(fromAddresses.map(addr => addr.address));

    switch (direction) {
      case TxDirections.Incoming: {
        const output = this.outputs.find(o => fromAddressesSet.has(o.address));

        if (!output) {
          throw new Error("Couldn't locate any output for addresses");
        }

        return {
          lovelace: output.lovelace,
          assets: output.assets,
        };
      }

      case TxDirections.Outgoing: {
        const inputs = this.inputs
          .filter(o => fromAddressesSet.has(o.address))
          .reduce((acc, i) => i.lovelace + acc, 0n);

        const outputs = this.outputs
          .filter(o => fromAddressesSet.has(o.address))
          .reduce((acc, i) => i.lovelace + acc, 0n);

        const assetsInput = this.inputs.flatMap(i => i.assets);

        const assetsOutput = new Map(
          this.outputs
            .filter(o => fromAddressesSet.has(o.address))
            .flatMap(i => i.assets.map(({ hex, quantity }) => [hex, quantity])),
        );

        const assets = assetsInput.map(({ hex, quantity }) => {
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

        return {
          lovelace: lovelace * -1n,
          assets: assets,
        };
      }

      default:
        throw new Error('Unhandled tx case');
    }
  }
}
