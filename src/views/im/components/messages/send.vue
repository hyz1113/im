<template>
  <div class="message-input">
    <!--    <van-icon name="photo-o" @click="onChooseImageBtnClick" />-->
    <van-cell-group inset>
      <van-field
          v-model="messageValue"
          center
          clearable
          autosize
          type="textarea"
      >
        <template #button>
          <van-icon name="photo-o" @click="onChooseImageBtnClick" size="30"/>
          <van-icon name="add-o" @click="onChooseImageBtnClick" size="30"/>
          <van-button size="small" type="primary">发送</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <!--    <div class="input-ctr">-->
    <!--      <div class="right">-->
    <!--        <el-button type="primary" @click="onSendBtnClick">-->
    <!--          发送-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {toRefs, nextTick, toRef} from "vue";
import {IMBase} from '../../mixins/base';

export default {
  name: "MessageInput",
  setup(props) {
    const state = {
      sendImageFile: null,
      messageValue: '',
    };
    const onChooseImageBtnClick = () => {
    }
    const messageList = toRef(props, 'messageList');

    const onImageFileChange = (event) => {
      const files = event.target.files;
      if (files.length) {
        sendImageMessage(files[0]);
      }
      refreshImageFile();
    };

    const onInputPaste = () => {

    };

    const onInputKeyDown = (event) => {
      // const widthFunctionKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      // if (event.key === 'Enter' && !this.sendBtnDisabled && !widthFunctionKey) {
      //   event.preventDefault();
      //   sendTextMessage();
      //   setTimeout(() => {
      //     state.messageValue = '';
      //   });
      // }
    };

    const sendTextMessage = () => {
    };

    const onSendBtnClick = () => {
      sendTextMessage();
    };

    const buildMessageOptions = (content, type, callback = () => ({})) => {
      const options = {
        to: '',
        conversationType: 'C2C',
        payload: content,
        needReadReceipt: true,
        cloudCustomData: JSON.stringify({
          userId: this.userInfo.userId || ''
        }),
      };
      if (type === 'file' && typeof callback === 'function') {
        options.onProgress = callback;
      }
      return options;
    };

    const onFileMessageProcess = (progress, message) => {
      const index = this.messageList.findIndex(item => item.ID === message.ID);
      if (index > -1) {
        const tempMessage = this.messageList[index];
        const newMessage = {
          ...tempMessage,
          progress: progress
        };
        this.messageList.splice(index, 1, newMessage)
      }
    };

    const sendMessage = async (message) => {
      //   message.senderUserId = this.userInfo.userId;
      //   await setMessageSenderInfo(message, true);
      //   this.messageList.push(message);
      //   try {
      //     const imResponse = await this.$tim.sendMessage(message);
      //     const index = this.messageList.findIndex(item => item.ID === imResponse.data.message.ID)
      //     const newMessage = imResponse.data.message;
      //     newMessage.senderUserId = this.userInfo.userId;
      //     await setMessageSenderInfo(newMessage);
      //     if (index > -1) {
      //       this.messageList.splice(index, 1, newMessage);
      //     }
      //     await setMessageRead();
      //   } catch (error) {
      //     // this.$message.error( error.message || this.$tt('{#发送失败!#}'));
      //   }
    };

    const sendImageMessage = async (image) => {
      const options = buildMessageOptions({file: image}, 'file', (progress) => {
        onFileMessageProcess(progress, message);
      });
      const message = IMBase.$tim.createImageMessage(options);
      await sendMessage(message);
    };

    const refreshImageFile = () => {
      state.imageFileShow = false;
      nextTick(() => {
        state.imageFileShow = true;
      });
    };

    return {
      ...toRefs(state),
      messageList,
      onChooseImageBtnClick,
      onImageFileChange,
      onInputKeyDown,
      onInputPaste,
      onSendBtnClick,
    }
  },
}
</script>

<style lang="scss" scoped>
.message-input {
  position: fixed;
  bottom: 10px;
  left: 0;
  display: flex;
  width: 100%;

  .van-cell-group {
    width: 100%;
  }

  .van-field {
    padding: 5px 10px 5px 20px;

    ::v-deep .van-field__button {
      display: flex;

      .van-icon {
        margin: 0 5px;
      }
    }
  }
}
</style>
