import React, { useCallback, useEffect, useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    Animated,
    RefreshControl, ScrollView
} from "react-native";
import axiosInstance from "../utils/comreqtool";
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cont_box: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cont_grey: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        padding: 8,
        justifyContent: 'space-between',
    },
    input: {
        margin: 12,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
        outlineStyle: 'none',
        shadowOpacity: 0,
        elevation: 0,
        placeholderTextColor: '#ccc',
    },
    customButton: {
        width: 50,
        backgroundColor: 'rgb(73, 187, 213)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
    msg: {
        fontWeight: 'bold',
    },
    bullet: {
        marginLeft: 10,
    }
    , btn_txt: {
        fontWeight: 'bold',
        color: 'rgb(73, 187, 213)',
    },
    capbox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        maxWidth: 200,
        //设置边距 让按钮水平居中
        alignSelf: 'center',
        marginVertical: 10,
    },
});

export default function HomeScreen() {
    const [captcha, setCaptcha] = useState('');
    const [userData, setUserData] = useState([]);
    const [captchaImg, setCaptchaImg] = useState('');
    const [animation] = useState(new Animated.Value(1));
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const APP_KEY = 'E6097975B89E83D6';
    const REWARD_POS_ID = '09A177D681D6FB81241C3DCE963DCB46';
    const INSERT_POS_ID = '1D273967F51868AF2C4E080D496D06D0';

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        initData()
        setRefreshing(false);
    }, []);
    const getCaptcha = async () => {
        try {
            let data = await axiosInstance.get('/captcha/getCaptcha')
            setCaptchaImg(data.data.data)
        } catch (e) {
            alert(e.message)
        }
    }
    useEffect(() => {
        initData()
    }, [])
    // 添加观看广告次数
    const addWatchVied = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            let dataForm = new FormData();
            dataForm.append('id', token);
            let data = await axiosInstance.post('/user/watchVideo', dataForm)
        } catch (e) {
            alert(e.message)
        }
    }
    //金币兑换时间
    const moneyToTime = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            let dataForm = new FormData();
            dataForm.append('userId', token);
            let data = await axiosInstance.post('/user/exchangeTime', dataForm)
            console.log(data);
            if (data.data.success) {
                alert('兑换成功')
                getUserInfo()
            } else {
                alert('兑换失败,金币不足')
            }
        } catch (e) {
            console.log(e.message);
            alert(e.message)
        }
    }
    const initData = async () => {
        try {
            getCaptcha()
            getUserInfo()
        } catch (e) {
            console.log(e.message)
        }
    }
    //将积分转化为余额
    const integralToMoney = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            let dataForm = new FormData();
            dataForm.append('id', token);
            let data = await axiosInstance.post('/user/exchange')
            if (data.data.success) {
                alert('兑换成功')
                getUserInfo()
            } else {
                alert('兑换失败,积分不足')
            }
        } catch (e) {
            alert(e.message)
        }
    }
    //为用户增加积分
    const addIntegral = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            let dataForm = new FormData();
            dataForm.append('id', token);
            dataForm.append('integral', 10);
            let data = await axiosInstance.post('/user/addIntegral', dataForm)
            if (data.data.success) {
                getUserInfo()
            }
        } catch (e) {
            alert(e.message)
        }
    }

    //初始化广告
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
    //激励广告 激励结果
    NativeAppEventEmitter.addListener('rewardResult', info => {
        switch (info.callBackName) {
            case 'onClick':
                console.log('onClick');
                break;
            case 'onClose':
                console.log('onClose adId=' + info.adId);
                console.log("未观看成功，不奖励金币");
                break;
            case 'onReward':
                console.log('onReward adId=' + info.adId);
                addIntegral()
                addWatchVied()
                alert("完成任务,获得奖励");
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
    //插入结果
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
    const initAd = () => {
        NativeModules.AdUtilsModule.initAd(APP_KEY);
    };
    const showRewardAd = () => {
        NativeModules.AdUtilsModule.showRewardAd(REWARD_POS_ID);
    };
    //广告
    //校验验证码
    const checkCaptcha = async () => {
        try {
            // 非空判断
            if (captcha === '') {
                alert('请输入验证码')
                return
            }
            //创建一个dataform对象
            let dataForm = new FormData();
            dataForm.append('captcha', captcha);
            dataForm.append('userId', 1);
            let data = await axiosInstance.post('/captcha/verifyCaptcha', dataForm)
            if (data.data.success) {
                getUserInfo()
                alert('恭喜,验证通过奖励1积分')
                //获取验证码
                getCaptcha()
            } else {
                alert('验证码错误，再试一下吧')
            }
        } catch (e) {
            alert(e.message)
        }
    }
    const getUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            if (!token) {
                alert('未获取到登录信息，请重新登录');
                navigation.navigate('Login');
                return;
            }
            const formData = new FormData();
            formData.append('userId', token);
            const { data } = await axiosInstance.post('/user/getUserInfo', formData);
            setUserData(data.data);
        } catch (error) {
            console.log(error.message);
        }
    };
    const handlePressIn = () => {
        Animated.spring(animation, {
            toValue: 0.5,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(animation, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };
    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={commonStyles.container}>
                {/* 图片容器 */}
                <TouchableOpacity style={commonStyles.capbox} onPress={getCaptcha}>
                    {/*插入图片*/}
                    <Image source={{ uri: 'data:image/jpeg;base64,' + captchaImg }} style={{ width: 200, height: 100 }} />
                </TouchableOpacity>
                <View>
                    <TextInput
                        style={[commonStyles.input]}
                        placeholder="在此输入上方验证码即可"
                        value={captcha}
                        onChangeText={setCaptcha}
                    />
                </View>

                <TouchableOpacity
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.6}
                    onPress={checkCaptcha}
                >
                    <Animated.View style={[commonStyles.button, { transform: [{ scale: animation }] }]}>
                        <Text style={commonStyles.buttonText}>验证</Text>
                    </Animated.View>
                </TouchableOpacity>

                <View style={commonStyles.cont_box}>
                    <Text>{`当前积分:${userData.integral === null ? 0 : userData.integral}`}</Text>
                    <TouchableOpacity 
                    onPress={integralToMoney}
                    >
                        <Text style={commonStyles.btn_txt}>立即兑换</Text>
                    </TouchableOpacity>
                </View>


                <View style={commonStyles.cont_box}>
                    <Text>{`当前金币:${userData.coins === null ? 0 : userData.coins}`}  </Text>
                    <Text>{userData.endTime}到期</Text>
                    <TouchableOpacity
                        onPress={moneyToTime}
                    >
                    <Text style={commonStyles.btn_txt}>兑换时间</Text>
                    </TouchableOpacity>
                </View>
                <View style={commonStyles.cont_box}>
                    <Text>{`观看视频(${userData.watchVideoCount === null ? 0 : userData.watchVideoCount}/50次)`}</Text>
                    <TouchableOpacity
                        style={commonStyles.customButton}
                        onPress={showRewardAd}
                    >
                        <Text style={commonStyles.buttonText}>+1</Text>
                    </TouchableOpacity>
                </View>

                <View style={commonStyles.cont_box}>
                    <Text>邀请好友（不限次数）</Text>
                    <TouchableOpacity style={commonStyles.customButton}>
                        <Text style={commonStyles.buttonText}>+10</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={commonStyles.msg}>新会员用户必看</Text>
                    <Text style={commonStyles.msg}>积分价格：</Text>
                    <Text style={commonStyles.bullet}>1. 1000积分=1元。</Text>
                    <Text style={commonStyles.bullet}>2. 直属好友打码10000积分提成1000积分</Text>
                    <Text style={commonStyles.bullet}>3. 徒孙打码10000码积分提成100积分-以此类推。</Text>
                    <Text style={commonStyles.msg}>提现规则:</Text>
                    <Text style={commonStyles.bullet}>1.2元起可提现。</Text>
                    <Text style={commonStyles.bullet}>2.20元以内三天到账</Text>
                    <Text style={commonStyles.bullet}>3.20元以上隔月到账。</Text>
                    <Text style={commonStyles.bullet}>4.20元月底去提现次月21-30号到账。</Text>
                    <Text style={commonStyles.msg}>违规录入:</Text>
                    <Text style={commonStyles.bullet}>1.脚本模拟器多开账户封号处理</Text>
                    <Text style={commonStyles.bullet}>2. 脚本模拟器打卡看视频封号处理。</Text>
                    <Text style={commonStyles.bullet}>3.批量注册账户/多个账户封号ip处理。</Text>
                    <Text style={commonStyles.bullet}>4.不正当违规录入封号处理。</Text>
                    <Text style={commonStyles.bullet}>1.脚本模拟器多开账户封号处理</Text>
                    <Text style={commonStyles.msg}>注意事项：</Text>
                    <Text style={commonStyles.bullet}>1. 三天打卡视频20次保级,不满20次,掉级没有录入,需要补级！！</Text>
                </View>
            </View>
        </ScrollView>
    );
}

