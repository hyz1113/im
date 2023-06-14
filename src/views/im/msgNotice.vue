<template>
  <div>
    dsfsdfsfs
  </div>
</template>

<script>
// import WebSocket from 'ws';
import {EventSourcePolyfill} from 'event-source-polyfill';

export default {
  name: "msgNotice",
  data() {
    return {
      ws: null, // websocket实例
      message: '', // 用于存储接收到的消息
      dlrStr: '',
      ldrStr: '',
      lrdStr: '',
      guangStr: '',
      deepStr: '',
      treeData: {
        value: '-',
        left: {
          value: '+',
          left: {
            value: 'a'
          },
          right: {
            value: '*',
            left: {
              value: 'b'
            },
            right: {
              value: '-',
              left: {
                value: 'c'
              },
              right: {
                value: 'd'
              }
            }
          }
        },
        right: {
          value: '/',
          left: {
            value: 'e'
          },
          right: {
            value: 'f'
          }
        }
      },
      treeData1: [
        {
          value: '-',
          child: [
            {
              value: '+',
              child: [
                {
                  value: 'a'
                }
              ]
            },
            {
              value: '*',
              child: [
                {
                  value: 'b'
                },
                {
                  value: '-',
                  child: [
                    {
                      value: 'c'
                    }, {
                      value: 'd'
                    }]
                }]
            }]
        }, {
          value: '/',
          child: [
            {
              value: 'e'
            }, {
              value: 'f'
            }]
        }
      ],
      treeData2: [
        {
          parent: 3,
          id: 4,
          value: 4,
        },
        {
          parent: 0,
          id: 1,
          value: 1,
        },
        {
          parent: 1,
          id: 2,
          value: 2,
        },
        {
          parent: 1,
          id: 3,
          value: 3,
        }
      ],
      tree: [{
        label: 'a',
        child: [
          {
            label: 'b',
            child: [
              {
                label: 'd',
              },
              {
                label: 'e',
              }
            ]
          },
          {
            label: 'c',
            child: [{
                label: 'f'
            }]
          }
        ]
      }]
    };
  }
  ,
  created() {
    this.deepTree(this.tree);
    console.log('深度遍历=====' + this.deepStr);
    // this.initWebSocket();

    // 冒泡排序
    // const arr = [9, 3, 8, 441, 390, 5];
    // this.sortMpao(arr);
    // this.selectSort(arr);
    // console.log(this.quickSort(arr));

    // console.log('======' + result);
    // let tt = [];
    // for(let i = 0; i <= 10; i++) {
    //   const a = this.fib(i);
    //   tt.push(a);
    // }
    // console.log(tt);
    // const str= 'abbaca';
    // const b = new Set(str);
    // console.log(b);
    //
    // const a = this.dealSpecInputStr(str);
    // console.log(a);
    // this.dlr(this.treeData);
    // console.log('前遍历======' + this.dlrStr);
    //
    // this.ldr(this.treeData);
    // console.log('中遍历======' + this.ldrStr);
    //
    // this.lrd(this.treeData);
    // console.log('后遍历======' + this.lrdStr);
    //
    // this.guangCode(this.treeData1);
    // console.log('广度遍历======' + this.deepStr);

    // const a = null;
    // console.log(Object.prototype.toString.call(a) === '[object Null]');
    //
    //
    // const b = undefined;
    // console.log(typeof b);

    // this.flatTree(this.treeData2);

    // this.hanoi(3, '柱子一', '柱子二', '柱子三');


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
      if (n < 2) {
        return 1;
      }
      return this.fib(n - 2) + this.fib(n - 1);
    },
    // 去除相邻的重复字符
    dealSpecInputStr(str) {
      const stack = [];
      for (const c of str) {
        let prev = stack.pop();
        if (prev !== c) {
          stack.push(prev);
          stack.push(c);
        }
      }
      return stack.join('');
    },
    // 前序遍历-(根-左-右)
    dlr(obj) {
      if (obj.value) {
        this.dlrStr = `${this.dlrStr}${obj.value}`
      }
      if (obj.left) {
        this.dlr(obj.left);
      }
      if (obj.left) {
        this.dlr(obj.right);
      }
    },
    // 中序遍历-(左-根-右)
    ldr(obj) {
      if (obj.left) {
        this.ldr(obj.left);
      }
      this.ldrStr = `${this.ldrStr}${obj.value}`;
      if (obj.right) {
        this.ldr(obj.right);
      }
    },
    // 后序遍历(左-右-根)
    lrd(obj) {
      if (obj.left) {
        this.lrd(obj.left);
      }
      if (obj.right) {
        this.lrd(obj.right);
      }
      this.lrdStr = `${this.lrdStr}${obj.value}`;
    },
    // 广度遍历
    guangCode(obj) {
      if (obj.length) {
        let arr = [];
        obj.forEach(item => {
          this.deepStr = `${this.deepStr}${item.value}`;
          if (item.child) {
            arr.push(...item.child);
          }
        })
        this.guangCode(arr);
      }
    },

    deepTree(tree) {
        let result = [];
        const that = this;
        tree.forEach(item => {
           this.deepStr = `${this.deepStr}${item.label}`
           if (item.child) {
             that.deepTree(item.child);
           }
        })
    },

    getTree(data = [], pid) {
      let children = data.filter(item => item.parent === pid)
      if(!children.length) return []
      data.forEach(item => {
        item.children = this.getTree(data, item.parent);
      })
      return children;
    },

    flatTree(data) {
      const tree = this.getTree(data, 0);
      console.log(tree);
    },

    hanoi (disc, begin, end, helper) {
        if (disc > 0) {
          this.hanoi(disc - 1, begin, helper, end);
          console.log('移动圆盘 ' + disc + ' 从 ' + begin + ' 到 ' + helper);
          this.hanoi(disc - 1, end, begin, helper);
        }
    },


    // const arr1 = [1,4,6,7,2,0,123,56];
    // const arr2 = [76,32,98,11,1,123];
    // this.mergeArr(arr1, arr2);
    mergeArr(arr1, arr2) {
      const a = new Set([...arr1, ...arr2]);
      const b = Array.from(a);
      debugger;
      b.sort((m, n) => {
        return n-m
      })
      console.log(b);


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
    }
    ,
    onOpen() {
      console.log('websocket连接成功');
    }
    ,
    onMessage(event) {
      console.log('收到消息：', event.data);
      this.message = event.data; // 将接收到的消息存储到data中
    }
    ,
    onClose() {
      console.log('websocket连接关闭');
    }
    ,
    onError() {
      console.log('websocket连接出错');
    }
    ,
    sendMessage() {
      this.ws.send({token: 'ST-1092-kiJIVtqCMfCrpCayL8gWNbuwpSYiam-cas-6dd9bdf7b6-ks4mx'}); // 发送消息
    }
    ,
  }
  ,
}
;
</script>

<style scoped>

</style>
