import { 
    apiGetPrograms,
    apiGetProgramById,
    apiPostProgram,
    apiEditProgram,
    apiPostBatch,
    apiGetBatch,
    apiGetBatchs,
    apiGetBatchById,
    apiGetCitiesByBatch,
    apiGetAllPrograms,
    apiEditBatch,
    apiGetRanking
 } from '@/api/programs.api';

export default {
    namespaced: true,
    state: {
        programs: [],
        batch: [],
        cities: [],
        rankings: [],
        message: '',
        status: false,
        pagination: {
            currentPage: 0,
            perPage: 0,
            totalRows: 0,
            lastPage: 0
        },
    },

    mutations: {
        SET_RESPONSE(state, {message, status}){
            state.message = message;
            state.status = status;
        },
        SET_PAGINATION(state, {pagination}){
            state.pagination = pagination
        },
        SET_PROGRAMS(state, {programs}){
            state.programs = programs
        },
        SET_BATCH(state, {batch}){
            state.batch = batch
        },
        SET_CITIES(state, {cities}){
            state.cities = cities
        },
        SET_RANKINGS(state, {rankings}) {
            state.rankings = rankings
        }
    },

    actions: {
        async getPrograms({commit}) {
            try {
                const response = await apiGetPrograms();

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    programs: response.data.data
                }

                commit('SET_PROGRAMS', payload);
            } catch (error) {
                console.log('Failed get programs: ', error);
            }
        },
        async getProgramById({commit}, program_id) {
            try {
                const response = await apiGetProgramById(program_id);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    programs: response.data.data
                }

                commit('SET_PROGRAMS', payload);
            } catch (error) {
                console.log('Failed get programs: ', error);
            }
        },
        async postProgram({commit}, {params}) {
            try {
                const response = await apiPostProgram(params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.log('Failed get programs: ', error);
            }
        },
        async editProgram({commit}, {program_id, params}) {
            try {
                const response = await apiEditProgram(program_id, params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.log('Failed get programs: ', error);
            }
        },
        async getAllPrograms({commit}) {
            try {
                const response = await apiGetAllPrograms();

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    programs: response.data.data
                }

                commit('SET_PROGRAMS', payload);
            } catch (error) {
                console.log('Failed get programs: ', error);
            }
        },
        async postBatch({commit}, {params}) {
            try {
                const response = await apiPostBatch(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                
            } catch (error) {
                console.log('Failed post batch: ', error)
            }
        },
        async editBatch({commit}, {id, params}) {
            try {
                const response = await apiEditBatch(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                
            } catch (error) {
                console.log('Failed edit batch: ', error)
            }
        },
        async getBatch({commit}, page) {
            try {
                const response = await apiGetBatch(page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    batch: response.data.data
                }

                commit('SET_BATCH', payload)

                var data = response.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                        lastPage: data.page.last_page
                    }
                }

                commit('SET_PAGINATION', pagePayload)

            } catch (error) {
                console.log('Failed get batch: ', error)
            }
        },
        async getBatchs({commit}) {
            try {
                const response = await apiGetBatchs()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    batch: response.data.data
                }

                commit('SET_BATCH', payload)

            } catch (error) {
                console.log('Failed get all batch: ', error)
            }
        },
        async getBatchById({commit}, batch_id) {
            try {
                const response = await apiGetBatchById(batch_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    batch: response.data.data
                }

                commit('SET_BATCH', payload)
            } catch (error) {
                console.log('Failed get batch: ', error)
            }
        },
        async getCitiesByBatch({commit}, batch_id) {
            try {
                const response = await apiGetCitiesByBatch(batch_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    batch: response.data.data
                }

                commit('SET_CITIES', payload)
            } catch (error) {
                console.log('Failed get batch: ', error)
            }
        },
        async getRankings({commit}) {
            try {
                const response = await apiGetRanking();

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    rankings: response.data.data
                }

                commit('SET_RANKINGS', payload)
            } catch (error) {
                console.log('Failed get rankings: ', error)
            }
        }
    }
}