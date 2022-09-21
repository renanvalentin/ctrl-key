import { CSL } from '../cardano-serialization-lib';
import cryptoRandomString from 'crypto-random-string';

export const encryptWithPassword = async (
  password: string,
  rootKey: CSL.Bip32PrivateKey,
): Promise<string> => {
  // @ts-ignore
  const rootKeyHex = Buffer.from(await rootKey.as_bytes(), 'hex').toString(
    'hex',
  );
  const passwordHex = Buffer.from(password).toString('hex');
  const salt = cryptoRandomString({ length: 2 * 32 });
  const nonce = cryptoRandomString({ length: 2 * 12 });
  return CSL.encrypt_with_password(passwordHex, salt, nonce, rootKeyHex);
};

export const decryptWithPassword = async (
  password: string,
  encryptedKeyHex: string,
): Promise<CSL.Bip32PrivateKey> => {
  const passwordHex = Buffer.from(password).toString('hex');
  try {
    let decryptedHex = await CSL.decrypt_with_password(
      passwordHex,
      encryptedKeyHex,
    );
    return CSL.Bip32PrivateKey.from_bytes(Buffer.from(decryptedHex, 'hex'));
  } catch (err) {
    throw new Error('Wrong password');
  }
};
