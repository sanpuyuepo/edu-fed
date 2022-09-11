/**
 * 课程-章节相关请求接口
 */

import requeset from '@/utils/request'

// 获取课程章节
export const getSectionAndLesson = (courseId: number | string) => {
  return requeset({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 保存或更新章节
export const saveOrUpdateSection = (data: any) => {
  return requeset({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data: data
  })
}

// 获取章节课程
export const getBySectionId = (data: any) => {
  return requeset({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    data: data
  })
}
