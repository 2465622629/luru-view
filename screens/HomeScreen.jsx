import React, { useCallback, useEffect, useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    Animated,
    RefreshControl, ScrollView, Alert
} from "react-native";
import axiosInstance from "../utils/comreqtool";
import { NativeAppEventEmitter, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sound from 'react-native-sound';
import { watchVideo, checkCode, exchange, addCoins } from '../service/api';
import { APP_KEY, REWARD_POS_ID, INSERT_POS_ID } from '../config/ADconfig';

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
        width: 90,
        backgroundColor: '#ff4d4f',
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
        fontSize: 16,
        color: '#fa541c',
    },
    bullet: {
        marginLeft: 10,
        fontSize: 14,
    },
    btn_txt: {
        fontWeight: 'bold',
        color: '#ff4d4f',
    },
    capbox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        backgroundColor: '#4096ff',
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
    disabledButton: {
        backgroundColor: '#ccc',
    },
});

export default function HomeScreen() {
    const [captcha, setCaptcha] = useState('');
    const [userData, setUserData] = useState([]);
    const [captchaImg, setCaptchaImg] = useState('');
    const [animation] = useState(new Animated.Value(1));
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const [adIsSuccess, setAdIsSuccess] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        initData()
        setRefreshing(false);
    }, []);

    //adIsSuccess 变为true时，播放广告
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (adIsSuccess) {
    //             await addWatchVied();
    //             await add_coins();
    //             console.log("首页已添加观看奖励");
    //             Alert.alert('提示', '观看视频成功')
    //             setAdIsSuccess(false);
    //         }
    //     };

    //     fetchData();

    //     return () => {
    //         // 在组件卸载或重新渲染时执行清理逻辑
    //         // 例如：取消异步操作，清除定时器等
    //     };
    // }, [adIsSuccess]);
    const getCaptcha = async () => {
        try {
            let data = await axiosInstance.post('/captcha/getCaptcha')
            setCaptchaImg(data.data.data)
        } catch (e) {
            Alert.alert("错误", e.message)
        }
    }
    useEffect(() => {
        NativeModules.AdUtilsModule.showInsert() //展示插屏广告
        initData()
        return () => {
            NativeAppEventEmitter.removeAllListeners('rewardResult');
        };
        // NativeModules.AdUtilsModule.showInsert(); //插屏广告
    }, [])

    //处理广告事件
    const handleEvent = async (e) => {
        if (e.callBackName == "onReward") {
            await addWatchVied();
            await add_coins();
            console.log("首页已添加观看奖励");
            Alert.alert('提示', '观看视频成功')
            // setAdIsSuccess(true)
        }
        console.log(e.callBackName);
    }
    //播放音频
    const playSound = () => {
        const s = new Sound('../assets/mp3/success.mp3', null, (e) => {
            if (e) {
                console.log('播放失败');
                return;
            }
            s.play(() => s.release());
        });
    }

    // 添加观看广告次数
    const addWatchVied = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            let dataForm = new FormData();
            dataForm.append('userId', token);
            const { data: watch } = await watchVideo(dataForm)
            console.log(watch.message);
        } catch (e) {
            console.log(e.message);
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
                Alert.alert("成功", '兑换成功')
                getUserInfo()
            } else {
                Alert.alert('失败', '兑换失败,金币不足')
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
            let data = await exchange(dataForm)
            alert(data.data.message)
        } catch (e) {
            alert(e.message)
        }
    }
    //为用户增加积分
    const add_coins = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            let dataForm = new FormData();
            dataForm.append('userId', token);
            dataForm.append('coins', 1);
            let { data: integralData } = await addCoins(dataForm)
            console.log(integralData);
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
    const showRewardAd = () => {
        NativeAppEventEmitter.removeAllListeners('rewardResult');
        NativeAppEventEmitter.addListener('rewardResult', handleEvent);
        NativeModules.AdUtilsModule.showRewardAd(REWARD_POS_ID);
    };
    //广告
    //校验验证码
    const checkCaptcha = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            // 非空判断
            if (captcha === '') {
                Alert.alert("消息", '请输入验证码')
                return
            }
            //创建一个dataform对象
            let dataForm = new FormData();
            dataForm.append('captcha', captcha);
            dataForm.append('userId', token);
            let { data: codeInfo } = await checkCode(dataForm)
            if (codeInfo.success) {
                //刷新验证码
                getCaptcha()
                //刷新用户信息
                getUserInfo()
                //播放音频
                // playSound()
                alert(codeInfo.message)
                return
            }
            alert(codeInfo.message)
        } catch (e) {
            alert(e.message)
        }
    }
    const getUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            if (!token) {
                navigation.navigate('登录');
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
                    colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
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
                    <Text>{`积分:${userData.integral === null ? 0 : userData.integral}`}</Text>
                    <TouchableOpacity
                        onPress={integralToMoney}
                    >
                        <Text style={commonStyles.btn_txt}>点击兑换</Text>
                    </TouchableOpacity>
                </View>


                <View style={commonStyles.cont_box}>
                    <Text>{`金币:${userData.coins === null ? 0 : userData.coins}`}  </Text>
                    <Text>
                        <Text style={{ color: '#000' }}>{userData.endTime}</Text>
                        到期
                    </Text>
                    <TouchableOpacity
                        onPress={moneyToTime}
                    >
                        <Text style={commonStyles.btn_txt}>兑换时间</Text>
                    </TouchableOpacity>
                </View>
                <View style={commonStyles.cont_box}>
                    <Text>{`观看视频(${userData.watchVideoCount === null ? 0 : userData.watchVideoCount}/50次)`}</Text>
                    <TouchableOpacity
                        style={[commonStyles.customButton, userData.watchVideoCount >= 50 && commonStyles.disabledButton]}
                        onPress={showRewardAd}
                        disabled={userData.watchVideoCount >= 50} //判断是否可以点击
                    >
                        <Text
                            style={commonStyles.buttonText}
                        >{userData.watchVideoCount >= 50 ? "已完成" : "+1"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={commonStyles.cont_box}>
                    <Text>邀请好友（上不封顶）</Text>
                    <TouchableOpacity style={commonStyles.customButton}>
                        <Text style={commonStyles.buttonText}>+10</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={commonStyles.msg}>新会员须知 :</Text>
                    <Text style={commonStyles.bullet}>1.新会员注册无录入权限❗️
                        （找客服开通）</Text>
                    <Text style={commonStyles.bullet}>2.开通后用金币兑换录入时间、
                        金币自由交易</Text>

                    <Text style={{ ...commonStyles.msg, marginLeft: 5 }}>注意事项：</Text>
                    <Text style={commonStyles.bullet}>1.  1000积分 = 10元 </Text>
                    <Text style={commonStyles.bullet}>直属好友1000积分提成100积分</Text>
                    <Text style={commonStyles.bullet}>2.批量注册账号、一个人多个账号者封号处理 !!! </Text>
                    <Text style={commonStyles.bullet}>3.脚本、违规录入封号不解释❗️</Text>

                    <Text style={{ ...commonStyles.msg, marginLeft: 5 }}>邀请好友须知：</Text>
                    <Text style={commonStyles.bullet}>1、邀请一个人奖励10金币. </Text>
                    <Text style={commonStyles.bullet}>2、恶意注册邀请,直接封号!!! </Text>
                </View>
            </View>
        </ScrollView>
    );
}

