/**
 * 资源相关请求模块
 */

import request from '@/utils/request'

export const getAllResources = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

// 查询资源分类列表
export const getAllCategorise = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 分页查询
export const getPaginationResource = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data: data
  })
}

// 保存或更新资源
export const createOrUpdateResource = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data: data
  })
}

// 删除资源
export const deleteResource = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
