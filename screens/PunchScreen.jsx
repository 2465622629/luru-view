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


  const [data, setData] = useState({
    userData: {},
    punchData: {},
  });


  const [refreshing, setRefreshing] = useState(false); 

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
        <TouchableOpacity onPress={() => console.log("123")}>
          <View style={styles.box}>
            <View>
              {/* 图片 */}
              <View style={styles.avatar_box}>
                <Image style={styles.avatar} source={require('../assets/avatar.png')} />
              </View>
              <View style={styles.dec}>
                <Text>昵称</Text>
                <Text>打卡时间</Text>
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
              <Text>今日累计打卡</Text>
            </View>
            <View>
              <Text>连续打卡 次</Text>
            </View>
          </View>
          {/* 右侧 */}
          <View>
            <View><Text>积分</Text></View>
            <View><Text>100</Text></View>
          </View>
        </View>
      </View>
      {/* <View style={styles.card}>
        <Text style={styles.title}>打卡任务</Text>
        <Text style={styles.content}>完成每日任务</Text>
      </View> */}

      <View style={styles.card}>
        <Text style={styles.title}>打卡记录</Text>
        <Text style={styles.content}>2021-01-01: 打卡成功</Text>
        <Text style={styles.content}>2021-01-02: 打卡成功</Text>
        <Text style={styles.content}>2021-01-02: 打卡成功</Text>
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