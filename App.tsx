
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './screens/BottomTabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}