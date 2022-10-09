export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MNEMONIC: string;
      BLOCKFROST_API_TOKEN: string;
      POLLY_TOKEN: string;
      BLOCKFROST_WEBHOOK_AUTH_TOKEN: string;
      PUSHER_APP_ID: string;
      PUSHER_KEY: string;
      PUSHER_SECRET: string;
      PUSHER_CLUSTER: string;
    }
  }
}
