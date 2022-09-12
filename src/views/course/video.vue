<template>
  <div class="course-video">
    <el-card>
      <el-descriptions
        title="课时信息"
        border
        direction="vertical">
        <el-descriptions-item label="课程名称">{{
          courseName
        }}</el-descriptions-item>
        <el-descriptions-item label="课程章节">{{
          sectionName
        }}</el-descriptions-item>
        <el-descriptions-item label="课时名称">{{
          lessonName
        }}</el-descriptions-item>
      </el-descriptions>
      <el-form>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file"/>
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <p v-if="isUploading">视频上传进度: {{uploadPercentage}}%</p> -->
          <p v-if="isUploading">
            视频上传进度:
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="uploadPercentage"
              :status="uploadPercentage === 100 ? 'success' : undefined">
            </el-progress>
          </p>
          <P v-if="isUploadSuccess">视频转码详情: {{isTransCodeSuccess ? '转码完成 ✅' : '正在处理中, 请稍后...✍'}}</P>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCourseById } from '@/services/course'
import { getSectionById } from '@/services/course-section'
import { getLessonById } from '@/services/course-lesson'
import {
  getAliyunVideoUploadAddressAdnAuth,
  getAliyunImagUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/aliyun-upload'

export default Vue.extend({
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      courseName: '',
      sectionId: {
        type: [String, Number]
      },
      sectionName: '',
      lessonId: {
        type: [String, Number]
      },
      lessonName: '',
      uploader: null,
      imageURL: '',
      videoId: null,
      videoFile: null,
      imageFile: null,

      isUploading: false,
      uploadPercentage: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false

    }
  },
  created () {
    this.loadCourse()
    this.loadSection()
    this.loadLesson()

    this.initUploader()
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.courseName = data.data.courseName
    },
    async loadSection () {
      this.sectionId = this.$route.query.sectionId
      const { data } = await getSectionById(this.sectionId)
      this.sectionName = data.data.sectionName
    },

    async loadLesson () {
      this.lessonId = this.$route.query.lessonId
      const { data } = await getLessonById(this.lessonId)
      this.lessonName = data.data.theme
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        //  开始上传
        onUploadstarted: async (uploadInfo: any) => {
          console.log('onUploadstarted')
          // 获取文件上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageURL = data.data.imageURL
          } else {
            const fileName = uploadInfo.file.name
            // 确保先上传图片
            const imageUrl = this.imageURL
            const { data } = await getAliyunVideoUploadAddressAdnAuth(fileName, imageUrl)
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }
          // 调用 uploader.setUploadAuthAndAddres 设置上传凭证
          (this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 确认上传凭证没问题, 上传进度开始
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          console.log('onUploadSucceed...')
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          console.log('onUploadFailed...')
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (
          uploadInfo: any,
          totalSize: any,
          loadedPercent: any
        ) => {
          console.log('onUploadProgress...')
          if (!uploadInfo.isImage) {
            this.uploadPercentage = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo: any) {
          console.log('onUploadTokenExpired...')
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          this.isUploadSuccess = true
          console.log('onUploadEnd...')
          // 请求转码
          const { data } = await aliyunTransCode({
            lessonId: this.lessonId,
            coverImageUrl: this.imageURL,
            fileName: (this.videoFile as any).name,
            fileId: this.videoId
          })

          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.lessonId)
            if (data.data === 100) {
              this.isTransCodeSuccess = true
              window.clearInterval(timer)
              console.log('转码成功')
            }
          }, 3000)
        }
      })
    },

    handleUpload () {
      this.isUploading = true
      this.isTransCodeSuccess = false
      this.isUploadSuccess = false
      this.uploadPercentage = 0
      // 获取上传的文件
      this.videoFile = (this.$refs['video-file'] as any).files[0]
      this.imageFile = (this.$refs['image-file'] as any).files[0]
      // 将文件上传到上传列表, 按照添加顺序开始上传
      const uploader = this.uploader as any
      uploader.addFile(this.imageFile, null, null, null, '{"void": {}}')
      uploader.addFile(this.videoFile, null, null, null, '{"void": {}}')

      // 开始上传, 触发 onUploadstarted
      uploader.startUpload()
    }
  }
})
</script>

<style lang="scss" scoped>
.el-descriptions {
  width: 50%;
  margin-bottom: 20px;
}
.el-progress {
  width: 400px;
}
</style>
