import { apiGetSchedules } from '@/api/schedules.api';

export default {
    namespaced: true,
    state: {
        schedules: [],
        message: '',
        status: false
    },

    mutations: {
        SET_RESPONSE(state, {message, status}){
            state.message = message;
            state.status = status;
        },
        SET_SCHEDULES(state, {schedules}){
            state.schedules = schedules
        }
    },

    actions: {
        async getSchedules({commit}, params) {
            try {
                const response = await apiGetSchedules(params?.day, params?.month, params?.year);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    schedules: response.data.data
                }

                commit('SET_SCHEDULES', payload);
            } catch (error) {
                console.error('Failed get schedules: ', error);
            }
        },
    }
}