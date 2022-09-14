import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { SERVER_URL } from './config';
import { Main, Summary, RestoreWallet } from './views';

const client = new ApolloClient({
  uri: SERVER_URL,
  cache: new InMemoryCache(),
});

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="RestoreWallet" component={RestoreWallet} />
          <Stack.Screen name="Summary" component={Summary} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
