import { Resolvers } from './resolvers-types';
import { WalletQuery } from './queries';

export const resolvers: Resolvers = {
  Query: {
    wallet(_: unknown, { stakeAddress }: { stakeAddress: string }) {
      return WalletQuery.byStakeAddress(stakeAddress);
    },
    hello: () => 'Hello',
  },
};
