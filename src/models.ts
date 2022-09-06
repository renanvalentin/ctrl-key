import uuid from 'react-native-uuid';
import { CSL } from './cardano-serialization-lib';
import * as hdWallets from './hd-wallets';
import * as crypto from './crypto';

export interface SerializedWallet {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: string;
  stakeVerificationKey: string;
}

export interface Wallet {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: CSL.Bip32PublicKey;
  stakeVerificationKey: CSL.Bip32PublicKey;
  stakeAddress: string;
  paymentAddresses: string[];
  serialize(): Promise<SerializedWallet>;
}

export interface CreateWalletArgs {
  name: string;
  seedWords: string;
  salt: string;
}

interface WalletDeps {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: CSL.Bip32PublicKey;
  stakeVerificationKey: CSL.Bip32PublicKey;
  paymentAddresses: string[];
  stakeAddress: string;
}

export class Wallet implements Wallet {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: CSL.Bip32PublicKey;
  stakeVerificationKey: CSL.Bip32PublicKey;
  paymentAddresses: string[];

  constructor({
    id,
    name,
    encryptedRootKey,
    paymentVerificationKey,
    stakeVerificationKey,
    paymentAddresses,
    stakeAddress,
  }: WalletDeps) {
    this.id = id;
    this.name = name;
    this.encryptedRootKey = encryptedRootKey;
    this.paymentVerificationKey = paymentVerificationKey;
    this.stakeVerificationKey = stakeVerificationKey;
    this.paymentAddresses = paymentAddresses;
    this.stakeAddress = stakeAddress;
  }

  static async create({ name, seedWords, salt }: CreateWalletArgs) {
    const entropy = hdWallets.mnemonic.mnemonicToEntropy(seedWords);
    const rootPrivateKey = await hdWallets.seed.createRootKey(entropy, salt);

    const accountPrivateKey = await hdWallets.addresses.createAccountPrivateKey(
      rootPrivateKey,
    );

    const paymentVerificationKey =
      await hdWallets.addresses.createPaymentVerificationKey(accountPrivateKey);

    const stakeVerificationKey =
      await hdWallets.addresses.createStakeVerificationKey(accountPrivateKey);

    const encryptedRootKey = await crypto.encryptWithPassword(
      salt,
      rootPrivateKey,
    );

    const paymentAddress = await hdWallets.addresses.createPaymentAddress(
      paymentVerificationKey,
      stakeVerificationKey,
    );

    const stakeAddress = await hdWallets.addresses.createStakeAddress(
      stakeVerificationKey,
    );

    return new Wallet({
      id: uuid.v4().toString(),
      name,
      encryptedRootKey,
      paymentVerificationKey,
      stakeVerificationKey,
      paymentAddresses: [paymentAddress],
      stakeAddress,
    });
  }

  async serialize(): Promise<SerializedWallet> {
    const paymentVerificationKey =
      await this.paymentVerificationKey.to_bech32();
    const stakeVerificationKey = await this.stakeVerificationKey.to_bech32();

    return {
      id: this.id,
      name: this.name,
      encryptedRootKey: this.encryptedRootKey,
      paymentVerificationKey: Buffer.from(paymentVerificationKey).toString(),
      stakeVerificationKey: Buffer.from(stakeVerificationKey).toString(),
    };
  }

  static async deserialize(
    serializedWallet: SerializedWallet,
  ): Promise<Wallet> {
    const paymentVerificationKey = await CSL.Bip32PublicKey.from_bech32(
      serializedWallet.paymentVerificationKey,
    );

    console.log({ paymentVerificationKey });

    const stakeVerificationKey = await CSL.Bip32PublicKey.from_bech32(
      serializedWallet.stakeVerificationKey,
    );

    const paymentAddress = await hdWallets.addresses.createPaymentAddress(
      paymentVerificationKey,
      stakeVerificationKey,
    );

    const stakeAddress = await hdWallets.addresses.createStakeAddress(
      stakeVerificationKey,
    );

    return new Wallet({
      id: serializedWallet.id,
      name: serializedWallet.name,
      encryptedRootKey: serializedWallet.encryptedRootKey,
      paymentVerificationKey,
      stakeVerificationKey,
      paymentAddresses: [paymentAddress],
      stakeAddress,
    });
  }
}
