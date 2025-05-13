<template>
    <section class="editor-area flex-grow-1 h-100 w-100 overflow-hidden d-flex flex-column">
      <!-- Top Bar -->
      <div id="top-bar-editor" class="d-flex align-items-center gap-2 p-3">
        <i class="ri-code-box-line text-2xl"></i>
        <h4>{{ currentLanguage.toUpperCase() }}</h4>
      </div>
  
      <!-- (Monaco Editor + Panel) -->
      <SplitterGroup direction="vertical" class="flex-grow-1 d-flex flex-column overflow-hidden">
        
        <!-- Editor Panel -->
        <SplitterPanel :min-size="30" class="overflow-hidden">
          <MonacoEditor 
            v-model="value"
            :language="currentLanguage"
            :options="editorOptions"
            class="w-100 h-100"
            @mount="onEditorMounted"
          />
        </SplitterPanel>
  
        <!-- Resize Handle -->
        <SplitterResizeHandle class="position-relative h-2 cursor-row-resize">
            <i
                class="position-absolute start-50 top-0 z-3 ri-more-2-fill resize-icon rounded p-1 text-xxs"
                style="transform: translateY(-10px) rotate(90deg);"
            >
            </i>
        </SplitterResizeHandle>
  
        <!-- Panel Section -->
        <SplitterPanel :min-size="20" class="panel pb-6 pb-lg-2 d-flex flex-column overflow-hidden">
          
          <!-- Panel Header -->
          <div class="panel-header p-2">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <button type="button" class="panel-language px-3 py-2 rounded fw-medium d-flex align-items-center justify-content-between" style="min-width: 7rem;">
                  <span>C#</span>
                  <i class="ri-arrow-down-s-fill text-lg"></i>
                </button>
                <ul class="panel-information d-flex align-items-center gap-2">
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'input' ? 'active' : '']"
                  >
                    <button type="button" @click="activePanel = 'input'" class="fw-bolder">Input</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'output' ? 'active' : '']"
                  >
                    <button type="button" @click="activePanel = 'output'" class="fw-bolder">Output</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'result' ? 'active' : '']"
                  >
                    <button type="button" @click="activePanel = 'result'" class="fw-bolder">Result</button>
                  </li>
                </ul>
              </div>
              <div class="panel-action d-flex align-items-center gap-2">
                <button type="button" class="px-2 py-1 rounded btn-disable"><i class="ri-save-line text-xl"></i></button>
                <button type="button" class="px-2 py-1 rounded bg-primary text-white"><i class="ri-play-line text-xl"></i></button>
                <button type="button" class="px-3 py-2 rounded btn-disable">Submit</button>
              </div>
            </div>
          </div>
  
          <!-- Panel Body (scrollable form) -->
          <div class="panel-body">
            <Input v-if="activePanel === 'input'" />
            <Output v-if="activePanel === 'output'" />
            <Result v-if="activePanel === 'result'" />
          </div>
  
        </SplitterPanel>
      </SplitterGroup>
    </section>
  </template>

<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue';
import * as monaco from 'monaco-editor';
import Input from '@/components/editor/monaco/panels/Input.vue';
import Output from '@/components/editor/monaco/panels/Output.vue';
import Result from '@/components/editor/monaco/panels/Result.vue';

const currentLanguage = ref('javascript')
const editorInstance = ref(null)
const value = ref('')
const isDark = inject('isDark')

watch(isDark, (dark) => {
  monaco.editor.setTheme(dark ? 'vs-dark' : 'vs')
})

onMounted(() => {
  monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs')
});

const editorOptions = {
  minimap: { enabled: false }
};

const activePanel = ref('input');

function onEditorMounted(editor) {
  editorInstance.value = editor

  // Dapatkan model bahasa pertama kali saat mount
  const model = editor.getModel()
  if (model) {
    currentLanguage.value = model.getLanguageId()
  }

  // Dengarkan perubahan model jika editor-nya dynamic
  monaco.editor.onDidCreateModel((model) => {
    currentLanguage.value = model.getLanguageId()
  })
}

</script>

<style lang="scss" scoped>
.panel-header .panel-information {
  li {
    position: relative;
    
    &:hover::after {
      width: 100%;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary);
      transition: 0.2s ease-in-out;
    }

    &.active::after {
      width: 100%;
    }
  }
} 
</style>