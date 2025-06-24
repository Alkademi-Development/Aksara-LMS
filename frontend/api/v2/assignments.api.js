import servicesClients from "../servicesClients"
import httpClientExport from '../httpClientExport'

const BASE_URL_SERVICES = process.env.servicesApi

const apiGetStudentsAssignmentV2 = (
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
    let url = `v2/assignment/students?topicId=${topicId}`

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

export {
    apiGetStudentsAssignmentV2,
}