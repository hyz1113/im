import { get, post } from '@/service/http';

export const im = {
    // 获取banner 列表
    getTimAppId: () => get('/kol/crmIm/appid'),
    getNickName: (params: Object) => get('/kol/crmIm/query/nickName', {...params}),
    getHistoryMessageByServer: (params: Object) => get('/kol/crmIm/getHistoryMsg', {...params}),
    recallMessage: (params: Object) => get('/kol/crmIm/recall', {...params}),
    checkUserIsImGray: () => get('/kol/crmIm/gray'),
    getCustomerByTMI: (p: { accounts: string }) => get('/kol/crmIm/query/uid'),
    getUserImAccounts: (params: Object) => get('/kol/crmIm/admin/uid', { ...params }),
    getCustomerImInfo: (params: Object) => get('/kol/crmIm/query/relation', { ...params }),
    getMySessionH5List: (params: Object) => post('/kol/crmIm/getMySessionH5List', { ...params }, {
        "content-Type": 'application/x-www-form-urlencoded'
    }),

    /*移动端sse推送建立链接*/
    getConnect: (params: Object) => get('/kol/crmIm/push/connect', { ...params }),

    /*获取移动端登录*/
    gotoLoginMepal: (params: Object) => post('/kol/authorization/mepal_login', { ...params }, {
        "content-Type": 'application/x-www-form-urlencoded'
    }),
    /*获取token*/
    getToken: () => get('/kol/authorization/getLoginToken'),
}

export default {
    im,
};
