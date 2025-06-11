import servicesClients from "./servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

// Get
const apiGetUsers = (page, kind, keyword, isChat = false, certified) => {
    let url = `v1/user/list`

    if(!!isChat) url = `v1/chat/user/list`
    const tempPage = !!page ? `page=${page}` : ''
    const tempKind = !!kind ? `&kind=${kind}` : ''
    const tempKeyword = !!keyword ? `&keyword=${keyword}` : '';
    const isCertified = !!certified ? `&certified=${certified}` : '';

    const params = '?' + tempPage + tempKind + tempKeyword + isCertified;

    return servicesClients.get(BASE_URL_SERVICES + url + params)
}

const apiGetDetailUser = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/user/detail?userId=${id}`)

const apiPostUser = (body) => servicesClients.post(BASE_URL_SERVICES + 'v1/user/create', body)

const apiEditUser = (userId, body) => servicesClients.post(BASE_URL_SERVICES + `v1/user/edit?userId=${userId}`, body)

export {
    apiGetUsers,
    apiGetDetailUser,
    apiPostUser,
    apiEditUser,
}