import uuid from 'react-native-uuid';
import { CSL } from '../cardano-serialization-lib';
import * as hdWallets from '../hd-wallets';
import * as crypto from '../crypto';
import { Bech32, SerializedWallet, WalletModel } from './wallet';

export interface CreateHotWalletArgs {
  name: string;
  seedWords: string;
  password: string;
  salt?: string;
}

interface WalletDeps {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: Bech32;
  stakeVerificationKey: Bech32;
  paymentAddresses: Bech32[];
  stakeAddress: Bech32;
}

export class HotWallet implements WalletModel {
  readonly id: string;
  readonly name: string;
  readonly encryptedRootKey: string;
  readonly paymentVerificationKey: Bech32;
  readonly stakeVerificationKey: Bech32;
  readonly paymentAddresses: Bech32[];
  readonly stakeAddress: Bech32;

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
    const txBody = await CSL.TransactionBody.from_bytes(
      Buffer.from(txBodyEncoded, 'hex'),
    );

    const txHash = await CSL.hash_transaction(txBody);

    const decryptedHex = await crypto.decryptWithPassword(
      password,
      this.encryptedRootKey,
    );

    const bip32PrivateKey = await CSL.Bip32PrivateKey.from_bytes(
      Buffer.from(decryptedHex, 'hex'),
    );

    const accountPrivateKey = await hdWallets.addresses.createAccountPrivateKey(
      bip32PrivateKey,
    );

    const vkeyWitnesses = await this.createVKeyWitnesses(
      accountPrivateKey,
      witnessesAddress,
      txHash,
    );

    const witnesses = await CSL.TransactionWitnessSet.new();
    await witnesses.set_vkeys(vkeyWitnesses);

    return CSL.Transaction.new(
      txBody,
      witnesses,
      undefined, // transaction metadata
    );
  }

  private async createVKeyWitnesses(
    accountPrivateKey: CSL.Bip32PrivateKey,
    inputAddresses: string[],
    txHash: CSL.TransactionHash,
  ) {
    const signingKeys = await hdWallets.addresses.discoverSigningAddresses(
      accountPrivateKey,
      inputAddresses,
    );

    const rawKeys = await Promise.all(signingKeys.map(k => k.to_raw_key()));

    const vkeyWitnesses = await CSL.Vkeywitnesses.new();

    await Promise.all(
      rawKeys.map(async key => {
        const vkeyWitness = await CSL.make_vkey_witness(txHash, key);
        return vkeyWitnesses.add(vkeyWitness);
      }),
    );

    return vkeyWitnesses;
  }

  static async create({
    name,
    seedWords,
    salt,
    password,
  }: CreateHotWalletArgs) {
    const entropy = hdWallets.mnemonic.mnemonicToEntropy(seedWords);
    const rootPrivateKey = await hdWallets.seed.createRootKey(entropy, salt);

    const accountPrivateKey = await hdWallets.addresses.createAccountPrivateKey(
      rootPrivateKey,
    );

    const accountPublicKey = await accountPrivateKey.to_public();

    const paymentVerificationKey =
      await hdWallets.addresses.createPaymentVerificationKey(accountPublicKey);

    const stakeVerificationKey =
      await hdWallets.addresses.createStakeVerificationKey(accountPublicKey);

    const rootKeyHex = await rootPrivateKey.as_bytes();

    const encryptedRootKey = await crypto.encryptWithPassword(
      password,
      Buffer.from(rootKeyHex).toString('hex'),
    );

    const paymentAddress = await hdWallets.addresses.createPaymentAddress(
      paymentVerificationKey,
      stakeVerificationKey,
    );

    const stakeAddress = await hdWallets.addresses.createStakeAddress(
      stakeVerificationKey,
    );

    return new HotWallet({
      id: uuid.v4().toString(),
      name,
      encryptedRootKey,
      paymentVerificationKey: await paymentVerificationKey.to_bech32(),
      stakeVerificationKey: await stakeVerificationKey.to_bech32(),
      paymentAddresses: [paymentAddress],
      stakeAddress,
    });
  }

  async serialize(): Promise<SerializedWallet> {
    return {
      __type: 'hot',
      id: this.id,
      name: this.name,
      encryptedRootKey: this.encryptedRootKey,
      paymentVerificationKey: this.paymentVerificationKey,
      stakeVerificationKey: this.stakeVerificationKey,
    };
  }

  static async deserialize(
    serializedWallet: SerializedWallet,
  ): Promise<HotWallet> {
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

    return new HotWallet({
      id: serializedWallet.id,
      name: serializedWallet.name,
      encryptedRootKey: serializedWallet.encryptedRootKey,
      paymentVerificationKey: serializedWallet.paymentVerificationKey,
      stakeVerificationKey: serializedWallet.stakeVerificationKey,
      paymentAddresses: [paymentAddress],
      stakeAddress,
    });
  }

  static validateMnemonic(mnemonic: string): boolean {
    return hdWallets.mnemonic.validate(mnemonic);
  }
}
