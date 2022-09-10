import React, { useState } from 'react';
import { Button, Text, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MNEMONIC } from '@ctrlK/config';
import { WalletViewModel } from '../models';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'RestoreWallet'
>['navigation'];

export const RestoreWallet = () => {
  const [mnemonic, setMnemonic] = useState(MNEMONIC);
  const [name, setName] = useState('Wallet');
  const [salt, setSalt] = useState('');
  const [password, setPassword] = useState('pass');
  const [error, setError] = useState('');
  const restoreWallet = useAppStore(state => state.restoreWallet);
  const navigation = useNavigation<Navigation>();

  const doRestore = async () => {
    if (name.length === 0) {
      setError('Enter wallet name');
      return;
    }

    if (password.length === 0) {
      setError('Enter password');
      return;
    }

    if (!WalletViewModel.validateMnemonic(mnemonic)) {
      setError('Check your seed words');
      return;
    }

    const walletId = await restoreWallet({
      seedWords: mnemonic,
      name,
      salt,
      password,
    });

    navigation.navigate('Summary', {
      walletId,
    });
  };

  return (
    <View style={{ padding: 50 }}>
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Wallet name"
      />
      <TextInput
        onChangeText={setMnemonic}
        value={mnemonic}
        placeholder="Enter mnemonic"
        multiline
        numberOfLines={4}
      />
      <TextInput onChangeText={setSalt} value={salt} placeholder="Salt" />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
      />
      <Button title="Restore" onPress={doRestore} />
      {error.length > 0 && <Text>{error}</Text>}
    </View>
  );
};
