import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from "../Home/Home";
import LoginScreen from "../Login/Login";
import MyScreen from "../My/My";
import RegisterScreen from "../Register/Register";
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === '录入') {
                        iconName = 'home';
                    } else if (route.name === '我的') {
                        iconName = 'person';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="录入" component={HomeScreen} />
            <Tab.Screen name="登录" component={LoginScreen} />
            <Tab.Screen name="我的" component={MyScreen} />
            <Tab.Screen name="注册" component={RegisterScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;