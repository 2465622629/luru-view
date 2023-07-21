import React, { Component } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>Account Information</Text>
            <Text style={styles.accountInfoText}>
              Name: 珍惜
              Avatar:
            </Text>
          </View>
          <View style={styles.securityInfo}>
            <Text style={styles.securityInfoTitle}>Security Information</Text>
            <Text style={styles.securityInfoText}>
              Phone Number: 185****7368
              Payment Information: 198****2090
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Text style={styles.actionButtonText}>Delete Account</Text>
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  accountInfo: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  accountInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  accountInfoText: {
    fontSize: 14,
    color: '#333',
  },
  securityInfo: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  securityInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  securityInfoText: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default App;
