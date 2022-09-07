<template>
  <div class="user">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryConditon.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="datePickerValue"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" size="medium" :disabled="isLoading" @click="onSearch">查询</el-button>
      </el-form>
      <el-table
        v-loading="isLoading"
        :data="userList"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="portrait"
          label="头像"
          width="80">
          <template v-slot="scope">
            <img class="portrait" :src="scope.row.portrait">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <!-- <template v-slot="scope"> -->
          <template>
            <el-button
              size="mini"
              >禁用</el-button>
            <el-button
              size="mini"
              type="danger"
              >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getFullTime } from '@/utils/time'
import { getUserPages } from '@/services/user'

export default Vue.extend({
  name: 'UserIndex',
  data () {
    return {
      userList: [],
      queryConditon: {
        userId: null,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        currentPage: 1, // default current page
        pageSize: 20 // default page size
      },
      isLoading: true,
      datePickerValue: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    this.loadUserPages()
  },
  methods: {
    async loadUserPages () {
      this.isLoading = true

      const [startCreateTime, endCreateTime] = this.datePickerValue
      this.queryConditon.startCreateTime = startCreateTime
      this.queryConditon.endCreateTime = endCreateTime

      const { data } = await getUserPages(this.queryConditon)
      this.userList = data.data.records
      this.userList.forEach(user => {
        // 添加默认头像
        if (!user.portrait) {
          user.portrait = require('@/assets/default-portrait.jpg')
        }
        // 时间格式装换
        user.createTime = getFullTime(user.createTime)
      })
      this.isLoading = false
    },

    onSearch () {
      this.loadUserPages()
    }
  }
})
</script>

<style lang="scss" scoped>
  .portrait {
    width: 50xp;
    height: 50px;
    border-radius: 50%;
  }
</style>
