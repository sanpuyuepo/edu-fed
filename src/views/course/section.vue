<template>
  <div class="course-section">
    <div class="header">
      <el-page-header @back="goBack" :content="test">
      </el-page-header>
      <el-button type="primary" icon="el-icon-plus" @click="handleShowAddSection">添加章节</el-button>
    </div>

    <el-card>
      <el-tree
        draggable
        :data="sections"
        :props="defaultProps">
        <span class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button size="small">编辑</el-button>
            <el-button size="small" type="primary">添加课时</el-button>
            <el-button size="small">状态</el-button>
          </span>
          <!-- lesson -->
          <span v-else class="actions">
            <el-button size="small">编辑</el-button>
            <el-button size="small">上传视频</el-button>
            <el-button size="small">状态</el-button>
          </span>
        </span>
      </el-tree>
    </el-card>

    <!-- 添加/编辑章节 -->
    <el-dialog
      title="添加课程阶段"
      :visible.sync="isAddSectionVisible"
    >
      <el-form ref="section-form" :model="section" :rules="rules" label-width="80px">
        <el-form-item label="课程名称">
          <el-input
            :value="course.courseName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="section.sectionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input v-model="section.description" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input-number v-model="section.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddSectionVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSection">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加/编辑课时 -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCourseById } from '@/services/course'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    const section = {
      courseId: this.courseId,
      sectionName: '',
      description: '',
      orderNum: 0,
      status: 0
    }
    const rules = {
      sectionName: [
        { required: true, message: '请输入章节名称', trigger: 'blur' },
        { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
      ]
    }
    return {
      test: 'TestName',
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      },
      section,
      isAddSectionVisible: false,
      course: {},
      rules
    }
  },

  created () {
    this.loadSections()
    this.loadCourse()
  },

  methods: {
    goBack () {
      this.$router.back()
    },

    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.course = data.data
    },

    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },

    handleShowAddSection () {
      this.section = { // 防止数据还是编辑时获取的数据
        courseId: this.courseId,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      }
      this.isAddSectionVisible = true
    },

    async handleAddSection () {
      // 1.表单校验
      (this.$refs['section-form'] as Form).validate(async valid => {
        if (valid) {
          // 2. 校验通过, 发送请求
          const { data } = await saveOrUpdateSection(this.section)
          this.loadSections()
          this.isAddSectionVisible = false;
          (this.$refs['section-form'] as Form).resetFields()
          this.$message.success('操作成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-card {
  margin-top: 20px;
}
.inner {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>
