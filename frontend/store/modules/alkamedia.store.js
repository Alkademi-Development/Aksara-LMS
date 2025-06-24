import httpClient from '@/api/httpClient'

export default {
  namespaced: true,

  state: () => ({
    serverTime: null,
    extList: [],
    timeNow: '',
    showTimer: '',
    isTimeOver: false
  }),

  mutations: {
    SET_SERVER_TIME(state, payload) {
      state.serverTime = payload
    },
    SET_EXT_LIST(state, payload) {
      state.extList = payload
    },
    SET_TIME_NOW(state, time) {
      state.timeNow = time
    },
    SET_TIMER(state, time) {
      state.showTimer = time
    },
    SET_TIME_OVER(state, flag) {
      state.isTimeOver = flag
    }
  },

  actions: {
    async getExt({ commit }) {
      try {
        const response = await httpClient.get('v1/metronom/ce/lang?v=2', { withAuth: false })
        commit('SET_EXT_LIST', response?.data ?? [])
      } catch (error) {
        console.error('getExt failed:', error)
      }
    },

    async getServerTime({ commit }) {
      try {
        const response = await httpClient.get('v1/assignment/server/time', { withAuth: false })
        commit('SET_SERVER_TIME', response?.data ?? null)
      } catch (error) {
        console.error('getServerTime failed:', error)
      }
    },

    setTimeNow({ commit }, time) {
      commit('SET_TIME_NOW', time)
    },

    setTimer({ commit }, time) {
      commit('SET_TIMER', time)
    },

    setTimeOver({ commit }, flag) {
      commit('SET_TIME_OVER', flag)
    }
  },

  getters: {
    serverTime: state => state.serverTime,
    extList: state => state.extList,
    timeNow: state => state.timeNow,
    showTimer: state => state.showTimer,
    isTimeOver: state => state.isTimeOver
  }
}
