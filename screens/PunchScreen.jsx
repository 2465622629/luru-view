// PunchScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';

const PunchScreen = () => {
  const handlePunch = () => {
    // 在此处实现打卡逻辑
    // 可以调用 API 来处理打卡操作
  };

  return (
    <ImageBackground
      source={require('../assets/bgImg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* 用户头像 */}
        <TouchableOpacity style={styles.avatarContainer}>
          <Image source={require('../assets/icon.png')} style={styles.avatar} />
        </TouchableOpacity>

        {/* 打卡按钮 */}
        <TouchableOpacity style={styles.punchButton} onPress={handlePunch}>
          <Text style={styles.buttonText}>打卡</Text>
        </TouchableOpacity>

        {/* 打卡规则介绍 */}
        <View style={styles.ruleContainer}>
          <Text style={styles.ruleText}>打卡规则介绍：</Text>
          <Text style={styles.ruleDescription}>
            在此处描述打卡的相关规则和内容，例如打卡时间、打卡地点等。
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Make sure the image covers the entire screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 30,
    elevation: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  punchButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ruleContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  ruleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ruleDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default PunchScreen;
