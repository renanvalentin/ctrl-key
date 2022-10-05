import { CSL } from '../cardano-serialization-lib';
import { Asset } from './asset';

export interface MultiAssetModel {
  readonly key: Uint8Array;
  readonly value: Asset[];
}

interface MultiAssetDeps {
  key: Uint8Array;
  value: Asset[];
}

export class MultiAsset implements MultiAssetModel {
  readonly key: Uint8Array;
  readonly value: Asset[];

  constructor({ key, value }: MultiAssetDeps) {
    this.key = key;
    this.value = value;
  }

  static async fromMultiAsset(
    multiasset: CSL.MultiAsset,
  ): Promise<MultiAssetModel[]> {
    const keys = await multiasset.keys();
    const len = await keys.len();

    const mapRequest = Array.from({ length: len }).map(async (_, idx) => {
      const key = await keys.get(idx);
      const assets = await multiasset.get(key);

      if (!assets) {
        return null;
      }

      const asset = await Asset.fromAssets(assets);
      return new MultiAsset({
        key: await key.to_bytes(),
        value: asset,
      });
    });

    const result = await Promise.all(mapRequest);

    return result.filter((x): x is MultiAssetModel => x !== null);
  }
}
