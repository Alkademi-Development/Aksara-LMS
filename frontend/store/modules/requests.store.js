import { apiGetRequestStudents, postApproveStudent, postRejectStudent, } from "@/api/request.api";

export default {
    namespaced: true,
    state: {
        users: [],
        message: '',
        status: false,
        page: {},
        data_count: {}
    },
    mutations: {
        SET_USER_REQUEST(state, users) {
            state.users = users.data
            state.page = users.page
            state.data_count = users.data_count
        },
        SET_RES(state, data) {
            state.message = data.message,
            state.status = data.status
        }
    },
    getters: {
        getRequestStudents(state) {
            return state.users
        }
    },
    actions: {
        async fetchRequestStudents({commit}, page) {
            try {
                const response = await apiGetRequestStudents(page)
                const data = response.data

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RES', resPayload)
                commit('SET_USER_REQUEST', data)   
            } catch (error) {
                console.error("FAILED TO REQUEST USER DATA", error);
            }
        },
        async storeApproveStudent({commit}, payload) {
            try {
                const response = await postApproveStudent(payload.batch_id, payload.program_id, payload.student_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RES', resPayload)
            } catch (error) {
                console.error("FAILED TO APPROVE STUDENT", error);
            }
        },
        async storeRejectStudent({commit}, payload) {
            try {
                const response = await postRejectStudent(payload.batch_id, payload.program_id, payload.student_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RES', resPayload)
            } catch (error) {
                console.error("FAILED TO REJECT STUDENT", error);
            }
        }
    }
}