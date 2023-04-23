<template>
  <div class="chat">
    <im-chat-main />
  </div>
</template>

<script>
import ImChatMain from './components/ChatWindow.vue';
import {reactive, toRefs} from "vue";
import { useRoute } from 'vue-router';
import Mepal from "@/utils/mepal";

export default {
  name: "chat",
  components: {
    ImChatMain,
  },
  setup() {
    const state = reactive({
      conversationID: '',
      customerName: '',
      pageTitle: ''
    });
    const route = useRoute();
    state.conversationID = route.query.userId;
    state.customerName = route.query.cname;
    state.pageTitle =  `${state.conversationID}${state.customerName}`
    Mepal.setTitle(state.pageTitle);
    console.log(`页面是 === ${state.pageTitle}`);

    return {
      ...toRefs(state)
    }
  },
}
</script>

<style scoped lang="scss">
.chat {
  background: #f7f8fa;
  height: 100vh;

  .header {
    padding: 10px;
  }
}
</style>
