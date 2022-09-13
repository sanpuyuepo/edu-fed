
import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const routes: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    requiresAuth: true,
    title: '课程管理'
  },
  children: [
    {
      path: '/course',
      name: 'course',
      component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
      meta: {
        // title: '课程管理'
      }
    },
    {
      path: '/course/new',
      name: 'create-course',
      component: () => import(/* webpackChunkName: 'create-course' */ '@/views/course/create.vue'),
      meta: {
        title: '新建课程'
      }
    },
    {
      path: '/course/:courseId/edit',
      name: 'edit-course',
      component: () => import(/* webpackChunkName: 'edit-course' */ '@/views/course/edit.vue'),
      props: true,
      meta: {
        title: '编辑课程'
      }
    },
    {
      path: '/course/:courseId/section',
      name: 'course-section',
      component: () => import(/* webpackChunkName: 'course-section' */ '@/views/course/section.vue'),
      props: true,
      meta: {
        title: '课程章节'
      }
    },
    {
      path: '/course/:courseId/video',
      name: 'course-video',
      component: () => import(/* webpackChunkName: 'course-video' */ '@/views/course/video.vue'),
      props: true,
      meta: {
        title: '上传视频'
      }
    }
  ]
}

export default routes
