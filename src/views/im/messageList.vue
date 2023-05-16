<template>
  <div class="list">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <div
          v-for="data in list"
          :key="data"
          class="item">
        <van-cell-group>
          <van-cell @click="togoDetail(data)">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <div class="title">
                <van-image
                    contain
                    width="36"
                    height="36"
                    :src="require('@/assets/images/im/customer-photo.png')"
                />
                <div class="text m-l-10">
                  <div>{{ data.uid }}｜{{ data.customerName }}</div>
                  <div class="msg">{{ getMsgContent(data.latestMsg, data) }}</div>
                </div>
              </div>
            </template>
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
              <time>{{ formatLastMsgTime(data.latestMsgTime) }}</time>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {computed, onMounted, reactive, toRefs} from 'vue';
import {useRouter} from 'vue-router';
import Mepal from "@/utils/mepal";
import {im} from "@/api/im/api";
import moment from 'moment';

export default {
  name: "messageList",
  setup() {
    const state = reactive({
      loading: false,
      count: 0,
      list: []
    })
    const router = useRouter();
    /*
   * 显示的消息类型
   * */
    const timMessageTypes = {
      TEXT: 'TIMTextElem',
      IMAGE: 'TIMImageElem'
    };
    Mepal.setTitle({title: 'im'});

    const siteToken = () => {
      // localStorage.setItem('Admin-Token', '1c1ad86624bd4635b6b0afc5a39feffa');
      // localStorage.setItem('UserId', '14815');
      // getList();
      Mepal.getToken().then(res => {
        console.log('token ==== ', res);
        localStorage.setItem('Admin-Token', res);
        im.gotoLoginMepal({token: res}).then((data) => {
          const {userId} = data.data;
          console.log('userId ==== ', userId);
          localStorage.setItem('UserId', userId);
          getList();
        });
      });
    }

    /*
    * 获取列表数据
    * */
    const getList = async () => {
      state.loading = true;
      const res = await im.getMySessionH5List();
      if (res) {
        state.list = res.data;
        state.loading = false;
        setTimeout(getList, 15000); // 每隔10分钟重新刷新一次列表
      }
    }

    const onRefresh = () => {
      state.count += 1;
      getList();
    }

    /*
    * 格式化时间
    * */
    const formatLastMsgTime = (time) => {
      if (time) {
        const latestMsgTime = moment(time * 1000);
        if (latestMsgTime.isSame(moment(), 'day')) {
          return latestMsgTime.format('HH:mm:ss');
        } else if (latestMsgTime.isSame(moment().subtract(1, 'day'), 'day')) {
          return "昨天"
        } else {
          return latestMsgTime.format('YYYY/MM/DD');
        }
      }
    }

    /*
    * 获取单一消息内容
    * */
    const getMsgContent = (latestMsg, data) => {
      let latestMsgData = latestMsg;
      if (typeof latestMsg === 'string') {
        try {
          latestMsg = JSON.parse(latestMsg)
          if (Array.isArray(latestMsg)) {
            latestMsgData = latestMsg[0] || {};
          } else {
            latestMsgData = latestMsg || {};
          }
          latestMsgData.isRevoked = typeof data.isRevoked === 'boolean' ? data.isRevoked : latestMsgData.isRevoked || false;
        } catch (ex) {
          latestMsgData = {};
        }
      }
      if (data.isRevoked || latestMsgData.isRevoked) {
        return '消息已被撤回';
      } else if (latestMsgData.msgType === timMessageTypes.TEXT) {
        const msgContent = latestMsgData.msgContent;
        if (msgContent) {
          return msgContent.text || '';
        }
      } else if (latestMsgData.msgType === timMessageTypes.IMAGE) {
        return `['图片']`;
      }
    }

    /*
    * 跳转到详情
    * */
    const togoDetail = (data) => {
      alert('跳转到详情页了')
      alert(`${JSON.stringify(data)}`);
      alert(`${JSON.stringify(router)}`);
      router.push({
        path: 'chat',
        query: {userId: data.uid, cname: data.customerName}
      });
      alert('跳转到详情页了---000')
    }

    onMounted(async () => {
      await siteToken();
    })

    return {
      ...toRefs(state),
      onRefresh,
      togoDetail,
      formatLastMsgTime,
      getMsgContent,
    }
  },
}
</script>

<style scoped lang="scss">
.list {
  .title {
    @include f-s-color(14px, #333);
    @include flex-align(flex-start, center);

    .text {
      margin-left: 10px;
      @include flex-align(flex-start, flex-start);
      flex-direction: column;
      flex: 1;

      .msg {
        display: block;
        width: 200px;
        height: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: #999;
        text-align: left;
      }
    }
  }

  time {
    @include f-s-color(13px, #999);
  }
}
</style>
