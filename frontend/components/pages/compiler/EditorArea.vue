<template>
    <section class="editor-area flex-grow-1 h-100 w-100 overflow-auto d-flex flex-column">
  
      <!-- (Monaco Editor + Panel) -->
      <SplitterGroup direction="vertical" class="flex-grow-1 d-flex flex-column overflow-hidden">

        <!-- Editor Panel -->
        <SplitterPanel :min-size="30" class="overflow-hidden">
          <template v-if="compilerType === 'web'">
            <SplitterGroup direction="horizontal" class="h-100">

              <template v-if="!isTablet">
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
                <SplitterPanel :default-size="50" class="d-none d-lg-block overflow-hidden">
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
              </template>
              
              <template v-else>
                <SplitterPanel class="overflow-hidden">
                  <div class="top-bar-editor d-flex align-items-center gap-2 px-3 py-2">
                    <i class="ri-code-box-line text-2xl"></i>
                    <h4>{{ activeLanguage.toUpperCase() }}</h4>
                  </div>
                  
                  <MonacoEditor 
                    v-if="activeLanguage === 'html'" 
                    v-model="htmlCode"
                    lang="html"
                    :options="editorOptions"
                    class="w-100 h-100"
                    @mount="onEditorMounted"
                  />

                  <MonacoEditor 
                    v-else-if="activeLanguage === 'css'" 
                    v-model="cssCode"
                    lang="css"
                    :options="editorOptions"
                    class="w-100 h-100"
                    @mount="onEditorMounted"
                  />

                  <MonacoEditor 
                    v-else-if="activeLanguage === 'javascript'" 
                    v-model="jsCode"
                    lang="javascript"
                    :options="editorOptions"
                    class="w-100 h-100"
                    @mount="onEditorMounted"
                  />
                </SplitterPanel>
              </template>
            </SplitterGroup>
          </template>

          <template v-else-if="compilerType === 'preview-web'">
              <div class="top-bar-editor d-flex align-items-center justify-content-between px-3 py-2">
                <div class="d-flex align-items-center gap-2">
                  <i class="ri-global-line text-2xl"></i>
                  <h4>Web</h4>
                </div>
                <ul class="d-flex align-items-center gap-3">
                  <li>
                    <button type="button" @click="setPreviewMode('mobile')">
                      <i :class="`ri-smartphone-line text-xl ${previewMode === 'mobile' ? 'text-primary' : ''}`"></i>
                    </button>
                  </li>
                  <li>
                    <button type="button" style="transform: rotate(90deg);" @click="setPreviewMode('tablet')">
                      <i :class="`ri-tablet-line text-xl ${previewMode === 'tablet' ? 'text-primary' : ''}`"></i>
                    </button>
                  </li>
                  <li>
                    <button type="button" @click="setPreviewMode('desktop')">
                      <i :class="`ri-computer-line text-xl ${previewMode === 'desktop' ? 'text-primary' : ''}`"></i>
                    </button>
                  </li>
                </ul>
              </div>
              <div class="preview-container d-flex align-items-start justify-content-center">
                <iframe 
                  class="preview-iframe w-100 vh-100 border-0"
                  :class="previewMode"
                  :srcdoc="generatePreviewContent()"
                ></iframe>
              </div>
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
        <SplitterResizeHandle class="position-relative h-2 cursor-row-resize" v-if="isTablet || compilerType === 'base' || compilerType === 'preview-web'">
          <i
            class="ri-more-2-fill position-absolute start-50 top-0 z-3 border rounded resize-icon rounded p-1 text-xxs"
            style="transform: translateY(-10px) rotate(90deg);"
          ></i>
        </SplitterResizeHandle>

        <!-- Panel Section -->
        <SplitterPanel 
          :default-size="defaultPanelSize"
          :min-size="minPanelSize" 
          class="panel pb-12 pb-lg-2 d-flex flex-column overflow-hidden"
        >
          
          <!-- Panel Header -->
          <div class="panel-header p-2">
            <div class="d-flex align-items-center justify-content-between gap-4">
              <div class="d-none d-lg-flex align-items-center gap-3">
                <button type="button" class="panel-language px-3 py-2 rounded d-flex align-items-center justify-content-between" style="min-width: 7rem;">
                  <span class="fw-bolder">{{ compilerType === 'web' || compilerType === 'preview-web' ? 'Web' : currentLanguage?.toUpperCase() }}</span>
                  <i class="ri-arrow-down-s-fill text-lg"></i>
                </button>
                <ul class="panel-information d-flex align-items-center gap-2">
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'input' ? 'active' : '']"
                    v-if="compilerType != 'web' && compilerType != 'preview-web'"
                  >
                    <button type="button" @click="activePanel = 'input'" class="fw-bolder">Input</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'output' || compilerType === 'web' || compilerType === 'preview-web' ? 'active' : '']"
                     v-if="compilerType != 'web'"
                  >
                    <button type="button" @click="activePanel = 'output'" class="fw-bolder">{{ compilerType === 'web' || compilerType === 'preview-web' ? 'Console' : 'Output' }}</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'result' ? 'active' : '']"
                    v-if="compilerType != 'web' && compilerType != 'preview-web'"
                  >
                    <button type="button" @click="activePanel = 'result'" class="fw-bolder">Result</button>
                  </li>
                </ul>
              </div>
              <div class="panel-action w-100">
                <ul class="panel-web d-flex d-lg-none align-items-center gap-2 mb-3 mb-lg-0" v-if="compilerType === 'web'">
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activeLanguage === 'html' ? 'active' : '']"
                  >
                    <button type="button" @click="activeLanguage = 'html'" class="fw-bolder">HTML</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activeLanguage === 'css' ? 'active' : '']"
                  >
                    <button type="button" @click="activeLanguage = 'css'" class="fw-bolder">CSS</button>
                  </li>
                  <li 
                    :class="['d-flex align-items-center justify-content-center px-3 pb-2', activeLanguage === 'javascript' ? 'active' : '']"
                  >
                    <button type="button" @click="activeLanguage = 'javascript'" class="fw-bolder">JavaScript</button>
                  </li>
                </ul>

                <div class="w-100 d-flex align-items-center justify-content-between justify-content-lg-end">
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="px-2 py-1 rounded btn-disable"><i class="ri-save-line text-xl"></i></button>
                    <button type="button" class="px-2 py-1 rounded bg-primary text-white"><i class="ri-play-line text-xl"></i></button>
                    <button type="button" class="px-3 py-2 rounded btn-disable">Submit</button>
                  </div>
                  <button type="button" @click="showViewerModal = true;" class="d-block d-lg-none px-4 py-2 rounded bg-primary text-white text-md">Module</button>
                </div>
                <div class="d-flex d-lg-none align-items-center flex-wrap gap-3 mt-3" v-if="compilerType === 'base'">
                  <button type="button" class="panel-language w-100 px-3 py-2 rounded d-flex align-items-center justify-content-between" style="min-width: 7rem;">
                    <span class="fw-bolder">{{ compilerType === 'web' || compilerType === 'preview-web' ? 'Web' : currentLanguage?.toUpperCase() }}</span>
                    <i class="ri-arrow-down-s-fill text-lg"></i>
                  </button>
                  <ul class="panel-information d-flex align-items-center gap-2">
                    <li 
                      :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'input' ? 'active' : '']"
                      v-if="compilerType != 'web' && compilerType != 'preview-web'"
                    >
                      <button type="button" @click="activePanel = 'input'" class="fw-bolder">Input</button>
                    </li>
                    <li 
                      :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'output' || compilerType === 'web' || compilerType === 'preview-web' ? 'active' : '']"
                    >
                      <button type="button" @click="activePanel = 'output'" class="fw-bolder">{{ compilerType === 'web' || compilerType === 'preview-web' ? 'Console' : 'Output' }}</button>
                    </li>
                    <li 
                      :class="['d-flex align-items-center justify-content-center px-3 pb-2', activePanel === 'result' ? 'active' : '']"
                      v-if="compilerType != 'web' && compilerType != 'preview-web'"
                    >
                      <button type="button" @click="activePanel = 'result'" class="fw-bolder">Result</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Panel Body (scrollable form) -->
          <div class="panel-body mt-2">
            <Input v-if="activePanel === 'input' && (compilerType != 'web' && compilerType != 'preview-web')" />
            <Output v-if="activePanel === 'output' || activePanel === 'console' || (compilerType === 'web' || compilerType === 'preview-web')" />
            <Result v-if="activePanel === 'result' && (compilerType != 'web' && compilerType != 'preview-web')" />
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

const activeLanguage = ref('html');
const previewMode = ref('desktop')
const currentLanguage = ref('csharp')
const editorInstance = ref(null)
const value = ref('')
const isDark = inject('isDark')
const compilerType = inject('compilerType')
const showViewerModal = inject('showViewerModal')

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

const isTablet = ref(false)

const updateIsTablet = () => isTablet.value = window.innerWidth < 768;

onMounted(() => {
  updateIsTablet()
  window.addEventListener('resize', updateIsTablet)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsTablet)
})

function onEditorMounted(editor) {
  editorInstance.value = editor

  const model = editor.getModel()
  if (model) {
    const lang = model.getLanguageId()

    // Jika belum sesuai, set ulang bahasa-nya
    if (lang !== currentLanguage.value) {
      monaco.editor.setModelLanguage(model, currentLanguage.value)
    }

    currentLanguage.value = lang
  }

}

function generatePreviewContent() {
  return `
    <html>
      <head>
        <style>
          *, html, body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          ${cssCode.value}
        </style>
      </head>
      <body>
        ${htmlCode.value}
        <script>${jsCode.value}<\/script>
      </body>
    </html>
  `
}

function setPreviewMode(mode) {
  previewMode.value = mode
}

const defaultPanelSize = computed(() => {
  if (compilerType.value === 'web' || compilerType.value === 'preview-web') return 18
  else {
    if (isTablet.value) return 12
    return 50
  }
})

const minPanelSize = computed(() => {
  if (compilerType.value === 'web' || compilerType.value === 'preview-web') return 18
  else {
    if (isTablet.value) return 12
    return 50
  }
})

provide('activePanel', activePanel)

</script>

<style lang="scss" scoped>
.panel-header .panel-web,
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


.preview-iframe {
  background-color: white;
  height: 100%;
  transition: all 0.3s ease-in-out;

  &.mobile {
    width: 375px !important;
  }

  &.tablet {
    width: 576px !important;
  }

  &.desktop {
    width: 100% !important;
  }
}
  
</style>