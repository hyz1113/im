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
          <van-uploader :before-read="onImageFileChange">
            <van-icon name="photo-o" size="30"/>
          </van-uploader>
          <van-button size="small" type="primary" @click="noticeMessage">发送</van-button>
        </template>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import {toRefs, nextTick, toRef, computed} from "vue";
import {IMBase, createTencentTim} from '../../mixins/base';
import Mepal from "@/utils/mepal";
import {showToast} from "vant";

export default {
  name: "MessageInput",
  setup(props, ctx) {
    const state = {
      sendImageFile: null,
      messageValue: '',
      userInfo: '',
      messageNickNameMap: new Map(),
    };

    const messageList = toRef(props, 'messageList');
    const customerTimId = toRef(props, 'customerTimId');

    const onImageFileChange = (files) => {
      debugger
      if (files) {
        // const { email = '', realname = '' } = this.userInfo;
        // const text = `${email}_${realname}`;
        ctx.emit('sendImageMessage', files);
        // this.$imgWaterRark(files[0], text).then(res=> {
        //
        // });
      }
      refreshImageFile();
    };


    const noticeMessage = async (message) => {
      ctx.emit('sendTextMessage', state.messageValue);
      state.messageValue = '';
    };

    const refreshImageFile = () => {
      state.imageFileShow = false;
      nextTick(() => {
        state.imageFileShow = true;
      });
    };

    return {
      ...toRefs(state),
      onImageFileChange,
      noticeMessage,
    }
  },
}
</script>

<style lang="scss" scoped>
.message-input {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  width: 100%;

  .van-cell-group {
    width: 100%;
  }

  .van-field {

    ::v-deep .van-field__button {
      display: flex;

      .van-icon {
        margin: 0 5px;
      }
    }

    .van-uploader {

    }
  }
}
</style>
