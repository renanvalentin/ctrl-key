import { CSL } from '../cardano-serialization-lib';

export const createRootKey = (
  entropy: string,
  salt: string = '',
): Promise<CSL.Bip32PrivateKey> =>
  CSL.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from(salt),
  );
