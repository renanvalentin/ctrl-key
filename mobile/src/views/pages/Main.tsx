import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import useSWR from 'swr';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSubscription } from 'observable-hooks';
import { useApolloClient } from '@apollo/client';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { WalletViewModel } from '../models';
import { SafeAreaLayout } from './components';
import { StyleSheet } from 'react-native';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'Main'
>['navigation'];

export const Main = () => {
  const wallets = useAppStore(state => state.wallets);
  const navigation = useNavigation<Navigation>();

  const apolloClient = useApolloClient();

  const viewModel = useMemo(
    () => new WalletViewModel(apolloClient),
    [apolloClient],
  );

  const { data: walletsCarousel } = useSWR(['wallets', wallets], (_, w) =>
    viewModel.walletsCarousel(w),
  );

  const activeWallet = Pages.Main.useActiveWallet();
  const { data: txs, error: txsError } = useSWR(
    activeWallet !== undefined ? ['txs', wallets[activeWallet]] : null,
    (_, w) => viewModel.txs(w),
  );

  Pages.Main.useRefreshTxs(txs, !txsError && !txs);
  Pages.Main.useRefreshWallets(walletsCarousel);
  const actions = Pages.Main.useActions();

  useSubscription(actions.addWallet$, () => navigation.navigate('AddWallet'));
  useSubscription(actions.onReceivePress$, () => {
    if (activeWallet === undefined) {
      return;
    }
    const wallet = wallets[activeWallet];
    navigation.navigate('Receive', {
      walletId: wallet.id,
    });
  });
  useSubscription(actions.onSendPress$, () => {
    if (activeWallet === undefined) {
      return;
    }
    const wallet = wallets[activeWallet];
    navigation.navigate('SendAmount', {
      walletId: wallet.id,
    });
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaLayout style={styles.container} level="1">
        <Pages.Main.View />
      </SafeAreaLayout>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
  },
});
