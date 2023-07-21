import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Animated} from 'react-native';
import axiosInstance from "../utils/comreqtool";
import {useNavigation} from "@react-navigation/native";

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation();
    const [buttonAnim] = useState(new Animated.Value(0));

    const fadeAnim = useState(new Animated.Value(0))[0];
    const startButtonAnimation = () => {
        Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };
    const buttonScale = buttonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.9],
    });
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const handleRegistration = () => {
        if (username === '' || password === '' || inviteCode === '' || phoneNumber === '') {
            alert('请填写完整信息');
            return;
        }
        // fadeIn();
        Registration();
    };
    //数据规则判断
    const checkData = () => {
        if (username === '' || password === '' || inviteCode === '' || phoneNumber === '') {
            alert('请填写完整信息');
            return;
        }
        //手机号长度必须为11位
        if (phoneNumber.length !== 11) {
            alert('手机号长度必须为11位');
            return;
        }
        //正则判断是否为手机号
        let reg = /^1[3456789]\d{9}$/;
        if (!reg.test(phoneNumber)) {
            alert('请输入正确的手机号');
            return;
        }
        return true;
    }
    const Registration = async () => {
        let formatData = new FormData();
        formatData.append('username', username);
        formatData.append('password', password);
        formatData.append('invitationCode', inviteCode);
        formatData.append('phone', phoneNumber);
        if (checkData()) {
            let rep = await axiosInstance.post('/user/register', formatData);
            console.log(rep.data.data)
            if (rep.data.message === 'success') {
                fadeIn();
                navigation.navigate('Home');
            } else {
                console.log(rep.data.message)
                alert(rep.data.message);
            }
        }
    }

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
            <TextInput
                style={styles.input}
                placeholder="邀请码"
                value={inviteCode}
                onChangeText={setInviteCode}
            />
            <TextInput
                style={styles.input}
                placeholder="手机号"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <Animated.View style={[styles.buttonContainer, {transform: [{scale: buttonScale}]}]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegistration}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>注册</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.successMessage, {opacity: fadeAnim}]}>
                <Text style={styles.successMessageText}>注册成功!</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
    },
    input: {
        height: 40,
        borderColor: '#d3d3d3', // 更新边框颜色为更浅的灰色
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    successMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    successMessageText: {
        color: 'green',
        marginRight: 5,
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
    }

});

