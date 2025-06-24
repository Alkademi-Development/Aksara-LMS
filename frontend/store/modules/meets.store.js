import { apiDeleteMeets, apiDetailMeetsV2, apiGetMeetsV2, apiPostMeets, apiUpdateMeets } from "~/api/v2/meet.api";

export default {
    namespaced: true,
    state() {
        return {
            meets: [],
            detailMeet: {},
            pagination: {
                currentPage: 0,
                perPage: 0,
                totalRows: 0,
                lastPage: 0,
            },
            message: '',
            status: false,
        }
    },
    mutations: {
        SET_RESPONSE(state, { message, status }) {
            state.message = message;
            state.status = status;
        },
        SET_MEETS(state, meets) {
            state.meets = meets;
        },
        SET_DETAIL_MEET(state, detailMeet) {
            state.detailMeet = detailMeet;
        },
    },
    actions: {
        async getMeetsV2({ commit }, classroomSlug) {
            try {
                const response = await apiGetMeetsV2(classroomSlug);

                const data = response.data;
                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);
                commit('SET_MEETS', data.data);
            } catch (error) {
                const resPayload = {
                    message: "Failed get meets:",
                    status: false
                };

                commit('SET_RESPONSE', resPayload);
                console.error('Failed get meets: ', error)
            }
        },
        
        async detailMeetsV2({ commit }, {classroomSlug, eventSlug}) {
            try {
                const response = await apiDetailMeetsV2(classroomSlug, eventSlug);

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);
                commit('SET_DETAIL_MEET', data.data);
            } catch (error) {
                const resPayload = {
                    message: "Failed get meets:",
                    status: false
                };

                commit('SET_RESPONSE', resPayload);
                console.error('Failed get meets: ', error)
            }
        },
        
        async storeMeets ({ commit }, params) {
            try {
                const response = await apiPostMeets(params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }
        
                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                console.error('Failed to create meets', error);
            }
        },

        async updateMeets ({ commit }, { params, eventId }) {

            try {
                const response = await apiUpdateMeets(params, eventId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }
        
                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                console.error('Failed to update meets', error);
            }
        },

        async deleteMeets ({ commit }, { eventId, classroomId }) {
            try {
                const response = await apiDeleteMeets(eventId, classroomId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }
        
                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                console.error('Failed to delete meets', error);
            }
        },
    },
}