import { 
    apiGetCourses, 
    apiGetCoursesById, 
    apiPostCourse, 
    apiEditCourse,
    apiGetModulesById,
    apiGetModulesByCourseId,
    apiGetForms,
    apiGetModulesByClassroomId,
    apiPostModule,
    apiEditModule,
    apiDeleteModule,
    apiGetSilabusByProgramId,
    apiGetModuleExtension,
    apiDeleteCourse,
    apiGetCoursesAll,
    apiAddForm,
    apiAttachForms,
    apiDeleteFormsModule,
    apiAttachStudio,
    apiDeleteStudioModule,
    apiGetListBundle,
    apiGetListCategory,
    apiCreateBundle,
    apiDeleteBundle,
    apiDetailBundle,
    apiEditBundle,
    apiPublishModule,
    apiAssignModuleToLMS,
    apiGetListBundleLibrary,
} from '@/api/courses.api';

import {
    apiAssignBundleToLMS,
    apiGetListBundleRelated,
    apiDownloadTopicV2,
    apiImportTopicV2
} from "@/api/v2/module.api"

export default {
    namespaced: true,
    state: {
        courses: [],
        modules:[],
        silabus: [],
        forms: [],
        ext: [],
        pagination: {
            currentPage: 0,
            perPage: 0,
            totalRows: 0,
            totalPage: 0
        },
        message: '',
        status: false,
        bundle: [],
        categories: [],
        isPublishModuleDraft: false,
        isDeleteCourse: false,
        isMoveModule: false,
        listBundleRelated: [],
        isPublishMateriDraft: false,

        // Topic
        downloadTopic: { data: null, status: false, message: "" },
        importDocument: { data: null, status: false, message: "", isLoading: false, },
    },

    mutations: {
        SET_RESPONSE(state, {message, status}){
            state.message = message;
            state.status = status;
        },
        SET_PAGINATION(state, {pagination}){
            state.pagination = pagination
        },
        SET_COURSES(state, {courses}){
            state.courses = courses
        },
        SET_MODULES(state, {modules}){
            state.modules = modules
        },
        SET_SILABUS(state, {silabus}){
            state.silabus = silabus
        },
        SET_FORMS(state, forms){
            state.forms = forms
        },
        SET_EXT(state, ext){
            state.ext = ext
        },
        SET_BUNDLE(state, bundle){
            state.bundle = bundle;
        },
        SET_CATEGORIES(state, categories){
            state.categories = categories
        },
        SET_ISPUBLISHMODULEDRAFT(state, isPublishModuleDraft){
            state.isPublishModuleDraft = isPublishModuleDraft
        },
        SET_ISDELETECOURSE(state, isDeleteCourse){
            state.isDeleteCourse = isDeleteCourse
        },
        SET_IS_MOVE_MODULE(state, isMoveModule){
            state.isMoveModule = isMoveModule
        },
        SET_LIST_BUNDLE_RELATED(state, listBundleRelated){
            state.listBundleRelated = listBundleRelated;
        },
        SET_ISPUBLISH_MATERI_DRAFT(state, status){
            state.isPublishMateriDraft = status;
        },
        SET_DOWNLOAD_TOPIC_V2(state, downloadTopic){
            state.downloadTopic = downloadTopic;
        },

        // Import Topic
        SET_IMPORT_DOCUMENT_V2(state, { data, status, message }){
            state.importDocument.data = data;
            state.importDocument.status = status;
            state.importDocument.message = message;
        },
        SET_IMPORT_LOADING_STATE(state, status){
            state.importDocument.isLoading = status;
        },
    },

    actions: {
        async getCoursesAll({commit},) {
            try {
                const response = await apiGetCoursesAll();

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    courses: response.data.data
                }

                commit('SET_COURSES', payload);
            } catch (error) {
                console.log('Failed get courses: ', error);
            }
        },
        async getCourses({commit}, page) {
            try {
                const response = await apiGetCourses(page);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    courses: response.data.data
                }

                commit('SET_COURSES', payload);

                var data = response.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                        totalPage: data.page.last_page
                    }
                }

                commit('SET_PAGINATION', pagePayload)
            } catch (error) {
                console.log('Failed get courses: ', error);
            }
        },
        async getCoursesById({commit}, id) {
            try {
                const response = await apiGetCoursesById(id);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                const payload = {
                    courses: response.data.data
                }

                commit('SET_COURSES', payload);
            } catch (error) {
                console.log('Failed get courses by id: ', error);
            }
        },
        async postCourse({commit}, {params}) {
            try {
                const response = await apiPostCourse(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                

                const payload = {
                    courses: response.data.data
                }

                commit('SET_COURSES', payload)
            } catch (error) {
                console.log('Failed post course: ', error)
            }
        },
        async editCourse({commit}, {id, params}) {
            try {
                const response = await apiEditCourse(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                

                const payload = {
                    courses: response.data.data
                }

                commit('SET_COURSES', payload)
            } catch (error) {
                console.log('Failed edit course: ', error)
            }
        },
        async getModulesById({commit}, { module_id, classroom_id, user_id }) {
            const role = localStorage.getItem('user_kind');
            try {
                if (role == 'admin' || role == 'superadmin' || role == 'lead_program') {
                    const response = await apiGetModulesById(module_id)

                    const resPayload = {
                        message: response.data.message,
                        status: response.data.status
                    }

                    commit('SET_RESPONSE', resPayload)

                    const payload = {
                        modules: response.data.data
                    }

                    commit('SET_MODULES', payload)
                } else if (role == 'student') {
                    const response = await apiGetModulesByClassroomId(classroom_id, module_id, user_id);

                    const resPayload = {
                        message: response.data.message,
                        status: response.data.status
                    }

                    commit('SET_RESPONSE', resPayload)

                    const payload = {
                        modules: response.data.data
                    }

                    commit('SET_MODULES', payload)
                } else if (role == 'mentor') {
                    const response = await apiGetForms(classroom_id, module_id);

                    const resPayload = {
                        message: response.data.message,
                        status: response.data.status
                    }

                    commit('SET_RESPONSE', resPayload)

                    const payload = {
                        modules: response.data.data
                    }

                    commit('SET_MODULES', payload)
                }
            } catch (error) {
                let message;
                if (role == 'admin' || role == 'superadmin' || role == 'lead_program') message = 'Failed get modules by course: ';
                else if (role == 'student' || role == 'mentor') message = 'Faile get modules by classroom: ';
                console.log(message, error)
            }
        },
        async getModulesByCourseId({commit}, {courseId, page}) {
            try {
                const response = await apiGetModulesByCourseId(courseId, page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    modules: response.data.data
                }

                commit('SET_MODULES', payload)
                
                var data = response.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                    }
                }

                commit('SET_PAGINATION', pagePayload)
            } catch (error) {
                console.log('Failed get modules by course: ', error)
            }
        },
        async postModule({commit}, {params}) {
            try {
                const response = await apiPostModule(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                
            } catch (error) {
                console.log('Failed post module: ', error)
            }
        },
        async editModule({commit}, {id, params}) {
            try {
                const response = await apiEditModule(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)                
            } catch (error) {
                console.log('Failed post module: ', error)
            }
        },
        async deleteModule({ commit }, { id }) {
            try {
                const response = await apiDeleteModule(id);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed delete module: ', error);
            }
        },
        async deleteCourse({ commit }, id) {
            try {
                const response = await apiDeleteCourse(id);

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed delete course: ', error);
            }
        },
        async getSilabusByProgramId({commit}, programId) {
            try {
                const response = await apiGetSilabusByProgramId(programId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    silabus: response.data.data,
                }

                commit('SET_SILABUS', payload)
            } catch (error) {
                console.log('Failed post module: ', error)
            }
        },
        async getForms({commit}, {classroomId, moduleId}) {
            try {
                const response = await apiGetForms(classroomId, moduleId)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const forms = response.data.data.forms

                commit('SET_FORMS', forms)
            } catch (error) {
                console.log('Failed get forms: ', error)
            }
        },
        async getModuleExt({commit}) {
            try {
                const response = await apiGetModuleExtension()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const ext = response.data.data

                commit('SET_EXT', ext)
            } catch (error) {
                console.log('Failed get extensions: ', error)
            }
        },
        async addForm ({ commit }, {moduleId, params} ) {
            try {
                const response = await apiAddForm(moduleId, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                };

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                console.error('Failed add form: ', error)
            }
        },
        async getModulesByIdPretest({commit}, { module_id }) {
            try {
                    const response = await apiGetModulesById(module_id)

                    const resPayload = {
                        message: response.data.message,
                        status: response.data.status
                    }

                    commit('SET_RESPONSE', resPayload)

                    const payload = {
                        modules: response.data.data
                    }

                    commit('SET_MODULES', payload)
            } catch (error) {
                console.log('Failed get module detail', error)
            }
        },
        async attachForm({commit}, {moduleId, params}) {
            try {
                const response = await apiAttachForms(moduleId, params)

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
                console.log('Failed attach forms: ', error)
            }
        },
        async attachStudio({commit}, {moduleId, params}) {
            try {
                const response = await apiAttachStudio(moduleId, params)

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
                console.log('Failed attach studio: ', error)
            }
        },
        async deleteStudioModule({commit}, moduleId) {
            try {
                const response = await apiDeleteStudioModule(moduleId)

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
                console.log('Failed delete studio: ', error)
            }
        },
        async deleteFormsModule({commit}, moduleId) {
            try {
                const response = await apiDeleteFormsModule(moduleId)

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
                console.log('Failed delete forms: ', error)
            }
        },
        async getListBundleLibrary({commit}, {page, pageSize, search, sort, categorySlug, authorId}){
            try {
                const response = await apiGetListBundleLibrary(page, pageSize, search, sort, categorySlug, authorId);
                
                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                const pagePayload = {
                    pagination: {
                        currentPage: response?.data?.data?.page,
                        perPage: response?.data?.data?.perPage,
                        totalRows: response?.data?.data?.totalItems,
                        totalPage: response?.data?.data?.totalPages,
                    }
                }

                commit('SET_PAGINATION', pagePayload)
                commit('SET_RESPONSE', resPayload)
                commit('SET_BUNDLE', response?.data?.data?.items)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.error('Failed Get Bundles: ', error)
            }
        },
        async getListBundle({commit}, {page, pageSize, search, sort, categorySlug, authorId}){
            try {
                const response = await apiGetListBundle(page, pageSize, search, sort, categorySlug, authorId);
                
                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                const pagePayload = {
                    pagination: {
                        currentPage: response?.data?.data?.page,
                        perPage: response?.data?.data?.perPage,
                        totalRows: response?.data?.data?.totalItems,
                        totalPage: response?.data?.data?.totalPages,
                    }
                }

                commit('SET_PAGINATION', pagePayload)
                commit('SET_RESPONSE', resPayload)
                commit('SET_BUNDLE', response?.data?.data?.items)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed Get Bundles: ', error)
            }
        },
        async getDetailBundle({commit}, slug){
            try{
                const response = await apiDetailBundle(slug);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_BUNDLE', response?.data?.data)
            }catch(error){
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed Get Bundles: ', error)
            }
        },
        async getListCategory({commit}){
            try{
                const response = await apiGetListCategory();

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_CATEGORIES', response?.data?.data)

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed Get List Category: ', error)
            }
        },
        async createBundle({commit}, params){
            try{
                const response = await apiCreateBundle(params);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_BUNDLE', response?.data?.data?.items)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed Create Bundle: ', error)
            }
        },
        async editBundle({commit}, {slug, params}){
            try{
                const response = await apiEditBundle(slug, params);

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_BUNDLE', response?.data?.data?.items)
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.log('Failed Edit Bundle: ', error)
            }
        },
        async deleteBundle({commit}, slug){
            try{
                const response = await apiDeleteBundle(slug);

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
                console.log('Failed Delete Bundle: ', error)
            }
        },
        async publishModule({commit}, moduleId){
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
        async assignModuleToLMS({commit}, {moduleId}) {
            try {
                const response = await apiAssignModuleToLMS(moduleId)

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
                console.error('Failed attach studio: ', error)
            }
        },
        async assignBundleToLMS({commit}, {bundleSlug}) {
            try {
                const response = await apiAssignBundleToLMS(bundleSlug)

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
                console.error('Failed attach studio: ', error)
            }
        },
        async getListBundleRelated({ commit }, { bundleSlug }){
            try {
                const response = await apiGetListBundleRelated(bundleSlug)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_LIST_BUNDLE_RELATED', response?.data?.data);

            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload)
                console.error('Failed attach studio: ', error)
            }
        },
        setIsPublishMateriDraft({ commit }, state){
            commit("SET_ISPUBLISH_MATERI_DRAFT", state);
        },
        async fetchDownloadTopic({ commit }, { slug }){
            try {
                const response = await apiDownloadTopicV2(slug);

                // Ambil nama file dari header Content-Disposition
                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition
                    ? contentDisposition.split('filename=')[1].replace(/"/g, '') // Ambil nama file
                    : 'download.pdf'; // Default nama file jika header tidak ada

                const resPayload = {
                    data: {
                        blob: response.data,
                        filename: fileName,
                        "content-type": response.headers['content-type'],
                    },
                    message: "",
                    status: response.status >= 200 && response.status <= 299,
                }

                commit('SET_DOWNLOAD_TOPIC_V2', resPayload)
            } catch (error) {
                const resPayload = {
                    data: null,
                    message: error,
                    status: false
                }

                commit('SET_DOWNLOAD_TOPIC_V2', resPayload);
            }
        },
        async fetchImportDocumentV2({ commit }, file){
            try {
                const response = await apiImportTopicV2(file);

                const resPayload = {
                    data: response?.data?.data,
                    message: response?.data?.message,
                    status: response?.data?.status,
                }

                commit('SET_IMPORT_DOCUMENT_V2', resPayload)
            } catch (error) {
                const resPayload = {
                    data: null,
                    message: error,
                    status: false
                }

                commit('SET_IMPORT_DOCUMENT_V2', resPayload);
            }
        },
        setLoadingImportDocument({ commit }, state){
            commit("SET_IMPORT_LOADING_STATE", state);
        }
    }
}