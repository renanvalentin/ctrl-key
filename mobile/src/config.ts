import Config from 'react-native-config';

export const BLOCKFROST_API_TOKEN =
  Config.BLOCKFROST_API_TOKEN || process.env.BLOCKFROST_API_TOKEN;

export const MNEMONIC = Config.MNEMONIC || process.env.MNEMONIC;
