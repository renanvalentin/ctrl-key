import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { BackAction, SafeAreaLayout } from './components';
import { TopNavigation, useStyleSheet } from '@ui-kitten/components';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'RestoreWallet'
>['navigation'];

export const RestoreWallet = () => {
  const styles = useStyleSheet(themedStyle);
  const navigation = useNavigation<Navigation>();

  const setPassword = async (data: Pages.RestoreWallet.Types.FormData) => {
    navigation.navigate('RestoreWalletPassword', {
      formData: data,
    });
  };

  return (
    <View style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title="wallets"
        style={styles.navigation}
      />

      <Pages.RestoreWallet.View onRestorePress={setPassword} />
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
