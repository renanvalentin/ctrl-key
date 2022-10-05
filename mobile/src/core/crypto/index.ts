import { CSL } from '../cardano-serialization-lib';
import cryptoRandomString from 'crypto-random-string';

type Hex = string;

export const encryptWithPassword = async (
  password: string,
  content: Hex,
): Promise<Hex> => {
  const passwordHex = Buffer.from(password).toString('hex');
  const salt = cryptoRandomString({ length: 2 * 32 });
  const nonce = cryptoRandomString({ length: 2 * 12 });
  return CSL.encrypt_with_password(passwordHex, salt, nonce, content);
};

export const decryptWithPassword = async (
  password: string,
  encryptedKeyHex: string,
): Promise<Hex> => {
  const passwordHex = Buffer.from(password).toString('hex');
  try {
    const decryptedHex = await CSL.decrypt_with_password(
      passwordHex,
      encryptedKeyHex,
    );

    return decryptedHex;
  } catch (err) {
    throw new Error('Wrong password');
  }
};
