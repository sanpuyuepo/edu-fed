import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器状态实现数据共享, 在组件访问方便, 但是没有持久化的功能
  state: {
    user: JSON.parse(localStorage.getItem('user') || 'null') // 当前登录用户状态
  },
  getters: {
  },
  mutations: {
    // 修改数据必须使用 mutation 函数
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 防止刷新丢失数据, 进行数据持久化
      localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
