<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'menu-create'})">添加菜单</el-button>
      </div>
      <el-table
        :data="menuList"
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
          label="菜单名称"
          >
        </el-table-column>
        <el-table-column
          align="center"
          prop="levelDesc"
          label="菜单级数">
        </el-table-column>
        <el-table-column
          align="center"
          prop="icon"
          label="前端图标">
        </el-table-column>
        <el-table-column
          align="center"
          prop="orderNum"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menuList: []
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.menuList = data.data
        // 添加菜单级数说明
        this.menuList.forEach(item => {
          item.levelDesc = item.level === 0 ? '一级' : '二级'
        })
      }
    },

    handleEdit (index: number, row: any) {
      console.log(index, row)
    },
    handleDelete (row: any) {
      this.$confirm('是否确认删除?', '删除提示', {})
        .then(async () => {
          // 删除操作
          const { data } = await deleteMenu(row.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 更新数据
            this.loadAllMenus()
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.info('取消删除')
        })
      console.log(row)
    }
  }
})

</script>

<style lang="scss" scoped></style>
