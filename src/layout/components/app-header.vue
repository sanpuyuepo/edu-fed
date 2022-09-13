<template>
  <div class="header">
    <breadcrumb></breadcrumb>
    <el-dropdown>
    <!-- <el-dropdown @command="handleCommand"> -->
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="30"
          :src="userInfo.portrait || require('@/assets/default-avatar.png')">
        </el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
        <!-- <el-dropdown-item divided command="handleLogout">退出</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import { getUserInfo } from '@/services/user'

export default Vue.extend({
  name: 'AppHeader',
  components: {
    Breadcrumb
  },
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },

    handleLogout () {
      // 1. 清除登录状态
      this.$store.commit('setUser', null)
      // 2. 跳转到登录页面
      this.$router.push({
        name: 'login'
      })
    }

    // handleCommand (command) {
    //   if (command === 'handleLogout') {
    //     this.handleLogout()
    //   }
    // }
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
