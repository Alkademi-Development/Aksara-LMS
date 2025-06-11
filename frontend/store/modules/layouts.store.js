export default {
    namespaced: true,
    state: () => {
        return {
            tabs: [],
            activeTab: localStorage.getItem('active_tab') || '',
            sidebars: [],
            stateSidebar: '',
            filters: [],
            stateFilter: null,
            activeBadges: null,
            stateAction: '#',
            stateDrawerChat: 'closed',
            breadcrumbs: null,
        }
    },
    mutations: {
        SET_SIDEBARS: (state, sidebars ) => {
            state.sidebars = sidebars 
        },
        SET_ACTIVE_TAB: (state, activeTab ) => {
            state.activeTab = activeTab 
        },
        SET_TABS: (state, tabs ) => {
            state.tabs = tabs 
        },
        SET_STATE_SIDEBAR: (state, stateSidebar ) => {
            state.stateSidebar = stateSidebar 
        },
        SET_STATE_DRAWER_CHAT: (state, stateDrawerChat ) => {
            state.stateDrawerChat = stateDrawerChat 
        },
        SET_FILTERS: (state, filters ) => {
            state.filters = filters 
        },
        SET_STATE_FILTER: (state, stateFilter ) => {
            state.stateFilter = stateFilter 
        },
        SET_ACTIVE_BADGES: (state, activeBadges ) => {
            state.activeBadges = activeBadges 
        },
        SET_ACTION: (state, stateAction ) => {
            state.stateAction = stateAction 
        },
        SET_BREADCRUMBS: (state, breadcrumbs) => {
            state.breadcrumbs = breadcrumbs;
        }
    },
    actions: {
        getTabs: async ({ commit }, tabs) => {
            try {
                commit('SET_TABS', tabs)
            } catch (error) {
                console.error(error);
            }
        },

        setActiveTab: ({commit}, tab) => {
            try {
                localStorage.setItem('active_tab', tab)

                commit('SET_ACTIVE_TAB', tab)
            } catch (error) {
                console.error(error);
            }
        },
        
        getSidebars: async ({ commit }, sidebars) => {
            try {
                commit('SET_SIDEBARS', sidebars)
            } catch (error) {
                console.error(error);
            }
        },

        setStateSidebar: ({commit}, sidebar) => {
            try {
                commit('SET_STATE_SIDEBAR', sidebar)
            } catch (error) {
                console.error(error);
            }
        },

        setStateDrawerChat: ({commit}, drawerChat) => {
            try {
                commit('SET_STATE_DRAWER_CHAT', drawerChat)
            } catch (error) {
                console.error(error);
            }
        },

        setFilters: ({commit}, filters) => {
            try {
                commit('SET_FILTERS', filters)
            } catch (error) {
                console.error(error);
            }
        },

        setSelectedFilter: ({commit}, filter) => {
            try {
                commit('SET_STATE_FILTER', filter)
            } catch (error) {
                console.error(error);
            }
        },
        
        setActiveBadge: ({commit}, badges) => {
            try {
                commit('SET_ACTIVE_BADGES', badges)
            } catch (error) {
                console.error(error);
            }
        },

        setAction: ({commit}, action) => {
            try {
                commit('SET_ACTION', action)
            } catch (error) {
                console.error(error);
            }
        },
        setBreadcrumbs: ({commit}, breadcrumbs) => {
            try{
                commit("SET_BREADCRUMBS", breadcrumbs);
            }catch(error){
                console.error(error);
            }
        }
    }
}