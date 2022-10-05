import React, { useEffect, useMemo } from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { BackAction } from './components';
import { TopNavigation, useStyleSheet } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { LedgerConnector, MonitorState } from '../../core/ledger';
import { useSubscription } from 'observable-hooks';
import { WalletViewModel } from '../models';
import { useNavigation } from '@react-navigation/native';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'NanoX'
>['navigation'];

export const NanoX = () => {
  const styles = useStyleSheet(themedStyle);
  const monitorDevice$ = useMemo(() => WalletViewModel.importLedger(), []);
  const navigation = useNavigation<Navigation>();

  useSubscription(monitorDevice$, async cases => {
    if (cases.type !== MonitorState.Found) {
      return;
    }

    const deviceInfo = await WalletViewModel.getLedgerDeviceInfo(
      cases.descriptor,
    );

    navigation.navigate('NanoXPassword', { deviceInfo });
  });

  return (
    <View style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title="wallets"
        style={styles.navigation}
      />

      <Pages.NanoX.View connecting onCreatePress={() => {}} />
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
