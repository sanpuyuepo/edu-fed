import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

const redirectLogin = function () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const refreshToken = function () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用一次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

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

// Add a response interceptor

// refresh Token flag
let isRefreshing = false
// 存储刷新 token 之前发送失败的请求 401
let requests: any[] = []
request.interceptors.response.use(function (response) {
  // 如果是自定义错误状态码, 错误处理在这里
  return response
}, async function (error) {
  // 如果使用 HTTP 状态码, 错误处理在这里
  if (error.response) {
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效(未提供token, token无效, token 过期了)
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        // 尝试刷新获取新的 token
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 刷新token成功
          store.commit('setUser', res.data.content)
          // 执行 requests 中挂起的请求
          requests.forEach(cb => cb())
          // 重置 requests 数组
          requests = []
          return request(error.config)
        }).catch(err => {
          console.log(err)
          // 清除当前登录用户状态
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          // 重置刷新状态
          isRefreshing = false
        })
      }

      // ! 刷新状态下挂起请求(通过返回一个pending状态的promise), 放到 requests 数组
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限, 请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误, 请联系管理员')
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    Message.error('请求超时, 请刷新重试')
  } else {
    // Something happened in setting up the request that triggered an Error
    Message.error(`请求失败: ${error.message}`)
  }
  return Promise.reject(error)
})

export default request

/*
^ Token 过期问题
access_token: 获取需要授权的接口数据
expire_in: 过期事件
refresh_token: 刷新获取新的 access_token

? 为什么 access_token 需要过期时间以及为什么过期时间比较短: 安全

方法1: 请求拦截
在请求发起前拦截请求, 判断 token 是否过期, 如果过期, 则先刷新token后再继续请求
优点: 在请求前拦截, 少发送一次请求, 省流量
缺点: 需要后端额外提供一个token过期时间的字段; 使用本地时间判断, 若本地时间被篡改, 特别是本地时间比服务器时间慢时, 拦截会失败

方法2: 响应拦截
先发起请求, 接口返回过期后,先刷新 token, 再发送一次请求
优点: 不需额外的 token 过期字段, 不需要判断时间
缺点: 多消耗一次请求, 耗流量

综上: 两个方法优缺点互补, 方法1 有校验失败的风险, 方法2 简单粗暴
*/
