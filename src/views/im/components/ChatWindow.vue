<template>
  <div>{{ SDKAppID }} -- {{ ntim }}</div>
</template>

<script>
import { useStore } from 'vuex'
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import {reactive, toRefs, computed} from 'vue';
import {im} from '@/api/im/api';

export default {
  name: "ChatWindow",
  components: {
    TIMUploadPlugin,
  },
  setup() {
    const state = reactive({
      SDKAppID: null, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      ntim: null
    });
    const { getters, dispatch } = useStore();

    /**
     * 初始化 IM 实例
     * */
    const initIMObject = () => {
      let options = {
        SDKAppID: + state.SDKAppID,
        oversea: true, // 添加允许在海外使用，
      };
      let tim = TIM.create(options); // SDK 实例通常用 tim 表示
      // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html#setLogLevel">setLogLevel 接口的说明</a>
      tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
      // 注册腾讯云即时通信 IM 上传插件
      tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });

      // 注册全局的tim
      dispatch('im/setTim', tim).then((res) => {
        state.ntim = computed(() => getters['im/getTim']);
      }).catch((err) => {
        console.log(err)
      })
    }

    /**
     * 请求后端的接口进行获取IM的的appId
     * */
    const getIMAppId = () => {
      im.getTimAppId()
          .then((res) => {
            state.SDKAppID = res.data || null;
            initIMObject(); // 初始化 实例对象
          })
          .catch((err) => {
            console.log(err);
          })
    }

    getIMAppId();

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style scoped>

</style>
