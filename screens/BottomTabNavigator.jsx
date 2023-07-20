import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdScreen from './AdScreen';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator>
        <Tab.Screen name="广告" component={AdScreen} />
      </Tab.Navigator>
    );
};

export default BottomTabNavigator;