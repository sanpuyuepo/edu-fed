/**
 * 课程章节-课时相关请求接口
 */

import requeset from '@/utils/request'

// 保存或更新课时
export const saveOrUpdateLesson = (data: any) => {
  return requeset({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data: data
  })
}

// 通过Id获取课时
export const getLessonById = (lessonId: number | string) => {
  return requeset({
    method: 'GET',
    url: '/boss/course/lesson/getById',
    params: {
      lessonId
    }
  })
}
