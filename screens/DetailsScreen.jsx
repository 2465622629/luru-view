import React, { useState, useCallback, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image,
    TouchableOpacity,
    ScrollView, RefreshControl, Alert
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfo } from '../service/api';


export default function PersonalCenterScreen() {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false); // 用于管理下拉刷新的状态

    const [data, setData] = useState({
        walletData: {},
        userData: {}
    }); // 用于存储列表数据
    useEffect(() => {
        initData();
    }, []);
    const copyText = () => {
        Clipboard.setString(data.userData.invitationCode);
        alert('复制成功');
        // console.log(data.userData.invitationCode);
    };

    // 刷新数据的方法
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        initData();
        setRefreshing(false);
    }, []);
    const handleLogout = () => {
        Alert.alert('提示', '确定退出登录吗？', [
            {
                text: '取消',
                onPress: () => console.log('取消退出登录'),
                style: 'cancel'
            },
            {
                text: '确定',
                onPress: async () => {
                    await AsyncStorage.removeItem('userId');
                    navigation.navigate('登录');
                }
            }
        ]);
    };

    const buttons = [
        { label: "我的团队", name: 'users', onPress: () => navigation.navigate('我的团队') },
        { label: "钱包", name: 'box', onPress: () => navigation.navigate('我的钱包') },
        { label: "我的订单", name: 'bell', onPress: () => Alert.alert("开发中...") },
        // { label: "更多功能尽请期待", name: 'battery-charging', onPress: () => console.log("提现管理") },
        // { label: "账户余额", name: 'feather', onPress: () => console.log("账户余额") }
    ];
    //录入权限
    const permissions = () => {
        if (data.userData.isFrozen) {
            return <Text style={{ color: '#f56c6c' }}>普通会员</Text>
        } else {
            return <Text style={{ color: '#67c23a' }}>超级会员</Text>
        }
    }
    //获取用户信息
    const initData = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            if (token === null) {
                navigation.navigate('登录');
            }
            const formData = new FormData();
            formData.append('userId', token);
            const { data: userData } = await getUserInfo(formData);
            setData({ userData: userData.data });
            console.log(userData);
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={{ uri: data.userData.userAvatar }} />
                </View>
                <View style={styles.userInfo}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.userName}>
                            {data.userData.username}
                        </Text>
                        <Text style={styles.permissions}>
                            {permissions()}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:20 }}>
                        <Text style={styles.invitationCode}>
                            邀请码: {data.userData.invitationCode}
                        </Text>
                        <TouchableOpacity onPress={copyText} style={{ marginLeft: -70 }}>
                            <FeatherIcon name="copy" size={15} color="#000" style={styles.copyIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                {buttons.map(({ label, onPress, name }, index) => (
                    <TouchableOpacity key={label} style={styles.button} onPress={onPress}>
                        <FeatherIcon name={name} size={20} color="#409eff" style={styles.icon} />

                        <Text style={styles.buttonLabel}>{label}</Text>

                        {index === buttons.length ? null : (
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
        </ScrollView>
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
        marginTop: 25,
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
        borderRadius: 50
    },
    avatarContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -40,
        marginRight: 10
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8
    },
    permissions: {
        fontSize: 16,
        color: '#faa709',
        width: 100,
        padding: 5,
        borderRadius: 20,
        textAlign: 'center',
        backgroundColor: '#fff7e8',
        marginRight: 30
    },
    invitationCode: {
        flexDirection: 'row',
        alignItems: 'right',
        color: '#333',
        fontSize: 16,
    },
    icon: {
        fontWeight: 'bold',
        marginHorizontal: 8
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -150
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
        color: '#333',
        fontSize: 14,
        textAlign: 'left',
        marginLeft: 10,
        fontWeight: 'bold'
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
        fontSize: 13,
        fontWeight: 'bold'
    },
    copyIcon: {
        //左右边距
        marginLeft: 80,
    }
});
