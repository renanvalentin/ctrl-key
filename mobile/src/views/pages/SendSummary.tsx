import React, { useMemo } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { BackAction } from './components';
import { TopNavigation, useStyleSheet } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { WalletViewModel } from '../models';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'SendSummary'
>['navigation'];
type Route = NativeStackScreenProps<RootStackParamList, 'SendSummary'>['route'];

export const SendSummary = () => {
  const styles = useStyleSheet(themedStyle);
  const navigation = useNavigation<Navigation>();
  const {
    params: { walletId, txBody },
  } = useRoute<Route>();
  const txSummary = useMemo(() => WalletViewModel.txSummary(txBody), [txBody]);

  const onConfirmPress = async () => {
    navigation.navigate('SendPassword', {
      walletId,
      txBody: txBody,
    });
  };

  return (
    <View style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title="wallets"
        style={styles.navigation}
      />

      <Pages.Send.SummaryView
        onConfirmPress={onConfirmPress}
        address={txSummary.address}
        fees={txSummary.fees}
        lovelace={txSummary.lovelace}
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
