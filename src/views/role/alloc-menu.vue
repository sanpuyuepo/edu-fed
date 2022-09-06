<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        ref="menu-tree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :data="menus"
        :props="defaultProps">
      </el-tree>
      <div class="center">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
  </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadRoleMenus()
    this.loadMenus()
  },
  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },

    // 获取角色已分配菜单(权限)
    getCheckedMenu (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          if (!menu.subMenuList) {
            this.checkedKeys.push(menu.id as never)
          } else {
            const isAllSelected = menu.subMenuList.every((item: any) => item.selected)
            if (isAllSelected) {
              this.checkedKeys.push(menu.id)
            }
          }
        }
        if (menu.subMenuList) {
          this.getCheckedMenu(menu.subMenuList)
        }
      })
    },

    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedMenu(data.data)
      }
    },

    async onSave () {
      // 获取选中节点的列表
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: menuIdList
      })
      if (data.code === '000000') {
        this.$message.success(data.mesg)
      }
      this.$router.back()
    },

    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }

})
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
}
</style>
