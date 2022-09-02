const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 全局样式变量共享:
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import \'@/styles/variables.scss\';'
      }
    }
  }
})
