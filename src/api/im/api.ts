import { Request } from '@/service/http';

export const im = {
    // 获取banner 列表
    getTimAppId: () => Request.get('/kol/crmIm/appid'),
    getNickName: (params: Object) => Request.get('/kol/crmIm/query/nickName', {...params}),
    getHistoryMessageByServer: (params: Object) => Request.get('/kol/crmIm/getHistoryMsg', {...params}),
    recallMessage: (params: Object) => Request.get('/kol/crmIm/recall', {...params}),
    checkUserIsImGray: () => Request.get('/kol/crmIm/gray'),
    getCustomerByTMI: (p: { accounts: string }) => Request.get('/kol/crmIm/query/uid'),
    getUserImAccounts: (params: Object) => Request.get('/kol/crmIm/admin/uid', { ...params }),
    getCustomerImInfo: (params: Object) => Request.get('/kol/crmIm/query/relation', { ...params }),
}

export default {
    im,
};
