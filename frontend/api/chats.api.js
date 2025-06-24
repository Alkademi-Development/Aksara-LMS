import servicesClients from "./servicesClients"

const BASE_URL = process.env.baseURL
const BASE_URL_SERVICES = process.env.servicesApi

// Deprecated
const searchChatUser = (keyword) => httpClient.get(BASE_URL + `chat/user/search?keyword=${keyword}`)

const send = (params) => httpClient.post(BASE_URL + 'chat/send', params)

const chats = (page) => httpClient.get(BASE_URL + `chats?page=${page}`)

const detail = (id, page) => httpClient.get(BASE_URL + `chat/${id}?page=${page}`)

const detailByUser = (id, page) => httpClient.get(BASE_URL + `chat/user/${id}?page=${page}`)

// New Version
const listChat = (page, perPage) => {
    var endpoint = `v1/chat/list`

    const __page = !!page ? `&page=${ page }` : ''
    const __perPage = !!perPage ? `&pageSize=${ perPage }` : ''

    endpoint += '?' + __page + __perPage

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const detailChat = (uuid) => servicesClients.get(BASE_URL_SERVICES + `v1/chat/detail?uuid=${ uuid }`)
const listMessage = (uuid, page, perPage) => {
    var endpoint = `v1/chat/messages`

    const __uuid = !!uuid ? `uuid=${ uuid }` : ''
    const __page = !!page ? `&page=${ page }` : ''
    const __perPage = !!perPage ? `&pageSize=${ perPage }` : ''

    endpoint += '?' + __uuid + __page + __perPage

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const negotiateChat = () => servicesClients.post(BASE_URL_SERVICES + `v1/chat/negotiate`)
const sendChat = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/chat/send`, params)
const shareableContent = (userId, search) => {
    var endpoint = `v1/chat/content/shareable?userId=${ userId }`

    const __search = !!search ? `&search=${ search }` : ''

    endpoint += __search

    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}

export {
    // deprecated
    searchChatUser,
    send,
    chats,
    detail,
    detailByUser,
    // new version
    listChat,
    detailChat,
    listMessage,
    negotiateChat,
    sendChat,
    shareableContent
}