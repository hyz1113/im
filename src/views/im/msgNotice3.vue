<template>
  <div>
    dsfsdfsfs
  </div>
</template>

<script>
// import WebSocket from 'ws';
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
      // this.ws = new WebSocket('ws://hbg-kol-crm-gateway.global-base.tc-jp1.huobiapps.com/crmIm/push/connect'); // 创建websocket实例
      this.ws = new WebSocket('ws://hbg-kol-crm-crm.global-base.tc-jp1.huobiapps.com:8080/crmIm/push/connect', ''); // 创建websocket实例
      // this.ws.sendMessage = this.sendMessage.bind(this);
      this.ws.onopen = this.onOpen.bind(this); // 绑定onopen事件处理函数
      this.ws.onmessage = this.onMessage.bind(this); // 绑定onmessage事件处理函数
      this.ws.onclose = this.onClose.bind(this); // 绑定onclose事件处理函数
      this.ws.onerror = this.onError.bind(this); // 绑定onerror事件处理函数
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
