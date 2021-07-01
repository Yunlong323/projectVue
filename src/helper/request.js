import axios from "axios";
import qs from 'qs';

// 实例对象
const instance = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // baseURL: "http://sishi.xmu.edu.cn:9002/api"
    baseURL: "http://127.0.0.1:9002",
    // timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        config.data = qs.stringify(config.data) // 转为formdata数据格式
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

instance.interceptors.response.use(
    response => {
        const { status, data } = response;
        if (status === 200) {
            return Promise.resolve(data);
        }
        return Promise.reject(response.data);
    },
    error => Promise.reject(error)
);

export default instance;