import TIM from "tim-js-sdk/tim-js-friendship";
import TIMUploadPlugin from "tim-upload-plugin";
import {im} from '@/api/im/api';
import {reactive, toRefs} from "vue";

export function IMBase() {
    const imBaseState = reactive({
        canUseIm: true,
        SDKAppID: '',
        $tim: {},
        isLoginTim: false,
        timCommonAccounts: [],
        loginTimTimer: null,
        currentLoginCommonAccount: {},
        currentLoginIndex: 0,
        commonAccountInfo: false, // 销售人员的相关信息
    })

    const checkUserCanUseIm = async () => {
        try {
            const res = await im.checkUserIsImGray();
            const value = (res as any).data;
            imBaseState.canUseIm = res && typeof value === 'boolean' ? value : false;
        } catch (ex) {
            console.log(ex);
            imBaseState.canUseIm = false;
        }
    }

    /**
     * 请求后端的接口进行获取IM的的appId
     * */
    const fetchTimAppID = async () => {
        try {
            const res = await im.getTimAppId();
            const value = (res as any).data;
            imBaseState.SDKAppID = value || '';
        } catch (ex) {
            imBaseState.SDKAppID = ''
        }
    }

    /**
     * 初始化 IM 实例
     * */
    const createTencentTim = async () => {
        if (!imBaseState.SDKAppID) {
            await fetchTimAppID();
        }
        if (imBaseState.SDKAppID) {
            let options = {
                SDKAppID: +imBaseState.SDKAppID,
                oversea: true, // 添加允许在海外使用，
            };
            let tim = TIM.create(options); // SDK 实例通常用 tim 表示
            // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html#setLogLevel">setLogLevel 接口的说明</a>
            tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
            // 注册腾讯云即时通信 IM 上传插件
            tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

            console.log('获取到了im 对象');
            imBaseState.$tim = tim;
            return true;
        }
        return false;
        // 注册全局的tim
        // dispatch('im/setTim', tim).then((res) => {
        //   state.ntim = computed(() => getters['im/getTim']);
        // }).catch((err) => {
        //   console.log(err)
        // })
    }

    const fetchTimInfo = async () => {
        const params = {
            customerId: 0,
            // uid: this.uid,
            uid: '12358', // 当前的客户uid
            leadsId: 0
        };
        const res = await im.getCustomerImInfo(params);
        if (res && (res as any).data) {
            imBaseState.commonAccountInfo = (res as any).data;
            // @ts-ignore
            console.log("建联了")
        } else {
            (imBaseState as any).commonAccountInfo = '';
            alert('该客户未建联!');
        }
    };

    const loginTim = async () => {
        try {
            const loginTimRes = await (imBaseState as any).$tim.login({
                userID: (imBaseState as any).commonAccountInfo.commonTencentUserId + '',
                userSig: (imBaseState as any).commonAccountInfo.commonUidUserSign
            });
            console.log(loginTimRes);
            imBaseState.isLoginTim = true;
            debugger
        } catch (ex) {
            console.log(ex);
            imBaseState.isLoginTim = false;
        }
    };

    const loginOutTim = async () => {
        try {
            if (imBaseState.isLoginTim) {
                await (imBaseState as any).$tim.logout();
            }
        } catch (ex) {
            console.log('ex');
        }
        imBaseState.isLoginTim = false;
    };

    const fetchTimAccountConversations = async () => {
        if (imBaseState.currentLoginCommonAccount) {
            const timConversationRes = await (imBaseState as any).$tim.getConversationList();
            const conversationList = timConversationRes.data.conversationList;
            const conversation = conversationList.find((item: Object) => (item as any).conversationID === (imBaseState as any).currentLoginCommonAccount.conversationID);
            console.log('const conversationList', conversation);
            if (conversation) {
                (imBaseState as any).currentLoginCommonAccount.unreadCount = conversation.unreadCount || 0;
            }
        }
    };

    // const fetchCustomerCommonIdInfo = async (ids: any, type: any) => {
    //     const params = {
    //         ids,
    //         type
    //     };
    //     const res = await im.getUserImAccounts(params);
    //     if (res && Array.isArray((res as any).data)) {
    //         (imBaseState as any).timCommonAccounts = (res as any).data.map((item: any) => {
    //             return {
    //                 ...item,
    //                 customerTimUserId: null,
    //                 conversationID: null,
    //                 unreadMessageCount: 0
    //             }
    //         });
    //     } else {
    //         (imBaseState as any).timCommonAccounts = [];
    //     }
    // };

    const fetchTimAccountFriends = async () => {
        const friendRes = await (imBaseState as any).$tim.getFriendList();
        if (friendRes) {
            return Array.isArray(friendRes.data) ? friendRes.data : [];
        }
        return [];
    };

    return {
        imBaseState,
        fetchTimAppID,
        createTencentTim,
        loginTim,
        loginOutTim,
        checkUserCanUseIm,
        fetchTimInfo,
        fetchTimAccountFriends,
    }
}


//
// export default {
//     setup() {
//         return {
//             ...toRefs(state),
//             fetchTimAppID,
//             createTencentTim,
//             loginTim,
//             loginOutTim,
//             checkUserCanUseIm,
//         }
//     },
// }
