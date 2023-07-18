/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NativeAppEventEmitter, NativeModules} from 'react-native';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const APP_KEY = 'E6097975B89E83D6';
  const REWARD_POS_ID = '09A177D681D6FB81241C3DCE963DCB46';
  const INSERT_POS_ID = '1D273967F51868AF2C4E080D496D06D0';

  NativeAppEventEmitter.addListener('initResult', info => {
    switch (info.callBackName) {
      case 'onError':
        console.log('初始化错误' + info.errorMsg);
        break;
      case 'onSuccess':
        console.log('初始化成功');
        NativeModules.AdUtilsModule.initRewardAd(REWARD_POS_ID);
        NativeModules.AdUtilsModule.initInsertAd(INSERT_POS_ID);
        break;
    }
  });

  NativeAppEventEmitter.addListener('rewardResult', info => {
    switch (info.callBackName) {
      case 'onClick':
        console.log('onClick');
        break;
      case 'onClose':
        console.log('onClose adId=' + info.adId);
        break;
      case 'onReward':
        console.log('onReward adId=' + info.adId);
        break;
      case 'onShow':
        console.log('onShow adId=' + info.adId);
        break;
      case 'onVideoEnd':
        console.log('onVideoEnd adId=' + info.adId);
        break;
      case 'onVideoStart':
        console.log('onVideoStart');
        break;
      case 'onError':
        console.log(
          'onError errorCode=' + info.errorCode + ' errorMsg=' + info.errorMsg,
        );
        break;
    }
  });

  NativeAppEventEmitter.addListener('insertResult', info => {
    switch (info.callBackName) {
      case 'onClick':
        console.log('onClick');
        break;
      case 'onClose':
        console.log('onClose');
        break;
      case 'onShow':
        console.log('onShow');
        break;
      case 'onError':
        console.log(
          'onError errorCode=' + info.errorCode + ' errorMsg=' + info.errorMsg,
        );
        break;
    }
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            title={'初始化广告'}
            onPress={() => {
              // NativeModules.AdUtilsModule.showToast('初始化失败');
              NativeModules.AdUtilsModule.initAd(APP_KEY);
            }}
          />

          <Button
            title={'show激励视频广告'}
            onPress={() => {
              NativeModules.AdUtilsModule.showRewardAd('userId');
            }}
          />

          <Button
            title={'show插屏广告'}
            onPress={() => {
              NativeModules.AdUtilsModule.showInsert();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
