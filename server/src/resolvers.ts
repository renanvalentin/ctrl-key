import { Resolvers, TxValue } from './resolvers-types';
import { WalletQuery, TransactionQuery } from './queries';

export const resolvers: Resolvers = {
  Query: {
    wallet(_: unknown, { stakeAddress }: { stakeAddress: string }) {
      return WalletQuery.byStakeAddress(stakeAddress);
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
};
