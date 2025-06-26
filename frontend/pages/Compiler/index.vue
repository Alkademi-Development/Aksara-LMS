<template>
  <div class="studio-compiler d-flex">
    <!-- Panel Modul -->
    <div class="studio-module flex-shrink-0">
      <iframe
        class="module-iframe"
        :src="moduleUrl"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Editor & Panel Control -->
    <div class="studio-editor flex-grow-1 d-flex flex-column">
      <!-- Header Editor -->
      <div class="editor-header d-flex align-items-center px-3 border-bottom">
        <i class="ri-code-s-slash-line mr-2"></i>
        <h4 class="editor-language font-weight-bold">{{ selectedLanguage }}</h4>
      </div>
      <!-- Monaco Editor -->
      <div class="editor-main flex-grow-1">

      </div>

      <!-- Panel Editor -->
      <div class="editor-panel border border-t d-flex align-items-center justify-content-between">
        <!-- Panel Control -->
        <div class="editor-panel-control d-flex align-items-center gap-2 px-3 py-2">
          <!-- Panel Dropdown Select Language -->
          <SelectDropdown
            v-model="selectedLanguage"
            :options="[
              { label: 'Golang', value: 'golang' },
              { label: 'Javascript', value: 'javascript' },
              { label: 'PHP', value: 'php' },
              { label: 'Python', value: 'python' }
            ]"
            label="Language"
          />
          <!-- Panel Tab -->
          <ul class="editor-panel-nav mb-2">
            <li class="editor-panel-nav-item" v-for="tab in tabs" :key="tab">
              <button
                type="button"
                class="editor-panel-nav-link"
                :class="{'active': activeTab === tab?.toLowerCase()}"
                @click="activeTab = tab"
              >
                {{ tab }}
              </button>
            </li>
          </ul>
        </div>
        <!-- Control Buttons -->
        <div class="panel-actions px-3 py-2 mt-2 d-flex align-items-center">
          <button class="btn btn-disabled mr-2" @click="runCode" :disabled="isRunning">
            <i class="ri-save-line"></i>
          </button>
          <button class="btn btn-primary mr-2" @click="resetCode">
            <i class="ri-play-line"></i>
          </button>
          <button class="btn btn-disabled" @click="submitCode" :disabled="isRunning">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import useAuthMixin from '~/mixins/useAuthMixin';
import Sidebar from '~/components/template/studio/Sidebar.vue';
import ModuleIFrame from '~/components/template/studio/ModuleIFrame.vue';
import SelectDropdown from '~/components/template/studio/SelectDropdown.vue';

export default {
  components: {
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
      isModuleOpen: false,
      activeScreen: 'editor',
      activeEditor: null,
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
    }
  },
  computed: {
    ...mapState({
      authState: (state) => state.Auth,
      compilerState: (state) => state.Compiler,
    })
  },
  mounted() {
    this.initialCompiler();
  },
  methods: {
    ...mapActions({
        getAppVersion: 'Auth/getAppVersion',
        validateAppToken: 'Auth/validateAppToken',
        getUserDetail: 'Auth/getUserDetail',
        getServerTime: 'Alkamedia/getServerTime',
        getExt: 'Alkamedia/getExt',
        getDetailProject: 'Compiler/getDetailProject',
        setModuleOpen: 'Studio/setModuleOpen',
    }),
    setModuleOpen(value) {
      this.isModuleOpen = value;
    },
    async initialCompiler() {

      await this.getDetailProject(this.metronomId)

      // console.log(this.compilerState)

    }
  },
}
</script>

<style lang="scss" scoped>
</style>