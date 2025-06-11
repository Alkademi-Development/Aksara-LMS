import {
    apiGetExt,
    apiGetAllStudio,
    apiGetListStudio,
    apiGetStudio,
    apiCreateStudio,
    apiEditStudio,
    apiDeleteStudio,
} from '@/api/studio.api';
import { data } from 'jquery';

export default {
    namespaced: true,
    state: {
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
    },
}