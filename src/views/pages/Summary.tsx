import React from 'react';
import {
  Text,
  View,
  Linking,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useSummary } from './Summary.hooks';

type Route = NativeStackScreenProps<RootStackParamList, 'Summary'>['route'];

export const Summary = () => {
  const {
    params: { walletId },
  } = useRoute<Route>();

  const { data, error } = useSummary(walletId);

  if (error) {
    return (
      <View style={{ padding: 50 }}>
        <View style={{ margin: 10 }}>
          <Text>{error.toString()}</Text>
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ padding: 50 }}>
        <View style={{ margin: 10 }}>
          <Text>loading...</Text>
        </View>
      </View>
    );
  }

  const { balance, marketPrice, name, txs } = data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={{ padding: 50 }}>
          <View style={{ margin: 10 }}>
            <Text>{name}</Text>
            <Text>{balance}</Text>
            <Text>{marketPrice}</Text>
            {txs.map(tx => (
              <View style={{ margin: 10 }} key={tx.id}>
                <Text>{tx.type}</Text>
                <Text>{tx.amount}</Text>
                <Text>{tx.date}</Text>
                {tx.fees && <Text>{tx.fees}</Text>}
                <Button
                  onPress={() =>
                    Linking.openURL(
                      `https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${tx.id}`,
                    )
                  }
                  title="Details"
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
