import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PersonalCenterScreen () {
  const handleWalletPress = () => {
    // 处理我的钱包点击事件
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={require('../assets/avatar.png')} style={styles.avatar} />
          <Text style={styles.username}>xiaomo</Text>
        </View>
        <Icon name="edit" size={20} color="#999" style={styles.editIcon} />
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.walletCardTitle}>我的钱包</Text>
        <View style={styles.walletCardRow}>
          <View style={styles.walletCardItem}>
            <Text style={styles.walletCardLabel}>可提现金额</Text>
            <Text style={styles.walletCardAmount}>¥100.00</Text>
          </View>
          <View style={styles.walletCardItem}>
            <Text style={styles.walletCardLabel}>提现中金额</Text>
            <Text style={styles.walletCardAmount}>¥50.00</Text>
          </View>
          <View style={styles.walletCardItem}>
            <Text style={styles.walletCardLabel}>待结算金额</Text>
            <Text style={styles.walletCardAmount}>¥30.00</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.card} onPress={handleWalletPress}>
        <Icon name="search" size={30} color="#007BFF" />
        <Text style={styles.cardText}>我的钱包</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleInviteFriendsPress}>
        <Icon name="glass" size={30} color="#007BFF" />
        <Text style={styles.cardText}>邀请好友</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleMyFansPress}>
        <Icon name="smile-o" size={30} color="#007BFF" />
        <Text style={styles.cardText}>我的粉丝</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleWithdrawPress}>
        <Icon name="money" size={30} color="#007BFF" />
        <Text style={styles.cardText}>提现收益</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleEarningsDetailPress}>
        <Icon name="line-chart" size={30} color="#007BFF" />
        <Text style={styles.cardText}>收益明细</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
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
  editIcon: {
    marginLeft: 10,
  },
  walletCard: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
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
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cardText: {
    fontSize: 18,
    marginLeft: 15,
  },
});