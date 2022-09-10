<template>
  <div class="create-course">
    <create-or-edit></create-or-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CreateCourse',
  components: {
    CreateOrEdit
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped></style>
