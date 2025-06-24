
import dayjs from 'dayjs'
import { isStrJSON } from '~/utils/helpers'
import {
  apiSaveCode,
  apiRunCode,
  apiSubmitCode,
  apiGetDetailProject
} from '~/api/studio.api'

export default {
  namespaced: true,

  state: {
    project: null,
    inputArgs: [],
    outputsPanel: [],
    submitData: {
      status: false,
      message: ''
    },
    activeEditor: 'default'
  },

  getters: {
    compilerResults(state) {
      if (isStrJSON(state.project?.result ?? '')) {
        return JSON.parse(state.project.result)
      }
      return []
    }
  },

  mutations: {
    SET_PROJECT(state, project) {
      state.project = project
    },
    SET_INPUT_ARGS(state, args) {
      state.inputArgs = args
    },
    SET_ACTIVE_EDITOR(state, ext) {
      state.activeEditor = ext === 'html' ? 'web' : 'default'
    },
    PUSH_OUTPUT(state, output) {
      state.outputsPanel.push(output)
    },
    SET_SUBMIT_DATA(state, data) {
      state.submitData = data
    },
    RESET_OUTPUTS(state) {
      state.outputsPanel = []
    }
  },

  actions: {
    async getDetailProject({ commit }, metronomId) {
      try {
        const response = await apiGetDetailProject(metronomId)
        const project = response.data ?? null
        commit('SET_PROJECT', project)
        commit('SET_INPUT_ARGS', project?.parameters ?? [])
        commit('SET_ACTIVE_EDITOR', project?.ext)
      } catch (e) {
        console.error('Failed to get project:', e)
      }
    },

    async saveCode(_, { metronomId, payload }) {
      try {
        await apiSaveCode(metronomId, payload)
      } catch (e) {
        console.error('Save code error:', e)
      }
    },

    async runCode({ commit }, { metronomId, payload }) {
      try {
        const response = await apiRunCode(metronomId, payload)
        const data = response.data

        const output = {
          time: dayjs().format('MMM DD, YY HH:mm:ss'),
          status: data?.status ?? false,
          message: data?.result ?? response.message ?? 'Timeout',
          executionTime: `${data?.resultExecutionTime ?? 99999}ms`
        }

        commit('PUSH_OUTPUT', output)
      } catch (e) {
        commit('PUSH_OUTPUT', {
          time: dayjs().format('MMM DD, YY HH:mm:ss'),
          status: false,
          message: 'Error or Timeout',
          executionTime: '99999ms'
        })
      }
    },

    async submitCode({ commit }, { metronomId, stdin = '' }) {
      try {
        const response = await apiSubmitCode(metronomId, stdin)
        const status = response.status
        const message = response.message || (status ? 'Code mu berhasil disubmit!' : 'Request error!')

        commit('SET_SUBMIT_DATA', { status, message })
      } catch (e) {
        commit('SET_SUBMIT_DATA', { status: false, message: 'Submit error' })
      }
    }
  }
}