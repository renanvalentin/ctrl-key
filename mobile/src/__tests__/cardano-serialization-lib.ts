import {
  Bip32PrivateKey,
  Ed25519KeyHash,
  StakeCredential,
  BaseAddress,
  Bip32PublicKey,
  PublicKey,
  Address,
  RewardAddress,
  encrypt_with_password,
  decrypt_with_password,
  TransactionBody,
  hash_transaction,
  Vkeywitnesses,
  make_vkey_witness,
  TransactionHash,
  PrivateKey,
  TransactionWitnessSet,
  Transaction,
  AuxiliaryData,
} from '@emurgo/cardano-serialization-lib-nodejs';

class Bip32PrivateKeyMock {
  privateKey: Bip32PrivateKey;

  constructor(privateKey: Bip32PrivateKey) {
    this.privateKey = privateKey;
  }

  static from_bip39_entropy(entropy: Uint8Array, salt: Uint8Array) {
    return Promise.resolve(
      new Bip32PrivateKeyMock(
        Bip32PrivateKey.from_bip39_entropy(entropy, salt),
      ),
    );
  }

  static from_bytes(bytes: Uint8Array) {
    return Promise.resolve(
      new Bip32PrivateKeyMock(Bip32PrivateKey.from_bytes(bytes)),
    );
  }

  derive(idx: number) {
    return Promise.resolve(
      new Bip32PrivateKeyMock(this.privateKey.derive(idx)),
    );
  }

  to_public() {
    return Promise.resolve(new Bip32PublicKeyMock(this.privateKey.to_public()));
  }

  as_bytes() {
    return Promise.resolve(this.privateKey.as_bytes());
  }

  to_raw_key() {
    return Promise.resolve(this.privateKey.to_raw_key());
  }

  to_bech32() {
    return Promise.resolve(this.privateKey.to_bech32());
  }
}

class Bip32PublicKeyMock {
  publicKey: Bip32PublicKey;

  constructor(publicKey: Bip32PublicKey) {
    this.publicKey = publicKey;
  }

  derive(idx: number) {
    return Promise.resolve(new Bip32PublicKeyMock(this.publicKey.derive(idx)));
  }

  to_raw_key() {
    return Promise.resolve(new PublicKeyMock(this.publicKey.to_raw_key()));
  }

  as_bytes() {
    return Promise.resolve(this.publicKey.as_bytes());
  }

  to_bech32() {
    return Promise.resolve(this.publicKey.to_bech32());
  }

  static from_bech32(bech32: string) {
    return Promise.resolve(
      new Bip32PublicKeyMock(Bip32PublicKey.from_bech32(bech32)),
    );
  }
}

class PublicKeyMock {
  publicKey: PublicKey;

  constructor(publicKey: PublicKey) {
    this.publicKey = publicKey;
  }

  hash() {
    return Promise.resolve(this.publicKey.hash());
  }
}

class BaseAddressMock {
  baseAddress: BaseAddress;

  constructor(baseAddress: BaseAddress) {
    this.baseAddress = baseAddress;
  }

  static new(
    network: number,
    payment: StakeCredentialMock,
    stake: StakeCredentialMock,
  ) {
    return Promise.resolve(
      new BaseAddressMock(
        BaseAddress.new(
          network,
          payment.stakeCredential,
          stake.stakeCredential,
        ),
      ),
    );
  }

  to_address() {
    return Promise.resolve(new AddressMock(this.baseAddress.to_address()));
  }
}

class AddressMock {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  to_bech32() {
    return Promise.resolve(this.address.to_bech32());
  }
}

class StakeCredentialMock {
  stakeCredential: StakeCredential;

  constructor(stakeCredential: StakeCredential) {
    this.stakeCredential = stakeCredential;
  }

  static from_keyhash(hash: Ed25519KeyHash) {
    return Promise.resolve(
      new StakeCredentialMock(StakeCredential.from_keyhash(hash)),
    );
  }
}

class RewardAddressMock {
  rewardAddress: RewardAddress;

  constructor(rewardAddress: RewardAddress) {
    this.rewardAddress = rewardAddress;
  }

  static new(network: number, payment: StakeCredentialMock) {
    return Promise.resolve(
      new RewardAddressMock(
        RewardAddress.new(network, payment.stakeCredential),
      ),
    );
  }

  to_address() {
    return Promise.resolve(new AddressMock(this.rewardAddress.to_address()));
  }
}

class TransactionBodyMock {
  static from_bytes(bytes: Uint8Array) {
    return Promise.resolve(TransactionBody.from_bytes(bytes));
  }
}

class VkeywitnessesMock {
  static new() {
    return Promise.resolve(Vkeywitnesses.new());
  }
}

class TransactionWitnessSetMock {
  static new() {
    return Promise.resolve(TransactionWitnessSet.new());
  }
}

class TransactionMock {
  static new(
    body: TransactionBody,
    witnessSet: TransactionWitnessSet,
    auxiliary?: AuxiliaryData | undefined,
  ) {
    return Promise.resolve(Transaction.new(body, witnessSet, auxiliary));
  }
}

export const CSL = {
  StakeCredential: {
    from_keyhash: StakeCredentialMock.from_keyhash,
  },
  Bip32PrivateKey: {
    from_bip39_entropy: Bip32PrivateKeyMock.from_bip39_entropy,
    from_bytes: Bip32PrivateKeyMock.from_bytes,
  },
  Bip32PublicKey: {
    from_bech32: Bip32PublicKeyMock.from_bech32,
  },
  BaseAddress: {
    new: BaseAddressMock.new,
  },
  RewardAddress: {
    new: RewardAddressMock.new,
  },
  encrypt_with_password: (
    password: string,
    salt: string,
    nonce: string,
    data: string,
  ) => Promise.resolve(encrypt_with_password(password, salt, nonce, data)),
  decrypt_with_password: (password: string, data: string) =>
    Promise.resolve(decrypt_with_password(password, data)),
  TransactionBody: {
    from_bytes: TransactionBodyMock.from_bytes,
  },
  hash_transaction: (txBody: TransactionBody) =>
    Promise.resolve(hash_transaction(txBody)),
  Vkeywitnesses: {
    new: VkeywitnessesMock.new,
  },
  make_vkey_witness: (txBodyHash: TransactionHash, sk: PrivateKey) =>
    Promise.resolve(make_vkey_witness(txBodyHash, sk)),
  TransactionWitnessSet: {
    new: TransactionWitnessSetMock.new,
  },
  Transaction: {
    new: TransactionMock.new,
  },
};
