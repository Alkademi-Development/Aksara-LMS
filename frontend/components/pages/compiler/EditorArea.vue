<template>
    <section class="editor-area flex-grow-1 h-100 w-100 overflow-hidden d-flex flex-column">
  
      <!-- (Monaco Editor + Panel) -->
      <SplitterGroup direction="vertical" class="flex-grow-1 d-flex flex-column overflow-hidden">

        <!-- Editor Panel -->
        <SplitterPanel :min-size="30" class="overflow-hidden">
          <template v-if="compilerType === 'web'">
            <SplitterGroup direction="horizontal" class="h-100">
              <!-- HTML Editor -->
              <SplitterPanel :default-size="40" class="overflow-hidden">
                <div class="top-bar-editor d-flex align-items-center gap-2 px-3 py-2">
                  <i class="ri-code-box-line text-2xl"></i>
                  <h4>HTML</h4>
                </div>
                <MonacoEditor 
                  v-model="htmlCode"
                  lang="html"
                  :options="editorOptions"
                  class="w-100 h-100"
                  @mount="onEditorMounted"
                />  
              </SplitterPanel>

              <SplitterResizeHandle class="resize-handle-horizontal relative d-none d-lg-flex align-items-center justify-content-center" style="width: 0;">
                  <i
                      class="resize-icon ri-more-2-fill border rounded p-1 text-xxs z-3"
                      style="transform: rotate(180deg); pointer-events: none;"
                  ></i>
              </SplitterResizeHandle>

              <!-- CSS & JS Editor -->
              <SplitterPanel :default-size="50" class="overflow-hidden">
                <SplitterGroup direction="vertical" class="h-100">
                  <!-- CSS -->
                  <SplitterPanel class="overflow-hidden">
                    <div class="top-bar-editor d-flex align-items-center gap-2 px-3 py-2">
                      <i class="ri-code-box-line text-2xl"></i>
                      <h4>CSS</h4>
                    </div>
                    <MonacoEditor 
                      v-model="cssCode"
                      lang="css"
                      :options="editorOptions"
                      class="w-100 h-100"
                    />
                  </SplitterPanel>

                  <SplitterResizeHandle class="resize-handle-vertical position-relative h-2 cursor-row-resize">
                    <i
                      class="ri-more-2-fill position-absolute start-50 top-0 z-3 border rounded resize-icon rounded p-1 text-xxs"
                      style="transform: translateY(-10px) rotate(90deg);"
                    ></i>
                  </SplitterResizeHandle>

                  <!-- JS -->
                  <SplitterPanel class="overflow-hidden">
                    <div class="top-bar-editor d-flex align-items-center gap-2 px-3 py-2">
                      <i class="ri-code-box-line text-2xl"></i>
                      <h4>JavaScript</h4>
                    </div>
                    <MonacoEditor 
                      v-model="jsCode"
                      lang="javascript"
                      :options="editorOptions"
                      class="w-100 h-100"
                    />
                  </SplitterPanel>
                </SplitterGroup>
              </SplitterPanel>
            </SplitterGroup>
          </template>

          <template v-else>
            <div class="d-flex align-items-center gap-2 p-3">
              <i class="ri-code-box-line text-2xl"></i>
              <h4>{{ currentLanguage.toUpperCase() }}</h4>
            </div>
            <MonacoEditor 
              v-model="value"
              :lang="currentLanguage"
              :options="editorOptions"
              class="w-100 h-100"
              @mount="onEditorMounted"
            />
          </template>
        </SplitterPanel>

        <!-- Resize Handle -->
        <SplitterResizeHandle class="position-relative h-2 cursor-row-resize">
          <i
            class="ri-more-2-fill position-absolute start-50 top-0 z-3 border rounded resize-icon rounded p-1 text-xxs"
            style="transform: translateY(-10px) rotate(90deg);"
          ></i>
        </SplitterResizeHandle>

        <!-- Panel Section -->
        <SplitterPanel :default-size="compilerType === 'web' ? 18 : 50" class="panel pb-6 pb-lg-2 d-flex flex-column overflow-hidden">
          
          <!-- Panel Header -->
          <div class="panel-header p-2">
            <div class="d-flex align-items-center justify-content-between gap-4">
              <div class="d-flex align-items-center gap-3">
                <button type="button" class="panel-language px-3 py-2 rounded fw-medium d-flex align-items-center justify-content-between" style="min-width: 7rem;">
                  <span>{{ compilerType === 'web' ? 'Web' : currentLanguage?.toUpperCase() }}</span>
                  <i class="ri-arrow-down-s-fill text-lg"></i>
                </button>
                <ul class="panel-information d-flex align-items-center gap-2">
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'input' ? 'active' : '']"
                    v-if="compilerType != 'web'"
                  >
                    <button type="button" @click="activePanel = 'input'" class="fw-bolder">Input</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'output' || compilerType === 'web' ? 'active' : '']"
                  >
                    <button type="button" @click="activePanel = 'output'" class="fw-bolder">{{ compilerType === 'web' ? 'Console' : 'Output' }}</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'result' ? 'active' : '']"
                    v-if="compilerType != 'web'"
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
            <Input v-if="activePanel === 'input' && compilerType != 'web'" />
            <Output v-if="activePanel === 'output' || activePanel === 'console'" />
            <Result v-if="activePanel === 'result' && compilerType != 'web'" />
          </div>
  
        </SplitterPanel>
      </SplitterGroup>
    </section>
  </template>

<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue';
import * as monaco from 'monaco-editor';
import Input from '@/components/pages/compiler/panels/Input.vue';
import Output from '@/components/pages/compiler/panels/Output.vue';
import Result from '@/components/pages/compiler/panels/Result.vue';

const currentLanguage = ref('csharp')
const editorInstance = ref(null)
const value = ref('')
const isDark = inject('isDark')
const compilerType = inject('compilerType')

const editorOptions = {
  minimap: { enabled: false }
};

const htmlCode = ref('<h1></h1>');
const cssCode = ref('h1 { color: red; }');
const jsCode = ref("console.log('Hi!')");

watch(isDark, (dark) => {
  monaco.editor.setTheme(dark ? 'vs-dark' : 'vs')
})

onMounted(() => {
  monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs')
});

const activePanel = ref('input');

function onEditorMounted(editor) {
  editorInstance.value = editor

  // Debug log
  console.log('Editor mounted with model:', editor.getModel())

  const model = editor.getModel()
  if (model) {
    const lang = model.getLanguageId()
    console.log('Detected language:', lang)

    // Jika belum sesuai, set ulang bahasa-nya
    if (lang !== currentLanguage.value) {
      monaco.editor.setModelLanguage(model, currentLanguage.value)
    }

    currentLanguage.value = lang
  }

}

provide('activePanel', activePanel)

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