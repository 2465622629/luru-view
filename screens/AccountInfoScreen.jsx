// 账户信息

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const AccountInfoScreen = () => {
  // 假设用户信息
  const userInfo = {
    username: 'John Doe',
    avatar: require('./path/to/your/user-avatar.png'),
    phoneNumber: '123-456-7890',
    paymentInfo: '**** **** **** 1234', // 假设显示最后四位
  };

  const handleLogout = () => {
    // 在此处实现注销账号逻辑
    // 可以清除用户信息、跳转到登录页等
    console.log('Logout');
  };

  return (
    <View style={styles.container}>
      {/* 头像 */}
      <Image source={userInfo.avatar} style={styles.avatar} />

      {/* 用户名 */}
      <Text style={styles.username}>{userInfo.username}</Text>

      {/* 账号安全 */}
      <TouchableOpacity style={styles.accountSecurityButton}>
        <Text style={styles.buttonText}>账号安全</Text>
      </TouchableOpacity>

      {/* 手机号 */}
      <Text style={styles.accountInfoText}>手机号：{userInfo.phoneNumber}</Text>

      {/* 支付信息 */}
      <Text style={styles.accountInfoText}>支付信息：{userInfo.paymentInfo}</Text>

      {/* 修改密码 */}
      <TouchableOpacity style={styles.changePasswordButton}>
        <Text style={styles.buttonText}>修改密码</Text>
      </TouchableOpacity>

      {/* 注销账号 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>注销账号</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  accountSecurityButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  accountInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  changePasswordButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountInfoScreen;
