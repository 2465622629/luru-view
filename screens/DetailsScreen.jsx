import React, {useCallback, useState} from "react";
import {
    View,
    Text,
    ImageBackground,
    Image,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    ScrollView, Dimensions
} from "react-native";

const orangeBackground = require("../assets/bgImg.jpg");
const userAvatar = require("../assets/Binx_Bond.svg");
import axiosInstance from "../utils/comreqtool";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";

export default function DetailsScreen() {
    const [userData, setUserData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        initData()
        setRefreshing(false);
    }, []);

    const initData = () => {
        try {
            getUserInfo()
        } catch (e) {
            console.log(e.message)
        }
    }

    const getUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('userId');
            console.log('获取到用户id:', token);

            const formData = new FormData();
            formData.append('userId', token);

            const { data } = await axiosInstance.post('/user/getUserInfo', formData);
            setUserData(data.data);
        } catch (error) {
            console.log(error.message);
            alert(error.message);
            navigation.navigate('Login');
        }
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
            <View style={styles.container}>
                <ImageBackground source={orangeBackground} style={styles.backgroundImage}>
                    <View style={styles.contentContainer}>
                        <View style={styles.profileContainer}>
                            <TouchableOpacity style={styles.avatarContainer}>
                                <Image source={userAvatar} style={styles.avatar}/>
                            </TouchableOpacity>
                            <View style={styles.profileInfo}>
                                <Text style={styles.userName}>{userData.username}</Text>
                                <Text style={styles.inviteCode}>邀请码：{userData.invitationCode}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>邀请好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>我的团队</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.sectionTitle}>工具</Text>
                        <TouchableOpacity style={styles.functionButton}>
                            <Text style={styles.buttonText}>设置</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.functionButton}>
                            <Text style={styles.buttonText}>消息</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.functionButton}>
                            <Text style={styles.buttonText}>钱包</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 50,
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    profileInfo: {
        marginTop: 10,
        alignItems: "center",
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    inviteCode: {
        fontSize: 16,
        color: "white",
        marginTop: 5,
        textAlign: "center",
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    button: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6600",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginTop: 20,
        marginBottom: 10,
    },
    functionButton: {
        backgroundColor: "white",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 10,
        alignItems: "center",
    },
});
