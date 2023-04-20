<template>
  <div>
    {{ conversationID }}====== {{ customerName }}
    <im-chat-main />
  </div>
</template>

<script>
import ImChatMain from './components/ChatWindow.vue';
import {reactive, toRefs} from "vue";
import { useRoute } from 'vue-router';
export default {
  name: "chat",
  components: {
    ImChatMain,
  },
  setup() {
    const state = reactive({
      conversationID: '',
      customerName: '',
    });
    const route = useRoute();
    state.conversationID = route.query.userId;
    state.customerName = route.query.cname;

    return {
      ...toRefs(state)
    }
  },
}
</script>

<style scoped lang="scss">

</style>
