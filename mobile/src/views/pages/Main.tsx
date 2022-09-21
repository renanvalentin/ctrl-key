import React from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppStore } from '../../store';
import { RootStackParamList } from '../../types';

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'Main'
>['navigation'];

export const Main = () => {
  const wallets = useAppStore(state => state.wallets);
  const navigation = useNavigation<Navigation>();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button
          onPress={() => navigation.navigate('RestoreWallet')}
          title="Restore Wallet"
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={{ padding: 50 }}>
          <View style={{ margin: 10 }}>
            {wallets.map(wallet => (
              <View style={{ margin: 10 }} key={wallet.id}>
                <Text>{wallet.name}</Text>
                <Button
                  onPress={() =>
                    navigation.navigate('Summary', {
                      walletId: wallet.id,
                    })
                  }
                  title="Open"
                />
                <Button
                  onPress={() =>
                    navigation.navigate('Send', {
                      walletId: wallet.id,
                    })
                  }
                  title="Send"
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
