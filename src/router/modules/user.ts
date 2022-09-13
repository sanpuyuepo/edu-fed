
import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const routes: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    requiresAuth: true,
    title: '用户管理'
  },
  children: [
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue')
    }
  ]
}

export default routes
