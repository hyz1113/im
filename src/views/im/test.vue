<template>
     <div class="test">
       <slot :obj="obj1"></slot>
     </div>
</template>

<script>
export default {
name: "test",
  props: {
     msg: {
       type: String,
       default: '默认值',
     }
  },
  data() {
  return {
    obj: {
      msg: '111111',
      msg2: '222222'
    },
    obj1: {
      msg: '444',
      msg2: '555'
    }
  }
  },
}
</script>

<style scoped lang="scss">
.test {
  background: red;
}
</style>
