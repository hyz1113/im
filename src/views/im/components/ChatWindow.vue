<template>
  <div class="chat-window">
    <div
        v-for="item in messageList"
        :key="item"
    >
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

      <!--        <message-revoked-->
      <!--            v-else-->
      <!--            :isEdit="item.type === TYPES.MSG_TEXT"-->
      <!--            :data="item"-->
      <!--        />-->
    </div>
    <message-send
        :conversation-id="conversationId"
        :imBaseState="imBaseState"
        :customerTimId="customerTimId"
        :messageList="messageList"
        @sendTextMessage="sendTextMessage"
        @sendImageMessage="sendImageMessage"
    />
  </div>
</template>

<script>
import {useStore} from 'vuex'
import TIM from 'tim-js-sdk/tim-js-friendship';
import TIMUploadPlugin from 'tim-upload-plugin';
import {reactive, toRefs, getCurrentInstance, computed, onMounted, onBeforeUnmount, nextTick} from 'vue';
import { useRoute, onBeforeRouteLeave, useRouter } from 'vue-router';
import {im} from '@/api/im/api';
import {List, showToast} from 'vant';
import MessageBubble from './messages/bubble';
import MessageTip from './messages/tip';
import MessageText from './messages/text';
import MessageImage from './messages/image';
import MessageAudio from './messages/audio';
import MessageFace from './messages/face';
import MessageNotSupport from './messages/notSupport';
import MessageRevoked from './messages/revoked';
import MessageSend from "./messages/send";
import { IMBase } from '../mixins/base';
import Mepal from '@/utils/mepal';

export default {
  setup() {
    const state = reactive({
      isInitTim: false,
      isBindTimEvent: false,
      messageList: [],
      isCompleted: false,
      isTimCompleted: false,
      isServerCompleted: false,
      customerUid: 'customerUid', // 当前的用户id
      // 吓一跳消息的ID
      nextReqMessageID: '',
      nextReqMessage: null,
      messageNickNameMap: new Map(),
      conversationID: '',
      customerName: '',
      customerTimId: '',// 存储在腾讯的用户id
      conversationId: '',
      pushMsgWay: '', // 是否是推送消息进入详情页
    });
    const {dispatch} = useStore();
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    state.conversationID = route.query.userId;
    state.pushMsgWay = route.query.way || '';

    const TYPES = computed(() => {
      return TIM.TYPES
    })

   const {
        imBaseState,
        createTencentTim,
        loginTim,
        loginOutTim,
        fetchTimInfo,
        fetchTimAccountFriends,
   } = IMBase();

    const onMessageItemContextmenu = () => {
      console.log('222');
    }

    const fetchMessageListByTim = async () => {
      try {
        const options = {
          conversationID: `C2C${state.conversationID}`,
        };
        // 如果存在有nextReq
        if (state.nextReqMessageID) { // 续拉数据
          options.nextReqMessageID = state.nextReqMessageID;
        }
        const messageListResponse = await imBaseState.$tim.getMessageList(options);
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

    const scrollToBottom = () => {
      const pageHeight = window.screen.height;
      nextTick(() => {
        window.scrollTo(0, pageHeight);
      })
    }

    const fetchMessageList = async () => {
      Mepal.showLoading(); // 打开loading 窗
      let messageList;
      messageList = await fetchMessageListByTim();
      if (state.isTimCompleted && !state.isServerCompleted) {
        const serverMessageList = await fetchMessageListByServer();
        messageList = [...serverMessageList, ...messageList];
        state.nextReqMessageID = messageList[0] ? messageList[0].ID || null : null;
      }
      const newMessageList = await buildMessageNickName(messageList);
      state.messageList = [...newMessageList, ...state.messageList];
      console.log(`获取到的消息的条数=== ${ state.messageList.length }`);
      scrollToBottom();
      Mepal.hideLoading(); // 关闭loading 窗
      await setMessageRead();
    }

    const setMessageRead = async () => {
      updateUnreadMessageCount();
    };

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
        customerUid: state.conversationID,
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

    const bindTimEventListener = () => {
      imBaseState.$tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onTimReady);
      imBaseState.$tim.on(TIM.EVENT.MESSAGE_RECEIVED, onTimReceivedMessage);
      imBaseState.$tim.on(TIM.EVENT.MESSAGE_MODIFIED, onTimModifiedMessage);
      imBaseState.$tim.on(TIM.EVENT.MESSAGE_REVOKED, onTimRevokedMessage);
      imBaseState.$tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onTimMessageReadByPeer);
    };

    const onTimReceivedMessage = async (event) => {
      const messages = Array.isArray(event.data) ? event.data : [];
      if (messages.length) {
        // this.conversationId
        let messageList = messages.filter(item => item.conversationID === state.conversationID);
        messageList = await buildMessageNickName(messageList);
        messageList.forEach(item => {
          state.messageList.push(item);
        });
      }
      updateUnreadMessageCount();
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
      clearAllUnreadMessageCount();
    };

    /*
    * 清空未读消息个数===0
    * */
    const clearAllUnreadMessageCount = async () => {
      let promise = imBaseState.$tim.setMessageRead({conversationID: state.conversationId});
      promise.then(function() {
        // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
        console.log('未读消息清空为0');
      }).catch(function(imError) {
        // 已读上报失败
        console.warn('setMessageRead error:', imError);
      });
    };

    const onTimModifiedMessage = (event) => {
      console.log(event);
    };

    const unBindTimeEventListener = () => {
      imBaseState.$tim.off(TIM.EVENT.MESSAGE_RECEIVED, onTimReceivedMessage);
      imBaseState.$tim.off(TIM.EVENT.MESSAGE_MODIFIED, onTimModifiedMessage);
      imBaseState.$tim.off(TIM.EVENT.MESSAGE_REVOKED, onTimRevokedMessage);
      imBaseState.$tim.off(TIM.EVENT.MESSAGE_READ_BY_PEER, onTimMessageReadByPeer);
    };

    // 初始化腾讯的tim相关的功能
    const initTencentTim = async() => {
      if (!state.isInitTim) {
        state.isInitTim = await createTencentTim();
      }
      if (!state.isBindTimEvent && state.isInitTim) {
        bindTimEventListener();
        state.isBindTimEvent = true;
      } else {
        showToast({
          message: '暂时未能获取建联对象!'
        });
      }
    };

    // 当tim进行初始化的时候进行的操作
    const onTimReady = async () => {
      try {
        const friendList = await fetchTimAccountFriends();
        if (imBaseState.commonAccountInfo && imBaseState.commonAccountInfo.customerTencentUserId) {
          const timUserId = `${imBaseState.commonAccountInfo.customerTencentUserId}`;
          // @ts-ignore
          const customerInfoOfTim = friendList.find(item => item.userID === timUserId);
          imBaseState.customerTimInfo = customerInfoOfTim || null;
        }
        console.log('====-------' + imBaseState.customerTimInfo);
        if (imBaseState.customerTimInfo) {
          state.customerTimId = imBaseState.customerTimInfo.userID;
          state.conversationId = state.customerTimId ? `C2C${state.customerTimId}` : null;
          console.log('建联了=====');
          console.log('存储在腾讯的用户的id ===' + state.customerTimId);
          await fetchMessageList();
        } else {
          console.log('获取腾讯IM建联关系失败！');
        }
      } catch (ex) {
        console.log('queryResult', false, ex.message || 'TIM 初始化错误');
      }
    };

    // 发送消息部分 ------------------------------
    const sendMessage = async (message) => {
      message.senderUserId = localStorage.getItem('UserId') || '' // 预定从 列表里-- adminUserID获取;
      await setMessageSenderInfo(message, true);
      state.messageList.push(message);
      try {
        const imResponse = await imBaseState.$tim.sendMessage(message);
        const index = state.messageList.findIndex(item => item.ID === imResponse.data.message.ID)
        const newMessage = imResponse.data.message;
        newMessage.senderUserId = localStorage.getItem('UserId') || '' // 预定从 列表里-- adminUserID获取;
        await setMessageSenderInfo(newMessage);
        if (index > -1) {
          state.messageList.splice(index, 1, newMessage);
        }
        console.log(`发送的消息是=== ${ JSON.stringify(newMessage)}`);
      } catch (error) {
        showToast( error.message || '发送失败');
      }
    };

    const buildMessageOptions = (content, type, callback = () => ({})) => {
      const options = {
        to: state.customerTimId, // （必须字符串） 预定从 列表里--  customerTencentUserId
        conversationType: 'C2C',
        payload: content,
        needReadReceipt: true,
        cloudCustomData: JSON.stringify({
          userId: localStorage.getItem('UserId') || '' // 预定从 列表里-- adminUserID获取
        }),
      };
      if (type === 'file' && typeof callback === 'function') {
        options.onProgress = callback;
      }
      return options;
    };

    const sendTextMessage = async (msg) => {
      const text = msg.trim();
      const options = buildMessageOptions({ text: text }, 'text');

      const message = imBaseState.$tim.createTextMessage(options);

      message.progress = 0;
      await sendMessage(message);
    }

    const onFileMessageProcess = (progress, message) => {
      const index = state.messageList.findIndex(item => item.ID === message.ID);
      if (index > -1) {
        const tempMessage = state.messageList[index];
        const newMessage = {
          ...tempMessage,
          progress: progress
        };
        state.messageList.splice(index, 1, newMessage )
      }
    };

    const sendImageMessage = async (image) => {
      const options = buildMessageOptions({ file: image }, 'file', (progress) => {
        onFileMessageProcess(progress, message);
      });
      console.log(`im  ${JSON.stringify(options)}`);
      // await createTencentTim();
      const message = imBaseState.$tim.createImageMessage(options);
      console.log('message======' + JSON.stringify(message));
      await sendMessage(message);
    };


    onMounted( async () => {
      if(state.pushMsgWay) {
        Mepal.getToken().then(res => {
          console.log('跳转链接获取的====token ==== ', res);
          im.gotoLoginMepal({token: res}).then(async (data) => {
            const {userId} = data.data;
            if(userId) {
              await fetchTimInfo();
              await initTencentTim();
              await loginTim();
            }
          });
        });
      } else {
        await fetchTimInfo();
        await initTencentTim();
        await loginTim();
      }
    })

    onBeforeRouteLeave(async (to, from, next) => {
      await loginOutTim();
      unBindTimeEventListener();
      imBaseState.$tim = null;
      next(() => {
        router.push({path:'/list'})
      });
    })

    return {
      ...toRefs(state),
      TYPES,
      imBaseState,
      onMessageItemContextmenu,
      sendTextMessage,
      sendImageMessage,
    }
  },
  components: {
    TIMUploadPlugin,
    MessageTip,
    MessageText,
    MessageImage,
    MessageAudio,
    MessageFace,
    MessageNotSupport,
    MessageBubble,
    MessageRevoked,
    MessageSend,
    List,
  },
}
</script>

<style scoped lang="scss">
.chat-window {
  background: #f7f8fa;
  padding: 10px 10px 80px 10px;
}
</style>
