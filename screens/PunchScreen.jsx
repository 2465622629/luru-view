import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, RefreshControl, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { getUserInfo, getClockInfo, punch } from '../service/api'
export default function PunchScreen() {
  const APP_KEY = '92D42E2EB1842FAB';
  const REWARD_POS_ID = '3F24470D94B6120114E1F575C3EC8119';
  const INSERT_POS_ID = 'A5C6AAAE8DF4D9F0EEA4982E1C0536C9';
  const [rewardAd, setRewardAd] = useState(false);
 //激励广告 激励结果
 NativeAppEventEmitter.addListener('rewardResult', info => {
  switch (info.callBackName) {
      case 'onClick':
          console.log('onClick');
          break;
      case 'onClose':
          console.log('onClose adId=' + info.adId);
          break;
      case 'onReward':
          console.log('onReward adId=' + info.adId);
          break;
      case 'onShow':
          console.log('onShow adId=' + info.adId);
          break;
      case 'onVideoEnd':
          console.log('onVideoEnd adId=' + info.adId);
          console.log("观看成功，奖励金币");
          setRewardAd(true);
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

  const [data, setData] = useState({
    userData: {},
    punchData: {},
  });
  const [checkIns, setCheckIns] = useState([]);


  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', token);
      const { data: userinfo } = await getUserInfo(formData)
      const { data: clockData } = await getClockInfo(formData)
      setData({ userData: userinfo.data, punchData: clockData.data });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };
  // 更新打卡日期
  const updateCheckIns = async () => {
    // const currentDate = new Date().toISOString().split('T')[0]; // 获取当前日期（格式：YYYY-MM-DD）
    const currentDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 设置为24小时制
    });
    const updatedCheckIns = [currentDate, ...checkIns.slice(0, 2)]; // 新的打卡日期放在最前面，只保留最新的三次打卡日期

    try {
      const storedCheckIns = await AsyncStorage.getItem('checkIns'); // 获取已存储的打卡日期
      if (storedCheckIns) { // 如果已存储的打卡日期存在
        setCheckIns(JSON.parse(storedCheckIns));
      }
      await AsyncStorage.setItem('checkIns', JSON.stringify(updatedCheckIns));
      setCheckIns(updatedCheckIns);
    } catch (error) {
      console.log('Error updating check-ins', error);
    }
  };

  const handlePunch = async () => {
    try {
      setRewardAd(false);
      NativeModules.AdUtilsModule.showRewardAd(REWARD_POS_ID);
      if(rewardAd){
        const token = await AsyncStorage.getItem('userId');
        const formData = new FormData();
        formData.append('userId', token);
        const { data: res } = await punch(formData);
        alert(res.message);
      }
      updateCheckIns();
    }
    catch (error) {
      alert(error.message);
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
        <TouchableOpacity onPress={handlePunch}>
          <View style={styles.box}>
            <View>
              {/* 图片 */}
              <View style={styles.avatar_box}>
                <Image style={styles.avatar} source={require('../assets/avatar.png')} />
              </View>
              <View style={styles.dec}>
                <Text>{data.userData.username}</Text>
                <Text>{checkIns[0] ? checkIns[0] : "今日未打卡"}</Text>
              </View>
            </View>
            <View style={styles.suceess}>
              <FeatherIcon color="#fff" size={30} name='check' />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.box}>
          {/* 左侧 */}
          <View>
            <View>
              <Text>今日累计打卡{data.punchData.punchCount}</Text>
            </View>
            <View>
              <Text>连续打卡{data.punchData.punchCount}次</Text>
            </View>
          </View>
          {/* 右侧 */}
          <View>
            <View><Text>金币</Text></View>
            <View><Text>{data.userData.coins}</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>打卡记录</Text>
        {checkIns.map((checkIn, index) => (
          <Text key={index} style={styles.content}>{checkIn} 打卡成功</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>积分规则</Text>
        <Text style={styles.content}>每次打卡获得10金币</Text>
        <Text style={styles.content}>连续打卡40次额外奖励40金币</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9fafc',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 }, // 阴影偏移
    shadowOpacity: 0.2, // 透明度
    shadowRadius: 4,  // 阴影半径
    elevation: 7, // Android 投影
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 13,
    marginBottom: 3,
  },
  icon: {
    fontSize: 30,
    alignSelf: 'center',
  },
  box: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  },
  avatar: {
    position: 'absolute',
    left: 0,
    width: 30,
    height: 30,
  },
  dec: {
    marginLeft: 30,
  },
  avatar_box: {
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
  },
  suceess: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563ea',
    borderRadius: 50,
    padding: 10,
  },
});