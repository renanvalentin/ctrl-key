import React, { useMemo, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { BackAction } from './components';
import { TopNavigation, useStyleSheet } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { WalletViewModel } from '../models';
import { useApolloClient } from '@apollo/client';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'SendAmount'
>['navigation'];
type Route = NativeStackScreenProps<RootStackParamList, 'SendAmount'>['route'];

interface State {
  isCalculatingFees: boolean;
}

export const SendAmount = () => {
  const styles = useStyleSheet(themedStyle);
  const navigation = useNavigation<Navigation>();
  const [state, setState] = useState<State>({
    isCalculatingFees: false,
  });

  const {
    params: { walletId },
  } = useRoute<Route>();

  const apolloClient = useApolloClient();

  const viewModel = useMemo(
    () => new WalletViewModel(apolloClient),
    [apolloClient],
  );

  const wallet = useAppStore(state => state.getWalletById(walletId));

  const onReviewPress = async (formData: Pages.Send.Types.FormData) => {
    setState({ isCalculatingFees: true });

    const txBodyEncoded = await viewModel.buildTx(wallet, formData);

    navigation.navigate('SendSummary', {
      walletId,
      txBody: txBodyEncoded,
    });
  };

  return (
    <View style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title="wallets"
        style={styles.navigation}
      />

      <Pages.Send.AmountView
        onReviewPress={onReviewPress}
        calculatingFees={state.isCalculatingFees}
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
