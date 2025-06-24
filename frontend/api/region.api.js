import servicesClients from "./servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

// Authorizer
const apiList = (page) => {
    let endpoint = `v1/region/list?`
    if (page) endpoint += `&page=${ page }`
    return servicesClients.get(BASE_URL_SERVICES + endpoint)
}
const apiDetail = (uuid) => servicesClients.get(BASE_URL_SERVICES + `v1/region/detail?uuid=${ uuid }`)
const apiCreate = (params) => servicesClients.post(BASE_URL_SERVICES + `v1/region/create`, params)
const apiUpdate = (uuid, params) => servicesClients.post(BASE_URL_SERVICES + `v1/region/update?uuid=${ uuid }`, params)
const apiDelete = (uuid) => servicesClients.post(BASE_URL_SERVICES + `v1/region/delete?uuid=${ uuid }`)

export {
    apiList,
    apiDetail,
    apiCreate,
    apiUpdate,
    apiDelete,
}