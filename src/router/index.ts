import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import messageList from '@/views/im/messageList.vue';
import chat from '@/views/im/chat.vue';
import notice from '@/views/im/msgNotice.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/list',
    name: 'list',
    component: messageList
  },
  {
    path: '/chat',
    name: 'chat',
    component: chat
  },
  {
    path: '/notice',
    name: 'notice',
    component: notice
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
