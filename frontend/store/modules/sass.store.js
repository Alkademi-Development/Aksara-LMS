import {
    apiGetAllSettings,
} from "@/api/sass.api"

export default {
    namespaced: true,
    state: () => ({
        status: false,
        isTestCase: false,
        isSchoolCase: false,
        message: '',
        data: null,
        settings: null,
        appVersion: null,
        isTokenValid: false,
        exchangeToken: null
    }),
    mutations: {
        SET_RESPONSE(state, { message, status }) {
            state.message = message
            state.status = status
        },
        SET_DATA(state, data){
            state.data = data
        },
        SET_SETTINGS(state, settings){
            state.settings = settings
        },
        SET_APP_VERSION(state, version) {
            state.appVersion = version
        },
    },
    actions: {
        async allSettings ({ commit }, { version }) {
            try {
                const response = await apiGetAllSettings(version)

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                let data = response?.data?.data;

                commit('SET_RESPONSE', resPayload);
                commit('SET_SETTINGS', data)

            } catch (error) {
                console.error("Failed to get all sass settings:", error);
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        }
    }
}