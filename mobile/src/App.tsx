import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Main, Summary, RestoreWallet } from './views';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="RestoreWallet" component={RestoreWallet} />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
