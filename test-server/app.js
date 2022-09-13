const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// 托管静态资源, 默认查找静态目录中 index.html
app.use(express.static(path.join(__dirname, '../dist')))

app.use('/boss', createProxyMiddleware({
  target: 'http://eduboss.lagounews.com',
  changeOrigin: true
}))

app.use('/front', createProxyMiddleware({
  target: 'http://edufront.lagounews.com',
  changeOrigin: true
}))

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.listen(3000, () => {
  console.log('running at http://localhost:3000/')
})
