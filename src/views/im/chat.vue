<template>
  <div class="chat">
    jfsljflksjflksjfsljflksjflsjfsljflskflsjflskfjslkjfslk
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
    alert('111')
    const state = reactive({
      conversationID: '',
      customerName: '',
      pageTitle: ''
    });
    alert('333')
    const route = useRoute();
    alert('555')
    state.conversationID = route.query.userId;
    state.customerName = route.query.cname;
    alert(JSON.stringify(state))
    state.pageTitle = `${state.conversationID}_${state.customerName}`
    Mepal.setTitle({title: state.pageTitle});

    alert('设置了页面' + state.pageTitle)

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
