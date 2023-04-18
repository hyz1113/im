import { Request } from '@/service/http';

export const im = {
    // 获取banner 列表
    getTimAppId: () => Request.get('crmIm/appid'),
}

export default {
    im,
};
