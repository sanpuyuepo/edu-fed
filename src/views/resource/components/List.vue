<template>
  <div class="resource-list">
    <el-card class="box-card">
      <el-form :inline="true" :model="searchCondition" class="demo-form-inline">
        <el-form-item label="资源名称">
          <el-input v-model="searchCondition.name" placeholder="资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源路径">
          <el-input v-model="searchCondition.url" placeholder="资源路径"></el-input>
        </el-form-item>
        <el-form-item label="资源分类">
          <el-select v-model="searchCondition.categoryId" placeholder="资源分类">
            <!-- <el-option label="全部"></el-option> -->
            <el-option
            v-for="item in allCategories" :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix">
        <el-button @click="openDialog">添加</el-button>
        <el-button @click="$router.push({ name: 'menu-create'})">资源分类</el-button>
      </div>
      <el-table
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
    </el-card>
    <!-- form dialog -->
    <create-or-edit :editInfo="editInfo" :showDialog="showDialog" :categories="allCategories" v-if="showDialog" @closeDialog="closeDialog"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './CreateOrEdit.vue'
import { getAllResources, getAllCategorise, deleteResource } from '@/services/resource'

export default Vue.extend({
  name: 'ResourceList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      allCategories: [],
      resourceList: [],
      searchCondition: {
        name: '',
        url: '',
        categoryId: ''
      },
      editInfo: {
        isEdit: false,
        resource: {}
      },
      showDialog: false
    }
  },
  created () {
    this.loadAllResources()
    this.loadAllCategories()
  },

  methods: {
    async loadAllResources () {
      const { data } = await getAllResources()
      if (data.code === '000000') {
        this.resourceList = data.data
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
      this.searchCondition.name = ''
      this.searchCondition.url = ''
      this.searchCondition.categoryId = ''
    },

    // 条件查询
    onSearch () {
      console.log('Searching...')
      console.log(this.searchCondition)
    },

    openDialog () {
      this.editInfo.isEdit = false
      this.showDialog = true
    },

    closeDialog () {
      this.showDialog = false
      this.loadAllResources()
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
    }
  }
})
</script>

<style lang="scss" scoped></style>
