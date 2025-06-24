import servicesClients from "../servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

const apiGetStudents = (
    classroomId, 
    page, 
    pageSize,
    join, 
    search, 
    order, 
    minScore, 
    maxScore, 
    shorten,
    pretest,
    certified,
) => {
    const url = 'v2/class/students'

    const _classroomId = !!classroomId ? `classroomId=${classroomId}` : ''
    const _page = !!page ? `&page=${page}` : ''
    const _pageSize = !!pageSize ? `&pageSize=${pageSize}` : ''
    const _join = !!join ? `&join=${join}` : ''
    const _search = !!search ? `&filter.search=${search}` : ''
    const _minScore = !!minScore ? `&filter.minScore=${minScore}` : ''
    const _maxScore = !!maxScore ? `&filter.maxScore=${maxScore}` : ''
    const _pretest = !!pretest ? `&filter.pretest=${pretest}` : ''
    const _order = !!order ? `&order=${order}` : ''
    const _shorter = !!shorten ? `&shorten=${shorten}` : '';
    const _certified = !!certified ? `&filter.certified=${certified}` : ''

    const params = '?' + _classroomId + _page + _pageSize + _join + _search + _minScore + _maxScore + _pretest + _order + _shorter + _certified;
    return servicesClients.get(BASE_URL_SERVICES + url + params)
}

const apiClassroomMentorsV2 = (classroomSlug, joined) => servicesClients.get(BASE_URL_SERVICES + `v2/class/mentors?classroomSlug=${classroomSlug}&join=${joined}`)
const apiClassroomModulesV2 = (slug, userId) => {
    let endpoint = `v2/class/module/list?classroomSlug=${slug}`
    if (userId) endpoint += `&userId=${userId}`
    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiClassroomTopicsV2 = (moduleSlug, classroomSlug, userId) => {
    let endpoint = `v2/class/topic/list?moduleSlug=${moduleSlug}&classroomSlug=${classroomSlug}`
    if (userId) endpoint += `&userId=${userId}`
    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}

const apiClassroomAssignModules = (params) => servicesClients.post(BASE_URL_SERVICES + 'v2/class/module/assign', params)

const apiClassroomTopicDetailV2 = (classroomSlug, topicSlug) => servicesClients.get(BASE_URL_SERVICES + `v2/class/topic/detail?classroomSlug=${classroomSlug}&topicSlug=${topicSlug}`);
const apiClassroomDetailModuleV2 = (moduleSlug, classroomSlug) => servicesClients.get(BASE_URL_SERVICES + `v2/class/module/detail?moduleSlug=${moduleSlug}&classroomSlug=${classroomSlug}`);

export {
    apiGetStudents,
    apiClassroomMentorsV2,
    apiClassroomModulesV2,
    apiClassroomTopicsV2,
    apiClassroomTopicDetailV2,
    apiClassroomDetailModuleV2,
    apiClassroomAssignModules
}
