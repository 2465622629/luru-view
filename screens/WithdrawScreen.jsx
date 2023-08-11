import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AliIcon from 'react-native-vector-icons/AntDesign';

import axiosInstance from "../utils/comreqtool";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWithdrawInfo, getUserInfo } from '../service/api';
export default function WithdrawScreen() {
  const [data, setData] = useState({
    userData: {},
    withdrawInfo: []
  });

  const [refreshing, setRefreshing] = useState(false); // State variable for controlling the refresh

  useEffect(() => {
    initData();
  }, []);

  const handleWithdraw = async () => {
    const token = await AsyncStorage.getItem('userId');
    if (data.userData.money < 2) {
      alert('余额不足2元');
      return;
    }
    const formData = new FormData();
    formData.append('userId', token);
    formData.append('amount', data.userData.money);
    const rep = await axiosInstance.post('/withdrawals/initiateWithdrawal', formData);
    if (rep.data.success == true) {
      alert('提现成功');
    }
  };

  const initData = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', token);
      const { data: userData } = await getUserInfo(formData);
      // setData(prevData => ({ ...prevData, userData: userData.data }));
      //获取用户提现记录
      const { data: withdrawInfo } = await getWithdrawInfo(formData)
      console.log(withdrawInfo.data);
      setData({ userData: userData.data, withdrawInfo: withdrawInfo.data });
    } catch (error) {
      console.log(error.message);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      initData();
    } catch (error) {
      console.log(error.message);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Icon name="money" size={24} color="#ffffff" />
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>可提现金额</Text>
            <Text style={styles.content}>￥{data.userData.money}</Text>
          </View>
          <TouchableOpacity
           style={styles.button}
            onPress={handleWithdraw}
          >
            <Text style={styles.buttonText}>提现</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.topTitle}>提现记录</Text>
        {
          data.withdrawInfo.map((item, index) => {
            return (
              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <View style={styles.iconBackground}>
                      <Icon
                        name={item.status === 0 ? "wrench" : item.status === 1 ? "check" : "times-circle-o"}
                        size={24}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.title}>
                      {item.status === 0 ? "审核中" : item.status === 1 ? "提现成功" : "提现失败"}
                    </Text>
                    <Text style={styles.content}>{item.createdAt}</Text>

                  </View>
                  <Text style={styles.titleMoney}>￥{item.amount}</Text>
                </View>
              </View>
            )
          })
        }
      </View>

      <View>
        <Text style={styles.topTitle}>提现方式</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <AliIcon name="alipay-circle" size={24} color="#ffffff" />
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.title}>支付宝</Text>
              {/* <Text style={styles.content}>账号{data.userData.phone.slice(-10,-7)}xxx{data.userData.phone.slice(-4)}</Text> */}
              <Text style={styles.content}>账号{data.userData.phone}</Text>
            </View>
            <Icon name="check-square" size={20} color="#22c55e" />
          </View> 
        </View>
      </View>

      <View>
        <Text style={styles.topTitle}>提现规则</Text>
        <Text style={styles.content}>1. 1元起提现</Text>
        <Text style={styles.content}>2. 提现账号为注册时手机号,填错无法到账请悉知</Text>
      </View>
    </ScrollView>
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