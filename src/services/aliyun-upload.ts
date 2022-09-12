/**
 * 阿里云上传相关请求接口
 */

import requeset from '@/utils/request'

// 获取阿里云图片上传凭证
export const getAliyunImagUploadAddressAdnAuth = () => {
  return requeset({
    method: 'GET',
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
  })
}

// 获取阿里云视频上传凭证
export const getAliyunVideoUploadAddressAdnAuth = (fileName: any, imageUrl: any) => {
  return requeset({
    method: 'GET',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params: {
      fileName,
      imageUrl
    }
  })
}

// 阿里云转码请求
export const aliyunTransCode = (data: any) => {
  return requeset({
    method: 'POST',
    url: '/boss/course/upload/aliyunTransCode.json',
    data
  })
}

// 获取阿里云转码进度
export const getAliyunTransCodePercent = (lessonId: string | number) => {
  return requeset({
    method: 'GET',
    url: '/boss/course/upload/aliyunTransCodePercent.json',
    params: {
      lessonId
    }
  })
}

// 刷新阿里云视频上传凭证
export const refreshAliyunVideoUploadAddressAdnAuth = (videoId: any) => {
  return requeset({
    method: 'GET',
    url: '/boss/course/upload/refreshAliyunVideoUploadAddressAdnAuth.json',
    params: {
      videoId
    }
  })
}
