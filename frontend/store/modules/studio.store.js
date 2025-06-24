import {
    apiGetExt,
    apiGetAllStudio,
    apiGetListStudio,
    apiGetStudio,
    apiCreateStudio,
    apiEditStudio,
    apiDeleteStudio,
} from '@/api/studio.api';
import dayjs from 'dayjs'
import { IFRAME_LOG } from '@/commons/constants/iframe-log'

function getBlobURL(content, type) {
  const blob = new Blob([content], { type })
  return URL.createObjectURL(blob)
}

export default {
    namespaced: true,
    state: {
        theme: 'light',
        activeScreen: 'editor',
        viewer: {
          html: '',
          css: '',
          js: ''
        },
        isModuleOpen: false,
        consoleOutputs: [],
        studio: [],
        message: '',
        status: false,
        data: null,
        pagination: {
            currentPage: 0,
            perPage: 0,
            totalRows: 0,
        },
    },

    mutations: {
        SET_ACTIVE_SCREEN(state, screen) {
          state.activeScreen = screen
        },
        SET_VIEWER(state, payload) {
          state.viewer = payload
        },
        SET_MODULE_OPEN(state, val) {
          state.isModuleOpen = val
        },
        ADD_CONSOLE_OUTPUT(state, { type, messages }) {
          const formattedMessages = messages.map(message =>
            typeof message === 'object' ? JSON.stringify(message, null, 2) : message
          )
          state.consoleOutputs.push({
            type,
            time: dayjs().format('MMM DD, YY HH:mm:ss'),
            message: formattedMessages.join(', ')
          })
        },
        CLEAR_CONSOLE_OUTPUT(state) {
          state.consoleOutputs = []
        },
        SET_RESPONSE(state, {message, status, data}){
            state.message = message;
            state.status = status;
            state.data = data;
        },
        SET_PAGINATION(state, {pagination}){
            state.pagination = pagination
        },
        SET_STUDIO(state, studio){
            state.studio = studio
        },
        SET_THEME(state, val) {
          state.theme = val
        }
    },

    actions: {
        async extenstions({commit}, version = null) {
            try {
                const response = await apiGetExt(version)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed get ext studio: ', error)
            }
        },
        async all({commit}) {
            try {
                const response = await apiGetAllStudio()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                commit('SET_STUDIO', response.data.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed get studio: ', error)
            }
        },
        async getList({commit}, { page, kind, keyword }) {
            try {
                const response = await apiGetListStudio(page, kind, keyword)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                commit('SET_STUDIO', response.data.data.items)

                var data = response.data.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page,
                        perPage: data.perPage,
                        totalRows: data.totalItems,
                    }
                }

                commit('SET_PAGINATION', pagePayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed get studio: ', error)
            }
        },
        async studio({commit}, id) {
            try {
                const response = await apiGetStudio(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_STUDIO', response.data.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed get studio: ', error)
            }
        },
        async create({commit}, {params}) {
            try {
                const response = await apiCreateStudio(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed get studio: ', error)
            }
        },
        async edit({commit}, {id, params}) {
            try {
                const response = await apiEditStudio(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed get studio: ', error)
            }
        },
        async delete({commit}, id) {
            try {
                const response = await apiDeleteStudio(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed get studio: ', error)
            }
        },
        setActiveScreen({ commit }, screen) {
          commit('SET_ACTIVE_SCREEN', screen)
        },
        setViewer({ commit }, payload) {
          commit('SET_VIEWER', payload)
        },
        setModuleOpen({ commit }, val) {
          commit('SET_MODULE_OPEN', val)
        },
        addConsoleOutput({ commit }, payload) {
          commit('ADD_CONSOLE_OUTPUT', payload)
        },
        removeConsoleOutput({ commit }) {
          commit('CLEAR_CONSOLE_OUTPUT')
        },
        disableSpecialKeys() {
          const exceptKeys = ['a', 'A', 'r', 'R', 'z', 'Z', 'y', 'Y', 's', 'S']
          const onClickKey = evt => evt.preventDefault()

          document.addEventListener('keydown', evt => {
            if (((evt.ctrlKey || evt.metaKey) && !exceptKeys.includes(evt.key)) || evt.key === 'F12') {
              onClickKey(evt)
            }
          })
        },
        onCtrlS(_, fn) {
          const keys = ['s', 'S']
          const handler = evt => {
            if ((evt.ctrlKey || evt.metaKey) && keys.includes(evt.key)) {
              evt.preventDefault()
              fn()
            }
          }
          document.addEventListener('keydown', handler)
        },
        setStudioTheme({ commit }, val) {
          commit('SET_THEME', val)
        }
    },
    getters: {
      theme: state => state.theme,
      activeScreen: state => state.activeScreen,
      viewer: state => state.viewer,
      isModuleOpen: state => state.isModuleOpen,
      consoleOutputs: state => state.consoleOutputs,
      getViewerURL: state => {
        const cssURL = getBlobURL(state.viewer.css, 'text/css')
        const jsURL = getBlobURL(state.viewer.js, 'text/javascript')

        let html = state.viewer.html

        if (cssURL) {
          const htmlArr = html.split('</head>')
          const jsConsole = getBlobURL(IFRAME_LOG, 'text/javascript')
          htmlArr[0] += `<link rel="stylesheet" type="text/css" href="${cssURL}" />
                         <script src="${jsConsole}" type="text/javascript"></script>`
          html = htmlArr.join('</head>')
        }

        if (jsURL) {
          const htmlArr = html.split('</body>')
          htmlArr[0] += `<script src="${jsURL}" type="text/javascript"></script>`
          html = htmlArr.join('</body>')
        }

        return getBlobURL(html, 'text/html')
      }
    },
}