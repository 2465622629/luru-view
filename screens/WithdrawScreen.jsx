import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axiosInstance from "../utils/comreqtool";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function WithdrawScreen() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [data, setData] = useState({
    userData: {},
  });

  const [refreshing, setRefreshing] = useState(false); // State variable for controlling the refresh

  useEffect(() => {
    // getUserInfo();
  }, []);

  const handleWithdraw = async () => {
    const token = await AsyncStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userId', token);
    formData.append('amount', withdrawAmount);
    const rep = await axiosInstance.post('/withdrawals/initiateWithdrawal', formData);
    if (rep.data.success == true) {
      alert('提现成功');
    }
  };

  const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');

      const formData = new FormData();
      formData.append('userId', token);

      const { data } = await axiosInstance.post('/user/getUserInfo', formData);
      setData({ userData: data.data });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      navigation.navigate('登录');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getUserInfo();
    } catch (error) {
      console.log(error.message);
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Icon name="money" size={24} color="#ffffff" />
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>可提现金额</Text>
            <Text style={styles.content}>￥500.00</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>提现</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.topTitle}>提现记录</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Icon name="check" size={24} color="#ffffff" />
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.title}>提现成功</Text>
              <Text style={styles.content}>2023-11-1 13:10:1</Text>

            </View>
            <Text style={styles.titleMoney}>￥500</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Icon name="info" size={24} color="#ffffff" />
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.title}>提现失败</Text>
              <Text style={styles.content}>2023-11-1 13:10:1</Text>
            </View>
              <Text style={styles.titleMoney}>￥500</Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.topTitle}>提现方式</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Icon name="money" size={24} color="#ffffff" />
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.title}>支付宝</Text>
              <Text style={styles.content}>尾号xxx</Text>
            </View>
            <Icon name="check-square" size={20} color="#22c55e" />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.topTitle}>提现规则</Text>
        <Text style={styles.content}>1.1元起提现</Text>
        <Text style={styles.content}>1.提现金额必须大于等于100元</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  content: {
    fontSize: 16,
    color: '#999',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#2196f3',
    marginLeft: 'auto',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  topTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  titleMoney: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },

});