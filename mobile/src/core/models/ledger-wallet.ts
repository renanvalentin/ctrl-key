import uuid from 'react-native-uuid';
import { CSL } from '../cardano-serialization-lib';
import * as hdWallets from '../hd-wallets';
import * as crypto from '../crypto';
import { Bech32, SerializedWallet, WalletModel } from './wallet';
import { PendingTx, PendingTxModel } from './pending-tx';

export interface CreateLedgerWalletArgs {
  name: string;
  chainCodeHex: string;
  publicKeyHex: string;
  password: string;
}

interface WalletDeps {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: Bech32;
  stakeVerificationKey: Bech32;
  paymentAddresses: Bech32[];
  stakeAddress: Bech32;
  pendingTxs: PendingTxModel[];
}

export class LedgerWallet implements WalletModel {
  readonly id: string;
  readonly name: string;
  readonly encryptedRootKey: string;
  readonly paymentVerificationKey: Bech32;
  readonly stakeVerificationKey: Bech32;
  readonly paymentAddresses: string[];
  readonly stakeAddress: string;
  readonly pendingTxs: PendingTxModel[];

  constructor({
    id,
    name,
    encryptedRootKey,
    paymentVerificationKey,
    stakeVerificationKey,
    paymentAddresses,
    stakeAddress,
    pendingTxs,
  }: WalletDeps) {
    this.id = id;
    this.name = name;
    this.encryptedRootKey = encryptedRootKey;
    this.paymentVerificationKey = paymentVerificationKey;
    this.stakeVerificationKey = stakeVerificationKey;
    this.paymentAddresses = paymentAddresses;
    this.stakeAddress = stakeAddress;
    this.pendingTxs = pendingTxs;
  }

  async tryUnlockPrivateKey(password: string): Promise<boolean> {
    try {
      await crypto.decryptWithPassword(password, this.encryptedRootKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  async signTx(
    txBodyEncoded: string,
    password: string,
    witnessesAddress: string[],
  ): Promise<CSL.Transaction> {
    throw new Error('Not implemented');
  }

  static async create({
    name,
    chainCodeHex,
    publicKeyHex,
    password,
  }: CreateLedgerWalletArgs) {
    const accountPublicKey = await hdWallets.addresses.createPublicKeyFromHex(
      publicKeyHex,
      chainCodeHex,
    );

    const paymentVerificationKey =
      await hdWallets.addresses.createPaymentVerificationKey(accountPublicKey);

    const stakeVerificationKey =
      await hdWallets.addresses.createStakeVerificationKey(accountPublicKey);

    const encryptedRootKey = await crypto.encryptWithPassword(
      password,
      Buffer.from(`${publicKeyHex}:${chainCodeHex}`).toString('hex'),
    );

    const paymentAddress = await hdWallets.addresses.createPaymentAddress(
      paymentVerificationKey,
      stakeVerificationKey,
    );

    const stakeAddress = await hdWallets.addresses.createStakeAddress(
      stakeVerificationKey,
    );

    return new LedgerWallet({
      id: uuid.v4().toString(),
      name,
      encryptedRootKey,
      paymentVerificationKey: await paymentVerificationKey.to_bech32(),
      stakeVerificationKey: await stakeVerificationKey.to_bech32(),
      paymentAddresses: [paymentAddress],
      stakeAddress,
      pendingTxs: [],
    });
  }

  async serialize(): Promise<SerializedWallet> {
    return {
      __type: 'cold',
      id: this.id,
      name: this.name,
      encryptedRootKey: this.encryptedRootKey,
      paymentVerificationKey: this.paymentVerificationKey,
      stakeVerificationKey: this.stakeVerificationKey,
      pendingTxs: this.pendingTxs.map(p => p.serialize()),
    };
  }

  static async deserialize(
    serializedWallet: SerializedWallet,
  ): Promise<LedgerWallet> {
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

    return new LedgerWallet({
      id: serializedWallet.id,
      name: serializedWallet.name,
      encryptedRootKey: serializedWallet.encryptedRootKey,
      paymentVerificationKey: serializedWallet.paymentVerificationKey,
      stakeVerificationKey: serializedWallet.stakeVerificationKey,
      paymentAddresses: [paymentAddress],
      stakeAddress,
      pendingTxs: serializedWallet.pendingTxs.map(p =>
        PendingTx.deserialize(p),
      ),
    });
  }

  static validateMnemonic(mnemonic: string): boolean {
    return hdWallets.mnemonic.validate(mnemonic);
  }
}
