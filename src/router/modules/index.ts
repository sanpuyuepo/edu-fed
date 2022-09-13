import { RouteConfig } from 'vue-router'
// 布局组件
import Layout from '@/layout/index.vue'

import rightsRoutes from './rights'
import courseRoutes from './course'
import userRoutes from './user'
import advertRoutes from './advert'

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true // 自定义数据
    }, // meta 默认为空对象
    // 嵌套路由
    children: [
      {
        path: '', // 默认子路由, 推荐
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue')
      }
    ]
  },
  rightsRoutes,
  courseRoutes,
  userRoutes,
  advertRoutes,
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

export default routes
