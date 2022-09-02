<template>
  <div id="app">
    <h1>APP</h1>
    <!-- 根路由出口 -->
    <router-view />

    <p class="text">Hello Vue</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App'
})
</script>

<style lang="scss" scoped>
  .text {
    color: $warning-color;
  }
</style>
