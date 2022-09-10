import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RestoreWallet } from './views/pages/RestoreWallet';
import { Summary } from './views/pages';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="RestoreWallet" component={RestoreWallet} />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
