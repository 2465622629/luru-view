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
    const handleLogout = () => {
        console.log("Logout button pressed");
        // Add logout logic here
    };
    const user = {
        name: "xiaomo",
        time: "录入权限",
        invitationCode: "邀请码"
    };

    const buttons = [
        { label: "我的团队", name: 'team', onPress: () => console.log("我的团队") },
        { label: "钱包", name: 'wallet', onPress: () => console.log("钱包") },
        { label: "提现管理", name: 'bank', onPress: () => console.log("提现管理") },
        { label: "我的订单", name: 'API', onPress: () => console.log("我的订单") },
        { label: "账户余额", name: 'creditcard', onPress: () => console.log("账户余额") }
    ];
    //获取用户信息
    const getUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            if (token === null) {
                navigation.navigate('登录');
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
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={require('../assets/avatar.png')} />
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.invitationCode}>邀请码: {user.invitationCode}</Text>
                    <Text style={styles.time}>{user.time}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                {buttons.map(({ label, onPress, name }, index) => (
                    <TouchableOpacity key={label} style={styles.button} onPress={onPress}>
                        <AntIcon name={name} size={24} color="#000" style={styles.icon} />

                        <Text style={styles.buttonLabel}>{label}</Text>

                        {index === buttons.length  ? null : (
                            <Icon name="angle-right" size={20} color="#000" style={styles.icon} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>退出登录</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        padding: 20
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userInfo: {
        flex: 7,
        marginLeft: 20
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    avatarContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8
    },
    time: {
        fontSize: 16,
        color: 'gray'
    },
    invitationCode: {
        fontSize: 16
    },
    icon: {
        marginHorizontal: 8
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'left',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 16,
        marginBottom: 16

    },
    icon: {
        marginHorizontal: 8
    },
    buttonLabel: {
        flex: 1,
        color: '#000',
        fontSize: 16,
        textAlign: 'left',
        marginLeft: 10
    },
    footer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        // marginTop: 'auto'
        marginBottom: 60
    },
    logoutButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 130
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
