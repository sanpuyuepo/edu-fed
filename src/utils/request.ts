import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // 配置选项
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么: 改写配置信息实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    // 这样写会报ts错误
    // config.headers.Authorization = user.access_token
    if (config.headers) {
      config.headers.Authorization = user.access_token
    }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器

export default request
