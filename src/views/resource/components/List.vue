<template>
  <div class="resource-list">
    <el-card class="box-card">
      <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="searchForm.url" placeholder="资源路径"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="searchForm.categoryId" placeholder="资源分类">
            <!-- <el-option label="全部"></el-option> -->
            <el-option
            v-for="item in allCategories" :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          <el-button type="primary" @click="onSearch" :disabled="isLoading">查询</el-button>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix">
        <el-button @click="openDialog">添加</el-button>
        <el-button @click="$router.push({ name: 'menu-create'})">资源分类</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="resourceList"
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
          label="资源名称"
          >
        </el-table-column>
        <el-table-column
          align="center"
          prop="url"
          label="资源路径">
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
      <!-- pagination -->
      <el-pagination
        background
        :disabled="isLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- form dialog -->
    <create-or-edit
      :editInfo="editInfo"
      :showDialog="showDialog"
      :categories="allCategories"
      v-if="showDialog"
      @closeDialog="closeDialog"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import CreateOrEdit from './CreateOrEdit.vue'
import { getPaginationResource, getAllCategorise, deleteResource } from '@/services/resource'
import { Form } from 'element-ui'

const listDateFormatter = (list: any) => {
  list.forEach((item: any) => {
    item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
  })
}

export default Vue.extend({
  name: 'ResourceList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      allCategories: [],
      resourceList: [],
      searchForm: {
        name: '',
        url: '',
        categoryId: null,
        // pagination
        currentPage: 1, // 默认查询第一页
        size: 10 // 每页大小
      },
      editInfo: {
        isEdit: false,
        resource: {}
      },
      showDialog: false,
      isLoading: true,
      // pagination
      total: 0
    }
  },
  created () {
    this.loadResources()
    this.loadAllCategories()
  },

  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getPaginationResource(this.searchForm)
      if (data.code === '000000') {
        this.total = data.data.total
        this.resourceList = data.data.records
        // 格式化创建时间
        listDateFormatter(this.resourceList)
        this.isLoading = false
      }
    },

    async loadAllCategories () {
      const { data } = await getAllCategorise()
      if (data.code === '000000') {
        this.allCategories = data.data
      }
    },

    // 重置查询条件
    onReset () {
      (this.$refs.searchForm as Form).resetFields()
      this.searchForm.currentPage = 1
      this.loadResources()
    },

    // 条件查询
    onSearch () {
      this.loadResources()
    },

    openDialog () {
      this.editInfo.isEdit = false
      this.showDialog = true
    },

    closeDialog () {
      this.showDialog = false
      this.loadResources()
    },

    handleEdit (row: any) {
      this.editInfo.isEdit = true
      this.showDialog = true
      this.editInfo.resource = row
    },
    handleDelete (row: any) {
      this.$confirm('是否确认删除?', '删除提示', {
        type: 'warning'
      })
        .then(async () => {
          // 删除操作
          const { data } = await deleteResource(row.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 更新数据
            this.loadAllResources()
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.info('取消删除')
        })
    },

    // pagination
    async handleSizeChange (val: number) {
      this.searchForm.size = val
      this.searchForm.currentPage = 1
      this.loadResources()
    },
    async handleCurrentChange (val: number) {
      this.searchForm.currentPage = val
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped></style>
