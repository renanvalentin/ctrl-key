import { useCallback, useEffect } from 'react';
import { createStateContext, useDeepCompareEffect } from 'react-use';

import { Tx, Wallet } from './data';

export interface State {
  wallets: Wallet[];
  txs: Tx[];
  activeWallet?: number;
  loadingTxs: boolean;
}

const [hook, provider] = createStateContext<State>({
  txs: [],
  wallets: [],
  loadingTxs: false,
});

export const useStateContext = hook;

export const Provider = provider;

export const useRefreshWallets = (wallets: Wallet[] = []) => {
  const [_, setState] = hook();
  useDeepCompareEffect(() => {
    setState(s => ({
      ...s,
      wallets,
      activeWallet:
        s.activeWallet === undefined && wallets.length > 0 ? 0 : undefined,
    }));
  }, [wallets]);
};

export const useRefreshTxs = (txs: Tx[] = [], loading = false) => {
  const [_, setState] = hook();
  useDeepCompareEffect(() => {
    setState(s => ({
      ...s,
      txs,
    }));
  }, [txs]);

  useEffect(() => {
    setState(s => ({
      ...s,
      loadingTxs: loading,
    }));
  }, [loading]);
};

export const useActiveWallet = (): number | undefined => {
  const [state] = hook();

  return state.activeWallet;
};

export const useSetActiveWallet = () => {
  const [_, setState] = hook();

  return useCallback((index: number) => {
    setState(s => ({ ...s, activeWallet: index }));
  }, []);
};
