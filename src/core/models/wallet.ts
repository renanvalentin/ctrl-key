import uuid from 'react-native-uuid';
import { CSL } from '../cardano-serialization-lib';
import * as hdWallets from '../hd-wallets';
import { api } from '../blockfrost';
import * as crypto from '../crypto';
import { Account, AccountModel } from './account';

export interface SerializedWallet {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: string;
  stakeVerificationKey: string;
}

export interface WalletModel {
  readonly id: string;
  readonly name: string;
  readonly encryptedRootKey: string;
  readonly paymentVerificationKey: CSL.Bip32PublicKey;
  readonly stakeVerificationKey: CSL.Bip32PublicKey;
  readonly stakeAddress: string;
  readonly paymentAddresses: string[];
  serialize(): Promise<SerializedWallet>;
  account(): Promise<AccountModel>;
}

export interface CreateWalletArgs {
  name: string;
  seedWords: string;
  password: string;
  salt?: string;
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

export class Wallet implements WalletModel {
  readonly id: string;
  readonly name: string;
  readonly encryptedRootKey: string;
  readonly paymentVerificationKey: CSL.Bip32PublicKey;
  readonly stakeVerificationKey: CSL.Bip32PublicKey;
  readonly paymentAddresses: string[];

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
  stakeAddress: string;

  async account(): Promise<Account> {
    const account = await api.accounts(this.stakeAddress);
    return new Account({
      stakeAddress: account.stake_address,
      availableRewards: BigInt(account.withdrawable_amount),
      totalAvailable: BigInt(account.controlled_amount),
    });
  }

  static async create({ name, seedWords, salt, password }: CreateWalletArgs) {
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
      password,
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
