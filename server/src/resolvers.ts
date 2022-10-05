import { Resolvers, TxValue } from './resolvers-types';
import { WalletQuery, TransactionQuery } from './queries';

export const resolvers: Resolvers = {
  Query: {
    wallet(_, { stakeAddress }) {
      return WalletQuery.byStakeAddress(stakeAddress);
    },
    wallets(_, { stakeAddresses }) {
      return stakeAddresses?.map(stakeAddress =>
        WalletQuery.byStakeAddress(stakeAddress),
      );
    },
    buildTx(
      _: unknown,
      {
        stakeAddress,
        value,
        paymentAddress,
      }: { stakeAddress: string; value: TxValue; paymentAddress: string },
    ) {
      return TransactionQuery.buildTx(stakeAddress, value, paymentAddress);
    },
    submitTx(_: unknown, { tx }: { tx: string }) {
      return TransactionQuery.submitTx(tx);
    },
  },
  Wallet: {
    balance: async (wallet, _, context) => WalletQuery.balance(wallet, context),
    marketPrice: async (_, __, context) => WalletQuery.marketPrice(context),
    txs: async (wallet, _, context) => WalletQuery.txs(wallet, context),
  },
};
