<template>
  <div class="studio-compiler d-flex">
    <!-- Panel Modul -->
    <div class="studio-module flex-shrink-0 d-none d-md-block">
      <iframe
        class="module-iframe"
        :src="moduleUrl"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <!-- Panel Modul for Mobile -->
    <transition name="fade-slide">
      <div
        v-if="isModuleVisible"
        class="studio-module-mobile"
      >
        <div class="studio-module-header mb-2">
          <h4>Slicing Landing Page</h4>
          <button type="button" @click="isModuleVisible = false;">
            <i class="ri-close-line"></i>
          </button>
        </div>
        <iframe
          class="module-iframe"
          :src="moduleUrl"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </transition>

    <!-- Editor & Panel Control -->
    <div class="studio-editor flex-grow-1 d-flex flex-column">
      <div class="editor-compiler flex-grow-1 d-flex flex-column" v-if="activeScreen === 'compiler'">
        <!-- Header Editor -->
        <div class="editor-header px-3 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <i class="ri-code-s-slash-line mr-2"></i>
            <h4 class="editor-language font-weight-bold">{{ selectedLanguage }}</h4>
          </div>
        </div>
        <!-- Monaco Editor -->
        <div
          class="editor-main flex-grow-1"
          :style="{
            maxHeight: panelControl.currentState === 'default'
              ? 550 + 'px'
              : panelControl.currentState === 'collapsed'
              ? 100 + '%'
              : 400 + 'px'
          }"
        >
          <VueMonacoEditor
            v-model="code"
            language="javascript"
            theme="vs-light"
            :options="{
              fontSize: 14,
              minimap: { enabled: false },
            }"
          />
        </div>
      </div>
      <div class="editor-web flex-grow-1 d-flex" v-else-if="activeScreen === 'web'">
        <!-- KIRI: HTML (panjang penuh) -->
        <div class="editor-pane html-pane">
          <div class="pane-header"><i class="ri-code-s-slash-line mr-2"></i>
            {{ activeCode.toUpperCase() }}
          </div>
          <VueMonacoEditor
            v-model="code"
            language="html"
            theme="vs-light"
            :options="{
              fontSize: 14,
              minimap: { enabled: false },
            }"
            v-if="activeCode === 'html'"
          />
          <VueMonacoEditor
            v-model="code"
            language="css"
            theme="vs-light"
            :options="{
              fontSize: 14,
              minimap: { enabled: false },
            }"
            height="50%"
            v-else-if="activeCode === 'css'"
          />
          <VueMonacoEditor
            v-model="code"
            language="javascript"
            theme="vs-light"
            :options="{
              fontSize: 14,
              minimap: { enabled: false },
            }"
            height="50%"
            v-else
          />
        </div>
        <!-- KANAN: CSS + JAVASCRIPT (atas-bawah) -->
        <div class="right-panes d-none d-md-flex">
          <div class="editor-pane css-pane">
            <div class="pane-header"><i class="ri-code-s-slash-line mr-2"></i> CSS</div>
            <VueMonacoEditor
              v-model="code"
              language="css"
              theme="vs-light"
              :options="{
                fontSize: 14,
                minimap: { enabled: false },
              }"
            />
          </div>
          <div class="editor-pane js-pane">
            <div class="pane-header"><i class="ri-code-s-slash-line mr-2"></i> JavaScript</div>
            <VueMonacoEditor
              v-model="code"
              language="javascript"
              theme="vs-light"
              :options="{
                fontSize: 14,
                minimap: { enabled: false },
              }"
            />
          </div>
        </div>
      </div>
      <div class="editor-preview flex-grow-1" v-else>
        <!-- Header Editor -->
        <div class="editor-header d-flex align-items-center justify-content-between px-3 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <i class="ri-code-s-slash-line mr-2"></i>
            <h4 class="editor-language font-weight-bold">Studio</h4>
          </div>
          <ul class="editor-header-display d-flex align-items-center gap-2 m-0">
            <li>
              <button
                type="button"
                class="border-0 appearance-none"
                :class="{ active: previewDevice === 'mobile' }"
                @click="previewDevice = 'mobile'"
                title="Mobile"
              >
                <i class="ri-smartphone-line"></i>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="border-0 appearance-none"
                :class="{ active: previewDevice === 'tablet' }"
                @click="previewDevice = 'tablet'"
                title="Tablet"
              >
                <i class="ri-tablet-line"></i>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="border-0 appearance-none"
                :class="{ active: previewDevice === 'desktop' }"
                @click="previewDevice = 'desktop'"
                title="Desktop"
              >
                <i class="ri-computer-line"></i>
              </button>
            </li>
          </ul>
        </div>
        <!-- Preview Web -->
        <div
          class="preview-main"
          :class="{
            'preview-mobile': previewDevice === 'mobile',
            'preview-tablet': previewDevice === 'tablet',
            'preview-desktop': previewDevice === 'desktop'
          }"
        >
        </div>
      </div>

      <!-- Panel Editor -->
      <div
        class="editor-panel border border-t"
        :class="[['expanded', 'default'].includes(panelControl.currentState) ? 'px-3 pt-2 pb-3' : '']"
        :style="{
          height:
            panelControl.currentState === 'default'
              ? panelControl.defaultHeight + 'px'
              : panelControl.currentState === 'collapsed'
              ? panelControl.collapsedHeight + 'px'
              : panelControl.expandedHeight + 'px'
        }"
      >
        <!-- Resize Handler -->
        <div class="resize-handler horizontal" v-if="activeScreen === 'compiler'">
          <button type="button" class="bg-primary text-white rounded-top rounded-bottom-0 py-1" @click="togglePanelSize">
            <i
              :class="panelControl.currentState === 'default'
                ? 'ri-arrow-down-s-line'
                : panelControl.currentState === 'collapsed'
                ? 'ri-arrow-up-s-line'
                : 'ri-arrow-down-s-line'"
            ></i>
          </button>
        </div>
        <div class="editor-panel-wrapper position-relative d-flex align-items-center justify-content-between">
          <!-- Panel Tab -->
          <ul class="editor-panel-nav mb-2 editor-panel-web d-flex d-md-none" v-if="activeScreen === 'web'">
            <li class="editor-panel-nav-item">
              <button
                type="button"
                class="editor-panel-nav-link"
                :class="{ active: activeCode === 'html' }"
                @click="activeCode = 'html';"
              >
                HTML
              </button>
            </li>
            <li class="editor-panel-nav-item">
              <button
                type="button"
                class="editor-panel-nav-link"
                :class="{ active: activeCode === 'css' }"
                @click="activeCode = 'css';"
              >
                CSS
              </button>
            </li>
            <li class="editor-panel-nav-item">
              <button
                type="button"
                class="editor-panel-nav-link"
                :class="{ active: activeCode === 'javascript' }"
                @click="activeCode = 'javascript';"
              >
                JavaScript
              </button>
            </li>
          </ul>
          <!-- Panel Control -->
          <div class="editor-panel-control d-none d-md-flex align-items-center gap-2">
            <!-- Panel Dropdown Select Language -->
            <SelectDropdown
              v-model="selectedLanguage"
              :options="[
                // { label: 'Golang', value: 'golang' },
                // { label: 'Javascript', value: 'javascript' },
                // { label: 'PHP', value: 'php' },
                // { label: 'Python', value: 'python' }
              ]"
              :positionMenu="['default', 'collapsed'].includes(panelControl?.currentState) ? 'top' : 'bottom'"
              label="Web"
            />
            <!-- Panel Tab -->
            <ul class="editor-panel-nav mb-2" v-if="activeScreen === 'compiler'">
              <li class="editor-panel-nav-item" v-for="tab in tabs" :key="tab">
                <button
                  type="button"
                  class="editor-panel-nav-link"
                  :class="{'active': activeTab === tab?.toLowerCase()}"
                  @click="activeTab = tab.toLowerCase()"
                >
                  {{ tab }}
                </button>
              </li>
            </ul>
          </div>
          <!-- Control Buttons -->
          <div class="editor-panel-actions mt-2 d-flex align-items-center justify-content-between justify-content-md-end w-100">
            <div class="d-flex align-items-center">
              <button class="btn btn-disabled mr-2" @click="runCode">
                <i class="ri-save-line"></i>
              </button>
              <button class="btn btn-primary mr-2">
                <i class="ri-play-line"></i>
              </button>
              <button class="btn btn-disabled" @click="submitCode">
                Submit
              </button>
            </div>
            <button type="button" class="btn btn-outline-primary px-3 d-block d-md-none" @click="isModuleVisible = true">
              Modul
            </button>
          </div>
        </div>
        <!-- Panel Body -->
        <div class="editor-body mt-3" v-if="activeScreen === 'compiler'">
          <!-- Panel Control -->
          <div class="editor-panel-control d-block d-md-none align-items-center gap-2 mb-3">
            <!-- Panel Dropdown Select Language -->
            <SelectDropdown
              v-model="selectedLanguage"
              :options="[
                { label: 'Golang', value: 'golang' },
                { label: 'Javascript', value: 'javascript' },
                { label: 'PHP', value: 'php' },
                { label: 'Python', value: 'python' }
              ]"
              label="Web"
              class="w-100"
            />
            <!-- Panel Tab -->
            <ul class="editor-panel-nav mb-2">
              <li class="editor-panel-nav-item" v-for="tab in tabs" :key="tab">
                <button
                  type="button"
                  class="editor-panel-nav-link"
                  :class="{'active': activeTab === tab?.toLowerCase()}"
                  @click="activeTab = tab.toLowerCase()"
                >
                  {{ tab }}
                </button>
              </li>
            </ul>
          </div>
          <!-- Input -->
          <div class="editor-input" v-if="activeTab === 'input'">
            <b-form-group
                label="Masukkan argumen 'x' disini"
                label-for="x">
                <b-form-input
                    id="x"
                    name="x"
                    value=""
                ></b-form-input>
            </b-form-group>
          </div>
          <!-- Output -->
          <div class="editor-output" v-else-if="activeTab === 'output'">
            <ul class="editor-output-list">
              <li class="editor-output-item">
                <div class="editor-output-info">
                  <p class="editor-output-date">
                    <span class="text-danger">~ [Jun 26, 25 21:25:00]</span>
                    >
                  </p>
                  <p class="editor-output-result">False</p>
                </div>
                <p class="editor-output-runtime">167ms</p>
              </li>
              <li class="editor-output-item">
                <div class="editor-output-info">
                  <p class="editor-output-date">
                    <span class="text-danger">~ [Jun 26, 25 21:25:00]</span>
                    >
                  </p>
                  <p class="editor-output-result">False</p>
                </div>
                <p class="editor-output-runtime">167ms</p>
              </li>
            </ul>
          </div>
          <!-- Result -->
          <div class="editor-result" v-else>
            <table>
              <thead>
                <td>Testcase</td>
                <td>Status</td>
                <td>Time Performance</td>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Passed</td>
                  <td>64ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import useAuthMixin from '~/mixins/useAuthMixin';
import Sidebar from '~/components/template/studio/Sidebar.vue';
import ModuleIFrame from '~/components/template/studio/ModuleIFrame.vue';
import SelectDropdown from '~/components/template/studio/SelectDropdown.vue';

export default {
  components: {
    VueMonacoEditor,
    Sidebar,
    ModuleIFrame,
    SelectDropdown,
  },
  layout: 'studio',
  asyncData({ redirect, query }) {
    const metronomId = query?.metronomId;
    // if (!metronomId) {
    //   redirect('/auth')
    // }

    return { metronomId }
  },
  mixins: [useAuthMixin],
  data() {
    return {
      isLoading: true,
      isModuleVisible: false,
      activeTab: 'input',
      activeCode: 'html',
      previewDevice: 'desktop',
      code: 'const noop = () => {}',
      project: {
        name: 'Proyek Dummy',
      },
      activeTab: "input",
      tabs: ['Input', 'Output', 'Results'],
      moduleUrl: 'https://drive.google.com/file/d/1S8TWF09kMViN-EHsTjJKUktRU193Pgse/preview?usp=drive_link',
      selectedLanguage: "JavaScript",
      modules: [
        { id: 1, name: 'Module 1', description: 'Deskripsi modul 1' },
        { id: 2, name: 'Module 2', description: 'Deskripsi modul 2' },
        { id: 3, name: 'Module 3', description: 'Deskripsi modul 3' },
      ],
      panelControl: {
        currentState: 'default',
        defaultHeight: 90,
        expandedHeight: 350,
      }
    }
  },
  computed: {
    ...mapState({
      authState: (state) => state.Auth,
      compilerState: (state) => state.Compiler,
      activeScreen: (state) => state.Studio.activeScreen
    })
  },
  mounted() {
    this.initialCompiler();
    this.updatePanelControl();
    window.addEventListener("resize", this.updatePanelControl);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updatePanelControl); // Hapus event listener saat komponen dihancurkan
  },
  methods: {
    ...mapActions({
        // getAppVersion: 'Auth/getAppVersion',
        // validateAppToken: 'Auth/validateAppToken',
        // getUserDetail: 'Auth/getUserDetail',
        // getServerTime: 'Alkamedia/getServerTime',
        // getExt: 'Alkamedia/getExt',
        // setModuleOpen: 'Studio/setModuleOpen',
    }),

    async initialCompiler() {

    },
    runCode() {

    },
    submitCode() {

    },
    updatePanelControl() {
      const isMobile = window.innerWidth <= 576;
      const isTablet = window.innerWidth <= 768;
      this.panelControl.defaultHeight = isTablet ? isMobile ? 95 : 90 : 100;
      this.panelControl.collapsedHeight = isMobile ? 35 : 20;
    },
    togglePanelSize() {
      if (this.panelControl.currentState === 'default') {
        this.panelControl.currentState = 'collapsed';
      } else if (this.panelControl.currentState === 'collapsed') {
        this.panelControl.currentState = 'expanded';
      } else {
        this.panelControl.currentState = 'default';
      }
    },
    setModuleOpen(value) {
      this.isModuleOpen = value;
    },
  },
}
</script>

<style lang="scss" scoped>
</style>