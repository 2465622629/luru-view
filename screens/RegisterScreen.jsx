import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Animated, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { register } from '../service/api'

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
  const logoImageUrl = '../assets/logo.png';

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
      let { data: rep } = await register(formatData);
      if (rep.success) {
        fadeIn();
        navigation.navigate('登录');
      } else {
        console.log(rep.message)
        alert(rep.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require(logoImageUrl)}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>欢迎来到贝壳联盟</Text>

      <View style={styles.inputContainer}>
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
        /><TextInput
          style={styles.input}
          placeholder="手机号"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View>
        <Text style={{ color: '#fa541c', fontSize: 16 }}>1.用户名字尽量中文名字 ❗️</Text>
        <Text style={{ color: '#fa541c', fontSize: 16 }}>2.注册时的手机号必须是支付宝账号，一旦注册自动绑定支付宝账号，如注册时的手机号没有注册支付宝，提现不到账！没办法提现❗️❗️</Text>
        <Text style={{ color: '#fa541c', fontSize: 16 }}>3.恶意批量注册将清空所有有关账号数据 请悉知</Text>
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
    height: 70,
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
  registerButton: {
    backgroundColor: '#000',
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