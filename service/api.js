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
//获取邀请记录
export async function getInviteInfo(body) {
    return await axiosInstance.post("/user/getInvitationList", body);
}
//观看视频
export async function watchVideo(body) {
    return await axiosInstance.post("/user/watchVideo", body);
}
//添加积分
export async function addIntegral(body) {
    return await axiosInstance.post("/user/addIntegral", body);
}
//积分兑换余额
export async function exchange(body) {
    return await axiosInstance.post("/user/exchange", body);
}
//获取验证码
export async function getCode(body) {
    return await axiosInstance.post("/captcha/getCaptcha", body);
}
//校验验证码
export async function checkCode(body) {
    return await axiosInstance.post("/captcha/verifyCaptcha", body);
}
//获取打卡信息
export async function getClockInfo(body) {
    return await axiosInstance.post("/punchRecords/getPunchRecords", body);
}
//打卡
export async function punch(body) {
    return await axiosInstance.post("/punchRecords/punch", body);
}
//获取最近两次提现记录
export async function getWithdrawInfo(body) {
    return await axiosInstance.post("/withdrawals/queryWithdrawalsRecordByStatus", body);
}
//获取邀请好友总数
export async function getInviteCount(body) {
    return await axiosInstance.post("/invitations/getInvitationCount", body);
}
