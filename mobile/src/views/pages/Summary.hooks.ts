import { useQuery, gql } from '@apollo/client';
import { useAppStore } from '../../store';
import { WalletViewModel } from '../models';
import { Wallet } from '@ctrl-k/schema';

const GET_WALLET = gql`
  query GetWallet($stakeAddress: String!) {
    wallet(stakeAddress: $stakeAddress) {
      balance
      marketPrice
      txs {
        type
        amount
        fees
        date
        id
      }
    }
  }
`;

export const useSummary = (walletId: string) => {
  const wallet = useAppStore(state => state.getWalletById(walletId));
  const { loading, error, data } = useQuery<{ wallet: Wallet }>(GET_WALLET, {
    variables: {
      stakeAddress: wallet.stakeAddress,
    },
  });

  return {
    loading,
    error,
    data: data && WalletViewModel.summary(wallet.name, data.wallet),
  };
};
