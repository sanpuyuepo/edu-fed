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
            <el-input v-model="course.previewFirstField" placeholder="概述1" type="textarea" style="margin-bottom: 5px;">
            </el-input>
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
              <!--
                v-modal 的本质还是父子组件通信:
                1. 父组件给子组件传递一个名为 value 的数据(Props)
                2. 默认监听 input 事件, 修改绑定的数据(自定义事件)
              -->
              <upload-image v-model="course.courseListImg"></upload-image>
            </el-form-item>
            <el-form-item label="介绍封面">
              <upload-image v-model="course.courseImgUrl" :limit="5"></upload-image>
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
          <el-form-item label="销量">
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
            <el-switch v-model="openSecKill" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="openSecKill">
            <el-form-item label="开始时间">
              <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="value2" type="datetime" placeholder="选择日期时间">
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
import UploadImage from './components/UploadImage.vue'
import { saveOrUpdateCourse } from '@/services/course'

export default Vue.extend({
  name: 'CreateCourse',
  components: { UploadImage },

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
        previewFirstField: '',
        previewSecondField: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        discounts: 0,
        price: 0,
        sales: 0,
        discountsTag: '',
        // 秒杀
        activityCourse: false,
        activityCourseDTO: {
          id: 0,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
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
</style>
