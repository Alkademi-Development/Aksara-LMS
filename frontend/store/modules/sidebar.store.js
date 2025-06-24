export default {
    namespaced: true,
    state: {
        role: ''
    },
    mutations: {
        SET_ROLE(state, role ) {
            state.role = role
        }
    },
    actions: {
        setSidebarRole({commit}, {kind, type}) {
            var sidebarRole = ''

            // Set the roles for filtering menu sidebars
            switch (kind) {
                case 0:
                    sidebarRole = 'superadmin'
                    break;
                case 1:
                    sidebarRole = 'admin'
                    break;
                case 2:
                    sidebarRole = 'mentor'
                    break;
                case 3:
                    sidebarRole = 'teacher'
                    break;
                case 4:
                    sidebarRole = 'student'
                    break;
                case 5:
                    sidebarRole = 'industry'
                    break;
                case 6:
                    sidebarRole = 'writer'
                    break;
                case 7:
                    sidebarRole = 'lead_program'
                    break;
                case 8:
                    sidebarRole = 'partner'
                    break;
                case 9:
                    sidebarRole = 'lead_region'
                    break;
                default:
                    sidebarRole = null
                    break;
            }

            if(!type) localStorage.setItem('user_kind', sidebarRole)

            commit('SET_ROLE', sidebarRole)
        }
    }
}