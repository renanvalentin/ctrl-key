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
  'NanoXPassword'
>['navigation'];
type Route = NativeStackScreenProps<
  RootStackParamList,
  'NanoXPassword'
>['route'];

export const NanoXPassword = () => {
  const styles = useStyleSheet(themedStyle);
  const importLedgerWallet = useAppStore(state => state.importLedgerWallet);
  const navigation = useNavigation<Navigation>();
  const {
    params: {
      deviceInfo: { chainCodeHex, publicKeyHex },
    },
  } = useRoute<Route>();

  const doCreate = async (pin: string) => {
    await importLedgerWallet({
      name: 'Nano X',
      chainCodeHex,
      publicKeyHex,
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
