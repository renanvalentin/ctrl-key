import { uniqWith, eqProps } from 'ramda';
import {
  AddressModel,
  TxDirections,
  Wallet,
  coingecko,
  Account,
  Price,
} from '@ctrl-k/core';
import DataLoader from 'dataloader';

type StakeAddress = string;

export const accountDataLoader = () =>
  new DataLoader<StakeAddress, Account>(
    async (stakeAddresses: readonly StakeAddress[]): Promise<Account[]> => {
      return await Promise.all(
        stakeAddresses.map(stakeAddress => {
          const wallet = new Wallet({ stakeAddress });
          return wallet.account();
        }),
      );
    },
  );

type Currency = string;

export const coingeckoDataLoader = () =>
  new DataLoader<Currency, Price>(
    async (currencies: readonly Currency[]): Promise<Price[]> => {
      return await Promise.all(
        currencies.map(currency => {
          return coingecko.price(currency);
        }),
      );
    },
  );
