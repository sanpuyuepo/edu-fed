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

// 课程上下架
export const changeCourseState = (courseId: string, status: string) => {
  return requeset({
    method: 'GET',
    url: '/boss/course/changeState',
    params: {
      courseId,
      status
    }
  })
}

// 保存或者更新课程信息
export const saveOrUpdateCourse = (data: any) => {
  return requeset({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data: data
  })
}

// 上传图片:
// 接口数据类型: multipart / form-data, 提交类型: FormData 对象
export const uploadImg = (data: any, onUploadProgress?: (progressEvent: any) => void) => {
  return requeset({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // H5: 上传响应事件
    onUploadProgress
  })
}
