import {
    apiGetAllForms,
    apiCreateForm,
    apiFormDetail,
    apiEditForm,
    apiGetForms,
    apiDeleteForms,
    apiCategories,
    apiCreateCategories,
    apiDetailCategories,
    apiEditCategories,
    apiDeleteCategories,
    apiFormQuestion,
    apiFormAddQuestion,
    apiFormDetailQuestion,
    apiFormEditQuestion,
    apiFormDeleteQuestion
} from '@/api/forms.api';

export default {
    namespaced: true,
    state: {
        forms: [],
        categories: [],
        questions: [],
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
        SET_FORMS(state, forms){
            state.forms = forms
        },
        SET_CATEGORIES(state, categories){
            state.categories = categories
        },
        SET_QUESTIONS(state, questions){
            state.questions = questions
        },
    },

    actions: {
        async getAllForms({commit}) {
            try {
                const response = await apiGetAllForms()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                commit('SET_FORMS', response.data.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async createForm({commit}, params) {
            try {
                const response = await apiCreateForm(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async formDetail({commit}, id) {
            try {
                const response = await apiFormDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async editForm({commit}, {id, params}) {
            try {
                const response = await apiEditForm(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async getForms({commit}, { page, kind, keyword }) {
            try {
                const response = await apiGetForms(page, kind, keyword)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                commit('SET_FORMS', response.data.data?.items)

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
            }
        },
        async deleteForms({commit}, id) {
            try {
                const response = await apiDeleteForms(id)

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
            }
        },
// Categories
        async categories({commit}, page) {
            try {
                const response = await apiCategories(page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

                if (page) {
                    var data = response.data.data
                    const pagePayload = {
                        pagination: {
                            currentPage: data.page,
                            perPage: data.perPage,
                            totalRows: data.totalItems,
                        }
                    }

                    commit('SET_CATEGORIES', data.items)
                    commit('SET_PAGINATION', pagePayload)
                } else commit('SET_CATEGORIES', response.data.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async createCategories({commit}, params) {
            try {
                const response = await apiCreateCategories(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async detailCategories({commit}, id) {
            try {
                const response = await apiDetailCategories(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async editCategories({commit}, {id, params}) {
            try {
                const response = await apiEditCategories(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async deleteCategories({commit}, id) {
            try {
                const response = await apiDeleteCategories(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
// Questions
        async formQuestion({commit}, {id, page}) {
            try {
                const response = await apiFormQuestion(id, page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

                var data = response.data.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page,
                        perPage: data.perPage,
                        totalRows: data.totalItems,
                    }
                }

                commit('SET_QUESTIONS', data.items)
                commit('SET_PAGINATION', pagePayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async formAddQuestion({commit}, {formId, params}) {
            try {
                const response = await apiFormAddQuestion(formId, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async formDetailQuestion({commit}, {formId, questionId}) {
            try {
                const response = await apiFormDetailQuestion(formId, questionId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async formEditQuestion({commit}, {formId, questionId, params}) {
            try {
                const response = await apiFormEditQuestion(formId, questionId, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async formDeleteQuestion({commit}, {formId, questionId}) {
            try {
                const response = await apiFormDeleteQuestion(formId, questionId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
    },
}