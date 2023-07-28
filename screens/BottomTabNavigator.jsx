import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native'; 
import DetailsScreen from './DetailsScreen';
import PunchScreen from './PunchScreen';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import WithdrawScreen from './WithdrawScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
       name="首页" 
       component={HomeStackScreen} 
       options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require('../assets/home.png')}
            style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }}
          />
        ),
      }}
       />
      <Tab.Screen
        name="打卡"
        component={PunchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/punch_icon.png')}
              style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="我的"
        component={DetailsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/user.png')}
              style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }}
            />
          ),
        }}
      />

<Tab.Screen
        name="登录"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/user.png')}
              style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="withdraw" component={WithdrawScreen} />
    </Stack.Navigator>
  );
};

export default BottomTabNavigator;
