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

      // 尝试刷新获取新的 token, 新建一个axios实例处理
      try {
        const { data } = await axios.create()({
          method: 'POST',
          url: '/front/user/refresh_token',
          data: qs.stringify({
            refreshtoken: store.state.user.refresh_token
          })
        })
        // 把成功刷新拿到的新的 access_token, 更新到容器和本地存储中
        store.commit('setUser', data.content)
        // 重新发送本次失败的请求
        return request(error.config)
      } catch (err) {
        // 清除当前登录用户状态
        store.commit('setUser', null)
        redirectLogin()
        return Promise.reject(error)
      }
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

方法1:
在请求发起前拦截请求, 判断 token 是否过期, 如果过期, 则先刷新token后再继续请求
优点: 在请求前拦截, 少发送一次请求, 省流量
缺点: 需要后端额外提供一个token过期时间的字段; 使用本地时间判断, 若本地时间被篡改, 特别是本地时间比服务器时间慢时, 拦截会失败

方法2:
先发起请求, 接口返回过期后,先刷新 token, 再发送一次请求
优点: 不需额外的 token 过期字段, 不需要判断时间
缺点: 多消耗一次请求, 耗流量

综上: 两个方法优缺点互补, 方法1 有校验失败的风险, 方法2 简单粗暴
*/
