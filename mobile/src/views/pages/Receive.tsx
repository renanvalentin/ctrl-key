import React from 'react';

import { useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { BackAction } from './components';
import { TopNavigation, useStyleSheet } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

type Route = NativeStackScreenProps<RootStackParamList, 'Receive'>['route'];

export const Receive = () => {
  const styles = useStyleSheet(themedStyle);
  const {
    params: { walletId },
  } = useRoute<Route>();

  const wallet = useAppStore(state => state.getWalletById(walletId));

  return (
    <View style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title="wallets"
        style={styles.navigation}
      />

      <Pages.Receive.View address={wallet.paymentAddresses[0]} />
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
