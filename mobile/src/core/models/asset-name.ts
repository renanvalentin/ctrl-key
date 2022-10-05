import { CSL } from '../cardano-serialization-lib';

export interface AssetNameModel {
  readonly value: Uint8Array;
  toString(): string;
}

interface AssetDeps {
  readonly value: Uint8Array;
}

export class AssetName implements AssetNameModel {
  readonly value: Uint8Array;

  constructor({ value }: AssetDeps) {
    this.value = value;
  }

  static async fromAssetNames(
    assetNames: CSL.AssetNames,
  ): Promise<AssetName[]> {
    const len = await assetNames.len();

    const assetNameModels = Array.from({ length: len }).map(async (_, idx) => {
      const assetName = await assetNames.get(idx);
      const name = await assetName.name();

      return new AssetName({ value: name });
    });

    return Promise.all(assetNameModels);
  }

  toString(): string {
    return Buffer.from(this.value).toString();
  }
}
