<template>
  <div class="edit-course">
    <el-page-header @back="goBack" content="编辑课程">
    </el-page-header>
    <create-or-edit isEdit :courseId="courseId"></create-or-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'EditCourse',
  components: {
    CreateOrEdit
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  created () {
    console.log('Edit...', this.courseId)
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped></style>
