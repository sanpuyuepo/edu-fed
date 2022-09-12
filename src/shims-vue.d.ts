declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
// ts 无法识别 .vue 结尾的文件
// 声明 所有以 .vue 结尾的文件模块, 其类型都是 vue 构造函数, 进行适配处理


interface Window {
  AliyunUpload: any
}