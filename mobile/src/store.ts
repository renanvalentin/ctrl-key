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
  updateWallet: (wallet: WalletModel) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, getState) => ({
        wallets: [
          new HotWallet({
            id: 'ad3a1625-fc76-42fb-a698-05ebe3e386ce',
            name: 'Demo 1',
            encryptedRootKey:
              '48932d9d32627ef533460999c72ea6f4db34ecf714046551898a85cb900171aeaeda4eb23ef32d40b740e2a709716422ca9e31281c721e2f204fe3ec42a0ab4a5f52c94dcc7856b5b3bd33378ea2885d3bf741959ef3b4f6112ef9ce4410f17dd0e10bbeebcb3c7bd6e720668bd1efc9f2f9c501b32036fab34bb0097cbdd978d87e1f62a7010c7dbe48c5bd4128a02312f1598765ac821370da7288',
            paymentVerificationKey:
              'xpub1ha3hdtpzuyavyp4n8jmk37rd9df6yxsqrqjl0q9znx6mgytn44hugkegc76zfx5wwuk060x67dlft5vfndzdzgrh824w3tlu9m4pznccqd6xs',
            stakeVerificationKey:
              'xpub1cw5hv0ufyyrdj9aan28sqgdlws6kqv3u8texkny5692ur7wu2n2pe5xmjc6cxrew6mqugvnw2sevpkmp2drf6yjl0qvh2cgzy7r4r6c8hz0la',
            pendingTxs: [],
            stakeAddress:
              'stake_test1ur4nu3k86e6hvuw6ck2etk3ssgv2y6dm4pr8s76m86kg6usappr74',
            paymentAddresses: [
              'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
            ],
          }),
          new HotWallet({
            id: '07cb3697-cc9b-4a03-bc5e-4c243183b1a0',
            name: 'Demo 2',
            encryptedRootKey:
              'd3d06b426722014227fb6f65c2f22396cfe87264274d13825db1e9fe04b2bdaeb4d5873408f0a7382c42e38c42d7f9a34918f3e77e43cb48cf90f04ae7261a9cb2f0defc4ca673e5991826afa3f18c28cc0099fee6213414dffea9e743ae0cbc24bfe979dc066c28e4c2a25222e61e23dee4f5b8b99ccd2aec8079219eeb50a2dbfdb00483837c39ebc8a5435ab1f157e4bf1d68d16524652872cf08',
            paymentVerificationKey:
              'xpub1cthyxl3utpu77zv58l3cnruq68qetz3eg5gwqwsp7r22dgfg3l3w4jcxnaf2uj8vs572le26a74af733qzr8m909zyfmpw0f0n80ymst32tkz',
            stakeVerificationKey:
              'xpub142w8yq44cdmdw62udzxc7kyjp4g0pw8rsujj4wyqr284qx9j2mu759jk43l6xdhzr9e87ctcf9eafg4hvgxtvce9hm6ml0r7gr7hh2ccg9g0t',
            pendingTxs: [],
            stakeAddress:
              'stake_test1uqn2f7y83lhlfpuvygtkm3p6jwag4afund63ynddeaqee7sd7jxyz',
            paymentAddresses: [
              'addr_test1qpag5f673kph6hgysh82553ac66uqaprdnr4s23ep3ztvwex5nug0rl07jrccgshdhzr4ya63t6nexm4zfx6mn6pnnaqcdshmp',
            ],
          }),
        ] as WalletModel[],
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
        updateWallet: wallet => {
          set(state => ({
            wallets: state.wallets.map(w => {
              if (w.id === wallet.id) {
                return wallet;
              }

              return w;
            }),
          }));
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
