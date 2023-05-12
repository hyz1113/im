<template>
  <div class="content">
      <div class="left">left</div>
      <div class="center">center</div>
      <div class="right">right</div>
  </div>
</template>

<script>
// import WebSocket from 'ws';
import { EventSourcePolyfill } from 'event-source-polyfill';
export default {
  name: "msgNotice",
  data() {
    return {
      ws: null, // websocket实例
      message: '', // 用于存储接收到的消息
    };
  },
  created() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
        const es = new EventSourcePolyfill('http://kol-crm-asset-mgt.global-base.tc-jp1.huobiapps.com/kol/crmIm/push/connect', {
          headers: {
            'Admin-Token': 'a06b277c451d4af6b17c7b5110d2e10a'
          }
        })

      es.onopen = function (e) {
        console.log('open success');
      }

      es.onmessage = function (e) {
        console.log('e.data' + e);
      }

      es.onerror = function (err) {
        console.log(err);
        err & err.state === 401 && console.log('无权限');
      }

      es.onClose = function (e) {
        console.log('连接关闭' + e);
      }
    },
    onOpen() {
      console.log('websocket连接成功');
    },
    onMessage(event) {
      console.log('收到消息：', event.data);
      this.message = event.data; // 将接收到的消息存储到data中
    },
    onClose() {
      console.log('websocket连接关闭');
    },
    onError() {
      console.log('websocket连接出错');
    },
    sendMessage() {
      this.ws.send({token: 'ST-1092-kiJIVtqCMfCrpCayL8gWNbuwpSYiam-cas-6dd9bdf7b6-ks4mx'}); // 发送消息
    },
  },
};
</script>

<style scoped lang="scss">
  // 方法1：
  .content {
    width: 100%;
    display: flex;
    background: gray;
    flex-flow: column;


    .left, .right {
      width: 300px;
    }
    .left {
      background: yellowgreen;
      height: 400px;
    }
    .right {
      background: red;
      height: 200px;
    }
    .center{
      background: green;
      flex: 0 0 100px;
      height: 300px;
    }
  }

  ////方法2：
  //.content {
  //  width: 100%;
  //  background: gray;
  //  height: 400px;
  //
  //
  //  .left, .right {
  //    width: 200px;
  //    position: absolute;
  //  }
  //
  //  .left {
  //    background: yellowgreen;
  //    left: 0;
  //    height: 300px;
  //  }
  //
  //  .right {
  //    background: red;
  //    right: 0;
  //  }
  //  .center {
  //    position: absolute;
  //    left: 200px;
  //    right: 200px;
  //    height: 200px;
  //    text-align: center;
  //    color: #000;
  //    background: #006EFF;
  //  }
  //}
</style>
