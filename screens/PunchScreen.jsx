import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, RefreshControl, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getUserInfo, getClockInfo, punch } from '../service/api'
export default function PunchScreen() {
  const APP_KEY = '92D42E2EB1842FAB';
  const REWARD_POS_ID = '3F24470D94B6120114E1F575C3EC8119';
  const INSERT_POS_ID = 'A5C6AAAE8DF4D9F0EEA4982E1C0536C9';
  const [rewardAd, setRewardAd] = useState(false);

  const [data, setData] = useState({
    userData: {},
    punchData: {
      punchCount: 0,
    },
  });
  const [checkIns, setCheckIns] = useState([]); // 打卡日期
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const subscription = NativeAppEventEmitter.addListener('rewardResult', handleEvent);
    initData();
    return () => {
      subscription.remove();
    };
  }, []);
  //处理广告事件
  const handleEvent = async (e) => {
    if (e.callBackName == "onReward") {
      console.log("广告播放完成");
      const token = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', token);
      const { data: res } = await punch(formData);
      const { data: clockData } = await getClockInfo(formData)
      setData({ ...data, punchData: clockData.data });
      alert(res.message);
      // setRewardAd(true);
    }
  }

  const initData = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');
      if (!token) {
        navigation.navigate('登录');
        return;
      }
      const formData = new FormData();
      formData.append('userId', token);
      const { data: userinfo } = await getUserInfo(formData)
      setData({ ...data, userData: userinfo.data });
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
    const updatedCheckIns = [currentDate, ...checkIns]; // 新的打卡日期放在最前面，只保留最新的三次打卡日期 

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
      // if (rewardAd) {
      //   const token = await AsyncStorage.getItem('userId');
      //   const formData = new FormData();
      //   formData.append('userId', token);
      //   const { data: res } = await punch(formData);
      //   alert(res.message);
      // }
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
                <Image style={styles.avatar} source={{ uri: data.userData.userAvatar }} />
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
              {/* <Text>今日累计打卡{data.punchData.punchCount ? data.punchData.punchCount : 0}次</Text> */}
            </View>
            <View>
              <Text>今日打卡共计{data.punchData.punchCount ? data.punchData.punchCount : 0}次</Text>
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
        <Text style={styles.title}>打卡规则</Text>
        <Text style={styles.content}>①早起打卡，每天好心情。</Text>
        <Text style={styles.content}>②严禁使用脚本，</Text>
        <Text style={styles.content}>③违规者封号处理，不解释！</Text>
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
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  dec: {
    marginLeft: 50,
  },
  avatar_box: {
    // borderRadius: 50,
    // backgroundColor: '#f5f5f5',
  },
  suceess: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563ea',
    borderRadius: 50,
    padding: 10,
  },
});