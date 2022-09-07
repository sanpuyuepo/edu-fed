<template>
  <div class="role-list">
    <el-card class="box-card">
      <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          <el-button type="primary" @click="onSearch" :disabled="isLoading">查询</el-button>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix">
        <el-button @click="createRole">添加</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="roleList"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="角色名称"
          >
        </el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template v-slot="scope">
            <el-button size="mini" @click="handleAllocMenu(scope.row)">分配菜单</el-button>
            <el-button size="mini" @click="handleAllocResource(scope.row)">分配资源</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 创建或编辑角色对话框 -->
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="isVisible"
      width="600px">
      <create-or-edit
        v-if="isVisible"
        @success="onSuccess"
        @cancel="onCancel"
        :editInfo="editInfo"></create-or-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Form } from 'element-ui'
import { getRolePages, deleteRole } from '@/services/role'

import CreateOrEdit from './CreateOrEdit.vue'

const listDateFormatter = (list: any) => {
  list.forEach((item: any) => {
    item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
  })
}

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roleList: [],
      form: {
        name: '',
        code: '',
        // pagination, 接口需要, 页面上不需要
        currentPage: 1, // 默认查询第一页
        size: 50 // 每页大小
      },
      isLoading: true,

      // 对话框
      isEdit: false,
      isVisible: false,

      editInfo: null
    }
  },
  created () {
    this.loadRoles()
  },

  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRolePages(this.form)
      if (data.code === '000000') {
        this.roleList = data.data.records
        // 格式化创建时间
        listDateFormatter(this.roleList)
        this.isLoading = false
      }
    },

    // 重置查询条件
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadRoles()
    },

    // 条件查询
    onSearch () {
      this.loadRoles()
    },

    // 创建角色
    createRole () {
      this.isEdit = false
      this.isVisible = true
    },

    onSuccess () {
      this.isVisible = false
      this.loadRoles()
      this.editInfo = null
    },

    onCancel () {
      this.isVisible = false
      this.editInfo = null
    },

    // 编辑角色
    handleEdit (row: any) {
      this.isEdit = true
      this.isVisible = true
      this.editInfo = Object.assign({}, row) // 避免修改同步到列表上的原数据
    },

    handleDelete (row: any) {
      this.$confirm('是否确认删除?', '删除提示', {
        type: 'warning'
      })
        .then(async () => {
          // 删除操作
          const { data } = await deleteRole(row.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 更新数据
            this.loadRoles()
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.info('取消删除')
        })
    },

    handleAllocMenu (row: any) {
      this.$router.push({
        name: 'alloc-menu',
        params: {
          roleId: row.id
        }
      })
    },

    handleAllocResource (row: any) {
      this.$router.push({
        name: 'alloc-resource',
        params: {
          roleId: row.id
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped></style>
