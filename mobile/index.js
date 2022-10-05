/**
 * @format
 */

import './shim';
import { AppRegistry } from 'react-native';
import { App, Storybook } from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
