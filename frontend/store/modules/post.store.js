import { 
    apiEditPost, 
    apiGetDetailPost, 
    apiGetPosts, 
    apiCreatePost, 
    apiDeletePost,
    apiGetDetailPostV2
} from "@/api/posts.api"

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
    },

    

    actions: {
        posts: async ({ commit }, { page, kind }) => {
            try {
                const response = await apiGetPosts(page, kind)
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

                    commit('SET_POSTS', data.items);
                    commit('SET_PAGINATION', pagination);
                } else {
                    commit('SET_POSTS', data);
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

        getDetailPost: async ({commit}, postId) => {
            try {
                const response = await apiGetDetailPost(postId)

                const resPayload = { 
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    post: response.data.data
                }

                commit('SET_POST', payload)
            } catch (error) {
                console.log('Failed get detail post: ', error)
            }
        },

        getDetailPostV2: async ({commit}, slug) => {
            try {
                const response = await apiGetDetailPostV2(slug)

                const resPayload = { 
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    post: response.data.data
                }

                commit('SET_POST', payload)
            } catch (error) {
                console.log('Failed get detail post: ', error)
            }
        },
        
        createPost: async ({commit}, params) => {
            try {
                const response = await apiCreatePost(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                

                const payload = {
                    post: response.data.data
                }

                commit('SET_POST', payload)
            } catch (error) {
                console.log('Failed post post: ', error)
            }
        },

        editPost: async ({commit}, { id, body }) => {
            try {
                const response = await apiEditPost(id, body)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                

                const payload = {
                    post: response.data.data
                }

                commit('SET_POST', payload)
            } catch (error) {
                console.log('Failed post post: ', error)
            }
        },

        deletePost: async ({commit}, postId) => {
            try {
                const response = await apiDeletePost(postId)

                const resPayload = { 
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    post: response.data.data
                }

                commit('SET_POST', payload)
            } catch (error) {
                console.log('Failed delete post: ', error)
            }
        },
    }
}