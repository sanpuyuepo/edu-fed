/**
 * 课程管理相关请求接口
 */

import requeset from '@/utils/request'

// 分页查询课程信息
export const getCoursePagination = (data: any) => {
  return requeset({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data: data
  })
}