import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import routes from './modules/index'

Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const router = new VueRouter({
  routes
})

// ^ 导航守卫: 全局前置守卫
// to: 即将要进入的目标 用一种标准化的方式
// from: 当前导航正要离开的路由 用一种标准化的方式
// next: 可选, 允许通行
router.beforeEach((to, from, next) => {
  // if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // else next()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.user) {
      next({
        name: 'login',
        query: { // 通过 url 传递查询字符串参数
          redirect: to.fullPath // 把登录成功后需要返回的页面告诉登录页面, 在登录成功后重定向到之前访问的页面
        }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
