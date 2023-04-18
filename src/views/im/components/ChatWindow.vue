<template>
  <div>dfsfsf</div>
</template>

<script>
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
import { reactive, toRefs } from 'vue';
import { getTimAppId } from '@/api/im';


export default {
  name: "ChatWindow",
  setup() {
    const state = reactive({
      SDKAppID: null, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    });

    /**
     * 请求后端的接口进行获取IM的的appId
     * */
    const getIMAppId = async () => {
      debugger
      const res = await getTimAppId();
      state.SDKAppID = res.data || null;
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
