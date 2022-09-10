import useSWR from 'swr';
import { useAppStore } from '../../store';
import { WalletViewModel } from '../models';

export const useSummary = (walletId: string) => {
  const wallet = useAppStore(state => state.getWalletById(walletId));
  return useSWR(`wallet:${walletId}:summary`, () =>
    WalletViewModel.summary(wallet),
  );
};
