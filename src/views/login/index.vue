<template>
  <div class="login">
    <el-form class="login-form" ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" :loading="isLoginLoading" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/services/user'

import { Form } from 'element-ui'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '123'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    // Test account: 18201288771 111111
    async onSubmit () {
      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate()
        // 2. 验证成功提交表单,发送请求
        this.isLoginLoading = true
        const { data } = await login(this.form)
        // 3. 处理请求结果:
        // 失败: 给出提示
        if (data.state !== 1) {
          // element-UI 消息提示组件
          return this.$message.error(data.message)
        }
        // 成功: 跳转到首页
        this.$router.push({
          name: 'home'
        })
        this.$message.success('登录成功')
      } catch (error) {
        console.log('登录失败', error)
      }

      // 结束登录按钮 loading 状态
      this.isLoginLoading = false
    }
  }
})

</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }

  .login-btn {
    width: 100%;
  }
}
</style>
