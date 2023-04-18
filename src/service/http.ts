import axios from 'axios';
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
const error = (err:any) => ({
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


/* 实例化请求配置 */
const instance = axios.create({
    headers: {
        //php 的 post 传输请求头一定要这个 不然报错 接收不到值
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin-Type": "*",
        "Accept-Language": "en-us" // TODO 根据当前页面语言传参数
    },
    // 请求时长
    timeout: 1000 * 30,
    // 请求的base地址 TODO:这块以后根据不同的模块调不同的api
    baseURL: process.env.VUE_APP_API_URL,
    //     ? "测试"
    //     : "正式",
    // 表示跨域请求时是否需要使用凭证
    withCredentials: false,
});


// 请求参数处理
instance.interceptors.request.use((config:any) => {
  config.params = {
        ...config.params,
    };
  config.headers = {
        'Accept-Language': getLang(),
        'Admin-Token': localStorage.getItem('Admin-Token') || '',
        ...config.headers,
    };
    return config;
}, (error: any) => Promise.reject(error));


// 响应拦截器
instance.interceptors.response.use((res: any) => transformResponse(res), (err:any) => error(err));

export class Request {
  /**
   * get方法
   *
   * @param {string} url 路径
   * @param {Object} params 参数
   * @param headers
   */
  static get = (url: string, params?: any, headers: Record<string, any> = {}) => {
      return new Promise((resolve, reject) => {
          axios
              .get(url, { params })
              .then((res:any) => {
                  resolve(res.data);
              })
              .catch((err: any) => {
                  reject(err);
              });
      });
  };

  static post = (url: string, params?: any, headers: Record<string, any> = {}) => {
      return new Promise((resolve, reject) => {
          axios
              .post(url, { ...params }, headers)
              .then((res: any) => {
                  resolve(res.data);
              })
              .catch((err: any) => {
                  reject(err);
              });
      });
  };
}
