<template>
  <div class="alloc-resource">
    <el-card>
      <el-tree
        ref="tree"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckedKeys"
        :default-expanded-keys="defaultCheckedKeys"
        :data="resources"
        :props="defaultProps">
      </el-tree>
      <div class="center">
        <el-button type="warning" @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
        <!-- <el-button type="info" @click="$router.back()">取消</el-button> -->
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAllResources,
  getAllCategorise,
  getRoleResources,
  allocateRoleResources
} from '@/services/resource'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      resources: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedKeys: []
    }
  },
  created () {
    this.loadRoleResources()
    this.loadResources()
  },
  methods: {
    async loadResources () {
      const res = await Promise.all([getAllResources(), getAllCategorise()])
      const resources = res[0].data.data
      const resrcCategories = res[1].data.data

      resources.forEach((r: any) => {
        const category = resrcCategories.find((c: any) => c.id === r.categoryId)
        if (category) {
          category.children = category.children || []
          category.children.push(r)
        }
      })
      // 修改顶层分类id, 避免分类id和资源id冲突
      resrcCategories.forEach((item: any) => {
        item.id = Math.random()
      })
      this.resources = resrcCategories
    },
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        this.getCheckedResources(data.data)
      }
    },

    // 获取角色已分配资源
    getCheckedResources (roleResources: any) {
      roleResources.forEach((r: any) => {
        r.resourceList && r.resourceList.forEach((c: any) => {
          if (c.selected) {
            this.defaultCheckedKeys = [...this.defaultCheckedKeys, c.id] as any
            // 使用 push 方法需要保证先获取角色资源数据, 再获取资源数据
            // this.defaultCheckedKeys.push(c.id)
          }
        })
      })
    },

    async onSave () {
      const checkedNodes = (this.$refs.tree as Tree).getCheckedNodes()
      const resourceIdList = [] as number[]
      checkedNodes.forEach(item => {
        // 过滤没有资源的分类
        if (!item.children && item.categoryId) {
          resourceIdList.push(item.id)
        }
      })
      console.log('resourceIdList: ', resourceIdList)
      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList: resourceIdList
      })
      if (data.code === '000000') {
        this.$message.success(data.mesg)
      }
      this.$router.back()
    },

    onCancel () {
      this.$router.back()
    },

    resetChecked () {
      (this.$refs.tree as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>
.center {
text-align: center;
}
</style>
