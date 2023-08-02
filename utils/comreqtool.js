import axios from 'axios';

// 创建 Axios 实例
const instance = axios.create({
    // baseURL: 'https://xwdmbq-zmclmt-8080.preview.myide.io/', // 设置基础URL
    // baseURL: 'http://localhost:8080', // 设置基础URL
    baseURL: 'http://api.beidalurupt.cn/', // 设置基础URL
    timeout: 5000, // 设置请求超时时间
    headers: {
        'Content-Type': 'multipart/form-data', // 设置请求头为 JSON 格式
        'Access-Control-Allow-Origin': '*', // 允许所有来源的跨域请求
        withCredentials: true, // 允许携带凭证
    },
});

// 添加请求拦截器
let requestCount = 0; // 初始化请求数计数器
let lastRequestTime = 0; // 初始化最后一次请求时间

instance.interceptors.request.use(
    config => {
        const now = Date.now();
        if (now - lastRequestTime > 60000) {
            // 如果距离上次请求的时间大于一分钟，则重置计数器
            requestCount = 0;
        }

        if (requestCount >= 20) {
            // 如果请求数超过限制，抛出错误
            throw new Error('客官操作太快了,喝杯茶休息一下吧');
        }

        // 更新计数器和最后一次请求时间
        requestCount++;
        lastRequestTime = now;

        // 在发送请求之前做些什么
        // 可以根据需要设置请求头等信息
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        return response;
    },
    error => {
        // 对响应错误做些什么
        return Promise.reject(error);
    }
);

export default instance;
