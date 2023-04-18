import { Request } from '@/service/http';

export const im = {
    // 获取banner 列表
    getTimAppId: () => Request.get('crmIm/appid', {}, {
        'Content-Type': 'application/json;charset=UTF-8'
    }),
}

export default {
    im,
};
