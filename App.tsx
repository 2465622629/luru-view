
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './screens/BottomTabNavigator';
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import { APP_KEY, REWARD_POS_ID, INSERT_POS_ID } from './config/ADconfig';

export default function App() {
  NativeModules.AdUtilsModule.initAd(APP_KEY);
  NativeModules.AdUtilsModule.initRewardAd(REWARD_POS_ID);
  NativeModules.AdUtilsModule.initInsertAd(INSERT_POS_ID);

  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}