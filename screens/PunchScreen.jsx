import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, RefreshControl,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Assuming you have installed the required package
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import { getUserInfo, getClockInfo, punch } from '../service/api'
export default function PunchScreen() {
  const APP_KEY = '92D42E2EB1842FAB';
  const REWARD_POS_ID = '3F24470D94B6120114E1F575C3EC8119';
  const INSERT_POS_ID = 'A5C6AAAE8DF4D9F0EEA4982E1C0536C9';
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
        const { data } = await punch(formData);
        if (data.success) {
          alert('打卡成功，金币增加');
        } else {
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
  const currentTime = new Date().toLocaleTimeString();

  const imageUri = '../assets/avatar.png';
  const currentTask = {
    task: '保持一天好心情',
    image: imageUri,
  };


  const checkInHistory = [
    { date: '2022-01-01', task: '喝一杯咖啡', image: imageUri },
    { date: '2022-01-02', task: '读一本书', image: imageUri },
    // 根据需要添加更多历史签到记录
  ];

  const [refreshing, setRefreshing] = useState(false); // State variable for controlling the refresh

  useEffect(() => {
    // initData();
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
    <View style={{ flex: 1 }}>
      {/* 页面头部 */}
      <View style={styles.header}>
        <Text>{currentTime}</Text>
        <Text style={styles.pageTitle}>每日打卡</Text>
        <Text>签到次数</Text>
      </View>

      {/* 页面主体内容 */}
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={require(imageUri)} style={styles.image} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.sectionHeading}>点我打卡</Text>
            <Text style={styles.taskText}>{currentTask.task}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>打卡历史：</Text>
        {checkInHistory.map((checkIn, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={require(imageUri)} style={styles.image} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.dateText}>{checkIn.date}</Text>
              <Text style={styles.taskText}>{checkIn.task}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionHeading}>打卡规则：</Text>
        <Text style={styles.ruleText}>每日最多40次打卡</Text>
        <Text style={styles.ruleText}>满40次打卡获得额外金币奖励</Text>

        <Text style={styles.sectionHeading}>奖励内容：</Text>
        <Text style={styles.rewardText}>10积分</Text>
      </View>

      {/* 页脚 */}
      {/* <View style={{ alignItems: 'center', paddingBottom: 20 }}>
        <Button title="签到" onPress={() => console.log('点击了签到按钮')} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  pageTitle: {
    fontSize: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 20,
    color: '#333',
  },
  taskText: {
    paddingBottom: 20,
  },
  ruleText: {
    paddingBottom: 5,
  },
  rewardText: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    //添加阴影
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cardContent: {
    flex: 2,
    padding: 10,
    marginTop: 10,
    justifyContent  : 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});