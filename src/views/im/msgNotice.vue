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
    // this.initWebSocket();

    // 冒泡排序
    const arr = [9, 3, 8, 441, 390, 5];
    // this.sortMpao(arr);
    // this.selectSort(arr);
    // console.log(this.quickSort(arr));

    // console.log('======' + result);
    let i = 1;
    let result = [];
    while (i <= 100) {
      // result.push(this.fib(i));
      i++;
    }
    console.log(result);
  },
  methods: {
    sortMpao(arr) {
      for (let index = 0; index < arr.length - 1; index++) {
        for (let n = 0; n < arr.length - 1 - index; n++) {
          if (arr[n] > arr [n + 1]) {
            const mid = arr[n];
            arr[n] = arr[n + 1];
            arr[n + 1] = mid;
          }
        }
      }
      return arr;
    },
    selectSort(arr) {
      for (let index = 0; index < arr.length - 1; index++) {
        let minIndex = index;
        for (let n = index; n < arr.length; n++) {
          if (arr[n] < arr[minIndex]) {
            minIndex = n;
          }
        }
        if (index !== minIndex) {
          const mid = arr[index];
          arr[index] = arr[minIndex];
          arr[minIndex] = mid;
        }
      }
      return arr;
    },
    // 快速排序
    quickSort(arr) {
      if (arr.length <= 1) return arr
      let arr1 = [], arr2 = []
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[0]) {
          arr1.push(arr[i])
        } else {
          arr2.push(arr[i])
        }
      }
      arr1 = this.quickSort(arr1)
      arr2 = this.quickSort(arr2)
      arr1.push(arr[0])
      debugger;
      return arr1.concat(arr2)
    },
    fib(n) {
      if(n < 2) {
        return 1;
      }
      return this.fib(n-2) + this.fib(n-1);
    },
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
