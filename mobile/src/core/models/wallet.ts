import uuid from 'react-native-uuid';
import { CSL } from '../cardano-serialization-lib';
import * as hdWallets from '../hd-wallets';
import * as crypto from '../crypto';

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
  signTx(
    txBody: string,
    password: string,
    witnessesAddress: [],
  ): Promise<CSL.Transaction>;
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
  readonly stakeAddress: string;

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

  async signTx(
    txBodyEncoded: string,
    password: string,
    witnessesAddress: string[],
  ): Promise<CSL.Transaction> {
    const txBody = await CSL.TransactionBody.from_bytes(
      Buffer.from(txBodyEncoded, 'hex'),
    );

    const txHash = await CSL.hash_transaction(txBody);

    const bip32PrivateKey = await crypto.decryptWithPassword(
      password,
      this.encryptedRootKey,
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

  static validateMnemonic(mnemonic: string): boolean {
    return hdWallets.mnemonic.validate(mnemonic);
  }
}
