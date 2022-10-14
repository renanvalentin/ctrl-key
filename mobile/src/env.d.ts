export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MNEMONIC: string;
      BLOCKFROST_API_TOKEN: string;
      POLLY_TOKEN: string;
      SERVER_URL: string;
      PUSHER_API_KEY: string;
      PUSHER_CLUSTER: string;
    }
  }
}
