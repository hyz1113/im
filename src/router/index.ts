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
  {
    path: '/notice',
    name: 'notice',
    component: import('@/views/im/msgNotice.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
