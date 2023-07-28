import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Animated,Image} from 'react-native';
import axiosInstance from "../utils/comreqtool";
import {useNavigation} from "@react-navigation/native";

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation();

    const fadeAnim = useState(new Animated.Value(0))[0];
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };
    const logoImageUrl = 'https://interactive-examples.mdn.mozilla.net/media/examples/lizard.png';

    const handleRegistration = () => {
        if (username === '' || password === '' || inviteCode === '' || phoneNumber === '') {
            alert('请填写完整信息');
            return;
        }
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
          <Image
            source={{ uri: logoImageUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heading}>欢迎来到贝壳联盟</Text>
    
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="用户名"
              secureTextEntry
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
              secureTextEntry
              value={inviteCode}
              onChangeText={setInviteCode}
            /><TextInput
            style={styles.input}
            placeholder="手机号"
            secureTextEntry
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          </View>
    
          <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
            <Text style={styles.buttonText}>注册</Text>
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
      marginBottom: 20,
    },
    inputContainer: {
      width: '100%',
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      paddingLeft: 15,
      marginBottom: 10,
    },
    registerButton: {
      backgroundColor: '#5468ff',
      borderRadius: 10,
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });