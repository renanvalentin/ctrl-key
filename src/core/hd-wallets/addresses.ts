import { CSL } from '../cardano-serialization-lib';

enum CardanoKeyConst {
  PURPOSE = 1852,
  COIN_TYPE = 1815,
}

// www.rubypools.com/blog/Understanding-Cardano-Wallets--Keys
enum ChangeType {
  Receive = 0,
  Internal = 1,
  Stake = 2,
}

const harden = (num: number): number => 0x80_00_00_00 + num;

const derivePublicKey = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  changeType: ChangeType,
  index: number,
): Promise<CSL.Bip32PublicKey> => {
  const accountType = await accountPrivateKey.derive(changeType);
  const address = await accountType.derive(index);
  return address.to_public();
};

export const createAccountPrivateKey = async (
  rootPrivateKey: CSL.Bip32PrivateKey,
  index: number = 0,
): Promise<CSL.Bip32PrivateKey> => {
  const purpose = await rootPrivateKey.derive(harden(CardanoKeyConst.PURPOSE));
  const coinType = await purpose.derive(harden(CardanoKeyConst.COIN_TYPE));
  return coinType.derive(harden(index));
};

export const createPaymentVerificationKey = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  index: number = 0,
): Promise<CSL.Bip32PublicKey> =>
  derivePublicKey(accountPrivateKey, ChangeType.Receive, index);

export const createStakeVerificationKey = (
  accountPrivateKey: CSL.Bip32PrivateKey,
  index: number = 0,
): Promise<CSL.Bip32PublicKey> =>
  derivePublicKey(accountPrivateKey, ChangeType.Stake, index);

export const createPaymentAddress = async (
  paymentVerificationKey: CSL.Bip32PublicKey,
  stakeVerificationKey: CSL.Bip32PublicKey,
): Promise<string> => {
  const paymentVKeyRawKey = await paymentVerificationKey.to_raw_key();
  const paymentEd25519KeyHash = await paymentVKeyRawKey.hash();
  const paymentCred = await CSL.StakeCredential.from_keyhash(
    paymentEd25519KeyHash,
  );

  const stakeVRawKey = await stakeVerificationKey.to_raw_key();
  const stakeEd25519KeyHash = await stakeVRawKey.hash();
  const stakeCred = await CSL.StakeCredential.from_keyhash(stakeEd25519KeyHash);

  const baseAddress = await CSL.BaseAddress.new(0, paymentCred, stakeCred);
  const address = await baseAddress.to_address();

  return address.to_bech32();
};

export const createStakeAddress = async (
  stakeVerificationKey: CSL.Bip32PublicKey,
): Promise<string> => {
  const stakeVRawKey = await stakeVerificationKey.to_raw_key();
  const stakeEd25519KeyHash = await stakeVRawKey.hash();
  const stakeCred = await CSL.StakeCredential.from_keyhash(stakeEd25519KeyHash);

  const rewardAddress = await CSL.RewardAddress.new(0, stakeCred);
  const address = await rewardAddress.to_address();

  return address.to_bech32();
};
