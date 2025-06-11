import {
    apiGetAssignments,
    apiGetStudentsAssignment,
    apiGetAssignmentToReview,
    apiCreateAssignment,
    apiEditAssignment,
    apiDetailAssignment,
    apiPublicAssignments,
    apiDeleteAssignment,
    apiGetAssignmentCounter,
    apiGetAssignmentStudentHistories
} from '@/api/assignments.api';

import { apiGetStudentsAssignmentV2 } from "@/api/v2/assignments.api";

export default {
    namespaced: true,
    state () {
        return {
            // Response
            data: null,
            message: '',
            status: false,

             // Paginations
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },

            counterAssignment: null,
            students: null,
            studentHistories: null,
        };
    },
    mutations: {
        SET_RESPONSE(state, { message, status, data }) {
            state.message = message
            state.status = status
            state.data = data
        },
        SET_COUNTERASSIGNMENT(state, { message, status, data }) {            
            state.message = message
            state.status = status
            state.counterAssignment = data
        },
        SET_PAGINATION(state, pagination){
            state.pagination = pagination
        },
        SET_RESPONSE_STATUS(state, { message, status }){
            state.message = message
            state.status = status
        },
        SET_STUDENTS(state, students){
            state.students = students;
        },
        SET_STUDENT_HISTORIES(state, histories){
            state.studentHistories = histories;
        }
    },
    actions: {
        async list({ commit }, params) {
            try {
                const response = await apiGetAssignments(
                    params?.classroomId, 
                    params?.page, 
                    params?.pageSize,
                    params?.order, 
                    params?.search, 
                    params?.moduleId, 
                    params?.type,
                    params?.moduleType,
                );
                let data = response?.data?.data

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: params?.page ? data?.items : data
                }
        
                commit('SET_RESPONSE', resPayload);
                
                if (params?.page) {
                    const pagination = {
                        page: data?.page,
                        perPage: data?.perPage,
                        totalItems: data?.totalItems,
                        totalPages: data?.totalPages,
                    }
    
                    commit('SET_PAGINATION', pagination);
                }
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async public ({ commit }, { user = null, slug = null }) {
            try {
                const response = await apiPublicAssignments(user, slug);
                let data = response?.data?.data

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: data
                }
        
                commit('SET_RESPONSE', resPayload);
                
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async students({ commit }, params) {
            try {
                const response = await apiGetStudentsAssignment(
                    params?.topicId, // Required
                    params?.minScore,
                    params?.search,
                    params?.maxScore,
                    params?.state,
                    params?.order,
                    params?.page,
                    params?.perPage
                );
                
                let data = response?.data?.data

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                }
                
                // I add state of is not store to data because if there is fetch data in same time in this store, the data will be replace with the new data.
                if(!params?.isNotStoreToData){
                    resPayload.data = params?.page ? data?.items : data
                    commit('SET_RESPONSE', resPayload);
                }else{
                    commit('SET_RESPONSE_STATUS', resPayload);
                    commit('SET_STUDENTS', params?.page ? data?.items : data);
                }
                
                if (params?.page) {
                    const pagination = {
                        page: data?.page,
                        perPage: data?.perPage,
                        totalItems: data?.totalItems,
                        totalPages: data?.totalPages,
                    }
    
                    commit('SET_PAGINATION', pagination);
                }
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async studentsV2({ commit }, params) {
            try {
                const response = await apiGetStudentsAssignmentV2(
                    params?.topicId, // Required
                    params?.minScore,
                    params?.search,
                    params?.maxScore,
                    params?.state,
                    params?.order,
                    params?.page,
                    params?.perPage,
                    params?.isExport
                );
                
                if (params?.isExport) {
                    const fileName = response.headers['content-disposition'].split('filename=')[1]

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName); //or any other extension
                    document.body.appendChild(link);
                    link.click();

                    const resPayload = {
                        message: response.status == 200 ? "export success" : "export failed",
                        status: response.status == 200 ? true : false,
                        data: null
                    };

                    commit('SET_RESPONSE', resPayload);
                } else {
                    let data = response?.data?.data

                    const resPayload = {
                        message: response?.data?.message,
                        status: response?.data?.status,
                        data: data?.items
                    }
            
                    commit('SET_RESPONSE', resPayload);
                    
                    if (params?.page) {
                        const pagination = {
                            page: data?.page,
                            perPage: data?.perPage,
                            totalItems: data?.totalItems,
                            totalPages: data?.totalPages,
                        }
        
                        commit('SET_PAGINATION', pagination);
                    }
                }
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async listReview({ commit }, params) {
            try {
                const response = await apiGetAssignmentToReview(params?.page, params?.perPage, params?.state, params?.classroomId, params?.order);
                let data = response?.data?.data

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: params?.page ? data?.items : data
                }
        
                commit('SET_RESPONSE', resPayload);
                
                if (params?.page) {
                    const pagination = {
                        page: data?.page,
                        perPage: data?.perPage,
                        totalItems: data?.totalItems,
                        totalPages: data?.totalPages,
                    }
    
                    commit('SET_PAGINATION', pagination);
                }
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async create({ commit }, { params }) {
            try {
                const response = await apiCreateAssignment(params);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data
                }
        
                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async edit({ commit }, { params, topicId }) {
            try {
                const response = await apiEditAssignment(params, topicId);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data
                }
        
                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async delete({ commit }, { classroomId, topicId }) {
            try {
                const response = await apiDeleteAssignment(classroomId, topicId);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data
                }
        
                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async detail({ commit }, { topicId }) {
            try {
                const response = await apiDetailAssignment(topicId);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data
                }
        
                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async counter({ commit }, { classroomId, topicId }) {
            try {
                const response = await apiGetAssignmentCounter(classroomId, topicId);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data
                }
        
                commit('SET_COUNTERASSIGNMENT', resPayload);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }
        
                commit('SET_RESPONSE', resPayload);
            }
        },
        async getStudentHistories({ commit }, { classroomId, topicId, page, pageSize }) {
            try {
                const response = await apiGetAssignmentStudentHistories(classroomId, topicId, page, pageSize);
                
                let data = response?.data?.data

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                }

                const pagination = {
                    page: data?.page,
                    perPage: data?.perPage,
                    totalItems: data?.totalItems,
                    totalPages: data?.totalPages,
                }

                commit('SET_RESPONSE_STATUS', resPayload);
                commit('SET_PAGINATION', pagination);
                commit('SET_STUDENT_HISTORIES', data?.items);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                }
        
                commit('SET_RESPONSE_STATUS', resPayload);
                commit('SET_STUDENT_HISTORIES', null);
            }
        },
    }
}