import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css' // 全局样式中加载
import App from './App.vue'
import router from './router'
import store from './store'

import './styles/index.scss' // 导入全局样式

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
