import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const WithdrawScreen = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const availableBalance = 1000; // 替换为实际可提现金额

  const handleWithdraw = () => {
    // TODO: 处理提现逻辑
    console.log('提现金额：', withdrawAmount);
    alert('提现成功！');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>可提现金额: {availableBalance} 元</Text>

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
    </View>
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
