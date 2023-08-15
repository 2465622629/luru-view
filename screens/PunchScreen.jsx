import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getUserInfo, getClockInfo, punch } from '../service/api'
import { APP_KEY, REWARD_POS_ID, INSERT_POS_ID } from '../config/ADconfig';
export default function PunchScreen() {

  const [data, setData] = useState({
    userData: {},
    punchData: {
      punchCount: 0,
    },
  });
  const [checkIns, setCheckIns] = useState([]); // 打卡日期
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  //是否成功
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    NativeModules.AdUtilsModule.showInsert() //展示插屏广告
    initData();
    return () => {
      NativeAppEventEmitter.removeAllListeners('rewardResult');
    }
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (isSuccess) {
  //       console.log("打卡已添加奖励");
  //       const token = await AsyncStorage.getItem('userId');
  //       const formData = new FormData();
  //       formData.append('userId', token);
  //       const { data: res } = await punch(formData);
  //       const { data: clockData } = await getClockInfo(formData)
  //       setData({ ...data, punchData: clockData.data });
  //       Alert.alert("提示", res.message);
  //       setIsSuccess(false);
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     // 在组件卸载或重新渲染时执行清理逻辑
  //     // 例如：取消异步操作，清除定时器等
  //   };
  // }, [isSuccess]);

  //处理广告事件
  const punchHandleEvent = async (e) => {
    if (e.callBackName == "onReward") {
      const token = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', token);
      const { data: res } = await punch(formData);
      const { data: clockData } = await getClockInfo(formData)
      setData({ ...data, punchData: clockData.data });
      Alert.alert("提示", res.message);
      updateCheckIns();
      Alert.alert("提示", "打卡成功");
      // setIsSuccess(true);
    }
    console.log(e.callBackName);
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
      const { data: clockData } = await getClockInfo(formData)
      setData({ ...data, punchData: clockData.data, userData: userinfo.data });
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
      NativeAppEventEmitter.removeAllListeners('rewardResult');
      NativeAppEventEmitter.addListener('rewardResult', punchHandleEvent);
      NativeModules.AdUtilsModule.showRewardAd(REWARD_POS_ID);
    }
    catch (error) {
      Alert.alert("错误", error.message);
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
            <View><Text>积分</Text></View>
            <View><Text>{data.userData.integral}</Text></View>
          </View>
        </View>
      </View>

      <View style={{ ...styles.card, maxHeight: 200 }}>
        <Text style={styles.title}>打卡记录</Text>
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={styles.scrollViewContent}
        >
          {checkIns.map((checkIn, index) => (
            <Text key={index} style={styles.content}>{checkIn} 打卡成功</Text>
          ))}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>打卡规则</Text>
        <Text style={styles.content}> 1、严禁使用脚本。</Text>
        <Text style={styles.content}> 2、违规者封号处理，不解释❗️</Text>
        <Text style={styles.content}> 3、打卡越多奖励越多✅</Text>
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