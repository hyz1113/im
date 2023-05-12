<template>
  <div>
    dsfsdfsfs
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
            'Admin-Token': 'ST-1092-kiJIVtqCMfCrpCayL8gWNbuwpSYiam-cas-6dd9bdf7b6-ks4mx'
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

<style scoped>

</style>
