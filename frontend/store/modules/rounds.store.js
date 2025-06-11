import {
    apiGetRounds,
    apiGetRoundDetail,
    apiCreateRound,
    apiEditRound,
    apiGetCurrentRound,
    apiPostScore,
    apiContinueRound
} from "@/api/round.api"

export default {
    namespaced: true,
    state: {
        rounds: [],
        score: null,
        message: '',
        status: false
    },

    mutations: {
        SET_RESPONSE(state, { message, status }){
            state.message = message
            state.status = status
        },
        SET_ROUNDS(state, {rounds}){
            state.rounds = rounds
        },
        SET_PAGINATION(state, {pagination}){
            state.pagination = pagination
        },
    },

    actions: {
        async continueRound({commit}) {
            try {
                const response = await apiContinueRound()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                console.error("Failed to get Rounds", error);
            }
        },
        async getRounds ({commit}, {batch_id, page}) {
            try {
                const response = await apiGetRounds(batch_id, page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    rounds: response.data.data
                }

                commit('SET_ROUNDS', payload)

                var data = response.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                    }
                }

                commit('SET_PAGINATION', pagePayload)
            } catch (error) {
                console.error("Failed to get Rounds", error);
            }
        },
        async getRoundDetail ({commit}, round_id) {
            try {
                const response = await apiGetRoundDetail(round_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    rounds: response.data.data
                }

                commit('SET_ROUNDS', payload)
            } catch (error) {
                console.error("Failed to get Rounds", error);
            }
        },
        async createRound ({commit}, {batch_id, params}) {
            try {
                const response = await apiCreateRound(batch_id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error("Failed to create Rounds", error);
            }
        },
        async editRound ({commit}, {batch_id, round_id, params}) {
            try {
                const response = await apiEditRound(batch_id, round_id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error("Failed to edit Rounds", error);
            }
        },
        async current ({commit}) {
            try {
                const response = await apiGetCurrentRound()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
                
                const payload = {
                    rounds: response.data.data
                }

                commit('SET_ROUNDS', payload)
            } catch (error) {
                console.error("Failed to edit Rounds", error);
            }
        },
        async postScore ({ commit }, { round_id, student_id, params }) {
            try {
                const response = await apiPostScore(round_id, student_id, params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('failed post score: ', error);
            }
        },
    }
}