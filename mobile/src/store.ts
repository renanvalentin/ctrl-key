import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SerializedWallet,
  HotWallet,
  CreateHotWalletArgs,
  LedgerWallet,
  WalletModel,
  CreateLedgerWalletArgs,
} from '@ctrlK/core';

interface AppState {
  wallets: WalletModel[];
  restoreHotWallet: (args: CreateHotWalletArgs) => Promise<string>;
  importLedgerWallet: (args: CreateLedgerWalletArgs) => Promise<string>;
  getWalletById: (walletId: string) => WalletModel;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, getState) => ({
        wallets: [] as WalletModel[],
        restoreHotWallet: async args => {
          const wallet = await HotWallet.create(args);
          set(state => ({ wallets: [...state.wallets, wallet] }));
          return wallet.id;
        },
        importLedgerWallet: async args => {
          const wallet = await LedgerWallet.create(args);
          set(state => ({ wallets: [...state.wallets, wallet] }));
          return wallet.id;
        },
        getWalletById: walletId => {
          const { wallets } = getState();
          const wallet = wallets.find(w => w.id === walletId);

          if (!wallet) {
            throw new Error('Wallet missing');
          }

          return wallet;
        },
      }),
      {
        name: 'app-storage',
        getStorage: () => AsyncStorage,
        async serialize(state) {
          const wallets = await Promise.all(
            state.state.wallets.map(w => w.serialize()),
          );

          return JSON.stringify({
            wallets,
          });
        },
        async deserialize(str) {
          const data: { wallets: SerializedWallet[] } = JSON.parse(str);

          const wallets = await Promise.all(
            data.wallets.map(w =>
              w.__type === 'cold'
                ? LedgerWallet.deserialize(w)
                : HotWallet.deserialize(w),
            ),
          );

          return {
            state: {
              wallets,
            },
          };
        },
      },
    ),
  ),
);
