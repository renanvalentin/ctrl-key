export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MNEMONIC: string;
      BLOCKFROST_API_TOKEN: string;
    }
  }
}
