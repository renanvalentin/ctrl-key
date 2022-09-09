import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export const api = new BlockFrostAPI({
  projectId: process.env.BLOCKFROST_API_TOKEN,
  network: 'testnet',
});
