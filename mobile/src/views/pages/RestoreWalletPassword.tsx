import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';
import { Pages } from '../../components';
import { useStyleSheet } from '@ui-kitten/components';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'RestoreWalletPassword'
>['navigation'];
type Route = NativeStackScreenProps<
  RootStackParamList,
  'RestoreWalletPassword'
>['route'];

export const RestoreWalletPassword = () => {
  const styles = useStyleSheet(themedStyle);
  const restoreWallet = useAppStore(state => state.restoreHotWallet);
  const navigation = useNavigation<Navigation>();
  const {
    params: {
      formData: { mnemonic, name },
    },
  } = useRoute<Route>();

  const doCreate = async (pin: string) => {
    await restoreWallet({
      seedWords: mnemonic,
      name: name,
      password: pin,
    });

    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Pages.Password.View onPinEnter={doCreate} />
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
