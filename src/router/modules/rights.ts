
import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const routes: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    requiresAuth: true, // 自定义数据
    title: '权限管理'
  }, // meta 默认为空对象
  children: [
    {
      path: '/role',
      name: 'role',
      component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
      meta: {
        title: '菜单管理'
      }
    },
    {
      path: '/resource',
      name: 'resource',
      component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
      meta: {
        title: '资源管理'
      }
    },
    {
      path: '/menu/create',
      name: 'menu-create',
      component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue'),
      meta: {
        title: '新建菜单'
      }
    },
    {
      path: '/menu/:id/edit',
      name: 'menu-edit',
      component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue'),
      meta: {
        title: '编辑菜单'
      }
    },
    // role-management
    {
      path: '/role/:roleId/alloc-menu',
      name: 'alloc-menu',
      component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
      props: true, // ^ 将路由路径中的动态参数(eg. :roleId)映射到组件的 props 数据中, 实现解耦
      meta: {
        title: '分配角色'
      }
    },
    {
      path: '/role/:roleId/alloc-resource',
      name: 'alloc-resource',
      component: () => import(/* webpackChunkName: 'alloc-resource' */ '@/views/role/alloc-resource.vue'),
      props: true,
      meta: {
        title: '分配资源'
      }
    }
  ]
}

export default routes
