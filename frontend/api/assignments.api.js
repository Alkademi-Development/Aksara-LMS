import servicesClients from "./servicesClients"
import httpClientExport from './httpClientExport'

const BASE_URL_SERVICES = process.env.servicesApi

// GET
const apiDetailAssignment = (topicId) => servicesClients.get(BASE_URL_SERVICES + `v1/assignment/base/detail?topicId=${topicId}`)
const apiPublicAssignments = (user, slug) => servicesClients.get(BASE_URL_SERVICES + `v1/assignment/public?user=${user}&slug=${slug}`)

const apiGetAssignmentCounter = (classroomId, topicId) => servicesClients.get(BASE_URL_SERVICES + `v1/assignment/base/counter?classroomId=${classroomId}&topicId=${topicId}`)

const apiGetAssignments = (
    classroomId, 
    page, 
    pageSize,
    order, 
    search, 
    moduleId, 
    type,
    moduleType,
) => {
    const url = 'v1/assignment/base/list'
    
    const _classroomId = !!classroomId ? `classroomId=${classroomId}` : ''
    const _page = !!page ? `&page=${page}` : ''
    const _pageSize = !!pageSize ? `&pageSize=${pageSize}` : ''
    const _order = !!order ? `&order=${order}` : ''
    const _search = !!search ? `&filter.search=${search}` : ''
    const _moduleId = !!moduleId ? `&filter.moduleId=${moduleId}` : ''
    const _type = !!type ? `&filter.type=${type}` : ''
    const _moduleType = !!moduleType ? `&moduleType=${moduleType}` : ''

    const params = '?' + _classroomId + _page + _pageSize + _order + _search + _moduleId + _type + _moduleType
 
    return servicesClients.get(BASE_URL_SERVICES + url + params)
}

const apiGetStudentsAssignment = (
    topicId = null, // Required
    minScore = null,
    search = null,
    maxScore = null,
    state = null,
    order = null,
    page = null,
    perPage = null,
    isExport = null,
) => {
    let url = `v1/assignment/students?topicId=${topicId}`

    if (minScore) url += `&filter.minScore=${minScore}`
    if (search) url += `&filter.search=${search}`
    if (maxScore) url += `&filter.maxScore=${maxScore}`
    if (state) url += `&filter.state=${state}`
    if (order) url += `&order=${order}`
    if (isExport) url += `&export=${isExport}`
    if (page) url += `&page=${page}`
    if (perPage) url += `&pageSize=${perPage}`

    if (isExport) return httpClientExport.get(BASE_URL_SERVICES + url)
    else return servicesClients.get(BASE_URL_SERVICES + url)
}

const apiGetAssignmentToReview = (page = null, perPage = null, state = null, classroomId = null, order = null) => {
    let url = `v1/assignment/review/list?`
    
    if (page) url += `&page=${page}`
    if (perPage) url += `&pageSize=${perPage}`
    if (state) url += `&state=${state}`
    if (classroomId) url += `&classroomId=${classroomId}`
    if (order) url += `&order=${order}`

    return servicesClients.get(BASE_URL_SERVICES + url)
}

const apiGetAssignmentStudentHistories = (classroomId, topicId, page, pageSize) => {
    let endpoint = `v1/assignment/base/history?`;

    if(classroomId) endpoint += `&classroomId=${classroomId}`;
    if(topicId) endpoint += `&topicId=${topicId}`;
    if(page) endpoint += `&page=${page}`;
    if(pageSize) endpoint += `&pageSize=${pageSize}`;

    return servicesClients.get(BASE_URL_SERVICES + endpoint);
}

// POST
const apiCreateAssignment = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/assignment/base/create`, params)
const apiEditAssignment = (params, topicId) => servicesClients.post(BASE_URL_SERVICES + `v1/assignment/base/edit?topicId=${topicId}`, params)
const apiDeleteAssignment = (classroomId, topicId) => servicesClients.post(BASE_URL_SERVICES + `v1/assignment/base/delete?topicId=${topicId}&classroomId=${classroomId}`)

export {
    apiGetAssignments,
    apiGetStudentsAssignment,
    apiGetAssignmentToReview,
    apiCreateAssignment,
    apiEditAssignment,
    apiDetailAssignment,
    apiPublicAssignments,
    apiDeleteAssignment,
    apiGetAssignmentCounter,
    apiGetAssignmentStudentHistories,
}