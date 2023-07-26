import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from "../utils/comreqtool";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function PersonalCenterScreen() {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false); // 用于管理下拉刷新的状态

    const [data, setData] = useState({
        walletData: {}
    }); // 用于存储列表数据
    useEffect(() => {
        getUserInfo();
    }, []);

    // 刷新数据的方法
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // 在这里进行刷新数据的操作，比如重新获取数据
        // 这里使用 setTimeout 模拟异步请求，实际使用时应该使用真实的异步请求
        getUserInfo();
        setRefreshing(false);
    }, []);

    const handleInviteFriendsPress = () => {
        // 处理邀请好友点击事件
    };

    const handleMyFansPress = () => {
        // 处理我的粉丝点击事件
    };

    const handleWithdrawPress = () => {
        // 处理提现点击事件
    };

    const handleEarningsDetailPress = () => {
        // 处理收益明细点击事件
    };
    //获取用户信息
    const getUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            if (token === null) {
                Alert.alert('请先登录');
                navigation.navigate('Login');
            }
            const formData = new FormData();
            formData.append('userId', token);
            const { data } = await axiosInstance.post('/withdrawals/queryWithdrawalsRecord', formData);
            console.log(data.data);
            setData({ walletData: data.data });
        } catch (error) {
            console.log(error.message);
            alert(error.message);
            // navigation.navigate('Login');
        }
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={ // 添加下拉刷新功能
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <ImageBackground
                source={require('../assets/bgImg.jpg')}
                resizeMode="stretch"
            >
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image source={require('../assets/avatar.png')} style={styles.avatar} />
                        <Text style={styles.username}>xiaomo</Text>
                    </View>
                </View>

                <View style={styles.walletCard}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('withdraw')}
                    >
                        <Text style={styles.walletCardTitle}>我的钱包</Text>
                        <View style={styles.walletCardRow}>
                            <View style={styles.walletCardItem}>
                                <Text style={styles.walletCardLabel}>审核中</Text>
                                <Text style={styles.walletCardAmount}>¥{data.walletData.pendingAmount}</Text>
                            </View>
                            <View style={styles.walletCardItem}>
                                <Text style={styles.walletCardLabel}>已发放</Text>
                                <Text style={styles.walletCardAmount}>¥{data.walletData.approvedAmount}</Text>
                            </View>
                            <View style={styles.walletCardItem}>
                                <Text style={styles.walletCardLabel}>提现失败</Text>
                                <Text style={styles.walletCardAmount}>¥{data.walletData.rejectedAmount}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <TouchableOpacity style={styles.card} onPress={handleInviteFriendsPress}>
                <AntIcon name="addusergroup" size={25} color="#007BFF" />
                <Text style={styles.cardText}>邀请好友</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={handleMyFansPress}>
                <Icon name="umbrella" size={25} color="#007BFF" />
                <Text style={styles.cardText}>我的粉丝</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={handleWithdrawPress}>
                <Icon name="money" size={25} color="#007BFF" />
                <Text style={styles.cardText}>提现收益</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={handleEarningsDetailPress}>
                <Icon name="line-chart" size={25} color="#007BFF" />
                <Text style={styles.cardText}>收益明细</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    walletCard: {
        backgroundColor: '#363636',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 20,
    },
    walletCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    walletCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    walletCardItem: {
        flex: 1,
    },
    walletCardLabel: {
        fontSize: 14,
        color: '#fff',
    },
    walletCardAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 5,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    cardText: {
        fontSize: 18,
        marginLeft: 15,
    },
});
