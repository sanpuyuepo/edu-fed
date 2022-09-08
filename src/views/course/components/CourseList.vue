<template>
  <div class="course-list">
    <el-card>
      <div class="head">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="课程名称">
            <el-input v-model="formInline.courseName" placeholder="课程名称"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formInline.status">
              <el-option
                v-for="(item, index) in statuses" :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button class="add-course" type="primary" icon="el-icon-plus">新建课程</el-button>
      </div>
      <el-table
        :data="courses"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="80">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="350">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格(¥)">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="上架状态">
          <template v-slot="scope">
            <el-tooltip
              :content="scope.row.status === 1 ? '已上架' : '已下架'"
              placement="left">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                :disabled="scope.row.isStatusLoading"
                @change="changeState(scope.row)">
              </el-switch>
          </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template v-slot="scope">
            <!-- <el-button size="small">上架</el-button> -->
            <el-button
              size="small"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="formInline.currentPage"
          :page-sizes="[20, 30, 50]"
          :page-size="formInline.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCoursePagination, changeCourseState } from '@/services/course'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      formInline: {
        courseName: '',
        status: '', // 默认不传, 上架: '1', 下架: '0'
        currentPage: 1,
        pageSize: 20
      },
      statuses: [
        {
          name: '全部',
          value: ''
        },
        {
          name: '上架',
          value: '1'
        },
        {
          name: '下架',
          value: '0'
        }
      ],
      courses: [],
      total: 0
    }
  },
  created () {
    this.loadCourses()
  },

  methods: {
    async loadCourses () {
      const { data } = await getCoursePagination(this.formInline)
      this.total = data.data.total
      // 添加字段用于设置 changeState 时禁用 Switch 组件
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
    },

    onSubmit () {
      this.loadCourses()
    },

    async changeState (row: any) {
      row.isStatusLoading = true
      await changeCourseState(row.id, row.status)
      this.$message.success(`${row.status === 0 ? '下架' : '上架'}成功`)
      row.isStatusLoading = false
    },

    handleEdit (row: any) {
      console.log(row)
    },

    handleSizeChange (val: number) {
      this.formInline.pageSize = val
      this.formInline.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val: number) {
      this.formInline.currentPage = val
      this.loadCourses()
    }
  }
})
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  // align-items: center;
  justify-content: space-between;
}
.add-course {
  align-self: flex-start;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
