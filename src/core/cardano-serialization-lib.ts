import {
  decrypt_with_password,
  encrypt_with_password,
  Bip32PrivateKey as Bip32PrivateKey_,
  Bip32PublicKey as Bip32PublicKey_,
  StakeCredential,
  BaseAddress,
  RewardAddress,
} from '@emurgo/react-native-haskell-shelley';

export declare namespace CSL {
  export type Bip32PrivateKey = Bip32PrivateKey_;
  export type Bip32PublicKey = Bip32PublicKey_;
}

export const CSL = {
  decrypt_with_password,
  encrypt_with_password,
  Bip32PrivateKey: Bip32PrivateKey_,
  StakeCredential,
  BaseAddress,
  RewardAddress,
  Bip32PublicKey: Bip32PublicKey_,
};
