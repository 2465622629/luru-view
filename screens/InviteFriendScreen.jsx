import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInviteInfo, getInviteCount } from '../service/api'

export default function InviteFriendScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        invitationList: [],
        invitationCount: 0,
    });
    useEffect(() => {
        initData();
    }, []);
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            initData();
        } catch (error) {
            console.log(error.message);
        }
        setRefreshing(false);
    };
    //获取提现记录
    const initData = async () => {
        const token = await AsyncStorage.getItem('userId');
        let dataForm = new FormData();
        dataForm.append('userId', token);
        const { data: invitationList } = await getInviteInfo(dataForm);
        const { data: invitationCount } = await getInviteCount(dataForm);
        setData({ invitationList: invitationList.data, invitationCount: invitationCount.data });

    };


    return (
        // <ScrollView
        //     contentContainerStyle={styles.container}
        //     refreshControl={<RefreshControl refreshing={refreshing} 
        //         onRefresh={onRefresh}
        //         colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
        //     />}

        // >
        <View style={styles.container}>
            <Text style={styles.title}>邀请记录</Text>

            <View style={{ ...styles.card, maxHeight: 450 }}>
                <FlatList
                    data={data.invitationList}
                    keyExtractor={(item, index) => index.toString()}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                        <View style={styles.friendCard}>
                            <View>
                                <Image source={{ uri: item.userAvatar }} style={{ width: 50, height: 50, borderRadius: 30, marginRight: 20 }} />
                            </View>
                            <View style={styles.friendInfo}>
                                <Text style={styles.infoText}>昵称: {item.username}</Text>
                                <Text style={styles.infoText}>邀请码: {item.invitationCode}</Text>
                                <Text style={styles.infoText}>注册时间: {item.createdAt}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>


            {/* <Text style={styles.title}>邀请规则</Text>
            <View style={styles.card}>
                <Text style={styles.ruleText}>
                    按照规则邀请好友即可获得奖励。
                    具体规则如下：
                    1.邀请好友成功注册后，你将获得一定数量的金币奖励；
                    邀请一位奖励10金币，以此类推
                    邀请越多，金币越多
                    打卡打满40次，系统再赠送10金币
                    2.奖励金币可以用于兑换时间或提升会员等级；
                </Text>
            </View> */}

            <Text style={styles.title}>邀请好友统计</Text>
            <View style={styles.card}>
                <Text style={styles.statText}>邀请总人数: {data.invitationCount}人</Text>
                <Text style={styles.statText}>已获得奖励: {data.invitationCount * 10}金币</Text>
            </View>
        </View>
        // </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    friendCard: {
        flexDirection: 'row', // 水平排列
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 10,
        //添加下边框
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'gray',
        marginRight: 12,
    },
    friendInfo: {
        flex: 1,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 4,
    },
    ruleText: {
        fontSize: 14,
    },
    statText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
