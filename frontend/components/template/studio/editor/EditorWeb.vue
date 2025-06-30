<template>
  <div
    class="editor-web flex-grow-1 d-flex"
    :style="{
      maxHeight: panelControl.currentState === 'default'
        ? 600 + 'px'
        : panelControl.currentState === 'collapsed'
        ? 100 + '%'
        : 400 + 'px'
    }"
  >
    <div class="editor-pane html-pane">
      <div class="pane-header"><i class="ri-code-box-line mr-2"></i>
        {{ activeCode.toUpperCase() }}
      </div>
      <VueMonacoEditor
        v-model="code.html"
        language="html"
        theme="vs-light"
        :options="{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: 'on',
        }"
        v-if="activeCode === 'html'"
      />
      <VueMonacoEditor
        v-model="code.css"
        language="css"
        theme="vs-light"
        :options="{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: 'on',
        }"
        height="50%"
        v-else-if="activeCode === 'css'"
      />
      <VueMonacoEditor
        v-model="code.javascript"
        language="javascript"
        theme="vs-light"
        :options="{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: 'on',
        }"
        height="50%"
        v-else
      />
    </div>
    <div class="right-panes d-none d-lg-flex">
      <div class="editor-pane css-pane">
        <div class="pane-header"><i class="ri-code-box-line mr-2"></i> CSS</div>
        <VueMonacoEditor
          v-model="code.css"
          language="css"
          theme="vs-light"
          :options="{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
          }"
        />
      </div>
      <div class="editor-pane js-pane">
        <div class="pane-header"><i class="ri-code-box-line mr-2"></i> JavaScript</div>
        <VueMonacoEditor
          v-model="code.javascript"
          language="javascript"
          theme="vs-light"
          :options="{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';

export default {
  name: 'EditorWeb',
  components: {
    VueMonacoEditor
  },
  props: {
    panelControl: {
      type: Object,
      default: null
    },
    activeCode: {
      type: String,
      default: 'html'
    },
    code: {
      type: Object,
      default: null,
    },
  }
}
</script>

<style scoped>

</style>