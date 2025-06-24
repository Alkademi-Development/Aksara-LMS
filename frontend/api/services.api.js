import axios from "axios"
import appToken from "./app-token"
import servicesClients from "./servicesClients"
import httpClientExport from './httpClientExport'

const BASE_URL_SERVICES = process.env.servicesApi
const BASE_URL_DRIVE = process.env.baseUrlDrive;

// Authorizer
const apiLocationList = () => servicesClients.get(BASE_URL_SERVICES + `v1/location/list`)
const apiCities = () => servicesClients.get(BASE_URL_SERVICES + `v1/authorizer/cities`)
const apiProvinces = () => servicesClients.get(BASE_URL_SERVICES + `v1/authorizer/provinces`)

// User
const apiAuthorize = () => servicesClients.get(BASE_URL_SERVICES + `v1/user/me`)
const apiUserDetail = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/user/detail?userId=${id}`)
const apiUpdateProfile = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/user/profile/update`, params)
const apiDetailUserbyHashEmail = (hashEmail) => servicesClients.get(BASE_URL_SERVICES + `v1/user/public?user=${hashEmail}`)
const apiUserExperience = (userId, page = null, perPage = null, type = '', sort = null, search = null) => {
  let endpoint = 'v1/user/experience/list?'

  if (userId) endpoint += `userId=${userId}`
  if (page) endpoint += `&page=${page}`
  if (perPage) endpoint += `&pageSize=${perPage}`
  if (type) endpoint += `&type=${type}`
  if (search) endpoint += `&search=${search}`
  if (sort) endpoint += `&sort=${sort}`

  return servicesClients.get(BASE_URL_SERVICES + endpoint)
}

// Classrooms
const apiCreateClassroom = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/create`, params)
const apiEditClassroom = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/update?classroomId=${id}`, params)
const apiDeleteClassroom = (id) => servicesClients.post(BASE_URL_SERVICES + `v1/class/delete?classroomId=${id}`)
const apiClassrooms = (page = null, perPage = null, state = null, sort = null, search = null, type = null, programId = null, all = null, preClass = null) => {
    let endpoint = "v1/class/list?"

    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (state) endpoint += `&state=${state}`
    if (search) endpoint += `&search=${search}`
    if (sort) endpoint += `&sort=${sort}`
    if (type) endpoint += `&type=${type}`
    if (programId) endpoint += `&programId=${programId}`
    if (all) endpoint += `&all=${all}`;
    if (preClass) endpoint += `preClass=${preClass}`;

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiClassroomsHistory = (page = null, perPage = null, userId = null, programId = null) => {
    let endpoint = `v1/class/history?`
    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (userId) endpoint += `&userId=${userId}`
    if (programId) endpoint += `&programId=${programId}`

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiDraftClassrooms = (page = null, perPage = null, programId = null, search = null, sort = null) => {
    let url = `v1/class/draft`

    if (page) {
        url += `?page=${page}`
        if (perPage) url += `&pageSize=${perPage}`
        if (programId) url += `&programId=${programId}`
        if (search) url += `&search=${search}`
        if (sort) url += `&sort=${sort}`
    }

    return servicesClients.get(BASE_URL_SERVICES + url)
}
const apiActiveClassrooms = (page = null, perPage = null, state = null, search = null, sort = null, level = null, type = null, programId = null) => {
    let endpoint = `v1/class/active?`

    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (state) endpoint += `&state=${state}`
    if (search) endpoint += `&search=${search}`
    if (sort) endpoint += `&sort=${sort}`
    if (level) endpoint += `&level=${level}`
    if (type) endpoint += `&filter.type=${type}`
    if (programId) endpoint += `&programId=${programId}`

    const httpClient = axios.create({
        baseURL: BASE_URL_SERVICES
    })

    const authInterceptor = async (config) => {
        while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
        }

        config.headers['AppToken'] = await appToken.generateDAppToken()
        return await config
    }

    httpClient.interceptors.request.use(authInterceptor)

    return httpClient.get(BASE_URL_SERVICES + endpoint)
}
const apiClassroomDetail = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/class/detail?classroomId=${id}`)
const apiClassroomOverview = (code) => servicesClients.get(BASE_URL_SERVICES + `v1/class/overview?slug=${code}`)
const apiClassroomSyllabus = (classId) => servicesClients.get(BASE_URL_SERVICES + `v1/class/syllabus?classroomId=${classId}`)
const apiClassroomModules = (id, userId) => {
    let endpoint = `v1/class/module/list?classroomId=${id}`
    if (userId) endpoint += `&userId=${userId}`
    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiClassroomTopics = (moduleId, classroomId, userId) => {
    let endpoint = `v1/class/topic/list?moduleId=${moduleId}&classroomId=${classroomId}`
    if (userId) endpoint += `&userId=${userId}`
    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}

const apiTopicsByClassId = (classroomId) => {
    let endpoint = `v1/class/topic/list?classroomId=${classroomId}`
    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiClassroomTopicsDetail = (moduleId, classroomId, topicId) => servicesClients.get(BASE_URL_SERVICES + `v1/class/topic/detail?moduleId=${moduleId}&classroomId=${classroomId}&topicId=${topicId}`)
const apiClassroomAssignModule = (classroomId, moduleId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/module/assign?classroomId=${classroomId}&moduleId=${moduleId}`)
const apiClassroomDeleteModule = (classroomId, moduleId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/module/remove?classroomId=${classroomId}&moduleId=${moduleId}`)
const apiClassroomAssignments = (page, classroomId, topicId) => servicesClients.get(BASE_URL_SERVICES + `v1/assignment/list?page=${page}&classroomId=${classroomId}&topicId=${topicId}`)
const apiRaportAssignments = (classroomId, moduleId, userId) => servicesClients.get(BASE_URL_SERVICES + `v1/assignment/list?classroomId=${classroomId}&moduleId=${moduleId}&userId=${userId}`)
const apiClassroomEnroll = (code, params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/enroll?code=${code}`, params)
const apiClassroomAssignScore = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/assignment/score`, params)
const apiClassroomAssignTask = (classId, topicId) => servicesClients.post(BASE_URL_SERVICES + `v1/assignment/start?classroomId=${classId}&topicId=${topicId}`)
const apiClassroomAssignLink = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/assignment/assign`, params)
const apiClassroomRelease = (classroomId) => servicesClients.get(BASE_URL_SERVICES + `v1/class/state/release?classroomId=${classroomId}`)
const apiClassroomRequirements = () => servicesClients.get(BASE_URL_SERVICES + `v1/class/requirement/fields`)
const apiClassroomMentors = (classroomId, joined) => servicesClients.get(BASE_URL_SERVICES + `v1/class/mentors?classroomId=${classroomId}&join=${joined}`)
const apiClassroomRemoveMentor = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/mentor/remove`, params)
const apiClassroomAssignMentors = (params, classroomId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/mentor/assign?classroomId=${classroomId}`, params)
// Leaderboards
const apiClassroomLeaderboards = (classroomId, page) => servicesClients.get(BASE_URL_SERVICES + `v1/class/leaderboards?classroomId=${classroomId}&page=${page}`)
const apiClassroomPretestLeaderboards = (classroomId, page) => servicesClients.get(BASE_URL_SERVICES + `v1/class/pretest/leaderboards?classroomId=${classroomId}&page=${page}`)
const apiClassroomLeaderboardsExport = (classroomId) => httpClientExport.get(BASE_URL_SERVICES + `v1/class/leaderboards?classroomId=${classroomId}&export=true`)
const apiClassroomPretestLeaderboardsExport = (classroomId) => httpClientExport.get(BASE_URL_SERVICES + `v1/class/pretest/leaderboards?classroomId=${classroomId}&export=true`)
const apiClassroomStudents = (classroomId) => servicesClients.get(BASE_URL_SERVICES + `v1/class/students?classroomId=${classroomId}`)
const apiClassroomStudentsNotJoin = (classroomId) => servicesClients.get(BASE_URL_SERVICES + `v1/class/students?classroomId=${classroomId}&join=false`)
const apiClassroomStudentsJoin = (classroomId) => servicesClients.get(BASE_URL_SERVICES + `v2/class/students?classroomId=${classroomId}&join=true`)
const apiClassroomInviteStudent = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/invite`, params)
// const apiClassroomKickStudent = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/kick`, params)
const apiClassroomKickStudent = (params) => servicesClients.post(BASE_URL_SERVICES + `v2/class/kick`, params)
const apiClassroomPublishPretest = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/pretest/publish`, params)
// Assignment
const apiPublicAssignment = (hashEmai) => servicesClients.get(BASE_URL_SERVICES + `v1/assignment/public?user=${hashEmai}`)
const apiStudentAssignmentDetail = (classId, topicId, userId) => servicesClients.get(BASE_URL_SERVICES + `v1/assignment/detail?classroomId=${classId}&topicId=${topicId}&userId=${userId}`)


// Certificate
const apiCertificates = (search = null, sort = null, page = null, perPage = null) => {
    var endpoint = `v1/certificate/list`

    const __search = !!search ? `&search=${search}` : ''
    const __sort = !!sort ? `&sort=${sort}` : ''
    const __page = !!page ? `&page=${page}` : ''
    const __perPage = !!perPage ? `&pageSize=${perPage}` : ''

    endpoint += '?' + __search + __sort + __page + __perPage
    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiCertificateDownload = (userId, classroomId) => httpClientExport.get(BASE_URL_SERVICES + `v1/certificate/download?userId=${userId}&classroomId=${classroomId}`)
const apiCertificateRaporDownload = (userId, classroomId) => httpClientExport.get(BASE_URL_SERVICES + `v1/certificate/rapor/download?userId=${userId}&classroomId=${classroomId}`)

// Programs
const apiAllPrograms = () => servicesClients.get(BASE_URL_SERVICES + `v1/program/list`)
const apiPrograms = (page = null, perPage = null, sort = null, search = null) => {
    let endpoint = 'v1/program/list?'

    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (search) endpoint += `&search=${search}`
    if (sort) endpoint += `&sort=${sort}`

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiProgramDetail = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/program/detail?id=${id}`)
const apiCreateProgram = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/program/create`, params)
const apiEditProgram = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/program/update?id=${id}`, params)
const apiDeleteProgram = (id) => servicesClients.post(BASE_URL_SERVICES + `v1/program/delete?id=${id}`)

// Modules
const apiModules = (page, pageSize, type, search, sort) => {
    var params = ''
    if (page) params += `?page=${page}`
    if (pageSize) params += `&pageSize=${pageSize}`
    if (type) params += `&type=${type}`
    if(search) params += `&search=${search}`
    if(sort) params += `&sort=${sort}`

    return servicesClients.get(BASE_URL_SERVICES + `v1/module/list${params}`)
}
const apiModuleDetail = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/module/detail?moduleId=${id}`)
const apiCreateModule = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/module/create`, params)
const apiEditModule = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/module/edit?moduleId=${id}`, params)
const apiDeleteModule = (id) => servicesClients.post(BASE_URL_SERVICES + `v1/module/delete?moduleId=${id}`)
const apiGetListModulesLibrary = (page, pageSize, type, search, sort) => {
    var params = ''
    if (page) params += `?page=${page}`
    if (pageSize) params += `&pageSize=${pageSize}`
    if (type) params += `&type=${type}`
    if(search) params += `&search=${search}`
    if(sort) params += `&sort=${sort}`

    return servicesClients.get(BASE_URL_SERVICES + `v1/module/public${params}`)
}
const apiGetListModulesDraft = (page, pageSize, type, search, sort) => {
    let params = ''

    if (page) params += `&page=${page}`
    if (pageSize) params += `&pageSize=${pageSize}`
    if (type) params += `&type=${type}`
    if(search) params += `&search=${search}`
    if(sort) params += `&sort=${sort}`

    return servicesClients.get(BASE_URL_SERVICES + `v1/module/draft?${params}`)
}

const apiPublishModule = (moduleId) => servicesClients.post(BASE_URL_SERVICES + `v1/module/state/release?moduleId=${moduleId}`);

// Module From CLassroom
const apiClassroomCreateModule = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/module/create`, params);
const apiClassroomEditModule = (moduleId, params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/module/edit?moduleId=${moduleId}`, params);
const apiClassroomModuleDeleted = (moduleId, classroomId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/module/delete?moduleId=${moduleId}&classroomId=${classroomId}`);
const apiClassroomDetailModule = (moduleId, classroomId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/module/detail?moduleId=${moduleId}&classroomId=${classroomId}`);
const apiClassroomPublishModule = (moduleId, classroomId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/module/state/release?moduleId=${moduleId}&classroomId=${classroomId}`);

// Topics
const apiAllTopics = (page, id) => {
    let endpoint = "v1/module/topic/list?"

    if (page) endpoint += `&page=${page}`
    if (id) endpoint += `&moduleId=${id}`

    return servicesClients.get(BASE_URL_SERVICES + endpoint);
}
const apiTopics = (page, id) => {
    var params = ''
    if (page) params += `?page=${page}`
    if (id) params += `&moduleId=${id}`
    return servicesClients.get(BASE_URL_SERVICES + `v1/module/topic/list${params}`)
}
const apiTopicDetail = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/module/topic/detail?topicId=${id}`)
const apiCreateTopic = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/module/topic/create`, params)
const apiEditTopic = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/module/topic/edit?topicId=${id}`, params)
const apiDeleteTopic = (id) => servicesClients.post(BASE_URL_SERVICES + `v1/module/topic/delete?topicId=${id}`)
const apiClassroomCreateTopic = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/topic/create`, params);
const apiClassroomEditTopic = (topicId, classroomId, params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/topic/edit?topicId=${topicId}&classroomId=${classroomId}`, params);
const apiClassroomDeleteTopic = (topicId, classroomId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/topic/delete?topicId=${topicId}&classroomId=${classroomId}`);
const apiClassroomPublishTopic = (topicId, classroomId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/topic/state/release?topicId=${topicId}&classroomId=${classroomId}`);
const apiClassroomRemoveTopic = (topicId, classroomId) => servicesClients.post(BASE_URL_SERVICES + `v1/class/topic/remove?topicId=${topicId}&classroomId=${classroomId}`);


// Blogs & Gallery
const apiDetailPost = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/post/detail?id=${id}`)
const apiDeletePost = (id) => servicesClients.post(BASE_URL_SERVICES + `v1/post/delete?id=${id}`)
    // Blogs
const apiBlogs = (page) => servicesClients.get(BASE_URL_SERVICES + `v1/post/article/list?page=${page}`)
const apiCreateBlog = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/post/article/create`, params)
const apiEditBlog = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/post/article/update?id=${id}`, params)
    // Gallery
const apiGalleries = (page) => servicesClients.get(BASE_URL_SERVICES + `v1/post/gallery/list?page=${page}`)
const apiCreateGallery = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/post/gallery/create`, params)
const apiEditGallery = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/post/gallery/update?id=${id}`, params)

// Newsletters
const apiGetNewsletterList = ({
  page,
  pageSize,
  filter
}) => {
  const url = 'v0/cms/newsletter/list';

  const _page = !!page ? `page=${page}` : ''
  const _pageSize = !!pageSize ? `&pageSize=${pageSize}` : ''
  const _filter = !!filter ? `&filter=${filter}` : '';

  const queries = '?' + _page + _pageSize + _filter;

  return servicesClients.get(BASE_URL_SERVICES + url + queries)
};
const apiGetNewsletterDetail = (slug) => servicesClients.get(BASE_URL_SERVICES + `v0/cms/newsletter/detail?slug=${slug}`);
const apiPostNewsletter = (params) => servicesClients.post(BASE_URL_SERVICES + 'v0/cms/newsletter/create', params);

// Attendance
const apiCreateClassAttendance = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/attendance/create?classId=${id}`, params)
// const apiCreateMeetAttendance = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/meet/attendance/create?topicId=${id}`, params)
const apiCreatePostAttendance = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/post/attendance/create?postId=${id}`, params)
const apiGetDetailAttendance = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/attendance/detail?attendanceId=${id}`)
const apiEditClassAttendance = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/class/attendance/edit?classId=${id}`, params)
const apiEditPostAttendance = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/post/attendance/edit?postId=${id}`, params)
const apiEditMeetAttendance = (id, params) => servicesClients.post(BASE_URL_SERVICES + `v1/meet/attendance/edit?topicId=${id}`, params)
const apiGetClassAttendanceRecap = (id, page = null, perPage = null, startDate = null, endDate = null, order = null, search = null, userId = null, isExport = false) => {
    let endpoint = 'v1/class/attendance/records?'

    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (startDate) endpoint += `&startDate=${startDate}`
    if (endDate) endpoint += `&endDate=${endDate}`
    if (id) endpoint += `&classId=${id}`
    if (order) endpoint += `&order=${order}`
    if (search) endpoint += `&search=${search}`
    if (userId) endpoint += `&userId=${userId}`
    if (isExport) endpoint += '&export=true'

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiGetMeetAttendanceRecap = (id, page = null, perPage = null, startDate = null, endDate = null, order = null, search = null, userId = null, isExport = false) => {
    let endpoint = 'v1/meet/attendance/records?'

    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (startDate) endpoint += `&startDate=${startDate}`
    if (endDate) endpoint += `&endDate=${endDate}`
    if (id) endpoint += `&topicId=${id}`
    if (order) endpoint += `&order=${order}`
    if (search) endpoint += `&search=${search}`
    if (userId) endpoint += `&userId=${userId}`
    if (isExport) endpoint += '&export=true'

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiGetPostAttendanceRecap = (id, page = null, perPage = null, startDate = null, endDate = null, order = null, search = null, userId = null) => {
    let endpoint = 'v1/attendance/recap?'

    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (startDate) endpoint += `&startDate=${startDate}`
    if (endDate) endpoint += `&endDate=${endDate}`
    if (id) endpoint += `&attendanceId=${id}`
    if (order) endpoint += `&order=${order}`
    if (search) endpoint += `&search=${search}`
    if (userId) endpoint += `&userId=${userId}`

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiGetClassAttendanceStatus = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/class/attendance/status?classId=${id}`)
const apiPostAttendanceRecapExport = (id, page = null, perPage = null, startDate = null, endDate = null, order = null, search = null, userId = null, isExport = false) => {
    let endpoint = 'v1/attendance/recap/download?'

    if (page) endpoint += `&page=${page}`
    if (perPage) endpoint += `&pageSize=${perPage}`
    if (startDate) endpoint += `&startDate=${startDate}`
    if (endDate) endpoint += `&endDate=${endDate}`
    if (id) endpoint += `&attendanceId=${id}`
    if (order) endpoint += `&order=${order}`
    if (search) endpoint += `&search=${search}`
    if (userId) endpoint += `&userId=${userId}`
    if (isExport) endpoint += '&export=true'

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}

const apiGetClassAttendanceUser = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/class/attendance/users?classId=${id}`)
const apiGetPostAttendanceUser = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/attendance/users?attendanceId=${id}`)

// Drive
const apiUploadFile = (payload) => servicesClients.post(BASE_URL_DRIVE + `v1/upload`, payload);

export {
    // Drive
    apiUploadFile,

    // Authorizer
    apiLocationList,
    apiCities,
    apiProvinces,

    // User
    apiAuthorize,
    apiUserDetail,
    apiUpdateProfile,
    apiDetailUserbyHashEmail,
    apiUserExperience,

    // Classrooms
    apiCreateClassroom,
    apiEditClassroom,
    apiDeleteClassroom,
    apiClassrooms,
    apiClassroomsHistory,
    apiDraftClassrooms,
    apiActiveClassrooms,
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
    apiClassroomMentors,
    apiClassroomRemoveMentor,
    apiClassroomAssignMentors,
    apiPublicAssignment,
    apiStudentAssignmentDetail,
    apiClassroomStudentsJoin,
    apiClassroomCreateTopic,
    apiClassroomEditTopic,
    apiClassroomDeleteTopic,

    // Certificate
    apiCertificates,
    apiCertificateDownload,
    apiCertificateRaporDownload,

    // Programs
    apiAllPrograms,
    apiPrograms,
    apiProgramDetail,
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
    apiTopics,
    apiTopicDetail,
    apiCreateTopic,
    apiEditTopic,
    apiDeleteTopic,
    apiTopicsByClassId,
    apiClassroomPublishTopic,
    apiClassroomRemoveTopic,

    // Blogs
    apiDetailPost,
    apiDeletePost,
    apiBlogs,
    apiCreateBlog,
    apiEditBlog,
    apiGalleries,
    apiCreateGallery,
    apiEditGallery,

    // Newsletters
    apiGetNewsletterList,
    apiGetNewsletterDetail,
    apiPostNewsletter,

    // Attendance
    apiCreateClassAttendance,
    // apiCreateMeetAttendance,
    apiCreatePostAttendance,
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
}
