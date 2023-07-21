import React, { Component } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>用户名</Text>
            <Text style={styles.accountInfoText}>
              珍惜
            </Text>
          </View>

          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>头像</Text>
            <Text style={styles.accountInfoText}>
              珍惜
            </Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>手机号</Text>
            <Text style={styles.accountInfoText}>
              1235123124
            </Text>
          </View>

          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>支付信息</Text>
            <Text style={styles.accountInfoText}>
              珍惜
            </Text>
          </View>

          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>修改密码</Text>
          </View>

          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>注销账号</Text>
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  accountInfo: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    //让内容横向排列
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  accountInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  accountInfoText: {
    fontSize: 14,
    color: '#333',
  },
  securityInfo: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  securityInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  securityInfoText: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default App;
