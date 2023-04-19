import { Request } from '@/service/http';

export const im = {
    // 获取banner 列表
    getTimAppId: () => Request.get('crmIm/appid'),
    getNickName: (params: Object) => Request.get('crmIm/query/nickName', {...params}),
    getHistoryMessageByServer: (params: Object) => Request.get('crmIm/getHistoryMsg', {...params}),
    recallMessage: (params: Object) => Request.get('crmIm/recall', {...params}),
}

export default {
    im,
};
