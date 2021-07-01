import axios from "axios";

// 实例对象
const instance = axios.create({
    // timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
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