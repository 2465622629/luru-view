import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axiosInstance from "../utils/comreqtool";
import AsyncStorage from '@react-native-async-storage/async-storage';
import JwtHelper from "../utils/jwtUtils";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonAnim] = useState(new Animated.Value(0));

    const navigation = useNavigation();

    const handleLogin = () => {
        startButtonAnimation('login');
        login();
    };

    const handleRegister = () => {
        startButtonAnimation('register');
        navigation.navigate('Register');
    };

    const login = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await axiosInstance.post('/user/login', formData);
        if (response.data.success === true) {
            let cookie = response.headers['set-cookie'][0];
            let jwt = JwtHelper.decodeToken(cookie); //解密
            const userId = jwt.user.id;
            await AsyncStorage.setItem('userId', userId.toString());
            alert('登录成功');
            navigation.navigate('Home');
        }
    };

    const startButtonAnimation = (buttonType) => {
        Animated.timing(buttonAnim, {
            toValue: buttonType === 'login' ? 1 : 2,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            // 动画完成后重置动画值
            buttonAnim.setValue(0);
        });
    };

    const buttonScale = buttonAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 0.9, 0.9],
    });

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="用户名"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="密码"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>登录</Text>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>注册</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonContainer: {
        marginTop: 20,
        width: '80%',
        transformOrigin: 'center',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
