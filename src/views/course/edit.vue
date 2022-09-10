<template>
  <div class="edit-course">
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
  }
})
</script>

<style lang="scss" scoped></style>
