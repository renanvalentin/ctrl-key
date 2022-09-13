export interface TxValue {
  lovelace: bigint;
  assets: EncodedAsset[];
}

export interface EncodedAsset {
  hex: string;
  quantity: bigint;
}
