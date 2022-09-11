/**
 * 课程章节相关请求接口
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
