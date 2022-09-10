<template>
  <div class="editor-wrapper">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"/>
    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onChange="onChange"
      @onCreated="onCreated"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { uploadImg } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  components: { Editor, Toolbar },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      html: this.value,
      toolbarConfig: { },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            customUpload: upload
          }
        }
      },
      mode: 'default' // or 'simple'
    }
  },
  mounted () {
    this.html = this.value
  },
  methods: {
    onCreated (editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },

    onChange () {
      const editor = this.editor
      if (editor == null) return
      const value = editor.getHtml()
      this.$emit('input', value)
    }
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
})

async function upload (file: File, insertFn: any) {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await uploadImg(fd)
  insertFn(data.data.name)
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.editor-wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
}
</style>
