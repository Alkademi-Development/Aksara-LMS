import { 
    getPretestQuestion, 
    getStudentPretestById, 
    postPretestAnswer, 
    pretestMetronom, 
    pretestMetronomRespondents 
} from "@/api/pretest.api"

export default {
    namespaced: true,
    state: {
        questionPretest: [],
        answerPretest: [],
        studentPretest: {},
        message: '',
        status: false,
        data: ''
    },

    mutations: {
        SET_RESPONSE(state, { message, status }){
            state.message = message
            state.status = status
        },
        SET_DATA(state, { data }){
            state.data = data
        },
        SET_PRETEST_QUESTION(state, questionPretest){
            state.questionPretest = questionPretest
        },
        SET_DETAIL_PRETEST(state, answerPretest){
            state.answerPretest = answerPretest
        },
        SET_STUDENT_PRETEST(state, studentPretest){
            state.studentPretest = studentPretest
        }
    },

    actions: {
        async fetchPretestMetronomRespondents({commit}, {moduleId, userId}) {
            try {
                const response = await pretestMetronomRespondents(moduleId, userId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    data: response.data.data
                }

                commit('SET_DATA', payload);
            } catch (error) {
                console.error("Failed to get metronom respondent", error);
            }
        },
        async fetchPretestMetronom({commit}, moduleId) {
            try {
                const response = await pretestMetronom(moduleId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    data: response.data.data
                }

                commit('SET_DATA', payload);
            } catch (error) {
                console.error("Failed to get pretests metronom", error);
            }
        },
        async fetchPretestQuestion({commit}, payload) {
            try {
                const response = await getPretestQuestion(payload.program_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_PRETEST_QUESTION', response.data.data);
            } catch (error) {
                console.error("Failed to get Pretest Question", error);
            }
        },
        async fetchStudentPretestById({commit}, payload) {
            try {
                const response = await getStudentPretestById(payload.batch_id, payload.program_id, payload.student_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_STUDENT_PRETEST', response.data.data);
            } catch (error) {
                console.error("Failed to get Student Pretest", error);
            }
        },
        async storePretestAnswer({commit}, payload) {
            try {
                const response = await postPretestAnswer(payload)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error("Failed to store Prestest Answer", error);
            }
        }
    }
}