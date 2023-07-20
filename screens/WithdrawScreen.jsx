// WithdrawScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const WithdrawScreen = () => {
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const availableBalance = 5000; // 示例可提现额度为5000

  const handleWithdraw = () => {
    // 在此处实现提现逻辑
    // 可以根据用户选择的提现方式和输入的提现金额来处理提现操作
    console.log('Withdraw Method:', withdrawMethod);
    console.log('Withdraw Amount:', withdrawAmount);
  };

  return (
    <View style={styles.container}>
      {/* 选择提现方式 */}
      <TouchableOpacity
        style={styles.withdrawMethodButton}
        onPress={() => setWithdrawMethod('银行卡')}
      >
        <Text style={styles.buttonText}>选择提现方式：银行卡</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.withdrawMethodButton}
        onPress={() => setWithdrawMethod('支付宝')}
      >
        <Text style={styles.buttonText}>选择提现方式：支付宝</Text>
      </TouchableOpacity>

      {/* 输入提现金额 */}
      <TextInput
        style={styles.amountInput}
        placeholder="输入提现金额"
        keyboardType="numeric"
        value={withdrawAmount}
        onChangeText={text => setWithdrawAmount(text)}
      />

      {/* 显示可提现额度 */}
      <Text style={styles.availableBalanceText}>可提现额度：{availableBalance}元</Text>

      {/* 提现按钮 */}
      <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
        <Text style={styles.buttonText}>提现</Text>
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
  withdrawMethodButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  amountInput: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  availableBalanceText: {
    fontSize: 18,
    marginBottom: 10,
  },
  withdrawButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'green',
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

export default WithdrawScreen;
