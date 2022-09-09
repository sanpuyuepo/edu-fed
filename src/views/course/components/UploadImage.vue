<template>
  <div class="uploadImage">
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="handleUpload">
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div slot="tip" class="el-upload__tip">建议尺寸：230*300px，JPG、PNG格式，图片小于150K</div>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { uploadImg } from '@/services/course'
import Vue from 'vue'

export default Vue.extend({
  name: 'UploadImage',
  props: {
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  methods: {
    // 封装自定义上传行为
    async handleUpload (options: any) {
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadImg(fd)
      this.$emit('input', data.data.name)
    },

    beforeUpload (file: any) {
      // const isPNG = file.type === 'image/png'
      const isJPGOrPNG = file.type === ('image/jpeg' || 'image/png')
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!isJPGOrPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过 ${this.limit}MB!`)
      }
      // return isJPG || isPNG
      return isJPGOrPNG && isLt2M
    }
  }
})
</script>

<style lang="scss" scoped>
// 深度作用选择器: scoped 样式中的一个选择器能够作用得“更深”
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 146px;
  height: 146px;
  line-height: 146px;
  text-align: center;
}
.avatar {
  width: 146px;
  height: 146px;
  display: block;
}
</style>
