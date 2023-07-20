
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './screens/BottomTabNavigator';
import {
  StyleSheet,
} from 'react-native';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

//样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});