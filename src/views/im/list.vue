<template>
  <div class="test">
    <div v-for="item in List" :key="item">
        <test :data="item"/>
    </div>
  </div>
</template>

<script>
import test from "@/views/im/test";

export default {
  name: "test",
  components: {
    test
  },
  props: {
    List: {
      type: Array,
      default: [],
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
