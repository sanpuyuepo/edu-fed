<template>
  <div class="create-course">
    <el-page-header @back="goBack" content="新增课程">
    </el-page-header>
    <el-card>
      <div slot="header">
        <!-- 也可以添加点击事件实现步骤跳转 -->
        <el-steps :active="activeStep" simple>
          <el-step
            :title="item.title"
            :icon="item.icon"
            v-for="(item, index) in steps" :key="index"
            @click.native="activeStep = index"></el-step>
        </el-steps>
      </div>
      <el-form label-width="100px" :model="course" :rules="rules" ref="ruleForm">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="brief">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述" prop="previewFirstField">
            <el-input v-model="course.previewFirstField" placeholder="概述1" type="textarea" style="margin-bottom: 5px;">
            </el-input>
            <el-input v-model="course.previewSecondField" placeholder="概述2" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名" prop="teacherDTO.teacherName">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介" prop="teacherDTO.description">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序" prop="sortNum">
            <el-input-number label="描述文字" v-model="course.sortNum"></el-input-number>
          </el-form-item>
          <div class="course-cover">
            <el-form-item label="课程封面">
              <!--
                v-model 的本质还是父子组件通信:
                https://v2.cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
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
          <el-form-item label="售价" prop="discounts">
            <el-input v-model="course.discounts" placeholder="请输入课程售价">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="原价">
            <el-input v-model="course.price" placeholder="请输入课程原价">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="course.sales" placeholder="请输入课程销量">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag" maxlength="10" show-word-limit placeholder="请输入活动标签"></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="限时秒杀开关">
            <el-switch v-model="course.activityCourse" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker v-model="course.activityCourseDTO.beginTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="course.activityCourseDTO.endTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input v-model="course.activityCourseDTO.amount" placeholder="请输入秒杀价">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input v-model="course.activityCourseDTO.stock" placeholder="请输入秒杀库存">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button v-if="activeStep !== 0" @click="activeStep--">上一步</el-button>
          <el-button v-if="activeStep !== 3" @click="activeStep++">下一步</el-button>
          <el-button v-if="activeStep === 3" type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UploadImage from './components/UploadImage.vue'
import { saveOrUpdateCourse } from '@/services/course'
import { Form } from 'element-ui'

import TextEditor from '@/components/TextEditor/index.vue'

export default Vue.extend({
  name: 'CreateCourse',
  components: { UploadImage, TextEditor },

  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-shopping-cart-1' },
        { title: '秒杀活动', icon: 'el-icon-alarm-clock' },
        { title: '课程详情', icon: 'el-icon-tickets' }
      ],
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
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
        status: 0, // 课程状态，0-草稿，1-上架
        discountsTag: '',
        // 秒杀
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0 // 库存
        },
        courseDescriptionMarkDown: '',
        autoOnlineTime: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入课程简介', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        previewFirstField: [
          { required: true, message: '请输入课程概述', trigger: 'blur' }
        ],
        'teacherDTO.teacherName': [
          { required: true, message: '请输入讲师姓名', trigger: 'blur' }
        ],
        'teacherDTO.description': [
          { required: true, message: '请输入讲师介绍', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入课程排序', trigger: 'change' }
        ],
        discounts: [
          { required: true, message: '请输入售价', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },

    async onSubmit () {
      // 校验表单
      await (this.$refs.ruleForm as Form).validate()
      const { data } = await saveOrUpdateCourse(this.course)
    }
  }
})
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
  .el-step {
    cursor: pointer;
  }
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
