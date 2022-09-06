<template>
  <div>
    <el-dialog
      :title="editInfo.isEdit ? '编辑资源' : '添加资源'"
      :visible.sync="isVisible"
      :show-close="false"
      width="600px">
      <el-form :model="resourceForm" :rules="resourceFormRuls" ref="resourceForm">
        <el-form-item label="资源名称:" prop="name" :label-width="formLabelWidth">
          <el-input v-model="resourceForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径:" prop="url" :label-width="formLabelWidth">
          <el-input v-model="resourceForm.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源分类:" prop="categoryId" :label-width="formLabelWidth">
          <el-select v-model="resourceForm.categoryId" placeholder="请选择活动区域">
            <el-option
            v-for="item in categories" :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入描述内容"
            v-model="resourceForm.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'

import { createOrUpdateResource } from '@/services/resource'

export default Vue.extend({
  name: 'CreateOrEidtResource',
  props: {
    editInfo: Object,
    showDialog: Boolean,
    categories: Array
  },
  data () {
    return {
      isVisible: false,
      resourceForm: {
        id: null,
        name: '',
        url: '',
        categoryId: null,
        description: ''
      },
      resourceFormRuls: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入资源路径', trigger: 'blur' }
        ],
        categoryId: [
          { required: true }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  mounted () {
    this.isVisible = this.showDialog
    if (this.editInfo.isEdit) {
      this.resourceForm = this.editInfo.resource
    } else {
      this.resourceForm.categoryId = this.categories[0].id
    }
  },
  methods: {
    // 添加资源
    async onSubmit () {
      // 1. 表单验证
      await (this.$refs.resourceForm as Form).validate()
      // 保存或更新资源
      const { data } = await createOrUpdateResource(this.resourceForm)
      if (data.code === '000000') {
        this.$message.success(data.mesg)
      }
      this.isVisible = false
      this.$emit('closeDialog')
    },

    // 取消
    onCancel () {
      this.isVisible = false
      this.$emit('closeDialog')
    }
  }
})
</script>

<style lang="scss" scoped>
  .el-dialog {
  .el-form-item {
    width: 500px;
  }
}
</style>
