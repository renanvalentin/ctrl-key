import { add } from 'date-fns';
import { CSL } from '../cardano-serialization-lib';

enum CardanoKeyConst {
  PURPOSE = 1852,
  COIN_TYPE = 1815,
}

// www.rubypools.com/blog/Understanding-Cardano-Wallets--Keys
export enum AccountType {
  Receive = 0,
  Internal = 1,
  Stake = 2,
}

export interface DiscoverAddress {
  address: string;
  index: number;
}

const harden = (num: number): number => 0x80_00_00_00 + num;

const derivePublicKey = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  changeType: AccountType,
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

export const createPaymentVerificationPrivateKey = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  index: number = 0,
  type: AccountType = AccountType.Receive,
): Promise<CSL.Bip32PrivateKey> => {
  const accountType = await accountPrivateKey.derive(type);
  const address = await accountType.derive(index);
  return address;
};

export const createPaymentVerificationKey = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  index: number = 0,
): Promise<CSL.Bip32PublicKey> =>
  derivePublicKey(accountPrivateKey, AccountType.Receive, index);

export const createStakeVerificationKey = (
  accountPrivateKey: CSL.Bip32PrivateKey,
): Promise<CSL.Bip32PublicKey> =>
  derivePublicKey(accountPrivateKey, AccountType.Stake, 0);

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

export const deriveAddresses = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  size = 20,
  startGap = 0,
  accountType: AccountType = AccountType.Receive,
): Promise<DiscoverAddress[]> => {
  const list = Array.from({ length: size });

  const accountPublicKey = await accountPrivateKey.to_public();

  const chainKey = await accountPublicKey.derive(accountType);
  const stakingKey = await (
    await accountPublicKey.derive(AccountType.Stake)
  ).derive(0);

  const paymentAddresses = list.map(async (_, index) => {
    const addressChain = await chainKey.derive(startGap + index);

    const paymentAddress = await createPaymentAddress(addressChain, stakingKey);

    return { address: paymentAddress, index: startGap + index };
  });

  return Promise.all(paymentAddresses);
};

export const discoverAddresses = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  size = 20,
  accountType: AccountType = AccountType.Receive,
  inputAddresses: string[],
): Promise<DiscoverAddress[]> => {
  const lookup = new Set(inputAddresses);
  let discoveredAddresses: DiscoverAddress[] = [];

  let startGap = 0;
  let discover = true;

  while (discover) {
    const addresses = await deriveAddresses(
      accountPrivateKey,
      size,
      startGap,
      accountType,
    );

    discover = addresses.every(addr => lookup.has(addr.address));
    if (discover) {
      startGap += 20;
    }

    discoveredAddresses = [
      ...discoveredAddresses,
      ...addresses.filter(addr => lookup.has(addr.address)),
    ];
  }

  return discoveredAddresses;
};

export const discoverSigningAddresses = async (
  accountPrivateKey: CSL.Bip32PrivateKey,
  inputAddresses: string[],
): Promise<CSL.Bip32PrivateKey[]> => {
  const discoveredExternalAddr = await discoverAddresses(
    accountPrivateKey,
    20,
    AccountType.Receive,
    inputAddresses,
  );

  const discoveredInternalAddr = await discoverAddresses(
    accountPrivateKey,
    20,
    AccountType.Internal,
    inputAddresses,
  );

  const derivePrivateKeys = (
    discoveredAddresses: DiscoverAddress[],
    accountType: AccountType,
  ) =>
    Promise.all(
      discoveredAddresses.map(async addr => {
        const address = await createPaymentVerificationPrivateKey(
          accountPrivateKey,
          addr.index,
          accountType,
        );

        return address;
      }),
    );

  const [external, internal] = await Promise.all([
    derivePrivateKeys(discoveredExternalAddr, AccountType.Receive),
    derivePrivateKeys(discoveredInternalAddr, AccountType.Internal),
  ]);

  return [...external, ...internal];
};
