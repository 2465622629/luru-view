import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Assuming you have installed the required package
import axiosInstance from "../utils/comreqtool";
export default function PunchScreen() {
  const [pageData, setPageData] = useState({
    userData: {},
  });
  const [punchCount, setPunchCount] = useState(0);

  const [refreshing, setRefreshing] = useState(false); // State variable for controlling the refresh

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', token);
      const { data } = await axiosInstance.post('/user/getUserInfo', formData);
      setPageData({userData: data.data });
      console.log(pageData.userData);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      navigation.navigate('Login');
    }
  };

  const handlePunch = async () => {
    try {
      const token = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', token);
      const { data } = await axiosInstance.post('/punchRecords/punch', formData);
      alert(data.message);
      getUserInfo();
      setPunchCount(data.data.punchCount);
    }
    catch (error) {
      console.log(error.message);
    }
  };
  

  const onRefresh = async () => {
    setRefreshing(true); // Set the refreshing state to true
    try {
      // Fetch the updated user info
      await getUserInfo();
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
          <Text> {pageData.userData.integral}积分 </Text>
        </TouchableOpacity>

        {/* 打卡按钮 */}
        <TouchableOpacity style={styles.punchButton} onPress={handlePunch}>
          <Text style={styles.buttonText}>打卡</Text>
        </TouchableOpacity>

        {/* 打卡规则介绍 */}
        <View style={styles.ruleContainer}>
          <Text style={styles.ruleText}>打卡规则：</Text>
          <Text style={styles.ruleDescription}>
            早起打卡，每天好心情
          </Text>
          <Text style={styles.ruleDescription}>
            严禁使用脚本，违规者封号，不解释
          </Text>
          <Text style={styles.ruleDescription}>
            打卡次数{punchCount}次 满40次将奖励10积分
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
