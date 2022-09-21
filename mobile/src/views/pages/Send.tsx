import React, { useState } from 'react';
import { Button, Text, View, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useSubmitTx } from './Send.hooks';

type Route = NativeStackScreenProps<RootStackParamList, 'Send'>['route'];
type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'Send'
>['navigation'];

interface State {
  paymentAddress: string;
  password: string;
  amount: string;
  error: string;
}

export const Send = () => {
  const {
    params: { walletId },
  } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();

  const submitTx = useSubmitTx(walletId);

  const [state, setState] = useState<State>({
    amount: '2000000',
    password: 'pass',
    paymentAddress:
      'addr_test1qzfxzvpjanrvrsk0g50822c2ygka3fcrwrdhn005wgwvwzpx5nug0rl07jrccgshdhzr4ya63t6nexm4zfx6mn6pnnaqgnscnz',
    error: '',
  });

  const submit = async () => {
    await submitTx({
      amount: state.amount,
      paymentAddress: state.paymentAddress,
      password: state.password,
    });

    navigation.navigate('Summary', {
      walletId,
    });
  };

  return (
    <View style={{ padding: 50 }}>
      <TextInput
        onChangeText={v => setState(s => ({ ...s, paymentAddress: v }))}
        value={state.paymentAddress}
        placeholder="Payment Address"
      />
      <TextInput
        onChangeText={v => setState(s => ({ ...s, amount: v }))}
        value={state.amount}
        placeholder="Amount"
      />
      <TextInput
        onChangeText={v => setState(s => ({ ...s, password: v }))}
        value={state.password}
        placeholder="Password"
        textContentType="password"
        autoCapitalize="none"
      />
      <Button title="Send" onPress={submit} />
      {state.error.length > 0 && <Text>{state.error}</Text>}
    </View>
  );
};
