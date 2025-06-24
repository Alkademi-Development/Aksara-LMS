import { apiGetMentors } from '@/api/mentors.api';

export default {
    namespaced: true,
    state: {
        mentors: [],
        message: '',
        status: false
    },

    mutations: {
        SET_RESPONSE(state, {message, status}){
            state.message = message;
            state.status = status;
        },
        SET_MENTORS(state, {mentors}){
            state.mentors = mentors
        }
    },

    actions: {
        async getMentors({commit}) {
            try {
                const response = await apiGetMentors();

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    mentors: response.data.data
                }

                commit('SET_MENTORS', payload);
            } catch (error) {
                console.log('Failed get mentors request: ', error);
            }
        }
    }
}