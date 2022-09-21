import { CSL } from '../cardano-serialization-lib';
import { Serializable, toObject } from './serializable';

export interface Props {
  readonly lovelace: bigint;
  readonly assets: EncodedAsset[];
}

export interface TxValueModel extends Props, Serializable<TxValueModel, Props> {
  toValue(): CSL.Value;
}

export class TxValue implements TxValueModel {
  readonly lovelace: bigint;
  readonly assets: EncodedAsset[];

  constructor({
    lovelace,
    assets,
  }: {
    lovelace: bigint;
    assets: EncodedAsset[];
  }) {
    this.lovelace = lovelace;
    this.assets = assets;
  }

  serialize(): Props {
    return toObject<Props>({
      assets: this.assets,
      lovelace: this.lovelace,
    });
  }

  deserialize({ assets, lovelace }: Props): TxValueModel {
    return new TxValue({ assets, lovelace });
  }

  toValue = (): CSL.Value => {
    const cslMultiAsset = CSL.MultiAsset.new();

    const cslAssets = this.assets.map(asset => {
      const scriptHash = asset.hex.slice(0, 56);
      const assetName = asset.hex.slice(56);

      const assets = CSL.Assets.new();
      assets.insert(
        CSL.AssetName.new(Buffer.from(assetName, 'hex')),
        CSL.BigNum.from_str(asset.quantity.toString()),
      );

      return {
        scriptHash: CSL.ScriptHash.from_bytes(Buffer.from(scriptHash, 'hex')),
        assets,
      };
    });

    cslAssets.forEach(({ scriptHash, assets }) =>
      cslMultiAsset.insert(scriptHash, assets),
    );

    const cslValue = CSL.Value.new(
      CSL.BigNum.from_str(this.lovelace.toString()),
    );

    if (this.assets.length > 0) {
      cslValue.set_multiasset(cslMultiAsset);
    }

    return cslValue;
  };
}

export interface EncodedAsset {
  hex: string;
  quantity: bigint;
}
