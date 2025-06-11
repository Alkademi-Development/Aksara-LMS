import servicesClients from "../servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

const apiGetMeetsV2 = (
    classroomSlug, 
    page, 
    pageSize,
) => {
    const url = 'v2/meet/list'

    const _classroomSlug = !!classroomSlug ? `classroomSlug=${classroomSlug}` : ''
    const _page = !!page ? `&page=${page}` : ''
    const _pageSize = !!pageSize ? `&pageSize=${pageSize}` : ''

    const params = '?' + _classroomSlug + _page + _pageSize
 
    return servicesClients.get(BASE_URL_SERVICES + url + params)
}

const apiDetailMeetsV2 = (classroomSlug, eventSlug) => {
    const url = 'v2/meet/detail'

    const _classroomSlug = !!classroomSlug ? `classroomSlug=${classroomSlug}` : ''
    const _eventSlug = !!eventSlug ? `&topicSlug=${eventSlug}` : ''

    const params = '?' + _classroomSlug + _eventSlug
 
    return servicesClients.get(BASE_URL_SERVICES + url + params)
}

const apiPostMeets = (params) => {
    const url = 'v1/meet/create'

    return servicesClients.post(BASE_URL_SERVICES + url, params)
}

const apiUpdateMeets = (params, eventId) => {
    const url = 'v1/meet/update'

    const _eventId = !!eventId ? `?topicId=${eventId}` : ''

    return servicesClients.post(BASE_URL_SERVICES + url + _eventId, params)
}

const apiDeleteMeets = (eventId, clasroomId) => {
    const url = 'v1/meet/delete'

    const _eventId = !!eventId ? `?topicId=${eventId}` : ''
    const _classroomId = !!clasroomId ? `&classroomId=${clasroomId}` : ''

    return servicesClients.post(BASE_URL_SERVICES + url + _eventId + _classroomId)
}

export { 
    apiDetailMeetsV2,
    apiDeleteMeets,
    apiGetMeetsV2,
    apiUpdateMeets,
    apiPostMeets,
}