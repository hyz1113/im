<template>
  <div>
    UID + 客户名 + chat
    <im-chat-main />
  </div>
</template>

<script>
import ImChatMain from './components/ChatWindow.vue';
export default {
  name: "chat",
  components: {
    ImChatMain,
  },
}
</script>

<style scoped lang="scss">

</style>
