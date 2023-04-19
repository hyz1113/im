<template>
  <div>
    <div>{{ SDKAppID }} -- {{ ntim }}</div>
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onRefresh"
    >
      <div
          v-for="item in messageList"
          :key="item"
      >
        {{ item }}==
        <message-tip v-if="item.type === TYPES.MSG_GRP_TIP"></message-tip>
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
      </div>
    </van-list>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import {reactive, toRefs, getCurrentInstance, computed, onMounted, onUnmounted} from 'vue';
import {im} from '@/api/im/api';
import {List} from 'vant';
import MessageBubble from './messages/bubble';
import MessageTip from './messages/tip';
import MessageText from './messages/text';
import MessageImage from './messages/image';
import MessageAudio from './messages/audio';
import MessageFace from './messages/face';
import MessageNotSupport from './messages/notSupport';
import { IMBase } from '../mixins/base';

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
    List,
  },
  async setup() {
    const state = reactive({
      SDKAppID: null, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      ntim: null,
      finished: false,
      loading: false,
      messageList: [],
      isCompleted: false,
      isTimCompleted: false,
      isServerCompleted: false,
      customerUid: 'customerUid', // 当前的用户id
      // 吓一跳消息的ID
      nextReqMessageID: '',
      nextReqMessage: null,
      messageNickNameMap: new Map(),
    });
    const {dispatch} = useStore();
    const { proxy } = getCurrentInstance();

    let TYPES = computed(() => {
      return TIM.TYPES
    })

    const onRefresh = () => {
      console.log('111');
    }

   const {
        imBaseState,
        createTencentTim,
        loginTim,
        loginOutTim,
        checkUserCanUseIm } = IMBase();

    const startTimLoginLoop = async () => {
      if (!imBaseState.$tim) {
        return;
      }
      if (imBaseState.timCommonAccounts.length) {
        await loginOutTim();
        imBaseState.currentLoginCommonAccount = imBaseState.timCommonAccounts[imBaseState.currentLoginIndex] || null;
        await loginTim();
        if (imBaseState.timCommonAccounts.length > 1) {
          imBaseState.currentLoginIndex += 1;
          if (imBaseState.currentLoginIndex >= imBaseState.timCommonAccounts.length) {
            imBaseState.currentLoginIndex = 0;
          }
          // 这里面定时15秒进行刷新
          imBaseState.loginTimTimer = setTimeout(() => {
            startTimLoginLoop();
          }, 15000);
        }
      }
    };
    const stopTimLoginLoop = async () => {
      if (imBaseState.loginTimTimer) {
        clearTimeout(imBaseState.loginTimTimer);
        imBaseState.loginTimTimer = null;
      }
      if (imBaseState.isLoginTim && imBaseState.$tim) {
        await loginOutTim();
      }
    };


    const onMessageItemContextmenu = () => {
      console.log('222');
    }

    const fetchMessageListByTim = async () => {
      debugger
      try {
        const options = {
          conversationID: 'C2C30071520',
        };
        // 如果存在有nextReq
        // if (this.nextReqMessageID) { // 续拉数据
        //   options.nextReqMessageID = this.nextReqMessageID;
        // }
        const messageListResponse = await state.$tim.getMessageList(options);
        debugger
        console.log('messageListResponse::', messageListResponse);
        if (messageListResponse.code === 0 && messageListResponse.data) {
          const msgListData = messageListResponse.data;
          state.nextReqMessageID = msgListData.nextReqMessageID;
          state.isTimCompleted = msgListData.isCompleted;
          return Array.isArray(msgListData.messageList) ? msgListData.messageList : [];
        }
      } catch (ex) {
        console.log(ex)
      }
      return [];
    }

    const fetchMessageList = async () => {
      let messageList = [];
      if (!state.isTimCompleted) {
        messageList = await fetchMessageListByTim();
      }
      if (state.isTimCompleted && !state.isServerCompleted) {
        const serverMessageList = await fetchMessageListByServer();
        messageList = [...serverMessageList, ...messageList];
        state.nextReqMessageID = messageList[0] ? messageList[0].ID || null : null;
      }
      const newMessageList = await buildMessageNickName(messageList);
      state.messageList = [...newMessageList, ...state.messageList];
      debugger
      await setMessageRead();
    }

    const buildMessageKey = (message) => {
      return `${message.sequence}_${message.random}_${message.time}`;
    };

    const fetchMessageListByServer = async () => {
      let msgKey = state.nextReqMessageID;
      if (state.nextReqMessage && !state.nextReqMessage.isServer) {
        msgKey = buildMessageKey(state.nextReqMessage); // `${this.nextReqMessage.sequence}_${this.nextReqMessage.random}_${this.nextReqMessage.time}`;
      }
      const params = {
        msgKey,
        customerUid: state.customerUid,
        limit: 10,
      };
      const res = await im.getHistoryMessageByServer(params);
      if (res && Array.isArray(res.data) && res.data.length) {
        const messageList = res.data.map(item => {
          item.isServer = true;
          item.ID = item.msgKey;
          item.id = item.msgKey;
          item.time = item.createTime / 1000;
          try {
            if (item.payload) {
              item.payload = JSON.parse(item.payload)
            }
            if (item.type === TYPES.MSG_IMAGE) {
              const imageInfoArray = item.payload.imageInfoArray;
              if (Array.isArray(imageInfoArray)) {
                imageInfoArray.forEach(imageInfo => {
                  imageInfo.imageUrl = imageInfo.url;
                })
              }
            }
          } catch (e) {
            console.log(e);
            item.payload = {};
          }
          return item;
        });
        state.isServerCompleted = messageList.length < 10;
        return messageList.reverse();
      }
      state.isServerCompleted = true;
      return [];
    };

    const buildMessageNickName = async (messageList) => {
      const notMapUserIds = [];
      messageList.forEach(message => {
        if (message.cloudCustomData) {
          const messageCloudCustomData = message.cloudCustomData;
          try {
            const cloudCustomData = JSON.parse(messageCloudCustomData);
            if (cloudCustomData) {
              const userId = +cloudCustomData.userId;
              // const senderUserName = this.messageNickNameMap.get(userId);
              message.senderUserId = userId;
              message.senderUserName = '';
              message.senderEmployeeId = '';
              const sender = state.messageNickNameMap.get(message.senderUserId);
              if (!sender && userId) {
                notMapUserIds.push(userId);
              } else {
                message.senderUserName = sender.imNickname || sender.realname || ''
                message.senderEmployeeId = sender.employeeId || '';
              }
            }
          } catch (ex) {
            // console.log(ex);
            message.senderUserId = '';
            message.senderUserName = '';
            message.senderEmployeeId = '';
          }
        }
      });
      if (notMapUserIds.length) {
        const userIds = Array.from(new Set(notMapUserIds));
        await fetchUserNickNameByUserIds(userIds);
        for (let idx = 0; idx < messageList.length; idx++) {
          const message = messageList[idx];
          if (message.senderUserId) {
            await setMessageSenderInfo(message);
          }
        }
      }
      return messageList;
    };

    const fetchUserNickNameByUserIds = async (userIds) => {
      try {
        const {data} = await im.getNickName({
          userIds: userIds.join(',')
        });
        if (Array.isArray(data)) {
          data.forEach(item => {
            state.messageNickNameMap.set(+item.userId, item);
          });
        }
      } catch (ex) {
        const message = `根据UserIds查询用户的昵称接口调用报错：${ex.message || '请求报错'}`;
        console.error(message);
      }
    };

    const setMessageSenderInfo = async (message, needGet) => {
      let sender = state.messageNickNameMap.get(message.senderUserId);
      if (!sender && needGet) {
        await fetchUserNickNameByUserIds([message.senderUserId]);
        sender = state.messageNickNameMap.get(message.senderUserId);
      }
      if (sender) {
        message.senderUserName = sender.imNickname || sender.realname || ''
        message.senderEmployeeId = sender.employeeId || '';
      } else {
        message.senderUserName = '';
        message.senderEmployeeId = '';
      }
    };


    const setMessageRead = async () => {
      // if (+this.userInfo.userId === +this.commonAccountInfo.adminUserId) {
      //   await state.$tim.setMessageRead({
      //     // conversationID: this.conversationId
      //     conversationID: 'C2C30071520'
      //   });
      // }
    };

    const onTimReceivedMessage = async (event) => {
      const messages = Array.isArray(event.data) ? event.data : [];
      if (messages.length) {
        let messageList = messages.filter(item => item.conversationID === this.conversationId);
        messageList = await buildMessageNickName(messageList);
        messageList.forEach(item => {
          state.messageList.push(item);
        });
      }
      updateUnreadMessageCount();
    };

    const bindTimEventListener = () => {
      state.$tim.on(TIM.EVENT.MESSAGE_RECEIVED, onTimReceivedMessage, this);
      state.$tim.on(TIM.EVENT.MESSAGE_MODIFIED, onTimModifiedMessage, this);
      state.$tim.on(TIM.EVENT.MESSAGE_REVOKED, onTimRevokedMessage, this);
      state.$tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onTimMessageReadByPeer, this);
    };

    const onTimRevokedMessage = (event) => {
      const messages = Array.isArray(event.data) ? event.data : [];
      if (messages.length) {
        messages.forEach(item => {
          const index = state.messageList.findIndex(message => item.ID === message.ID);
          if (index > -1) {
            state.messageList.splice(index, 1);
            state.messageList.push(item);
          }
        });
      }
      updateUnreadMessageCount();
    };

    const onTimMessageReadByPeer = (event) => {
      const readMessages = Array.isArray(event.data) ? event.data : [];
      const readMessageIdSet = new Set();
      if (readMessages.length) {
        readMessages.forEach(item => readMessageIdSet.add(item.ID));
        state.messageList.forEach(item => {
          if (readMessageIdSet.has(item.ID)) {
            item.isPeerRead = true;
          }
        })
      }
      updateUnreadMessageCount();
    };

    const updateUnreadMessageCount = () => {
      console.log('更新未读的消息个数');
    };

    const onTimModifiedMessage = (event) => {
      console.log(event);
    };

    const unBindTimeEventListener = () => {
      state.$tim.off(TIM.EVENT.MESSAGE_RECEIVED, onTimReceivedMessage);
      state.$tim.off(TIM.EVENT.MESSAGE_MODIFIED, onTimModifiedMessage);
      state.$tim.off(TIM.EVENT.MESSAGE_REVOKED, onTimRevokedMessage);
      state.$tim.off(TIM.EVENT.MESSAGE_READ_BY_PEER, onTimMessageReadByPeer);
    };

    /**
     * 请求后端的接口进行获取IM的的appId
     * */
    const getIMAppId = () => {
      im.getTimAppId()
          .then((res) => {
            state.SDKAppID = res.data || null;
            debugger
            createTencentTim(); // 初始化 实例对象
          })
          .catch((err) => {
            console.log(err);
          })
    }

    await getIMAppId();

    onMounted(async () => {
      await checkUserCanUseIm();
      if (imBaseState.canUseIm) {
        await createTencentTim();
        await bindTimEventListener();
      }
      await fetchMessageList();
    })

    onUnmounted(async () => {
      await stopTimLoginLoop();
      bindTimEventListener();
      await imBaseState.$tim.destroy();
      imBaseState.$tim = null;
    })

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
