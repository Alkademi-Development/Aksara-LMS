import { 
    apiGetCoursesById, 
} from '@/api/courses.api';

export default {
    namespaced: true,
    state: {
        courses: [],
        course: null,
        pagination: {
            currentPage: 0,
            perPage: 0,
            totalRows: 0,
            totalPage: 0
        },
        message: '',
        status: false,
        data: null
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
        SET_COURSES(state, {courses}){
            state.courses = courses
        },
        SET_COURSE(state, {course}){
            state.course = course
        },
    },

    actions: {
        async getCoursesById({commit}, id) {
            try {
                const response = null;

                const resPayload = {
                    message: '',
                    status: true,
                    data: {
                        name: 'HTML'
                    }
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    course: resPayload.data
                }

                commit('SET_COURSE', payload);
            } catch (error) {
                console.log('Failed get the course by id: ', error);
            }
        },
    }
}