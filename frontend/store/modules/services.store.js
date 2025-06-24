import {
    // Auth
    apiCities,
    apiProvinces,

    // User
    apiAuthorize,
    apiUserDetail,
    apiUpdateProfile,
    apiDetailUserbyHashEmail,

    // Classrooms
    apiCreateClassroom,
    apiEditClassroom,
    apiClassrooms,
    apiClassroomsHistory,
    apiDraftClassrooms,
    apiActiveClassrooms,
    apiDeleteClassroom,
    apiClassroomDetail,
    apiClassroomOverview,
    apiClassroomSyllabus,
    apiClassroomModules,
    apiClassroomTopics,
    apiClassroomTopicsDetail,
    apiClassroomAssignModule,
    apiClassroomDeleteModule,
    apiClassroomAssignments,
    apiRaportAssignments,
    apiClassroomEnroll,
    apiClassroomAssignScore,
    apiClassroomAssignTask,
    apiClassroomAssignLink,
    apiClassroomLeaderboards,
    apiClassroomPretestLeaderboards,
    apiClassroomLeaderboardsExport,
    apiClassroomPretestLeaderboardsExport,
    apiClassroomRelease,
    apiClassroomStudents,
    apiClassroomStudentsNotJoin,
    apiClassroomInviteStudent,
    apiClassroomKickStudent,
    apiClassroomPublishPretest,
    apiClassroomRequirements,
    // apiClassroomMentors,
    apiClassroomRemoveMentor,
    apiClassroomAssignMentors,
    apiPublicAssignment,
    apiStudentAssignmentDetail,

    // Certificate
    apiCertificates,
    apiCertificateDownload,
    apiCertificateRaporDownload,

    // Programs
    apiAllPrograms,
    apiProgramDetail,
    apiPrograms,
    apiCreateProgram,
    apiEditProgram,
    apiDeleteProgram,

    // Modules
    apiModules,
    apiModuleDetail,
    apiCreateModule,
    apiEditModule,
    apiDeleteModule,
    apiClassroomCreateModule,
    apiClassroomEditModule,
    apiClassroomModuleDeleted,
    apiClassroomDetailModule,
    apiGetListModulesLibrary,
    apiGetListModulesDraft,
    apiPublishModule,
    apiClassroomPublishModule,

    // Topics
    apiAllTopics,
    // apiTopics,
    apiTopicDetail,
    apiCreateTopic,
    apiEditTopic,
    apiDeleteTopic,
    apiClassroomCreateTopic,
    apiClassroomEditTopic,
    apiClassroomDeleteTopic,
    apiClassroomPublishTopic,
    apiClassroomRemoveTopic,

    // Blogs
    apiBlogs,
    apiDetailPost,
    apiCreateBlog,
    apiEditBlog,
    apiDeletePost,
    apiGalleries,
    apiCreateGallery,
    apiEditGallery,
    apiTopicsByClassId,
    apiLocationList,

    // Newsletters
    apiGetNewsletterList,
    apiGetNewsletterDetail,
    apiPostNewsletter,

    // Attendance
    apiCreateClassAttendance,
    apiCreatePostAttendance,
    // apiCreateMeetAttendance,
    apiGetDetailAttendance,
    apiEditClassAttendance,
    apiEditPostAttendance,
    apiEditMeetAttendance,
    apiGetClassAttendanceRecap,
    apiGetMeetAttendanceRecap,
    apiGetPostAttendanceRecap,
    apiGetClassAttendanceStatus,
    apiPostAttendanceRecapExport,
    apiGetClassAttendanceUser,
    apiGetPostAttendanceUser,
    apiUploadFile,
} from "@/api/services.api"

import {
    apiClassroomMentorsV2,
    apiClassroomModulesV2,
    apiClassroomTopicsV2,
    apiGetStudents,
    apiClassroomTopicDetailV2,
    apiClassroomDetailModuleV2,
    apiClassroomAssignModules
} from "~/api/v2/classroom.api"

import { apiTopicsV2, apiGetDetailTopicV2, apiEditTopicV2, apiDeleteTopicV2, apiDetailModuleV2 } from '@/api/v2/module.api'
import { apiClassroomRemoveModuleV3 } from "~/api/v3/classroom.api"
import { apiUnsubsNewsletter } from "~/api/newsletter.api"

export default {
    namespaced: true,
    state: {
        // Response
        status: false,
        data: null,
        message: '',

        // User
        detail_auth: null,
        detail_profile: null,
        userDetail: null,
        isHaveSchool: false,

        // Classrooms
        classrooms: null,
        classroomDetail: null,
        detailPreClass: null,
        assignments: null,
        assignmentCounter: null,
        leaderboardDetail: null,

        // Certificate
        certificates: null,

        // Programs
        programs: null,

        // Modules
        modules: null,
        moduleDetail: null,

        // Topics
        topics: null,
        topicDetail: null,

        // tabs
        tabs: null,

        // Attendance
        attendanceRecap: null,
        attendanceStatus: null,
        attendanceUser: null,

        // Paginations
        pagination: {
            page: 1,
            perPage: 10,
            totalItems: 0,
            totalPages: 0,
        },
        paginationPrograms: {
            page: 1,
            perPage: 10,
            totalItems: 0,
            totalPages: 0,
        },

        // enroll result
        enrollResult: null,

        // Drive
        uploadFile: { status: false, message: "", data: null },
    },

    mutations: {
        SET_RESPONSE(state, { message, status, data }) {
            state.message = message
            state.status = status
            state.data = data
        },
        SET_PAGINATION(state, pagination) {
            state.pagination = pagination
        },
        SET_PAGINATION_PROGRAM(state, pagination){
            state.paginationPrograms = pagination
        },
        SET_CLASSROOMS(state, classrooms) {
            state.classrooms = classrooms
        },
        SET_CLASSROOM_DETAIL(state, classroomDetail) {
            state.classroomDetail = classroomDetail
        },
        SET_LEADERBOARD(state, data) {
            state.leaderboardDetail = data
        },
        SET_MODULES(state, modules) {
            state.modules = modules
        },
        SET_MODULE_DETAIL(state, moduleDetail) {
            state.moduleDetail = moduleDetail
        },
        SET_TOPICS(state, topics) {
            state.topics = topics
        },
        SET_TOPIC_DETAIL(state, topicDetail) {
            state.topicDetail = topicDetail
        },
        SET_PROGRAMS(state, programs) {
            state.programs = programs
        },
        SET_DETAIL_AUTH(state, data) {
          state.detail_auth = data
        },
        SET_DETAIL_PROFILE(state, data) {
          state.detail_profile = data
        },
        SET_USER_DETAIL(state, data) {
            state.userDetail = data
        },
        SET_HAVE_SCHOOL(state, data) {
            state.isHaveSchool = data
        },
        SET_CERTIFICATE(state, data) {
            state.certificates = data
        },
        SET_ASSIGNMENTS(state, assignments) {
            state.assignments = assignments.items
            state.assignmentCounter = assignments.counter
        },
        SET_TABS(state, data){
            state.tabs = data
        },
        SET_ATTENDANCE(state, data) {
            state.attendanceRecap = data
        },
        SET_ATTENDANCE_STATUS(state, data) {
            state.attendanceStatus = data
        },
        SET_ATTENDANCE_USER(state, data) {
            state.attendanceUser = data
        },
        SET_MODULE_COUNTER(state, data){
            state.moduleCounter = data;
        },
        SET_MODULE_COUNTER_LIST(state, data){
            state.moduleCounterList = data;
        },
        SET_DETAIL_PRECLASS(state, data){
            state.detailPreClass = data;
        },
        SET_ENROLL_RESULT(state, data) {
            state.enrollResult = data;
        },
        SET_UPLOAD_FILE(state, { message, status, data }){
            state.uploadFile.message = message
            state.uploadFile.status = status
            state.uploadFile.data = data
        },
    },

    actions: {
      // Authorizer
        async authorize({ commit }) {
            try {
                const response = await apiAuthorize()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async locationList ({commit}) {
            try {
                const response = await apiLocationList()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
// Auth
        async cities ({commit}) {
            try {
                const response = await apiCities()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },

        async provinces ({commit}) {
            try {
                const response = await apiProvinces()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async authorize ({commit}) {
            try {
                const response = await apiAuthorize()
                const data = response.data.data

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: data
                }

                if (data?.school) {
                    if (data?.school?.id != 0) commit('SET_HAVE_SCHOOL', true)
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_DETAIL_AUTH', data)
                commit('SET_DETAIL_PROFILE', data)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
// User
        async userDetail ({commit}, id) {
            try {
                const response = await apiUserDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_USER_DETAIL', response.data.data)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async userDetailUpdate ({commit}, id) {
            try {
                const response = await apiUserDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_USER_DETAIL', response.data.data)
                commit('SET_DETAIL_AUTH', response.data.data)
                commit('SET_DETAIL_PROFILE', response.data.data)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async updateProfile ({commit}, params) {
            try {
                const response = await apiUpdateProfile(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_DETAIL_PROFILE', response?.data?.data);
                // commit('SET_DETAIL_AUTH', response.data.data)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
        async detailUserbyHashEmail ({commit}, hasEmail) {
            try {
                const response = await apiDetailUserbyHashEmail(hasEmail)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload)
            }
        },
// Classrooms
        async createClassroom ({commit}, params) {
            try {
                const response = await apiCreateClassroom(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to create class:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async editClassroom ({commit}, { classroomId, params }) {
            try {
                const response = await apiEditClassroom(classroomId, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to edit class:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async deleteClassroom ({commit}, classroomId) {
            try {
                const response = await apiDeleteClassroom(classroomId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to delete class:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classrooms ({commit}, params) {

            try {
                const response = await apiClassrooms(params?.page, params?.perPage, params?.state, params?.sort, params?.search, params?.type, params?.programId, params?.all, params?.preClass);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

                const data = response.data.data

                if (params?.page) {
                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }

                    commit('SET_CLASSROOMS', data.items);
                    commit('SET_PAGINATION', pagination);
                } else commit('SET_CLASSROOMS', data);

            } catch (error) {
                // console.error("Failed to get class:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomsHistory ({commit}, params) {
            try {
                const response = await apiClassroomsHistory(params?.page, params?.perPage, params?.userId, params?.programId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

                const data = response.data.data

                if (params?.page) {
                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }

                    commit('SET_CLASSROOMS', data.items);
                    commit('SET_PAGINATION', pagination);
                } else commit('SET_CLASSROOMS', data);

            } catch (error) {
                // console.error("Failed to get class:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async draftClassrooms ({commit}, params) {
            try {
                const response = await apiDraftClassrooms(params?.page, params?.perPage, params?.programId, params?.search, params?.sort)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

                if (resPayload?.status) {
                    const data = response.data.data

                    if (params?.page) {

                        const pagination = {
                            page: data.page,
                            perPage: data.perPage,
                            totalItems: data.totalItems,
                            totalPages: data.totalPages,
                        }

                        commit('SET_CLASSROOMS', data.items);
                        commit('SET_PAGINATION', pagination);
                    } else commit('SET_CLASSROOMS', data);
                }

            } catch (error) {
                // console.error("Failed to get class:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async activeClassrooms ({commit}, params) {

            try {
                const response = await apiActiveClassrooms(params?.page, params?.perPage, params?.state, params?.search, params?.sort, params?.level, params?.type, params?.programId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

                const data = response.data.data

                if (params?.page) {
                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }

                    commit('SET_CLASSROOMS', data.items);
                    commit('SET_PAGINATION', pagination);
                } else commit('SET_CLASSROOMS', data);

            } catch (error) {
                // console.error("Failed to get class:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomDetail ({commit}, {id, isPreClass = false}) {
            try {
                const response = await apiClassroomDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                if(isPreClass) commit('SET_DETAIL_PRECLASS', response.data.data);
                else commit('SET_CLASSROOM_DETAIL', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomOverview ({commit}, code) {
            try {
                const response = await apiClassroomOverview(code)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_CLASSROOM_DETAIL', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomSyllabus ({commit}, classId) {
            try {
                const response = await apiClassroomSyllabus(classId)

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
        async classroomModules ({commit}, {slug, userId}) {
            try {
                const response = await apiClassroomModulesV2(slug, userId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_MODULES', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomTopics ({commit}, { moduleSlug, classroomSlug, userId }) {
            try {
                const response = await apiClassroomTopicsV2(moduleSlug, classroomSlug, userId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPICS', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async topicsByClassId ({commit}, { classroomId }) {
            try {
                const response = await apiTopicsByClassId(classroomId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPICS', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomTopicDetail ({commit}, { moduleId, classroomId, topicId }) {
            try {
                const response = await apiClassroomTopicsDetail(moduleId, classroomId, topicId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomTopicDetailV2 ({commit}, { classroomSlug, topicSlug }) {
            try {
                const response = await apiClassroomTopicDetailV2(classroomSlug, topicSlug);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomPublishTopic({commit}, { topicId, classroomId}){
            try{
                const response = await apiClassroomPublishTopic(topicId, classroomId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
            }catch(error){
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomAssignModule ({commit}, { moduleId, classroomId }) {
            try {
                const response = await apiClassroomAssignModule(classroomId, moduleId)

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
        async classroomAssignModules({commit}, { params }) {
            try {
                const response = await apiClassroomAssignModules(params)

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
        async classroomDeleteModule ({commit}, { classroomSlug, moduleUUID }) {
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
        async classroomAssignments ({commit}, { page, topicId, classroomId }) {
            try {
                const response = await apiClassroomAssignments(page, classroomId, topicId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                const data = response.data.data

                const pagination = {
                    page: data?.page,
                    perPage: data?.perPage,
                    totalItems: data?.totalItems,
                    totalPages: data?.totalPages,
                }

                commit('SET_RESPONSE', resPayload);
                if (resPayload.status) {
                    commit('SET_ASSIGNMENTS', data);
                    commit('SET_PAGINATION', pagination);
                }

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async raportAssignments ({commit}, { classroomId, moduleId, userId }) {
            try {
                const response = await apiRaportAssignments(classroomId, moduleId, userId)

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
        async classroomEnroll ({commit}, params) {
            try {
                const response = await apiClassroomEnroll(params.code, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_ENROLL_RESULT', response.data); // Tambahkan baris ini

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_ENROLL_RESULT', null); // Tambahkan baris ini
            }
        },
        async classroomAssignScore ({commit}, params) {
            try {
                const response = await apiClassroomAssignScore(params)

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
        async classroomAssignTask ({commit}, { classId, topicId }) {
            try {
                const response = await apiClassroomAssignTask(classId, topicId)

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
        async classroomAssignLink ({commit}, params) {
            try {
                const response = await apiClassroomAssignLink(params)

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
        async classroomLeaderboards ({commit}, params) {
            try {
                const response = await apiGetStudents(
                    params?.classroomId,
                    params?.page,
                    params?.pageSize,
                    params?.join,
                    params?.search,
                    params?.order,
                    params?.minScore,
                    params?.maxScore,
                    params?.shorten,
                    params?.pretest,
                    params?.certified,
                );

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status,
                    data: response?.data?.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_LEADERBOARD', response?.data?.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async pretestLeaderboards ({commit}, { classroomId, page }) {
            try {
                const response = await apiClassroomPretestLeaderboards(classroomId, page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_LEADERBOARD', response.data.data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomLeaderboardsExport ({commit}, classId) {
            try {
                const response = await apiClassroomLeaderboardsExport(classId)
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
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async pretestLeaderboardsExport ({commit}, classId) {
            try {
                const response = await apiClassroomPretestLeaderboardsExport(classId)
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
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomRelease ({commit}, classroomId) {
            try {
                const response = await apiClassroomRelease(classroomId)

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
        async classroomStudents ({commit}, classroomId) {
            try {
                const response = await apiClassroomStudents(classroomId)

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
        async classroomStudentsNotJoin ({commit}, classroomId) {
            try {
                const response = await apiClassroomStudentsNotJoin(classroomId)

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
        async classroomInviteStudent ({commit}, params) {
            try {
                const response = await apiClassroomInviteStudent(params)

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
        async classroomKickStudent ({commit}, params) {
            try {
                const response = await apiClassroomKickStudent(params)

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
        async classroomPublishPretest ({commit}, params) {
            try {
                const response = await apiClassroomPublishPretest(params)

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
        async classroomRequirements ({commit}) {
            try {
                const response = await apiClassroomRequirements()

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
        async classroomMentors ({commit}, {classroomSlug = "", joined = false}) {
            try {
                const response = await apiClassroomMentorsV2(classroomSlug, joined)

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
        async classroomRemoveMentor ({commit}, {classroomId = -1, userId = -1}) {
            try {
                const response = await apiClassroomRemoveMentor({classroomId, userId})

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
        async classroomAssignMentors ({commit}, {params = null, classroomId = -1}) {
            try {
                const response = await apiClassroomAssignMentors(params, classroomId)

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
        async publicAssignment ({commit}, hashEmail) {
            try {
                const response = await apiPublicAssignment(hashEmail)

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
        async studentAssignmentDetail ({commit}, {classId, topicId, userId}) {
            try {
                const response = await apiStudentAssignmentDetail(classId, topicId, userId)

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

// Certificate
        async certificates ({commit}, params) {
            try {
                const response = await apiCertificates(params?.search, params?.sort, params?.page, params?.perPage)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                const data = response.data.data

                if (params?.page) {

                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }

                    commit('SET_PAGINATION', pagination);
                    commit('SET_CERTIFICATE',  data.items);
                } else commit('SET_CERTIFICATE',  data);

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async certificateDownload ({commit}, { type, userId, classroomId }) {
            try {
                let response = null
                if (type == 'certificate') response = await apiCertificateDownload(userId, classroomId)
                else if (type == 'rapor') response = await apiCertificateRaporDownload(userId, classroomId)
                else {
                    const resPayload = {
                        message: 'type download undefined',
                        status: false,
                        data: null,
                    }
                    return commit('SET_RESPONSE', resPayload);
                }

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
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

// Programs
        async allPrograms ({commit}) {
            try {
                const response = await apiAllPrograms()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_PROGRAMS', response.data.data);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async programs ({commit}, {page, perPage, sort, keyword}) {
            try {
                const response = await apiPrograms(page, perPage, sort, keyword)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                const data = response.data.data

                const pagination = {
                    page: data.page,
                    perPage: data.perPage,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_PROGRAMS', data.items);
                commit('SET_PAGINATION_PROGRAM', pagination);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async programDetail ({commit}, id) {
            try {
                const response = await apiProgramDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async createProgram ({commit}, params) {
            try {
                const response = await apiCreateProgram(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async editProgram ({commit}, { id, params }) {
            try {
                const response = await apiEditProgram(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async deleteProgram ({commit}, id) {
            try {
                const response = await apiDeleteProgram(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
// Modules
        async modules ({commit}, { page, pageSize = null, type, search = null, sort = null }) {
            try {
                const response = await apiModules(page, pageSize, type, search, sort)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                const data = response.data.data

                if (page) {
                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }
                    commit('SET_PAGINATION', pagination);
                    commit('SET_MODULES', data.items);
                } else {
                    commit('SET_MODULES', data);
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getListModulesLibrary ({commit}, { page, pageSize = null, type, search = null, sort = null }) {
            try {
                const response = await apiGetListModulesLibrary(page, pageSize, type, search, sort)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                const data = response.data.data

                if (page) {
                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }
                    commit('SET_PAGINATION', pagination);
                    commit('SET_MODULES', data.items);
                } else {
                    commit('SET_MODULES', data);
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async getListModulesDraft ({commit}, { page, pageSize = null, type, search = null, sort = null }) {
            try {
                const response = await apiGetListModulesDraft(page, pageSize, type, search, sort)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                const data = response.data.data

                if (page) {
                    const pagination = {
                        page: data.page,
                        perPage: data.perPage,
                        totalItems: data.totalItems,
                        totalPages: data.totalPages,
                    }
                    commit('SET_PAGINATION', pagination);
                    commit('SET_MODULES', data.items);
                } else {
                    commit('SET_MODULES', data);
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }
                commit('SET_MODULES', null);
                commit('SET_RESPONSE', resPayload);
            }
        },
        async publishMateri({commit}, moduleId){
            try{
                const response = await apiPublishModule(moduleId);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)
            }catch(error){
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.error('Failed Delete Bundle: ', error)
            }
        },
        async classroomPublishModule({commit}, {moduleId, classroomId}){
            try{
                const response = await apiClassroomPublishModule(moduleId, classroomId);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)
            }catch(error){
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.error('Failed Delete Bundle: ', error)
            }
        },
        async moduleDetail ({commit}, id) {
            try {
                const response = await apiModuleDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_MODULE_DETAIL', response.data.data);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async detailModuleV2({commit}, {slug}){
            try{
                const response = await apiDetailModuleV2(slug);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_MODULE_DETAIL', response.data.data);
            }catch(error){
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomDetailModule({commit}, {moduleSlug, classroomSlug}){
            try{
                const response = await apiClassroomDetailModuleV2(moduleSlug, classroomSlug);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_MODULE_DETAIL', response.data.data);
            }catch(error){
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomModuleDetail({commit}, {moduleId, classroomId}){
            try{
                const response = await apiClassroomDetailModule(moduleId, classroomId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_MODULE_DETAIL', response.data.data);
            }catch(error){
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomCreateModule ({commit}, params) {
            try {
                const response = await apiClassroomCreateModule(params)

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
        async classroomEditModule ({commit}, { moduleId, params }) {
            try {
                const response = await apiClassroomEditModule(moduleId, params)

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
        async classroomModuleDeleted ({commit}, { moduleId, classroomId }) {
            try {
                const response = await apiClassroomModuleDeleted(moduleId, classroomId)

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
        async createModule ({commit}, params) {
            try {
                const response = await apiCreateModule(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async editModule ({commit}, { id, params }) {
            try {
                const response = await apiEditModule(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async deleteModule ({commit}, id) {
            try {
                const response = await apiDeleteModule(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
// Topics
        async allTopics ({commit}, { page, moduleId }) {
            try {
                const response = await apiAllTopics(page, moduleId )

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPICS', response.data.data);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async topics ({commit}, { page, moduleSlug }) {
            try {
                const response = await apiTopicsV2(page, moduleSlug)
                let module = null;
                let topics = null;
                let pagination = {
                    page: 1,
                    perPage: 10,
                    totalItems: 0,
                    totalPages: 0,
                };

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                if(response?.data?.data){
                    module = response.data.data.module
                    topics = response.data.data.topics
                    pagination = {
                        page: topics.page,
                        perPage: topics.perPage,
                        totalItems: topics.totalItems,
                        totalPages: topics.totalPages,
                    }
                }


                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPICS', topics?.items);
                commit('SET_MODULE_DETAIL', module);
                commit('SET_PAGINATION', pagination);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async detailTopicV2({commit}, { slug }){
            try{
                const response = await apiGetDetailTopicV2(slug);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);

            }catch(error){
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async topicDetail ({commit}, id) {
            try {
                const response = await apiTopicDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomCreateTopic({ commit }, params){
            try {
                const response = await apiClassroomCreateTopic(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomEditTopic({ commit }, { topicId, classroomId, params }){
            try {
                const response = await apiClassroomEditTopic(topicId, classroomId, params);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomDeleteTopic ({commit}, { topicId, classroomId }) {
            try {
                const response = await apiClassroomDeleteTopic(topicId, classroomId);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async createTopic ({commit}, params) {
            try {
                const response = await apiCreateTopic(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);
            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async editTopic ({commit}, { id, params }) {
            try {
                const response = await apiEditTopic(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);
            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async deleteTopic ({commit}, id) {
            try {
                const response = await apiDeleteTopic(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async editTopicV2 ({commit}, { topicSlug, params }) {
            try {
                const response = await apiEditTopicV2(topicSlug, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);
                commit('SET_TOPIC_DETAIL', response.data.data);
            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async deleteTopicV2 ({commit}, { topicSlug }) {
            try {
                const response = await apiDeleteTopicV2(topicSlug)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                }

                commit('SET_RESPONSE', resPayload);

            } catch (error) {
                // console.error("Failed to get programs:", error);
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async classroomRemoveTopic ({commit}, { topicId, classroomId }) {
            try {
                const response = await apiClassroomRemoveTopic(topicId, classroomId)

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

// Blogs & Gallery
        async detailPost ({commit}, id) {
            try {
                const response = await apiDetailPost(id)

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
        async deletePost ({commit}, id) {
            try {
                const response = await apiDeletePost(id)

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
// Blogs
        async blogs ({commit}, page) {
            try {
                const response = await apiBlogs(page)

                const data = response.data.data

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: data.items,
                }

                const pagination = {
                    page: data.page,
                    perPage: data.perPage,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                }

                commit('SET_PAGINATION', pagination);
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
        async createBlog ({commit}, params) {
            try {
                const response = await apiCreateBlog(params)

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
        async editBlog ({commit}, {id, params}) {
            try {
                const response = await apiEditBlog(id, params)

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
// Gallery
        async galleries ({commit}, page) {
            try {
                const response = await apiGalleries(page)

                const data = response.data.data

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: data.items,
                }

                const pagination = {
                    page: data.page,
                    perPage: data.perPage,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                }

                commit('SET_PAGINATION', pagination);
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
        async createGallery ({commit}, params) {
            try {
                const response = await apiCreateGallery(params)

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
        async editGallery ({commit}, {id, params}) {
            try {
                const response = await apiEditGallery(id, params)

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
// Newsletters
        async newsletters ({commit}, { page, perPage: pageSize }) {
            try {
                const response = await apiGetNewsletterList({ page, pageSize })

                const data = response.data.data

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: data.items,
                }

                const pagination = {
                    page: data.page,
                    perPage: data.perPage,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                }

                commit('SET_PAGINATION', pagination);
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
        async createNewsletter ({commit}, payload) {
            try {
                const response = await apiPostNewsletter(payload)

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
        async detailNewsletter ({commit}, slug) {
            try {
                const response = await apiGetNewsletterDetail(slug)

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
        async unsubsNewsletter ({commit}, slug) {
            try {
                const response = await apiUnsubsNewsletter()

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
        setHaveSchool({ commit }) {
            commit('SET_HAVE_SCHOOL', true)
        },
        setTabs({commit}, data){
            commit("SET_TABS", data)
        },

        async createClassAttendance({ commit }, { id, params }) {
            try {
                const response = await apiCreateClassAttendance(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        // async createMeetAttendance({ commit }, { id, params }) {
        //     try {
        //         const response = await apiCreateMeetAttendance(id, params)

        //         const resPayload = {
        //             message: response.data.message,
        //             status: response.data.status,
        //             data: response.data.data
        //         }

        //         commit('SET_RESPONSE', resPayload)

        //     } catch (error) {
        //         const resPayload = {
        //             message: error,
        //             status: false,
        //             data: null,
        //         }

        //         commit('SET_RESPONSE', resPayload)
        //     }
        // },

        async createPostAttendance({ commit }, { id, params }) {
            try {
                const response = await apiCreatePostAttendance(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload)
            }
        },

        async getDetailAttendance({ commit }, attendanceId) {
            try {
                const response = await apiGetDetailAttendance(attendanceId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload)
            }
        },

        async editClassAttendance({ commit }, { id, params }) {
            try {
                const response = await apiEditClassAttendance(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async editPostAttendance({ commit }, { id, params }) {
            try {
                const response = await apiEditPostAttendance(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async editMeetAttendance({ commit }, { id, params }) {
            try {
                const response = await apiEditMeetAttendance(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async getClassAttendanceRecap({ commit }, { id, page, perPage, startDate, endDate, order, search, userId }) {
            try {
                const response = await apiGetClassAttendanceRecap(id, page, perPage, startDate, endDate, order, search, userId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

                const data = response.data.data?.recap

                if (page) {
                    const pagination = {
                        page: data?.page,
                        perPage: data?.perPage,
                        totalItems: data?.totalItems,
                        totalPages: data?.totalPages,
                    }

                    commit('SET_ATTENDANCE', data?.items)
                    commit('SET_PAGINATION', pagination)
                } else commit('SET_ATTENDANCE', data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async getMeetAttendanceRecap({ commit }, { id, page, perPage, startDate, endDate, order, search, userId }) {
            try {
                const response = await apiGetMeetAttendanceRecap(id, page, perPage, startDate, endDate, order, search, userId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

                const data = response.data.data?.recap

                if (page) {
                    const pagination = {
                        page: data?.page,
                        perPage: data?.perPage,
                        totalItems: data?.totalItems,
                        totalPages: data?.totalPages,
                    }

                    commit('SET_ATTENDANCE', data?.items)
                    commit('SET_PAGINATION', pagination)
                } else commit('SET_ATTENDANCE', data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async getPostAttendanceRecap({ commit }, { id, page, perPage, startDate, endDate, order, search, userId }) {
            try {
                const response = await apiGetPostAttendanceRecap(id, page, perPage, startDate, endDate, order, search, userId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data
                }

                commit('SET_RESPONSE', resPayload)

                const data = response.data.data?.recap

                if (page) {
                    const pagination = {
                        page: data?.page,
                        perPage: data?.perPage,
                        totalItems: data?.totalItems,
                        totalPages: data?.totalPages,
                    }

                    commit('SET_ATTENDANCE', data?.items)
                    commit('SET_PAGINATION', pagination)
                } else commit('SET_ATTENDANCE', data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async getClassAttendanceStatus({ commit }, id) {
            try {
                const response = await apiGetClassAttendanceStatus(id)

                const resPayload = {
                    message: response.data?.message,
                    status: response.data?.status,
                }

                commit('SET_RESPONSE', resPayload)

                commit('SET_ATTENDANCE_STATUS', response.data?.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async recapClassAttendanceExport ({ commit }, { id, page, perPage, startDate, endDate, order, search, userId, isExport }) {
            try {
                const response = await apiGetClassAttendanceRecap(id, page, perPage, startDate, endDate, order, search, userId, isExport)
                const fileName = response.headers['content-disposition'].split('filename=')[1]

                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()



                const resPayload = {
                    message: response.status == 200 ? "export success" : "export failed",
                    status: response.status == 200 ? true : false
                };

                commit('SET_RESPONSE', resPayload)

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload)
            }
        },

        async recapMeetAttendanceExport ({ commit }, { id, page, perPage, startDate, endDate, order, search, userId, isExport }) {
            try {
                const response = await apiGetMeetAttendanceRecap(id, page, perPage, startDate, endDate, order, search, userId, isExport)
                const fileName = response.headers['content-disposition'].split('filename=')[1]

                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()

                const resPayload = {
                    message: response.status == 200 ? "export success" : "export failed",
                    status: response.status == 200 ? true : false
                };

                commit('SET_RESPONSE', resPayload)

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload)
            }
        },

        async recapPostAttendanceExport ({ commit }, { id, page, perPage, startDate, endDate, order, search, userId, isExport }) {
            try {
                const response = await apiPostAttendanceRecapExport(id, page, perPage, startDate, endDate, order, search, userId, isExport)
                const fileName = response.headers['content-disposition'].split('filename=')[1]

                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()

                const resPayload = {
                    message: response.status == 200 ? "export success" : "export failed",
                    status: response.status == 200 ? true : false
                };

                commit('SET_RESPONSE', resPayload)

            } catch (error) {

                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload)
            }
        },

        async getClassAttendanceUser ({ commit }, id) {
            try {
                const response = await apiGetClassAttendanceUser(id)

                const resPayload = {
                    message: response.data?.message,
                    status: response.data?.status,
                }

                commit('SET_RESPONSE', resPayload)

                commit('SET_ATTENDANCE_USER', response.data?.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },

        async getPostAttendanceUser ({ commit }, id) {
            try {
                const response = await apiGetPostAttendanceUser(id)

                const resPayload = {
                    message: response.data?.message,
                    status: response.data?.status,
                }

                commit('SET_RESPONSE', resPayload)

                commit('SET_ATTENDANCE_USER', response.data?.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null,
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        setListTopics({ commit }, data){
            try{
                commit("SET_TOPICS", data);
            }catch(error){
                console.error(error);
            }
        },

        // Drive

        async uploadFile({commit}, payload){
          try{
              const response = await apiUploadFile(payload);

              const resPayload = {
                  message: response?.data?.message,
                  status: response?.data?.status,
                  data: response?.data?.data,
              }

              commit('SET_UPLOAD_FILE', resPayload);
          }catch(error){
              const resPayload = {
                  message: error,
                  status: false,
                  data: null,
              }

              commit('SET_UPLOAD_FILE', resPayload);
          }
      },
    }
}