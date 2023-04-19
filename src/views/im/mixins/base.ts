import TIM from "tim-js-sdk/tim-js-friendship";
import TIMUploadPlugin from "tim-upload-plugin";
import {im} from '@/api/im/api';
import {reactive, toRefs} from "vue";

export function IMBase() {
    const imBaseState = reactive({
        canUseIm: false,
        SDKAppID: '',
        $tim: {},
        isLoginTim: false,
        timCommonAccounts: [],
        currentLoginCommonAccount: null,
        currentLoginIndex: 0,
        loginTimTimer: null,
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
        let options = {
            SDKAppID: + imBaseState.SDKAppID,
            oversea: true, // 添加允许在海外使用，
        };
        let tim = TIM.create(options); // SDK 实例通常用 tim 表示
        // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html#setLogLevel">setLogLevel 接口的说明</a>
        tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
        // 注册腾讯云即时通信 IM 上传插件
        tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

        imBaseState.$tim = tim;
        // 注册全局的tim
        // dispatch('im/setTim', tim).then((res) => {
        //   state.ntim = computed(() => getters['im/getTim']);
        // }).catch((err) => {
        //   console.log(err)
        // })
    }

    const loginTim = async (userID: string, userSig: string) => {
        try {
            const loginTimRes = await (imBaseState as any).$tim.login({
                userID: userID,
                userSig: userSig
            });
            console.log(loginTimRes);
            imBaseState.isLoginTim = true;
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

    return {
        imBaseState,
        fetchTimAppID,
        createTencentTim,
        loginTim,
        loginOutTim,
        checkUserCanUseIm,
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
