import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import axiosInstance from "../utils/comreqtool";
import AsyncStorage from "@react-native-async-storage/async-storage";
const WithdrawScreen = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [data, setData] = useState({
    userData: {},
  });

  const [refreshing, setRefreshing] = useState(false); // State variable for controlling the refresh

  useEffect(() => {
    getUserInfo();
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
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <Text style={styles.label}>可提现金额: {data.userData.money} 元</Text>

      <TextInput
        style={styles.input}
        placeholder="输入提现金额"
        keyboardType="numeric"
        value={withdrawAmount}
        onChangeText={setWithdrawAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
        <Text style={styles.buttonText}>提现</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WithdrawScreen;
