<template>
  <div class="chat">
    <im-chat-main />
  </div>
</template>

<script>
import ImChatMain from './components/ChatWindow.vue';
import { im } from '@/api/im/api'
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
    state.pageTitle = `${state.conversationID}_${state.customerName}`
    Mepal.setTitle({title: state.pageTitle});

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
  overflow-x: hidden;

  .header {
    padding: 10px;
  }
}
</style>
