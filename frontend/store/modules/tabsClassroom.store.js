export default {
    namespaced: true,
    state: () => ({
      activeTab: 'overview' 
    }),
    mutations: {
      SET_ACTIVE_TAB(state, tabName) {
        state.activeTab = tabName
      },
      RESET_TAB(state) {
        state.activeTab = 'overview'
      },
    },
    actions: {
      setActiveTab({ commit }, tabName) {
        commit('SET_ACTIVE_TAB', tabName)
      },
      resetTab({ commit }) {
        commit('RESET_TAB')
      }
    },
    getters: {
      activeTab: (state) => state.activeTab
    }
}