import {
    apiGetDetailNews, 
} from "@/api/news.api"

export default {
    namespaced: true,
    state: {
        // Default Response
        status: false,
        data: null,
        message: '',

        // Object
        post: null,
        posts: null,

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
        SET_POST: (state, post) => {
            state.post = post
        },
        SET_POSTS: (state, posts) => {
            state.posts = posts
        },
        SET_PAGINATION(state, pagination) {
            state.pagination = pagination
        },
        SET_APPOINTMENT(state, appointment){
            state.appointment = appointment;
        }
    },

    actions: {
        getDetailPost: async ({commit}, { postId }) => {
            try {
                const response = await apiGetDetailPost(postId)

                const resPayload = { 
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_POST', response.data.data)
            } catch (error) {
                console.log('Failed get detail post: ', error)
            }
        },
    }
}