import { apiGetDriveAssets, apiUploadDriveAssets } from "@/api/drive.api"

export default {
    namespaced: true,
    state: {
        message: '',
        status: false,
        data: null
    },

    mutations: {
        SET_RESPONSE(state, { message, status, data }) {
            state.message = message
            state.status = status
            state.data = data
        },
    },

    actions: {
        async get({ commit }, path) {
            try {
                const response = await apiGetDriveAssets(path)

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: "Failed to get assets",
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async upload({ commit }, params) {
            try {
                const response = await apiUploadDriveAssets(params)

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: "Failed to upload assets",
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
    }
}