<template>
  <div id="app">
    <h1>APP</h1>
    <p>{{a}}</p>
    <button @click="test">Test</button>
    <!-- 根路由出口 -->
    <router-view/>
  </div>
</template>

<script lang="ts">
// ^ 1. TypeScript支持: 基本用法, Options API, 推荐
/* import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      a: 1,
      b: '2',
      c: {
        a: 1,
        b: '2'
      }
    }
  },
  methods: {
    test () {
      console.log(this.a)
    }
  }
}) */

// ^ 2. TypeScript支持: 基于 类 的组件, Class API, 使用 vue-class-component /vue-property-decrator 装饰器
import Vue from 'vue'
import Component from 'vue-class-component'

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class App extends Vue {
  a = 1
  b = '2'
  c = {
    a: 1,
    b: '2'
  }

  test () {
    console.log(this.a)
    // this.b.
  }
}

</script>

<style lang="scss">

</style>
