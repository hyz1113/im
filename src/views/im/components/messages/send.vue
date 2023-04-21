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
          <van-button size="small" type="primary" @click="noticeMessage">发送</van-button>
        </template>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import {toRefs, nextTick, toRef} from "vue";
import {IMBase} from '../../mixins/base';

export default {
  name: "MessageInput",
  setup(props, ctx) {
    const state = {
      sendImageFile: null,
      messageValue: '',
      userInfo: '',
    };

    const onChooseImageBtnClick = () => {
    }

    const onImageFileChange = (event) => {
      const files = event.target.files;
      if (files.length) {
        sendImageMessage(files[0]);
      }
      refreshImageFile();
    };

    // const onFileMessageProcess = (progress, message) => {
    //   const index = messageList.findIndex(item => item.ID === message.ID);
    //   if (index > -1) {
    //     const tempMessage = messageList[index];
    //     const newMessage = {
    //       ...tempMessage,
    //       progress: progress
    //     };
    //     messageList.splice(index, 1, newMessage)
    //   }
    // };

    const noticeMessage = async (message) => {
      ctx.emit('sendTextMessage', state.messageValue);
      state.messageValue = '';
    };

    const sendImageMessage = async (image) => {

    };

    const refreshImageFile = () => {
      state.imageFileShow = false;
      nextTick(() => {
        state.imageFileShow = true;
      });
    };

    return {
      ...toRefs(state),
      onChooseImageBtnClick,
      onImageFileChange,
      noticeMessage,
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
