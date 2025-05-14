export default {
    namespaced: true,
    state: () => ({
      activeTab: 'library' 
    }),
    mutations: {
      SET_ACTIVE_TAB(state, tabName) {
        state.activeTab = tabName
      },
      RESET_TAB(state) {
        state.activeTab = 'library'
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