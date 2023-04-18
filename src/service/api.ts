import { Request } from './http';

export const api = {
    // 获取banner 列表
    getTimAppId: (param: any) => Request.get('crmIm/appid', {...param}, {
        'Content-Type': 'application/json;charset=UTF-8'
    }),
}

export default {
    api,
};
