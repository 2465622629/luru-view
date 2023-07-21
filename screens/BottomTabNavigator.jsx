import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AdScreen from './AdScreen';  
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import DetailsScreen from './DetailsScreen';
import PunchScreen from './PunchScreen';
import AccountInfoScreen from './AccountInfoScreen';
import WithdrawScreen from './WithdrawScreen';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="广告" component={AdScreen} />
      <Tab.Screen name="我的" component={DetailsScreen} />
      <Tab.Screen name="账号信息" component={AccountInfoScreen} />
      <Tab.Screen name="打卡" component={PunchScreen} />
      <Tab.Screen name="提现" component={WithdrawScreen} />
    </Tab.Navigator>
  );
};

// const AppNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="注册" component={RegisterScreen} />
//       <Stack.Screen name="首页" component={LoginScreen} />
//     </Stack.Navigator>
//   );
// };

export default BottomTabNavigator;