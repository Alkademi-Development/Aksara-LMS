import {
    apiGetClassroomList,
    apiGetActiveClassroom,
    apiGetClassroomDetail,
    apiEditClassroom,
    apiStartClassroom,
    apiGetClassroomModuleTasks,
    apiGetClassroomTaskDetail,
    apiStudentAssignTask,
    apiMentorVerifyTask,
    apiGenerateClassrooms,
    apiCreateUserEditor,
    apiGetStudentTaskList,
    apiAddForm,
    apiFormRespondents,
    apiCekGenerateClass,
    apiCreateClassroom,
    apiStartFormAnswer,
    apiGetProgress,
    apiLeaderboards,
    apiLeaderboardsExport
} from '@/api/classroom.api';

import {
    apiClassroomModuleCounterV3,
    apiClassroomModuleCounterListV3,
    apiClassroomListModulesV3,
    apiDetailModuleV3,
    apiListTopicsV3,
    apiDetailTopicV3,
    apiUnlockTopicV3,
    apiClassroomRemoveModuleV3,
    apiUnlockModuleV3,
} from "~/api/v3/classroom.api.js"

export default {
    namespaced: true,
    state() {
        return {
            classrooms: [],
            classroom: null,
            counter: null,
            tasks: [],
            task: null,
            editor: null,
            respondents: [],
            startData: null,
            progress: null,
            leaderboardDetail: null,
            pagination: {
                currentPage: 0,
                perPage: 0,
                totalRows: 0,
                lastPage: 0,
            },
            message: '',
            status: false,

            moduleCounter: null,
            moduleCounterList: null,
            listModules: null,
            detailModule: null,
            listTopics: null,
            detailTopic: null,
            unlockTopic: null,
        }
    },
    mutations: {
        SET_RESPONSE(state, { message, status }) {
            state.message = message;
            state.status = status;
        },
        SET_CLASSROOMS(state, { classrooms }) {
            state.classrooms = classrooms;
        },
        SET_CLASSROOM(state, { classroom }) {
            state.classroom = classroom;
        },
        SET_TASKS(state, { tasks }) {
            state.tasks = tasks;
        },
        SET_COUNTER(state, { counter }) {
            state.counter = counter;
        },
        SET_TASK(state, { task }) {
            state.task = task;
        },
        SET_EDITOR(state, { editor }){
            state.editor = editor;
        },
        SET_PAGINATION(state, { pagination }){
            state.pagination = pagination;
        },
        SET_RESPONDENTS(state, respondents){
            state.respondents = respondents;
        },
        SET_START_ANSWER(state, data){
            state.startData = data;
        },
        SET_PROGRESS(state, data){
            state.progress = data;
        },
        SET_LEADERBOARD(state, data){
            state.leaderboardDetail = data;
        },
        SET_MODULE_COUNTER(state, data){
            state.moduleCounter = data;
        },
        SET_MODULE_COUNTER_LIST(state, data){
            state.moduleCounterList = data;
        },
        SET_LIST_MODULES(state, data){
            state.listModules = data;
        },
        SET_DETAIL_MODULE(state, data){
            state.detailModule = data
        },
        SET_LIST_TOPICS(state, data){
            state.listTopics = data;
        },
        SET_DETAIL_TOPIC(state, data){
            state.detailTopic = data;
        },
        SET_UNLOCK_TOPIC(state, data){
            state.unlockTopic = data
        }
    },
    actions: {
        async getLeaderboards({ commit }, classroomId) {
            try {
                const response = await apiLeaderboards(classroomId);

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);
                commit('SET_LEADERBOARD', data.data);
            } catch (error) {
                const resPayload = {
                    message: "Failed get progress:",
                    status: false
                };

                commit('SET_RESPONSE', resPayload);
                console.error('Failed get progress: ', error)
            }
        },
        async exportLeaderboards({ commit }, classroomId) {
            try {
                const response = await apiLeaderboardsExport(classroomId);

                const fileName = response.headers['content-disposition'].split('filename=')[1]

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); //or any other extension
                document.body.appendChild(link);
                link.click();

                const resPayload = {
                    message: response.status == 200 ? "export success" : "export failed",
                    status: response.status == 200 ? true : false
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                const resPayload = {
                    message: "Failed export leaderboard:",
                    status: false
                };

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getProgress({ commit }) {
            try {
                const response = await apiGetProgress();

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);
                commit('SET_PROGRESS', data.data);
            } catch (error) {
                const resPayload = {
                    message: "Failed get progress:",
                    status: false
                };

                commit('SET_RESPONSE', resPayload);
                console.error('Failed get progress: ', error)
            }
        },
    },
    actions: {
        async startFormAnswer({ commit }, {classroomId, moduleId}) {
            try {
                const response = await apiStartFormAnswer(classroomId, moduleId);

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);
                commit('SET_START_ANSWER', data.data);
            } catch (error) {
                const resPayload = {
                    message: "Failed start form answer:",
                    status: false
                };

                commit('SET_RESPONSE', resPayload);
                console.error('Failed start form answer: ', error)
            }
        },
        async createClassroom({ commit }, params) {
            try {
                const response = await apiCreateClassroom(params);

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                const resPayload = {
                    message: "Failed create classroom:",
                    status: false
                };

                commit('SET_RESPONSE', resPayload);
                console.error('Failed create classroom: ', error)
            }
        },
        async cekGenerateClass({ commit }) {
            try {
                const response = await apiCekGenerateClass();

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                const payload = {
                    classroom: data.data
                };

                commit('SET_RESPONSE', resPayload);
                commit('SET_CLASSROOM', payload);
            } catch (error) {
                console.error('Failed cek generate class: ', error)
            }
        },
        async getClassroomsList({ commit }, { page }) {
            try {
                const response = await apiGetClassroomList(page);

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    classrooms: data.data
                }

                commit('SET_CLASSROOMS', payload);

                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                        lastPage: data.page.last_page,
                    }
                };

                commit('SET_PAGINATION', pagePayload);
            } catch (error) {
                console.error('Failed get classrooms list: ', error)
            }
        },
        async getActiveClassroom ({ commit }) {
            try {
                const response = await apiGetActiveClassroom();

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    classroom: data.data
                }

                commit('SET_CLASSROOM', payload);
            } catch (error) {
                console.error('Failed get active classroom: ', error);
            }
        },
        async getClassroomById({ commit }, { id }) {
            try {
                const response = await apiGetClassroomDetail(id);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    classroom: response.data.data
                }

                commit('SET_CLASSROOM', payload);

            } catch (error) {
                console.error('Failed get classroom detail: ', error)
            }
        },
        async editClassroom ({ commit }, { id, params }) {
            try {
                const response = await apiEditClassroom(id, params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed edit classroom: ', error)
            }
        },
        async startClassroom ({ commit }, { id, params }) {
            try {
                const response = await apiStartClassroom(id, params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed start classroom: ', error);
            }
        },
        async getTasksList({ commit }, { classroom_id, module_id, page }) {
            try {
                const response = await apiGetClassroomModuleTasks(classroom_id, module_id, page);

                const data = response.data;

                const resPayload = {
                    message: data.message,
                    status: data.status
                };

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    tasks: data.data
                }

                commit('SET_TASKS', payload);

                const counter = {
                    counter: data.counter
                }

                commit('SET_COUNTER', counter);

                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                    }
                };

                commit('SET_PAGINATION', pagePayload);
            } catch (error) {
                console.error('Failed get tasks list: ', error)
            }
        },
        async getTaskDetail({ commit }, { classroom_id, module_id, student_id }) {
            try {
                const response = await apiGetClassroomTaskDetail(classroom_id, module_id, student_id);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    task: response.data.data
                }

                commit('SET_TASK', payload);

            } catch (error) {
                console.error('Failed get task detail: ', error)
            }
        },
        async assignTask ({ commit }, { classroom_id, module_id, params }) {
            try {
                const response = await apiStudentAssignTask(classroom_id, module_id, params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed assign task: ', error)
            }
        },
        async verifyTask ({ commit }, { classroom_id, module_id, student_id, params }) {
            try {
                const response = await apiMentorVerifyTask(classroom_id, module_id, student_id, params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed verify task: ', error)
            }
        },
        async generate ({ commit }, params ) {
            try {
                const response = await apiGenerateClassrooms(params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed generate task: ', error)
            }
        },
        async createUserEditor ({ commit }, params ) {
            try {
                const response = await apiCreateUserEditor(params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    editor: response.data.data
                };

                commit('SET_EDITOR', payload);
            } catch (error) {
                console.error('Failed create editor: ', error)
            }
        },
        async getStudentTaskList ({ commit }, {page, studentId} ) {
            try {
                const response = await apiGetStudentTaskList(page, studentId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    tasks: response.data.data
                };

                commit('SET_TASKS', payload);

                const pagePayload = {
                    pagination: {
                        currentPage: response.data.page.current_page,
                        lastPage: response.data.page.last_page,
                        perPage: response.data.data_count.per_page,
                        totalRows: response.data.data_count.total_data,
                    }
                };

                commit('SET_PAGINATION', pagePayload);
            } catch (error) {
                console.error('Failed create editor: ', error)
            }
        },
        async addForm ({ commit }, {classroomId, moduleId, params} ) {
            try {
                const response = await apiAddForm(classroomId, moduleId, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed add form: ', error)
            }
        },
        async formRespondents ({ commit }, formId ) {
            try {
                const response = await apiFormRespondents(formId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);

                const respondents = response.data.data

                commit('SET_RESPONDENTS', respondents)
            } catch (error) {
                console.error('Failed get form respondents: ', error)
            }
        },
        async getModuleCounter({commit}, {classroomSlug, moduleSlug, userId}){
            try{

                const response = await apiClassroomModuleCounterV3(classroomSlug, moduleSlug, userId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_MODULE_COUNTER', response.data.data)

            }catch(error){
                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getModuleCounterList({commit}, {classroomSlug, userId}){
            try{

                const response = await apiClassroomModuleCounterListV3(classroomSlug, userId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_MODULE_COUNTER_LIST', response.data.data)

            }catch(error){
                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getListModules({commit}, { classroomSlug, keyword = null, sort = null }){
            try{
                
                const response = await apiClassroomListModulesV3(classroomSlug, keyword, sort);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_LIST_MODULES', response.data.data)

            }catch(error){

                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);

            }
        },
        async getDetailModule({ commit }, { classroomSlug, moduleUUID }){
            try{
                const response = await apiDetailModuleV3(classroomSlug, moduleUUID);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_DETAIL_MODULE', response.data.data)
            }catch(error){

                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);

            }
        },
        async getListTopics ({commit}, { classroomSlug, moduleUUID }) {
            try {
                const response = await apiListTopicsV3(classroomSlug, moduleUUID)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_LIST_TOPICS', response.data.data);

            } catch (error) {
                
                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getDetailTopic ({commit}, { classroomSlug, topicUUID }) {
            try {
                const response = await apiDetailTopicV3(classroomSlug, topicUUID)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_DETAIL_TOPIC', response.data.data);

            } catch (error) {
                
                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getUnlockTopic({ commit }, { classroomSlug, topicUUID, completed = false }){
            try{
                
                const response = await apiUnlockTopicV3(classroomSlug, topicUUID, completed);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_UNLOCK_TOPIC', response.data.data);

            }catch(error){

                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);

            }
        },
        async removeModuleV3 ({commit}, { classroomSlug, moduleUUID }) {
            try {
                const response = await apiClassroomRemoveModuleV3(classroomSlug, moduleUUID)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getUnlockModule({commit}, { classroomSlug, moduleUUID }){
            try{
                
                const response = await apiUnlockModuleV3(classroomSlug, moduleUUID);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_DETAIL_MODULE', response.data.data)
            }catch(error){

                const resPayload = {
                    message: error,
                    status: false,
                }

                commit('SET_RESPONSE', resPayload);

            }
        }
    }
}