<template>
  <div class="studio-compiler d-flex h-100">
    <ModulePanel
      :isModuleVisible="isModuleVisible"
      :moduleUrl="moduleUrl"
      @close="isModuleVisible = false"
    />
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
      <EditorCompiler
        :selected-language="selectedLanguage"
        :panel-control="panelControl"
        :compiler-code="compilerCode"
        v-if="activeScreen === 'compiler'"
      />
      <EditorWeb
        :active-code="activeCode"
        :code="code"
        :panel-control="panelControl"
        v-else-if="activeScreen === 'web'"
      />
      <PreviewWeb
        :preview-device.sync="previewDevice"
        :executed-code="executedCode"
        v-else
      />

      <!-- Editor Panel Control -->
      <EditorPanelControl
        :panel-control="panelControl"
        :selected-language="selectedLanguage"
        :detail-user="detailUser"
        :active-code.sync="activeCode"
        :is-module-visible.sync="isModuleVisible"
        @run-code="runCode"
        @submit-code="submitCode"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import useAuthMixin from '~/mixins/useAuthMixin';
import Sidebar from '~/components/template/studio/Sidebar.vue';
import { TEMPLATE_COMPILER, TEMPLATE_CSS, TEMPLATE_HTML, TEMPLATE_JAVASCRIPT } from '~/commons/constants/studio';
import ModulePanel from '~/components/template/studio/editor/ModulePanel.vue';
import EditorCompiler from '~/components/template/studio/editor/EditorCompiler.vue';
import EditorWeb from '~/components/template/studio/editor/EditorWeb.vue';
import EditorPanelControl from '~/components/template/studio/editor/EditorPanelControl.vue';
import PreviewWeb from '~/components/template/studio/editor/PreviewWeb.vue';

export default {
  components: {
    EditorCompiler,
    EditorWeb,
    EditorPanelControl,
    PreviewWeb,
    Sidebar,
    ModulePanel,
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
  watch: {
    'code.html': 'updatePreview',
    'code.css': 'updatePreview',
    'code.javascript': 'updatePreview',
  },
  data() {
    return {
      isLoading: true,
      isModuleVisible: false,
      activeCode: 'html',
      previewDevice: 'desktop',
      executedCode: '',
      compilerArgs: {},
      compilerCode: TEMPLATE_COMPILER,
      code: {
        html: TEMPLATE_HTML,
        css: TEMPLATE_CSS,
        javascript: TEMPLATE_JAVASCRIPT,
      },
      project: {
        name: 'Proyek Dummy',
      },
      moduleUrl: 'https://drive.google.com/file/d/1S8TWF09kMViN-EHsTjJKUktRU193Pgse/preview?usp=drive_link',
      selectedLanguage: "javascript",
      modules: [
        { id: 1, name: 'Module 1', description: 'Deskripsi modul 1' },
        { id: 2, name: 'Module 2', description: 'Deskripsi modul 2' },
        { id: 3, name: 'Module 3', description: 'Deskripsi modul 3' },
      ],
      panelControl: {
        currentState: 'default',
        defaultHeight: 50,
        expandedHeight: 350,
      },
      windowWidth: window.innerWidth,
      detailUser: null,
    }
  },
  computed: {
    ...mapState({
      servicesState: (state) => state.Services,
      activeScreen: (state) => state.Studio.activeScreen
    })
  },
  mounted() {
    this.initialCompiler();
    this.updatePanelControl();
    this.updatePreview();
    this.getUserDetail();
    window.addEventListener("resize", this.updatePanelControl);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updatePanelControl); // Hapus event listener saat komponen dihancurkan
  },
  methods: {
    ...mapActions({
      setActiveScreen: 'Studio/setActiveScreen',
    }),
    updatePreview() {
      // Ekstrak head/body kalau perlu, atau lakukan penggabungan template di sini
      this.executedCode = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              ${this.code.css || ''}
            </style>
          </head>
          <body>
            ${this.code.html || ''}
            <script>
              ${this.code.javascript || ''}
            <\/script>
          </body>
        </html>
      `;
    },
    async getUserDetail() {
      await this.$store.dispatch('Services/authorize');

      if (!this.servicesState.status) {
        console.error('Failed to fetch user detail', this.servicesState.message);
      } else {
        this.detailUser = this.servicesState?.detail_auth;
      }
    },
    async initialCompiler() {

    },
    runCode() {
      if (this.activeScreen === 'web') this.setActiveScreen('preview');
    },
    submitCode() {

    },
    updatePanelControl() {
      this.windowWidth = window.innerWidth;
      const isMobile = window.innerWidth <= 576;
      const isTablet = window.innerWidth <= 768;
      this.panelControl.defaultHeight = 70;
      this.panelControl.expandedHeight = isTablet ? isMobile ? 500 : 400 : 350;
    },
    togglePanelSize() {
      this.panelControl.currentState =
        this.panelControl.currentState === 'default'
          ? 'expanded' : 'default';
    },
    setModuleOpen(value) {
      this.isModuleOpen = value;
    },
  },
}
</script>

<style lang="scss" scoped>
</style>