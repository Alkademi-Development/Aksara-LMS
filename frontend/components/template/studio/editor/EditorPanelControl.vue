<template>
  <div
      class="editor-panel border border-t"
      :class="[['expanded', 'default'].includes(panelControl.currentState) ? 'px-3 pt-2 pb-3' : '']"
      :style="{
        height:
          ['web', 'preview'].includes(activeScreen) ? 'auto' : panelControl.currentState === 'expanded'
            ? panelControl.expandedHeight + 'px'
            : panelControl.defaultHeight + 'px'
      }"
    >
      <!-- Resize Handler -->
      <div class="resize-handler horizontal" v-if="activeScreen === 'compiler'">
        <button type="button" class="bg-primary text-white rounded-top rounded-bottom-0 py-1" @click="$emit('toggle-panel-size')">
          <i :class="panelControl.currentState === 'default'
            ? 'ri-arrow-up-s-line'
            : 'ri-arrow-down-s-line'"
          ></i>
        </button>
      </div>
      <div class="editor-panel-wrapper position-relative d-flex align-items-center justify-content-between">
        <!-- Panel Tab -->
        <ul class="editor-panel-nav mb-2 editor-panel-web d-flex d-lg-none" v-if="activeScreen === 'web'">
          <li class="editor-panel-nav-item">
            <button
              type="button"
              class="editor-panel-nav-link"
              :class="{ active: activeCode === 'html' }"
              @click="$emit('update:activeCode', 'html');"
            >
              HTML
            </button>
          </li>
          <li class="editor-panel-nav-item">
            <button
              type="button"
              class="editor-panel-nav-link"
              :class="{ active: activeCode === 'css' }"
              @click="$emit('update:activeCode', 'css');"
            >
              CSS
            </button>
          </li>
          <li class="editor-panel-nav-item">
            <button
              type="button"
              class="editor-panel-nav-link"
              :class="{ active: activeCode === 'javascript' }"
              @click="$emit('update:activeCode', 'javascript');"
            >
              JavaScript
            </button>
          </li>
        </ul>
        <!-- Panel Control -->
        <div class="editor-panel-control d-none d-lg-flex align-items-center gap-2">
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
        <div class="editor-panel-actions mt-2 d-flex align-items-center justify-content-between justify-content-lg-end w-100">
          <div class="d-flex align-items-center">
            <button
              class="btn mr-2"
              :class="[detailUser?.kind === 4 ? 'btn-primary' : 'btn-disabled']"
              :disabled="detailUser?.kind != 4"
            >
              <i class="ri-save-line"></i>
            </button>
            <button class="btn btn-primary mr-2" @click="$emit('run-code')">
              <i class="ri-play-line"></i>
            </button>
            <button
              class="btn"
              :class="[detailUser?.kind === 4 ? 'btn-primary' : 'btn-disabled']"
              :disabled="detailUser?.kind != 4"
              @click="$emit('submit-code')"
            >
              Submit
            </button>
          </div>
          <button type="button" class="btn btn-outline-primary px-3 d-block d-lg-none" @click="$emit('update:isModuleVisible', true)">
            Modul
          </button>
        </div>
      </div>
      <!-- Panel Body -->
      <div class="editor-body mt-3" v-if="activeScreen === 'compiler'">
        <!-- Panel Control -->
        <div class="editor-panel-control d-block d-lg-none align-items-center gap-2 mb-3">
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
</template>

<script>
import { mapState } from "vuex";
import SelectDropdown from '~/components/template/studio/SelectDropdown.vue';
export default {
  name: 'EditorPanelControl',
  components: {
    SelectDropdown,
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
    detailUser: {
      type: Object,
      default: null,
    },
    activeCode: {
      type: String,
      default: 'html',
    }
  },
  computed: {
    ...mapState({
      activeScreen: (state) => state.Studio.activeScreen
    })
  },
  data() {
    return {
      tabs: ['Input', 'Output', 'Results'],
      activeTab: 'input',
    }
  },
  methods: {
  },
}
</script>

<style scoped>

</style>