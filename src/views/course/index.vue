<template>
  <div class="course">
    <course-list></course-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CourseList from './components/CourseList.vue'

export default Vue.extend({
  name: 'CourseIndex',
  components: {
    CourseList
  },
  data () {
    return {

    }
  }
})

</script>

<style lang="scss" scoped></style>
