<template>
  <el-container>
      <el-aside width="200px">
        <AppAside ></AppAside>
      </el-aside>
      <el-container>
        <el-header>
          <AppHeader></AppHeader>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AppHeader from './components/app-header.vue'
import AppAside from './components/app-aside.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    AppHeader,
    AppAside
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  min-width: 980px;
}
.el-aside {
  background: #bfc;
}

.el-header {
  background: #f8f9fa;
}

.el-main {
  background: yellow;
}
</style>
