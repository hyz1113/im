<template>
  <div>
    <div>{{ SDKAppID }} -- {{ ntim }}</div>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <message-bubble
          v-else-if="!item.isRevoked"
          :data="item"
          @contextmenu="onMessageItemContextmenu">
        <!-- 基础的文本消息 -->
        <message-text v-if="item.type === TYPES.MSG_TEXT" :data="item"/>
        <!--图片信息 -->
        <message-image v-else-if="item.type === TYPES.MSG_IMAGE" :data="item"/>
        <message-audio v-else-if="item.type === TYPES.MSG_AUDIO" :data="item" @play="onPlayAudit"/>
        <!-- <message-file v-else-if="message.type === TYPES.MSG_FILE" :data="message" />-->
        <message-face v-else-if="item.type === TYPES.MSG_FACE" :data="item"/>
        <message-not-support v-else :data="item"/>

      </message-bubble>
    </van-pull-refresh>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import {reactive, toRefs, computed} from 'vue';
import {im} from '@/api/im/api';
import MessageBubble from './messages/bubble';
import MessageTip from './messages/tip';
import MessageText from './messages/text';
import MessageImage from './messages/image';
import MessageAudio from './messages/audio';
import MessageFace from './messages/face';
import MessageNotSupport from './messages/notSupport';

export default {
  name: "ChatWindow",
  components: {
    TIMUploadPlugin,
    MessageTip,
    MessageText,
    MessageImage,
    MessageAudio,
    MessageFace,
    MessageNotSupport,
    MessageBubble,
  },
  setup() {
    const state = reactive({
      SDKAppID: null, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      ntim: null,
      loading: false,
      messageList: [],
    });
    const {getters, dispatch} = useStore();

    /**
     * 初始化 IM 实例
     * */
    const initIMObject = () => {
      let options = {
        SDKAppID: +state.SDKAppID,
        oversea: true, // 添加允许在海外使用，
      };
      let tim = TIM.create(options); // SDK 实例通常用 tim 表示
      // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html#setLogLevel">setLogLevel 接口的说明</a>
      tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
      // 注册腾讯云即时通信 IM 上传插件
      tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

      // 注册全局的tim
      dispatch('im/setTim', tim).then((res) => {
        state.ntim = computed(() => getters['im/getTim']);
      }).catch((err) => {
        console.log(err)
      })
    }

    const onRefresh = () => {
      console.log('111');
    }

    const onMessageItemContextmenu = () => {
      console.log('222');
    }

    const fetchMessageListByTim = async () => {
      try {
        const options = {
          conversationID: this.conversationId,
        };
        // 如果存在有nextReq
        if (this.nextReqMessageID) {
          options.nextReqMessageID = this.nextReqMessageID;
        }
        const messageListResponse = await this.$tim.getMessageList(options);
        console.log('messageListResponse::', messageListResponse);
        if (messageListResponse.code === 0 && messageListResponse.data) {
          const msgListData = messageListResponse.data;
          this.nextReqMessageID = msgListData.nextReqMessageID;
          this.isTimCompleted = msgListData.isCompleted;
          return Array.isArray(msgListData.messageList) ? msgListData.messageList : [];
        }
      } catch (ex) {
        console.log(ex)
      }
      return [];
    }

    const fetchMessageList = async () => {
      let messageList = [];

      if (!this.isTimCompleted) {
        messageList = await this.fetchMessageListByTim();
      }
      if (this.isTimCompleted && !this.isServerCompleted) {
        const serverMessageList = await this.fetchMessageListByServer();
        messageList = [...serverMessageList, ...messageList];
        this.nextReqMessageID = messageList[0] ? messageList[0].ID || null : null;
      }
      const newMessageList = await this.buildMessageNickName(messageList);
      this.messageList = [...newMessageList, ...this.messageList];
      await this.setMessageRead();
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
      onRefresh,
      onMessageItemContextmenu,
    }
  },
}
</script>

<style scoped>

</style>
