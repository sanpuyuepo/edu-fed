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
    // axios 默认发送数据格式为: application/json, 其他方式参考 axios 官方文档
    // data: this.form
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}
