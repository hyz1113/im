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
    getMySessionH5List: (params: Object) => get('/kol/crmIm/getMySessionH5List', { ...params }),

    /*获取移动端登录*/
    gotoLoginMepal: (params: Object) => post('/kol/authorization/mepal_login', { ...params }),
    /*获取token*/
    getToken: () => get('/kol/authorization/getLoginToken'),
}

export default {
    im,
};
