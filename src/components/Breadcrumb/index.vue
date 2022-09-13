<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item, index) in routeRecords"
        :key="index">
        {{item.meta.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BreadCrumb',
  computed: {
    routeRecords () {
      // return this.$route.matched
      return this.$route.matched.filter(item => Object.keys(item.meta).length !== 0)
    }
  }
})
</script>

<style lang="scss" scoped></style>
