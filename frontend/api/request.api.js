import httpClient from './httpClient'
import servicesClients from "./servicesClients"

const SERVICES_URL = process?.env?.servicesApi
const BASE_URL = process.env.baseURL

/**
 * Users
 */
const logout = () => httpClient.get('signout')
const register = (user) => httpClient.post(BASE_URL + 'auth/register/students', user) 
const apiGetRequestStudents = (page) => httpClient.get(BASE_URL + `/students/request?page=${page}`)
const postApproveStudent = (batch_id, program_id, student_id) => httpClient.post(BASE_URL + `batch/${batch_id}/program/${program_id}/approve/${student_id}`)
const postRejectStudent = (batch_id, program_id, student_id) => httpClient.post(BASE_URL + `batch/${batch_id}/program/${program_id}/reject/${student_id}`)


/**
 * Statistic
 */
const getStatisticProvincies = () => httpClient.get(BASE_URL + 'statistic/provincies')
const getStatisticProvinciesScore = () => httpClient.get(BASE_URL + 'statistic/provincies/score')
const getStatisticCounter = () => httpClient.get(BASE_URL + 'statistic/counter')
const getStatisticChart = (kind) => httpClient.get(BASE_URL + 'statistic/chart/' + kind)
const getStatisticActiveBatchs = () => httpClient.get(BASE_URL + `statistic/batchs/active`)
const getStatisticActiveBatchChart = (kind) => httpClient.get(BASE_URL + `statistic/batchs/active/` + kind)
const getStatisticLandingPage = () => httpClient.get(BASE_URL + 'statistic/landing/counter');
const getStatisticStudentChart = () => httpClient.get(BASE_URL + 'statistic/students/chart');
const getStatisticRegistrarChart = () => httpClient.get(BASE_URL + 'statistic/registrar/chart');
const getStatisticModuleProgress = (moduleId, classroomId) => servicesClients.get(SERVICES_URL + `v1/statistics/class/module-progress/funnel?moduleId=${moduleId}&classroomId=${classroomId}`);
const getStatisticStudentProgressModule = (moduleId, classroomId, order, keyword, page, pageSize) => {
    let endpoint = "/v1/statistics/class/student-progress/funnel?";

    if(page) endpoint += `&page=${page}`;
    if(pageSize) endpoint += `&pageSize=${pageSize}`;
    if(moduleId) endpoint += `&moduleId=${moduleId}`;
    if(classroomId) endpoint += `&classroomId=${classroomId}`;
    if(order) endpoint += `&order=${order}`;
    if(keyword) endpoint += `&keyword=${keyword}`;

    return servicesClients.get(SERVICES_URL + endpoint);
}

/**
 * Schools
 */
const getSchools = ({keyword, city, sortBy, sortType, page}) => {
    let url = `schools?page=${page}`;
    if(keyword) url += `&search=${keyword}`;
    if(city) url += `&cityId=${city}`;
    if(sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    return httpClient.get(BASE_URL + url);
}

const getSchoolsRequest = ({keyword, city, sortBy, sortType, page}) => {
    let url = `schools/request?page=${page}`;
    if(keyword) url += `&search=${keyword}`;
    if(city) url += `&cityId=${city}`;
    if(sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    return httpClient.get(BASE_URL + url);
}

const approveSchoolsRequest = (id) => httpClient.post(BASE_URL + `school/${id}/approve`)
const rejectSchoolsRequest = (id) => httpClient.post(BASE_URL + `school/${id}/reject`)
const schoolsRequestCounter = () => httpClient.get(BASE_URL + `schools/request/counter`)
const apiGetSchoolDetail = (id) => httpClient.get(BASE_URL + `school/${id}`)

export {
    register,
    logout,
    apiGetRequestStudents,
    postApproveStudent,
    postRejectStudent,
    getStatisticProvincies,
    getStatisticProvinciesScore,
    getStatisticCounter,
    getStatisticChart,
    getSchools,
    getSchoolsRequest,
    rejectSchoolsRequest,
    schoolsRequestCounter,
    apiGetSchoolDetail,
    approveSchoolsRequest,
    getStatisticActiveBatchs,
    getStatisticActiveBatchChart,
    getStatisticLandingPage,
    getStatisticStudentChart,
    getStatisticRegistrarChart,
    getStatisticModuleProgress,
    getStatisticStudentProgressModule
}