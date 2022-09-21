import {
  decrypt_with_password,
  encrypt_with_password,
  Bip32PrivateKey as Bip32PrivateKey_,
  Bip32PublicKey as Bip32PublicKey_,
  StakeCredential,
  BaseAddress,
  RewardAddress,
  TransactionOutput,
  TransactionBody,
  Transaction as Transaction_,
  TransactionWitnessSet,
  make_vkey_witness,
  hash_transaction,
  PrivateKey_,
  Vkeywitnesses,
  TransactionHash as TransactionHash_,
} from '@emurgo/react-native-haskell-shelley';

export declare namespace CSL {
  export type Bip32PrivateKey = Bip32PrivateKey_;
  export type Bip32PublicKey = Bip32PublicKey_;
  export type Transaction = Transaction_;
  export type PrivateKey = PrivateKey_;
  export type TransactionHash = TransactionHash_;
}

export const CSL = {
  decrypt_with_password,
  encrypt_with_password,
  Bip32PrivateKey: Bip32PrivateKey_,
  StakeCredential,
  BaseAddress,
  RewardAddress,
  Bip32PublicKey: Bip32PublicKey_,
  TransactionOutput,
  TransactionBody,
  Transaction: Transaction_,
  TransactionWitnessSet,
  make_vkey_witness,
  hash_transaction,
  PrivateKey: PrivateKey_,
  Vkeywitnesses,
  TransactionHash: TransactionHash_,
};
