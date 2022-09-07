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
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="ENABLE"
              inactive-value="DISABLE"
              @change="switchUserStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template v-slot="scope">
            <el-button
              size="mini"
              @click="disableUser(scope.row)">封禁</el-button>
            <el-button
              size="mini"
              @click="allocRole(scope.row.id)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryConditon.currentPage"
          :page-sizes="[20, 30, 50]"
          :page-size="queryConditon.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!-- allocate role dialog -->
      <el-dialog
        width="30%"
        title="分配角色"
        :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="选择角色">
            <el-select
              multiple
              v-model="form.roleIdList"
              placeholder="请选择为用户分配的角色">
              <el-option
                v-for="role in allRoles" :key="role.id"
                :label="role.name"
                :value="role.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="onCancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getFullTime } from '@/utils/time'
import { getUserPages, disableUser, enableUser } from '@/services/user'
import { getAllRoles, getRolesOfUser, allocateUserRoles } from '@/services/role'

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
      },
      total: 0,
      // dialog form
      dialogFormVisible: false,
      form: {
        userId: -1,
        roleIdList: [] as any
      },
      // allocate role for user
      allRoles: []
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
      this.total = data.data.total
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
    },

    async switchEnableUser (row: any) {
      try {
        await enableUser(row.id)
      } catch (err) {
        console.log(err)
      } finally {
        this.loadUserPages()
      }
    },

    async switchDisableUser (row: any) {
      try {
        await disableUser({ userId: row.id })
      } catch (err) {
        console.log(err)
      } finally {
        this.loadUserPages()
      }
    },

    // switch user status: enable / disable
    switchUserStatus (row: any) {
      console.log('switch...', row.status)
      if (row.status === 'DISABLE') {
        this.switchDisableUser(row)
      } else {
        this.switchEnableUser(row)
      }
    },

    // 封禁用户
    async disableUser (row: any) {
      try {
        await disableUser({ userId: row.id })
        this.loadUserPages()
      } catch (err) {
        console.log(err)
      }
    },

    // 获取角色
    async loadRoles (userId: number) {
      const res = await Promise.all([getAllRoles(), getRolesOfUser(userId)])
      const allRoles = res[0].data.data
      const userRoles = res[1].data.data

      this.allRoles = allRoles
      // handle user role
      userRoles.forEach((item: any) => {
        this.form.roleIdList.push(item.id)
      })
      this.form.userId = userId
    },
    // TODO 分配角色
    allocRole (userId: number) {
      this.loadRoles(userId)
      this.dialogFormVisible = true
    },

    onCancel () {
      this.dialogFormVisible = false
      this.form.roleIdList = []
    },

    async onSubmit () {
      this.dialogFormVisible = false
      const { data } = await allocateUserRoles({
        userId: this.form.userId,
        roleIdList: this.form.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success(data.mesg)
      }
      this.form.roleIdList = []
    },

    // 分页
    handleSizeChange (val: number) {
      this.queryConditon.pageSize = val
      this.queryConditon.currentPage = 1
      this.loadUserPages()
    },
    handleCurrentChange (val: number) {
      this.queryConditon.currentPage = val
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
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
</style>
