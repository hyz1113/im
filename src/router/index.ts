import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import messageList from '@/views/im/messageList.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/list',
    name: 'list',
    component: messageList
  },
  {
    path: '/chat',
    name: 'chat',
    component: import('@/views/im/chat.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
