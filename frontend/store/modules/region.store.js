import {
    apiList,
    apiDetail,
    apiCreate,
    apiUpdate,
    apiDelete,
} from "@/api/region.api"

export default {
    namespaced: true,
    state: {
        // Response
        status: false,
        data: null,
        message: '',

        // Paginations
        pagination: {
            page: 1,
            perPage: 10,
            totalItems: 0,
            totalPages: 0,
        },
    },

    mutations: {
        SET_RESPONSE(state, { message, status, data }) {
            state.message = message
            state.status = status
            state.data = data
        },
        SET_PAGINATION(state, pagination) {
            state.pagination = pagination
        },
    },

    actions: {
        async list ({commit}, page) {
            try {
                const response = await apiList(page)

                if (page) {
                    const data = response.data.data

                    const resPayload = {
                        message: response.data.message,
                        status: response.data.status,
                        data: data.items
                    }
    
                    commit('SET_RESPONSE', resPayload)
                    
                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }
                    
                    commit('SET_PAGINATION', pagination);
                } else {
                    const resPayload = {
                        message: response.data.message,
                        status: response.data.status,
                        data: response.data.data
                    }
    
                    commit('SET_RESPONSE', resPayload)
                }
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async detail ({commit}, uuid) {
            try {
                const response = await apiDetail(uuid)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async create ({commit}, params) {
            try {
                const response = await apiCreate(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async update ({commit}, params) {
            try {
                const response = await apiUpdate(params?.uuid, params?.params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async delete ({commit}, uuid) {
            try {
                const response = await apiDelete(uuid)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
    }
}