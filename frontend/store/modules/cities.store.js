import { apiGetCities, apiGetAvailableCities, apiSearchCities, apiGetLocationCities } from '@/api/cities.api';

export default {
    namespaced: true,
    state: {
        cities: [],
        message: '',
        status: false
    },

    mutations: {
        SET_RESPONSE(state, {message, status}){
            state.message = message;
            state.status = status;
        },
        SET_CITIES(state, {cities}){
            state.cities = cities
        }
    },

    actions: {
        async getLocationCities({commit}) {
            try {
                const response = await apiGetLocationCities();

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    cities: response.data.data
                }

                commit('SET_CITIES', payload);
            } catch (error) {
                console.log('Failed get cities: ', error);
            }
        },
        async getCities({commit}) {
            try {
                const response = await apiGetCities();

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    cities: response.data.data
                }

                commit('SET_CITIES', payload);
            } catch (error) {
                console.log('Failed get cities: ', error);
            }
        },
        async getAvailableCities({commit}, {batchId, programId}) {
            try {
                const response = await apiGetAvailableCities(batchId, programId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    cities: response.data.data
                }

                commit('SET_CITIES', payload);
            } catch (error) {
                console.log('Failed get cities: ', error);
            }
        },
        async searchCities({commit}, keyword) {
            try {
                const response = await apiSearchCities(keyword)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    cities: response.data.data
                }

                commit('SET_CITIES', payload)
            } catch (error) {
                console.log('Failed search cities: ', error)
            }
        }
    }
}