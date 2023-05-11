<template>
  <div class="message-input">
    <!--    <van-icon name="photo-o" @click="onChooseImageBtnClick" />-->
    <van-cell-group>
      <van-field
          v-model="messageValue"
          center
          clearable
          autosize
          type="textarea"
      >
        <template #button>
          <div class="uploadFile">
            <van-icon class="bg" name="photo-o" size="40"/>
            <input
                type="file"
                class="button"
                id="imageFile"
                accept="image/*"
                @click="onImageFileChange"
            />
          </div>

          <van-button size="small" type="primary" @click="noticeMessage">发送</van-button>
        </template>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import {toRefs, nextTick, toRef, ref, getCurrentInstance} from "vue";
import {IMBase, createTencentTim} from '../../mixins/base';
import Mepal from "@/utils/mepal";
import imgAddWaterRark from "@/mixins/imgAddWaterRark";

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
    const imageFile = ref(null);

    const {proxy} = getCurrentInstance();

    const onImageFileChange = async () => {
      if (imageFile) {
        const email = 'lallal@qq.com';
        const realname = 'f888888';
        const text = `${email}_${realname}`;
        const dom = document.getElementById('imageFile');
        ctx.emit('sendImageMessage', dom);
        // imgAddWaterRark(files, text).then(res=> {
        //   ctx.emit('sendImageMessage', res);
        // });
        refreshImageFile();
      }
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
    padding: 0 20px;

    ::v-deep .van-field__button {
      display: flex;

      .van-icon {
        margin: 0 5px;
      }
    }
  }

  .uploadFile {
    width: 40px;
    margin-right: 10px;
    position: relative;

    .bg, input[type="file"] {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }

    .bg {
      z-index: 1;
      top: -4px;
    }

    input[type="file"]{
      opacity: 0;
      z-index: 2;
    }
  }


}
</style>
