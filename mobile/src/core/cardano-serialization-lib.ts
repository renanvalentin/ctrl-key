import {
  decrypt_with_password,
  encrypt_with_password,
  Bip32PrivateKey as Bip32PrivateKey_,
  Bip32PublicKey as Bip32PublicKey_,
  StakeCredential,
  BaseAddress,
  RewardAddress,
  TransactionOutput as TransactionOutput_,
  TransactionBody as TransactionBody_,
  Transaction as Transaction_,
  TransactionWitnessSet,
  make_vkey_witness,
  hash_transaction,
  PrivateKey as PrivateKey_,
  Vkeywitnesses,
  TransactionHash as TransactionHash_,
  Assets as Assets_,
  AssetNames as AssetNames_,
  AssetName as AssetName_,
  MultiAsset as MultiAsset_,
  ScriptHash as ScriptHash_,
} from '@emurgo/react-native-haskell-shelley';

export declare namespace CSL {
  export type Bip32PrivateKey = Bip32PrivateKey_;
  export type Bip32PublicKey = Bip32PublicKey_;
  export type Transaction = Transaction_;
  export type PrivateKey = PrivateKey_;
  export type TransactionHash = TransactionHash_;
  export type TransactionBody = TransactionBody_;
  export type TransactionOutput = TransactionOutput_;
  export type Assets = Assets_;
  export type AssetNames = AssetNames_;
  export type AssetName = AssetName_;
  export type MultiAsset = MultiAsset_;
  export type ScriptHash = ScriptHash_;
}

export const CSL = {
  decrypt_with_password,
  encrypt_with_password,
  Bip32PrivateKey: Bip32PrivateKey_,
  StakeCredential,
  BaseAddress,
  RewardAddress,
  Bip32PublicKey: Bip32PublicKey_,
  TransactionOutput: TransactionOutput_,
  Transaction: Transaction_,
  TransactionWitnessSet,
  make_vkey_witness,
  hash_transaction,
  PrivateKey: PrivateKey_,
  Vkeywitnesses,
  TransactionHash: TransactionHash_,
  TransactionBody: TransactionBody_,
  Assets: Assets_,
  AssetNames: AssetNames_,
  AssetName: AssetName_,
  MultiAsset: MultiAsset_,
  ScriptHash: ScriptHash_,
};
