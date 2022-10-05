import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { useStyleSheet } from '@ui-kitten/components';
import { WalletViewModel } from '../models';
import { useApolloClient } from '@apollo/client';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'Processing'
>['navigation'];
type Route = NativeStackScreenProps<RootStackParamList, 'Processing'>['route'];

interface State {
  completed: boolean;
  txHash: string;
}

export const Processing = () => {
  const styles = useStyleSheet(themedStyle);
  const navigation = useNavigation<Navigation>();
  const {
    params: { walletId, unsingedTx },
  } = useRoute<Route>();

  const apolloClient = useApolloClient();

  const [state, setState] = useState<State>({
    completed: false,
    txHash: '',
  });

  const viewModel = useMemo(
    () => new WalletViewModel(apolloClient),
    [apolloClient],
  );

  const wallet = useAppStore(state => state.getWalletById(walletId));

  useEffect(() => {
    const doSign = async () => {
      const txHash = await viewModel.signTx(wallet, { ...unsingedTx });

      setState({
        completed: true,
        txHash,
      });
    };

    doSign();
  }, []);

  const onClosePress = () => navigation.navigate('Main');

  const onTransactionLinkPress = () =>
    Linking.openURL(
      `https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${state.txHash}`,
    );

  return (
    <View style={styles.container}>
      <Pages.Send.ProcessingView
        completed={state.completed}
        onClosePress={onClosePress}
        onTransactionLinkPress={onTransactionLinkPress}
      />
    </View>
  );
};

const themedStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    backgroundColor: 'background-basic-color-2',
  },
});
