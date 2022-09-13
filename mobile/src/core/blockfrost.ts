import type { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import type { PaginationOptions } from '@blockfrost/blockfrost-js/lib/types';
import axios from 'axios';
import { BLOCKFROST_API_TOKEN } from '@ctrlK/config';
import { TxValue } from './cardano';

const instance = axios.create({
  baseURL: 'https://cardano-testnet.blockfrost.io/api/v0/',
  timeout: 1000,
  headers: { project_id: BLOCKFROST_API_TOKEN },
});

interface API {
  accounts: (stakeAddress: string) => ReturnType<BlockFrostAPI['accounts']>;
  accountsAddressesAll: (
    stakeAddress: string,
  ) => ReturnType<BlockFrostAPI['accountsAddressesAll']>;
  addressesTransactions: (
    address: string,
    opts?: PaginationOptions,
  ) => ReturnType<BlockFrostAPI['addressesTransactions']>;
  addressesUtxosAll: (
    address: string,
  ) => ReturnType<BlockFrostAPI['addressesUtxosAll']>;
  txs: (hash: string) => ReturnType<BlockFrostAPI['txs']>;
  txsUtxos: (hash: string) => ReturnType<BlockFrostAPI['txsUtxos']>;
}

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
  addressesUtxosAll: async address => {
    const { data } = await instance.get(`/addresses/${address}/utxos`);
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

interface Amount {
  unit: string;
  quantity: string;
}

export const amountToValue = (amount: Amount[]): TxValue => {
  const findLovelace = () => {
    const lovelace = amount.find(asset => asset.unit === 'lovelace');

    if (lovelace) {
      return BigInt(lovelace.quantity);
    }

    return 0n;
  };

  const findAssets = () => {
    return amount
      .filter(asset => asset.unit !== 'lovelace')
      .map(asset => ({
        hex: asset.unit,
        quantity: BigInt(asset.quantity),
      }));
  };

  return {
    lovelace: findLovelace(),
    assets: findAssets(),
  };
};
