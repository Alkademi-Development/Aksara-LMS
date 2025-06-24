import httpClient from './httpClient'
import servicesClients from "./servicesClients"

const SERVICES_URL = process?.env?.servicesApi


const BASE_URL = process.env.baseURL

const apiGetCourses = (page) => httpClient.get(BASE_URL + `courses?page=${page}`)

const apiGetCoursesById = (id) => httpClient.get(BASE_URL + `course/${id}`)

const apiPostCourse = (params) => httpClient.post(BASE_URL + 'course', params)

const apiEditCourse = (id, params) => httpClient.post(BASE_URL + `course/${id}/edit`, params)

const apiDeleteCourse = (id) => httpClient.get(BASE_URL + `/course/${id}/delete`)

const apiGetModulesById = (id) => httpClient.get(BASE_URL + `course/module/${id}`)

const apiGetModulesByCourseId = (courseId, page) => httpClient.get(BASE_URL + `course/${courseId}/modules?page=${page}`)

const apiGetForms = (classroomId, moduleId) => httpClient.get(BASE_URL +  `classroom/${classroomId}/module/${moduleId}`);

const apiGetModulesByClassroomId = (classroomId, moduleId, studentId) => httpClient.get(BASE_URL +  `classroom/${classroomId}/module/${moduleId}/student/${studentId}/task`);

const apiPostModule = (params) => httpClient.post(BASE_URL + 'course/module', params)

const apiEditModule = (id, params) => httpClient.post(BASE_URL + `course/module/${id}`, params)

const apiDeleteModule = (id) => httpClient.post(BASE_URL + `course/module/${id}/delete`);

const apiGetSilabusByProgramId = (programId) => httpClient.get(BASE_URL + `silabus/${programId}`)

const apiGetModuleExtension = () => httpClient.get(BASE_URL + `ce/extensions`)

const apiGetCoursesAll = () => httpClient.get(BASE_URL + `courses/all`)

const apiAddForm = (moduleId, params) => httpClient.post(BASE_URL + `course/module/${moduleId}/form`, params)

const apiAttachForms = (moduleId, params) => httpClient.post(BASE_URL + `course/module/${moduleId}/form/attach`, params)

const apiDeleteFormsModule = (moduleId) => httpClient.post(BASE_URL + `course/module/${moduleId}/form/remove`)

const apiAttachStudio = (moduleId, params) => httpClient.post(BASE_URL + `course/module/${moduleId}/studio/attach`, params)

const apiDeleteStudioModule = (moduleId) => httpClient.post(BASE_URL + `course/module/${moduleId}/studio/remove`)

const apiAssignModuleToLMS = (moduleId) => servicesClients.post(SERVICES_URL + `v1/module/lms/assign?moduleId=${moduleId}`);

// BUNDLE
const apiGetListBundleLibrary = (page, pageSize, search, sort, categorySlug, authorId) => {

    let endpoint = SERVICES_URL + 'v2/module/bundle/public?'

    if(search) endpoint += `&search=${search}`;
    if(page) endpoint += `&page=${page}`;
    if(pageSize) endpoint += `&pageSize=${pageSize}`
    if(sort) endpoint += `&sort=${sort}`;
    if(categorySlug) endpoint += `&categorySlug=${categorySlug}`;
    if(authorId) endpoint += `&authorId=${authorId}`;

    return servicesClients.get(endpoint);
}
const apiGetListBundle = (page, pageSize, search, sort, categorySlug, authorId) => {

    let endpoint = SERVICES_URL + 'v2/module/bundle/list?'

    if(search) endpoint += `&search=${search}`;
    if(page) endpoint += `&page=${page}`;
    if(pageSize) endpoint += `&pageSize=${pageSize}`
    if(sort) endpoint += `&sort=${sort}`;
    if(categorySlug) endpoint += `&categorySlug=${categorySlug}`;
    if(authorId) endpoint += `&authorId=${authorId}`;

    return servicesClients.get(endpoint);
}
const apiCreateBundle = (params) => servicesClients.post(SERVICES_URL + `v2/module/bundle/create`, params);
const apiDeleteBundle = (slug) => servicesClients.post(SERVICES_URL + `v2/module/bundle/delete?slug=${slug}`);
const apiDetailBundle = (slug) => servicesClients.get(SERVICES_URL + `v2/module/bundle/detail?slug=${slug}`);
const apiEditBundle = (slug, params) => servicesClients.post(SERVICES_URL + `v2/module/bundle/edit?slug=${slug}`, params);

// CATAGORY
const apiGetListCategory = () => servicesClients.get(SERVICES_URL + `v2/module/category/list`);

// Publish Module
const apiPublishModule = (moduleId) => servicesClients.post(SERVICES_URL + `v1/module/topic/state/release?topicId=${moduleId}`);

export {
    apiGetCourses,
    apiGetCoursesById,
    apiPostCourse,
    apiDeleteCourse,
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
}