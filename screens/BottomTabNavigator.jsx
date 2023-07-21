import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdScreen from './AdScreen';
import LoginScreen from './LoginScreen';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator>
        <Tab.Screen name="广告" component={AdScreen} />
        <Tab.Screen name="登录" component={LoginScreen} />
      </Tab.Navigator>
    );
};

export default BottomTabNavigator;