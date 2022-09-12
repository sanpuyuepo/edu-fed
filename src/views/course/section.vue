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
        v-loading="isLoading"
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
        :data="sections"
        :props="defaultProps">
        <template v-slot="{ node, data }">
          <span class="inner">
            <span>{{ node.label }}</span>
            <span v-if="data.sectionName" class="actions">
              <el-button @click.stop="handleEditSectionShow(data)">编辑章节</el-button>
              <el-button type="primary" @click.stop="handleShowAddLesson(data)">添加课时</el-button>
              <el-select
                class="select-status"
                v-model="data.status"
                @change="handleSectionStatusChange(data)">
                <el-option label="已隐藏" :value="0" />
                <el-option label="待更新" :value="1" />
                <el-option label="已更新" :value="2" />
              </el-select>
            </span>
            <!-- lesson -->
            <span v-else class="actions">
              <el-button size="mini" @click="handleShowEditLesson(data, node.parent.data)">编辑</el-button>
              <el-button size="mini" type="success" @click="handleVideoUpload(data)">上传视频</el-button>
              <el-select class="select-status" size="mini"
                v-model="data.status"
                @change="handleLessonStatusChange(data)"
              >
                <el-option label="已隐藏" :value="0" />
                <el-option label="待更新" :value="1" />
                <el-option label="已更新" :value="2" />
              </el-select>
            </span>
          </span>
      </template>
      </el-tree>
    </el-card>

    <!-- 添加/编辑章节 -->
    <el-dialog
      title="添加课程阶段"
      :visible.sync="isAddSectionVisible"
    >
      <el-form ref="section-form" :model="section" :rules="sectionRules" label-width="80px">
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
    <el-dialog
      title="添加课时"
      :visible.sync="isAddLessonVisible"
    >
      <el-form ref="lesson-form" :model="lesson" :rules="lessonRules" label-width="100px">
        <el-form-item label="课程名称">
          <el-input
            :value="course.courseName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input :value="lesson.sectionName" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时名称" prop="theme">
          <el-input v-model="lesson.theme" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input v-model.number="lesson.duration" type="number" autocomplete="off">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听" prop="isFree">
          <el-switch v-model="lesson.isFree"></el-switch>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="lesson.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddLessonVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddLesson">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCourseById } from '@/services/course'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { Form } from 'element-ui'
import { saveOrUpdateLesson } from '@/services/course-lesson'

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
    const lesson = {
      courseId: this.courseId,
      sectionId: undefined,
      sectionName: '',
      theme: '',
      duration: 0,
      isFree: false,
      orderNum: 0,
      status: 0
    }
    const sectionRules = {
      sectionName: [
        { required: true, message: '请输入章节名称', trigger: 'blur' },
        { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
      ]
    }
    const lessonRules = {
      theme: [
        { required: true, message: '请输入课时名称', trigger: 'blur' },
        { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
      ],
      duration: [
        { required: true, message: '请输入课时时长', trigger: 'blur' }
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
      lesson,
      isAddSectionVisible: false,
      isAddLessonVisible: false,
      course: {},
      sectionRules,
      lessonRules,
      isLoading: false
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

    /**
     * 拖动逻辑处理: 只能平级拖动
     * @param draggingNode 拖动的节点
     * @param dropNode 放置的目标节点
     * @param type 'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
     */
    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      // console.log(draggingNode, dropNode, type)
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },

    /**
     * 拖拽成功完成时触发
     * @param dragNode 被拖拽节点对应的 Node
     * @param dropNode 结束拖拽时最后进入的节点
     * @param type 被拖拽节点的放置位置（before、after、inner）
     * @param event
     */
    async handleNodeDrop (dragNode: any, dropNode: any, type: any, event: any) {
      this.isLoading = true
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          // 判断是否有 lessonDTOS 这个字段, 注意可能为空值: null/undefined
          if ('lessonDTOS' in dragNode.data) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (error) {
        console.log(error)
        this.$message.error('排序失败')
      }
      this.isLoading = false
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

    handleAddSection () {
      // 1.表单校验
      (this.$refs['section-form'] as Form).validate(async valid => {
        if (valid) {
          await saveOrUpdateSection(this.section)
          this.loadSections()
          this.isAddSectionVisible = false;
          (this.$refs['section-form'] as Form).resetFields()
          this.$message.success('操作成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleEditSectionShow (section: any) {
      this.section = section
      this.isAddSectionVisible = true
    },
    // section 添加课程
    handleShowAddLesson (data: any) {
      this.lesson = {
        sectionName: data.sectionName,
        sectionId: data.id,
        courseId: this.courseId,
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      }
      this.isAddLessonVisible = true
    },
    handleAddLesson () {
      // 1.表单校验
      (this.$refs['lesson-form'] as Form).validate(async valid => {
        if (valid) {
          // 2. 校验通过, 发送请求
          await saveOrUpdateLesson(this.lesson)
          this.loadSections()
          this.isAddLessonVisible = false;
          (this.$refs['lesson-form'] as Form).resetFields()
          this.$message.success('操作成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 更改section状态
    async handleSectionStatusChange (section: any) {
      await saveOrUpdateSection(section)
      this.$message.success('操作成功')
    },

    /* lesson handler */
    handleShowEditLesson (lesson: any, section: any) {
      this.lesson = lesson
      this.lesson.sectionName = section.sectionName
      this.isAddLessonVisible = true
    },

    // video
    handleVideoUpload (lesson: any) {
      this.$router.push({
        name: 'course-video',
        params: {
          courseId: this.courseId
        },
        query: {
          sectionId: lesson.sectionId,
          lessonId: lesson.id
        }
      })
    },

    async handleLessonStatusChange (lesson: any) {
      await saveOrUpdateLesson(lesson)
      this.$message.success('操作成功')
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

:deep .el-tree-node__content {
  height: auto;
}

.select-status {
  max-width: 90px;
  margin-left: 8px;
}

.lessonBtn {
  font-size: 12px;
}
</style>
