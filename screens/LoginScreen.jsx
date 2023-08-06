import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import axiosInstance from "../utils/comreqtool";
import AsyncStorage from '@react-native-async-storage/async-storage';
import JwtHelper from "../utils/jwtUtils";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginButtonAnim] = useState(new Animated.Value(0));
    const [registerButtonAnim] = useState(new Animated.Value(0));
    const backgroundImageUrl = '../assets/logo.png';
    const navigation = useNavigation();

    const handleLogin = () => {
        startButtonAnimation('login');
        login();
    };

    const handleRegister = () => {
        startButtonAnimation('register');
        navigation.navigate('注册');
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
            navigation.navigate('首页');
        }
    };

    const startButtonAnimation = (buttonType) => {
        if (buttonType === 'login') {
            Animated.timing(loginButtonAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                // 动画完成后重置动画值
                loginButtonAnim.setValue(0);
            });
        } else if (buttonType === 'register') {
            Animated.timing(registerButtonAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                // 动画完成后重置动画值
                registerButtonAnim.setValue(0);
            });
        }
    };


    return (
        <View style={styles.container}>
            <Image
                source={require(backgroundImageUrl)}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.heading}>欢迎使用贝壳联盟</Text>
            <Text style={styles.subheading}>请输入您的登录信息</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="用户名"
                    keyboardType="email-address"
                    autoCapitalize="none" // 不自动大写
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="密码"
                    secureTextEntry
                    autoCapitalize="none" // 不自动大写
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
            >
                <Text style={styles.loginButtonText}>登录</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
            >
                <Text style={styles.registerButtonText}>注册</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subheading: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 0,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 10,
        //添加背景色为白色 并添加外阴影 拟物风格
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 6, height: 6 }, //阴影偏移
        shadowRadius: 5, //阴影模糊程度
        elevation: 5, //Android端专用，iOS端不支持 阴影模糊程度

    },
    loginButton: {
        backgroundColor: '#000',
        borderRadius: 10,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});