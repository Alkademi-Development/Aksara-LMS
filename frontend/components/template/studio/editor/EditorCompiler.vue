<template>
  <div class="editor-compiler flex-grow-1 d-flex flex-column">
      <!-- Header Editor -->
      <div class="editor-header px-3 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <i class="ri-code-box-line mr-2"></i>
          <h4 class="editor-language font-weight-bold">{{ selectedLanguage?.toUpperCase() }}</h4>
        </div>
      </div>
      <!-- Monaco Editor -->
      <div
        class="editor-main flex-grow-1"
        :style="{
          maxHeight: panelControl.currentState === 'default'
            ? 500 + 'px'
            : 150 + 'px'
        }"
      >
        <VueMonacoEditor
          v-model="compilerCode"
          :language="selectedLanguage"
          theme="vs-light"
          :options="{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
          }"
        />
      </div>
    </div>
</template>

<script>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';

export default {
  name: 'EditorCompiler',
  components: {
    VueMonacoEditor,
  },
  props: {
    selectedLanguage: {
      type: String,
      default: ''
    },
    panelControl: {
      type: Object,
      default: null
    },
    compilerCode: {
      type: String,
      default: ''
    }
  },
}
</script>

<style scoped>

</style>