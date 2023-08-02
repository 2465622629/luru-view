import axiosInstance from "../utils/comreqtool";
//登录
export async function login(body) {
    return await axiosInstance.post("/user/login", body);
}
//注册
export async function register(body) {
    return await axiosInstance.post("/user/register", body);
}
//获取用户信息
export async function getUserInfo(body) {
    return await axiosInstance.post("/user/getUserInfo", body);
}
//获取验证码
export async function getCode(body) {
    return await axiosInstance.post("/captcha/getCaptcha", body);
}
//获取打卡信息
export async function getClockInfo(body) {
    return await axiosInstance.post("/punchRecords/getPunchRecords", body);
}
//打卡
export async function punch(body) {
    return await axiosInstance.post("/punchRecords/punch", body);
}
