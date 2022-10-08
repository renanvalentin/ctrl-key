import {
  Resolvers,
  TxValue,
  QuerySubmitTxArgs,
  SubscriptionPendingTxsArgs,
} from './resolvers-types';
import { WalletQuery, TransactionQuery } from './queries';
import { pubSub, PendingTxPayload } from './pub-sub';

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
    submitTx(_: unknown, { tx }: QuerySubmitTxArgs, context) {
      return TransactionQuery.submitTx(tx, context);
    },
  },
  Subscription: {
    pendingTxs: {
      subscribe(_, { txHash }: SubscriptionPendingTxsArgs, context) {
        return pubSub.subscribe('txs:pending:', txHash);
      },
      resolve: (payload: PendingTxPayload) => ({ hash: payload.hash }),
    },
  },
  Wallet: {
    balance: async (wallet, _, context) => WalletQuery.balance(wallet, context),
    marketPrice: async (_, __, context) => WalletQuery.marketPrice(context),
    txs: async (wallet, _, context) => WalletQuery.txs(wallet, context),
  },
};
