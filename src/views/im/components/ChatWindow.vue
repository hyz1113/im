<template>
  <div>dfsfsf</div>
</template>

<script>
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import { reactive, toRefs } from 'vue';
import { im } from '@/api/im/api';


export default {
  name: "ChatWindow",
  components: {
    TIMUploadPlugin,
  },
  setup() {
    const state = reactive({
      SDKAppID: null, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    });

    /**
     * 请求后端的接口进行获取IM的的appId
     * */
    const getIMAppId = () => {
      im.getTimAppId()
      .then((res) => {
        state.SDKAppID = res.data || null;
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
