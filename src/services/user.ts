/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
// 转换发送的数据格式
import qs from 'qs'

// 参数类型指定
interface User {
  phone: string,
  password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // axios 默认发送数据格式为 Content-Type: application/json, 其他方式参考 axios 官方文档
    // 如果 data 是普通对象, 则 Content-Type 是 application/json
    // 如果 data 是 qs.stringify(data), 转换之后的数据: key=value & key=value, 则 Content-Type 会被设置为 application/x-www-form-urlencoded
    // 如果 data 是 FormData 对象, 则 Content-Type 是 multipart/form-data
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // axios 使用请求拦截器统一设置Token, 这里就不需要了
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}

// 分页查询用户信息 /boss/user/getUserPages
export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data: data
  })
}
