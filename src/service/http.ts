import axios from 'axios';
import Mepal from '@/utils/mepal';
import {showToast} from "vant";

// 先简单获取下语言
const getLang = () => {
    let lang = location.pathname.split('/')[1] || 'en-us';
    const items = lang.split('-');
    return `${items[0]}-${items[1].toUpperCase()}`;
};

/**
 * 错误处理方法
 *
 * @param {Object} err 错误对象
 * @return {Object}
 */
const error = (err: any) => ({
    success: false,
    code: 500,
    message: '访问出错，请稍后重试',
    data: null,
    trace: err.stack ? err.stack : err,
});

/**
 * 格式化响应数据
 *
 * @param {Object}
 * @return {Object} 返回响应数据结果对象
 **/
const transformResponse = (res: any) => {
    const data = res.request && res.config ? res.data : res;

    // 如果不是正常 JSON 数据则认为是错误
    if (typeof data !== 'object' || Array.isArray(data)) {
        return error('数据响应格式不正确。');
    }
    if (data.code === 5005) {
        sessionStorage.setItem('tokenExpire', '0');
    }
    // 封装后端 Response Schema
    // 具体需要根据后端而定
    data.success = typeof data.success === 'boolean'
        ? data.success
        : (data.success || data.status === 'ok' || data.code === 200 || data.code === 0);
    data.code = data.code || data['err-code'] || 200;
    data.message = data.message || data['err-msg'] || 200;

    return data;
};

// 请求参数处理
axios.interceptors.request.use((config: any) => {
    config.headers = {
        ...config.headers,
        "Admin-Token": localStorage.getItem('Admin-Token')
    };
    return config;
}, (error: any) => Promise.reject(error));


// 响应拦截器
axios.interceptors.response.use((res: any) => transformResponse(res), (err: any) => error(err));


// @ts-ignore
/**
 * get方法
 *
 * @param {string} url 路径
 * @param {Object} params 参数
 * @param _headers
 */
export function get(url: string, params?: any, headers: Record<string, any> = {}) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {params, headers})
            .then((res: any) => {
                if([302].includes(res.code)) {
                    showToast({
                        message: '请重新登录'
                    })
                    Mepal.login();
                } else {
                    resolve(res);
                }
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export function post(url: string, params?: any, headers: Record<string, any> = {}) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, {...params}, {headers: headers})
            .then((res: any) => {
                if([302].includes(res.code)) {
                    showToast({
                        message: '请重新登录'
                    })
                    Mepal.login();
                } else {
                    resolve(res);
                }
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

