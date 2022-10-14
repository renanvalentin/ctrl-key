import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloProvider } from '@apollo/client';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StorybookUIRoot from '../.ondevice/Storybook';

import { Pages } from './components';
import { TransactionsChannel } from './channels';
import {
  Main,
  Summary,
  RestoreWallet,
  RestoreWalletPassword,
  Send,
  Receive,
  SendAmount,
  NanoX,
  AddWallet,
  SendSummary,
  SendPassword,
  Processing,
  NanoXPassword,
} from './views';
import { SWR } from './swr-config';
import { createApolloClient } from './apollo';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const client = createApolloClient(fetch);

const Stack = createNativeStackNavigator();

export const App = () => {
  // AsyncStorage.clear().then(() => console.log('Cleared'));

  return (
    <SWR>
      <SafeAreaProvider>
        <TransactionsChannel />
        <Pages.Main.ActionProvider>
          <Pages.Main.StateProvider>
            <ApplicationProvider {...eva} theme={eva.light}>
              <IconRegistry icons={EvaIconsPack} />
              <ApolloProvider client={client}>
                <NavigationContainer>
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <>
                      <Stack.Screen name="Main" component={Main} />
                      <Stack.Screen
                        name="RestoreWallet"
                        options={{
                          presentation: 'modal',
                        }}
                        component={RestoreWallet}
                      />
                      <Stack.Screen
                        name="RestoreWalletPassword"
                        component={RestoreWalletPassword}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="NanoX"
                        component={NanoX}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="NanoXPassword"
                        component={NanoXPassword}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="AddWallet"
                        component={AddWallet}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="Receive"
                        component={Receive}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="SendAmount"
                        component={SendAmount}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="SendSummary"
                        component={SendSummary}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="SendPassword"
                        component={SendPassword}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen
                        name="Processing"
                        component={Processing}
                        options={{
                          presentation: 'modal',
                        }}
                      />
                      <Stack.Screen name="Summary" component={Summary} />
                      <Stack.Screen name="Send" component={Send} />
                    </>
                  </Stack.Navigator>
                </NavigationContainer>
              </ApolloProvider>
            </ApplicationProvider>
          </Pages.Main.StateProvider>
        </Pages.Main.ActionProvider>
      </SafeAreaProvider>
    </SWR>
  );
};

export const Storybook = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <IconRegistry icons={EvaIconsPack} />
        <StorybookUIRoot />
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
};
