import { CSL } from '../cardano-serialization-lib';
import { AssetName } from './asset-name';

export interface AssetModel {
  readonly key: AssetName;
  readonly value: bigint;
}

interface AssetDeps {
  key: AssetName;
  value: bigint;
}

export class Asset implements AssetModel {
  readonly key: AssetName;
  readonly value: bigint;

  constructor({ key, value }: AssetDeps) {
    this.key = key;
    this.value = value;
  }

  static async fromAssets(assets: CSL.Assets): Promise<AssetModel[]> {
    const [cslAssetNames, len] = await Promise.all([
      assets.keys(),
      assets.len(),
    ]);

    const assetNames = await AssetName.fromAssetNames(cslAssetNames);

    console.log({ assetNames });

    const mapResult = Array.from({ length: len }).map(async (_, idx) => {
      const assetName: AssetName = assetNames[idx];
      console.log('assets', assets);
      const value = await assets.get(
        await CSL.AssetName.from_bytes(assetName.value),
      );

      if (value) {
        return new Asset({
          key: assetName,
          value: BigInt(await value.to_str()),
        });
      }

      return null;
    });

    const result = await Promise.all(mapResult);

    return result.filter((x): x is AssetModel => x !== null);
  }
}
