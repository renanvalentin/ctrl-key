import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { useStyleSheet } from '@ui-kitten/components';
import { WalletViewModel } from '../models';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'SendPassword'
>['navigation'];
type Route = NativeStackScreenProps<
  RootStackParamList,
  'SendPassword'
>['route'];

export const SendPassword = () => {
  const styles = useStyleSheet(themedStyle);
  const navigation = useNavigation<Navigation>();
  const {
    params: { walletId, txBody },
  } = useRoute<Route>();
  const wallet = useAppStore(state => state.getWalletById(walletId));
  const [isIncorrectPassword, setIsIncorrectPassword] = useState<boolean>();

  const onPinEnter = async (pin: string) => {
    const isCorrect = WalletViewModel.tryUnlockPrivateKey(wallet, pin);

    if (!isCorrect) {
      setIsIncorrectPassword(true);
      return;
    }

    navigation.navigate('Processing', {
      walletId,
      unsingedTx: {
        hex: txBody.hex,
        password: pin,
        witnessesAddress: txBody.witnessesAddress,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pages.Password.View
        onPinEnter={onPinEnter}
        incorrect={isIncorrectPassword}
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
