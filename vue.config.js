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
  },
  devServer: {
    proxy: {
      '/boss': {
        target: 'http://eduboss.lagounews.com',
        ws: true,
        changeOrigin: true // 把请求头中的 host 配置为 target
      },
      '/front': {
        target: 'http://edufront.lagounews.com',
        changeOrigin: true
      }
    }
  }
})
