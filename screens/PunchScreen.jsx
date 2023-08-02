import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Assuming you have installed the required package
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import { getUserInfo, getClockInfo, punch } from '../service/api'
export default function PunchScreen() {
  const APP_KEY = 'E6097975B89E83D6';
  const REWARD_POS_ID = '09A177D681D6FB81241C3DCE963DCB46';
  const INSERT_POS_ID = '1D273967F51868AF2C4E080D496D06D0';
  //初始化广告
  NativeAppEventEmitter.addListener('initResult', info => {
    switch (info.callBackName) {
      case 'onError':
        console.log('初始化错误' + info.errorMsg);
        break;
      case 'onSuccess':
        console.log('初始化成功');
        NativeModules.AdUtilsModule.initRewardAd(REWARD_POS_ID);
        NativeModules.AdUtilsModule.initInsertAd(INSERT_POS_ID);
        break;
    }
  });
  //激励广告 激励结果
  NativeAppEventEmitter.addListener('rewardResult', info => async () => {
    switch (info.callBackName) {
      case 'onClick':
        console.log('onClick');
        break;
      case 'onClose':
        console.log('onClose adId=' + info.adId);
        break;
      case 'onReward':
        
        break;
      case 'onShow':
        console.log('onShow adId=' + info.adId);
        break;
      case 'onVideoEnd':
        console.log("视频观看完成");
        const formData = new FormData();
        formData.append('userId', data.userData.id);
        const {data} = await punch(formData);
        if (data.success) {
          alert('打卡成功，金币增加');
        }else{
          alert(data.message);
        }
        console.log('onVideoEnd adId=' + info.adId);
        break;
      case 'onVideoStart':
        console.log('onVideoStart');
        break;
      case 'onError':
        console.log(
          'onError errorCode=' + info.errorCode + ' errorMsg=' + info.errorMsg,
        );
        break;
    }
  });
  //插入结果
  NativeAppEventEmitter.addListener('insertResult', info => {
    switch (info.callBackName) {
      case 'onClick':
        console.log('onClick');
        break;
      case 'onClose':
        console.log('onClose');
        break;
      case 'onShow':
        console.log('onShow');
        break;
      case 'onError':
        console.log(
          'onError errorCode=' + info.errorCode + ' errorMsg=' + info.errorMsg,
        );
        break;
    }
  });

  const [data, setData] = useState({
    userData: {},
    punchData: {},
  }); 

  const [refreshing, setRefreshing] = useState(false); // State variable for controlling the refresh

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', token);
      if (token === null) {
        alert('请先登录');
        navigation.navigate('Login');
      }
      const { data: userinfo } = await getUserInfo(formData)
      const { data: clockData } = await getClockInfo(formData)

      setData({ userData: userinfo.data, punchData: clockData.data });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const handlePunch = async () => {
    try {
      NativeModules.AdUtilsModule.showRewardAd(REWARD_POS_ID);
      // getUserInfo();
      // setPunchCount(data.data.punchCount);

    }
    catch (error) {
      alert(error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true); // Set the refreshing state to true
    try {
      // Fetch the updated user info
      initData();
    } catch (error) {
      console.log(error.message);
    }
    setRefreshing(false); // Set the refreshing state back to false after fetching the data
  };

  return (
    <ImageBackground
      source={require('../assets/bgImg.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <TouchableOpacity style={styles.avatarContainer}>
          <Image source={require('../assets/icon.png')} style={styles.avatar} />
          <Text> {data.userData.coins}金币 </Text>
        </TouchableOpacity>

        {/* 打卡按钮 */}
        <TouchableOpacity style={styles.punchButton} onPress={handlePunch}>
          <Text style={styles.buttonText}>打卡</Text>
        </TouchableOpacity>

        {/* 打卡规则介绍 */}
        <View style={styles.ruleContainer}>
          <Text style={styles.ruleText}>打卡规则：</Text>
          <Text style={styles.ruleDescription}>
            ①早起打卡，每天好心情。
          </Text>
          <Text style={styles.ruleDescription}>
            ②严禁使用脚本，
          </Text>
          <Text style={styles.ruleDescription}>
            ③违规者封号处理，不解释！
          </Text>
          <Text style={styles.ruleDescription}>
            当前打卡次数{data.punchData.punchCount}次 满40次将奖励10金币
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#fc5b67',
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
