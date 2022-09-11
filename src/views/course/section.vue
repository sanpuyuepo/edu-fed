<template>
  <div class="course-section">
    <div class="header">
      <el-page-header @back="goBack" :content="test">
      </el-page-header>
      <el-button type="primary" icon="el-icon-plus">添加章节</el-button>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson } from '@/services/course-section'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      test: 'TestName',
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },

  created () {
    this.loadSections()
  },

  methods: {
    goBack () {
      this.$router.back()
    },

    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    }

  }
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
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
