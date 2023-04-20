<template>
  <div class="list">
    <p>刷新次数: {{ count }}</p>
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
                  width="36"
                  height="36"
                  :src="require('@/assets/images/im/customer-photo.png')"
              />
              <div class="text m-l-10">
                  <div>{{ data.uid }}｜{{ data.customerName }}</div>
                  <div>{{ data.latestMsg }}</div>
              </div>
            </div>
          </template>
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #right-icon>
            <time>{{ data.latestMsgTime }}</time>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
export default {
  name: "messageList",
  setup() {
    const state = reactive({
      loading: false,
      count: 0,
      list: [
        {
          customerName: "423424",
          latestMsg: '3333',
          latestMsgTime: 1679994123,
          latestMsgUid: "41054496",
          uid: "C2C234470313520",
        },
        {
          customerName: "23",
          latestMsg: '3333',
          latestMsgTime: 1679994123,
          latestMsgUid: "41054496",
          uid: "4324",
        },
        {
          customerName: "23",
          latestMsg: '3333',
          latestMsgTime: 1679994123,
          latestMsgUid: "41054496",
          uid: "4324",
        },
        {
          customerName: "23",
          latestMsg: '3333',
          latestMsgTime: 1679994123,
          latestMsgUid: "41054496",
          uid: "4324",
        }
      ]
    })
    const router = useRouter();

    const onRefresh = () => {
      state.count += 1;
    }

    /*
    * 跳转到详情
    * */
    const togoDetail = (data) => {
      router.push({
        path: '/chat',
        query: { userId: data.uid, cname: data.customerName }
      });
    }


    return {
      ...toRefs(state),
      onRefresh,
      togoDetail,
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
      }
    }
  time {
    @include f-s-color(13px, #999);
  }
}
</style>
