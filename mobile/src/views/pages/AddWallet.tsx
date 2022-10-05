import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { BackAction } from './components';
import { TopNavigation, useStyleSheet } from '@ui-kitten/components';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'AddWallet'
>['navigation'];

export const AddWallet = () => {
  const styles = useStyleSheet(themedStyle);
  const navigation = useNavigation<Navigation>();

  const restoreWallet = () => {
    navigation.navigate('RestoreWallet');
  };

  const nanoX = () => {
    navigation.navigate('NanoX');
  };

  return (
    <View style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title="wallets"
        style={styles.navigation}
      />

      <Pages.AddWallet.View
        onRestoreWalletPress={restoreWallet}
        onLedgerNanoXPress={nanoX}
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
