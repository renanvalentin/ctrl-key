import * as bip39 from 'bip39';

export const generateMnemonic = () => bip39.generateMnemonic();

export const mnemonicToEntropy = (mnemonic: string) =>
  bip39.mnemonicToEntropy(mnemonic);

export const validate = (mnemonic: string) => bip39.validateMnemonic(mnemonic);
