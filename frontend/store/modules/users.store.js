import {
    apiEditUser,
    apiGetDetailUser,
    apiGetUsers,
    apiPostUser
} from "@/api/users.api"

export default {
    namespaced: true,
    state: {
        // Default Response
        status: false,
        data: null,
        message: '',

        // Object
        user: null,
        users: null,

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
        SET_USER: (state, user) => {
            state.user = user
        },
        SET_USERS: (state, users) => {
            state.users = users
        },
        SET_PAGINATION(state, pagination) {
            state.pagination = pagination
        },
    },

    actions: {
        users: async ({ commit }, { page, kind, keyword, isChat, certified }) => {
            try {
                const response = await apiGetUsers(page, kind, keyword, isChat, certified)
                const data = response?.data?.data

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: data,
                }

                commit('SET_RESPONSE', resPayload);

                if (page) {
                    const pagination = {
                        page: data?.page,
                        perPage: data?.perPage,
                        totalItems: data?.totalItems,
                        totalPages: data?.totalPages,
                    }

                    commit('SET_USERS', data.items);
                    commit('SET_PAGINATION', pagination);
                } else {
                    commit('SET_USERS', data);
                }

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        getDetailUser: async ({commit}, userId) => {
            try {
                const response = await apiGetDetailUser(userId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    user: response.data.data
                }

                commit('SET_USER', payload)
            } catch (error) {
                console.log('Failed get detail user: ', error)
            }
        },

        postUser: async ({commit}, params) => {
            try {
                const response = await apiPostUser(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    user: response.data.data
                }

                commit('SET_USER', payload)
            } catch (error) {
                console.log('Failed post user: ', error)
            }
        },

        editUser: async ({commit}, {userId, body}) => {
            try {
                const response = await apiEditUser(userId, body)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    user: response.data.data
                }

                commit('SET_USER', payload)
            } catch (error) {
                console.log('Failed post user: ', error)
            }
        },
    }
}