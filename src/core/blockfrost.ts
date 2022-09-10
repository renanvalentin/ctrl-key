import type { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import axios from 'axios';
import { BLOCKFROST_API_TOKEN } from '@ctrlK/config';

const instance = axios.create({
  baseURL: 'https://cardano-testnet.blockfrost.io/api/v0/',
  timeout: 1000,
  headers: { project_id: BLOCKFROST_API_TOKEN },
});

type API = Pick<
  BlockFrostAPI,
  | 'accountsAddressesAll'
  | 'addressesTransactions'
  | 'txsUtxos'
  | 'accounts'
  | 'txs'
>;

export const api: API = {
  accounts: async stakeAddress => {
    const { data } = await instance.get(`/accounts/${stakeAddress}`);
    return data;
  },
  accountsAddressesAll: async stakeAddress => {
    const { data } = await instance.get(`/accounts/${stakeAddress}/addresses`);
    return data;
  },
  addressesTransactions: async (address, { order } = {}) => {
    const { data } = await instance.get(
      `/addresses/${address}/transactions${order ? `?order=${order}` : ''}`,
    );
    return data;
  },
  txs: async hash => {
    const { data } = await instance.get(`/txs/${hash}`);
    return data;
  },
  txsUtxos: async hash => {
    const { data } = await instance.get(`/txs/${hash}/utxos`);
    return data;
  },
};
