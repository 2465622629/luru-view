import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInviteInfo } from '../service/api'

export default function InviteFriendScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        invitationList: [],
    });
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
        setData({ invitationList: invitationList.data });
    };


    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >

            <Text style={styles.title}>邀请记录</Text>

            {
                data.invitationList.map((item, index) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.friendCard}>
                                <View style={styles.avatar} />
                                <View style={styles.friendInfo}>
                                    <Text style={styles.infoText}>昵称: {item.username}</Text>
                                    <Text style={styles.infoText}>邀请码: {item.invitationCode}</Text>
                                    <Text style={styles.infoText}>注册时间: {item.createdAt}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })
            }


            <Text style={styles.title}>邀请规则</Text>
            <View style={styles.card}>
                <Text style={styles.ruleText}>
                    按照规则邀请好友即可获得奖励。具体规则如下：
                    1. 邀请好友成功注册后，你将获得一定数量的积分奖励；
                    2. 奖励积分可以用于兑换商品或提升会员等级；
                    3. 邀请越多，奖励越丰厚。
                </Text>
            </View>

            <Text style={styles.title}>邀请好友统计</Text>
            <View style={styles.card}>
                <Text style={styles.statText}>邀请总人数: 10人</Text>
                <Text style={styles.statText}>已获得奖励: 100积分</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
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
        marginTop: 8,
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
