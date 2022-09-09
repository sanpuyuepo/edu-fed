<template>
  <div class="create-course">
    <el-page-header @back="goBack" content="新增课程">
    </el-page-header>
    <el-card>
      <div slot="header">
        <!-- 也可以添加点击事件实现步骤跳转 -->
        <el-steps :active="activeStep" simple>
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
          <el-step title="销售信息" icon="el-icon-shopping-cart-1"></el-step>
          <el-step title="秒杀活动" icon="el-icon-alarm-clock"></el-step>
          <el-step title="课程详情" icon="el-icon-tickets"></el-step>
        </el-steps>
      </div>
      <el-form label-width="100px">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input v-model="course.previewFirstField" placeholder="概述1" type="textarea" style="margin-bottom: 5px;"></el-input>
            <el-input v-model="course.previewSecondField" placeholder="概述2" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number label="描述文字" v-model="course.sortNum"></el-input-number>
          </el-form-item>
          <div class="course-cover">
            <el-form-item label="课程封面">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="handleUpload">
                <img v-if="course.courseListImg" :src="course.courseListImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">建议尺寸：230*300px，JPG、PNG格式，图片小于150K</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="介绍封面">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :before-upload="beforeUpload">
                <img v-if="course.courseImgUrl" :src="course.courseImgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">建议尺寸：750*422px，JPG、PNG格式，图片小于150K</div>
              </el-upload>
            </el-form-item>
          </div>
        </div>
        <div v-show="activeStep === 1">
          <el-form-item label="售价">
            <el-input placeholder="请输入课程售价">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="原价">
            <el-input placeholder="请输入课程原价">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量" >
            <el-input placeholder="请输入课程销量">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input maxlength="10" show-word-limit placeholder="请输入活动标签"></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="openSecKill"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="openSecKill">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="value2"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input placeholder="请输入秒杀价">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input placeholder="请输入秒杀库存">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="课程详情">
            <el-input type="textarea"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button v-if="activeStep !== 0" @click="activeStep--">上一步</el-button>
          <el-button v-if="activeStep !== 3" @click="activeStep++">下一步</el-button>
          <el-button v-if="activeStep === 3" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse, uploadImg } from '@/services/course'

export default Vue.extend({
  name: 'CreateCourse',
  data () {
    return {
      activeStep: 0,
      course: {
        id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          id: 0,
          courseId: 0,
          teacherName: '',
          position: '',
          description: ''
        },
        previewFirstField: '', // 课程概述1
        previewSecondField: '', // 课程概述2
        courseListImg: '', // 课程封面
        courseImgUrl: '', // 介绍封面
        sortNum: 0, // 课程排序
        discounts: 0, // 售价(优惠价)
        price: 0, // 原价
        sales: 0, // 销量
        discountsTag: '', // 活动标签
        // 秒杀
        activityCourse: false,
        activityCourseDTO: {
          id: 0, // 活动课程id
          courseId: 0, // 课程id
          beginTime: '',
          endTime: '',
          amount: 0, // 活动价格
          stock: 0 // 库存
        },
        courseDescriptionMarkDown: '',
        autoOnlineTime: ''
      },

      // 秒杀
      openSecKill: false,
      value1: '',
      value2: ''
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },

    // 封装自定义上传行为
    async handleUpload (options: any) {
      // console.log(options)
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadImg(fd)
      this.course.courseListImg = data.data.name
    },

    beforeUpload (file: any) {
      // const isPNG = file.type === 'image/png'
      const isJPGOrPNG = file.type === ('image/jpeg' || 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGOrPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      // return isJPG || isPNG
      return isJPGOrPNG && isLt2M
    }
  }
})
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px;

  .el-form {
    padding: 0 70px 0 30px;
  }
  .course-cover {
    display: flex;
    gap: 10%;

    .el-upload__tip {
      margin-top: -12px;
      padding: 0px 10px;
      border-radius: 5px;
      background: #f3f4f5;
      border: 1px solid #e7e8ea
    }
  }
}
// 深度作用选择器: scoped 样式中的一个选择器能够作用得“更深”
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 146px;
  height: 146px;
  line-height: 146px;
  text-align: center;
}
.avatar {
  width: 146px;
  height: 146px;
  display: block;
}
</style>
