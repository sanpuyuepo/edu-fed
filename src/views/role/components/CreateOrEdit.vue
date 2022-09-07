<template>
  <div>
    <el-form :model="roleForm" :rules="rules" ref="roleForm">
      <el-form-item label="角色名称:" prop="name" :label-width="formLabelWidth">
        <el-input v-model="roleForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色编码:" prop="code" :label-width="formLabelWidth">
        <el-input v-model="roleForm.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述:" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入描述内容"
          v-model="roleForm.description">
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="center">
          <el-button @click="$emit('cancel')">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'

import { createOrUpdateRole } from '@/services/role'

export default Vue.extend({
  name: 'CreateOrEidtRole',
  props: ['editInfo'],
  data () {
    return {
      roleForm: this.editInfo
        ? this.editInfo
        : {
            id: null,
            name: '',
            code: '',
            description: ''
          },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },

  methods: {
    // 添加角色
    async onSubmit () {
      // 1. 表单验证
      await (this.$refs.roleForm as Form).validate()
      // 保存或更新角色
      const { data } = await createOrUpdateRole(this.roleForm)
      if (data.code === '000000') {
        this.$message.success(data.mesg)
        this.$emit('success')
      }
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

.center {
  text-align: right;
}
</style>
