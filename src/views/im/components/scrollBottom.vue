<template>
  <div class="content">
      <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  mounted() {
     window.onscroll = this.handleScroll;
  },
   methods: {
     handleScroll() {
       // 获取滚动的距离
       let scrollTop=document.documentElement.scrollTop;
       if(scrollTop === 0){
         console.log("=========我到顶了============");
         this.$emit('scrollTopGetList');
       }
     },
   },
}
</script>

<style scoped lang="scss">
.content {
  overflow: scroll;
}
</style>
