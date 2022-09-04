<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单'}}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option
              :label="parentMenu.name"
              :value="parentMenu.id"
              v-for="parentMenu in parentMenuList" :key="parentMenu.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderNum"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ isEdit ? '提交编辑' : '立即添加'}}</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { createOrUpdateMenu, getEditMenuInfo } from '@/services/menu'

export default Vue.extend({
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1, // -1: 没有上级菜单
        name: '123',
        href: '123',
        icon: '123',
        orderNum: 0,
        description: '123',
        shown: false
      },
      parentMenuList: [], // 父级菜单列表
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入菜单描述', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadMenuInfo()
  },
  methods: {
    async loadMenuInfo () {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1)
      if (data.code === '000000') {
        this.form = data.data.menuInfo
        this.parentMenuList = data.data.parentMenuList
      }
    },

    async onSubmit () {
      // 1. 表单验证
      await (this.$refs.form as Form).validate()
      // 2. 提交表单
      const { data } = await createOrUpdateMenu(this.form)
      if (data.code === '000000') {
        this.$message.success('添加菜单成功')
        this.$router.back()
      }
    },

    cancel () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped></style>
