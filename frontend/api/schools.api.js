import servicesClients from "./servicesClients"

const BASE_URL = process?.env?.servicesApi

const apiList = ( page = null, pageSize = null, sort = null,  search = null ) => {

    let url = `v1/school/list?`

    if ( page ) url += `&page=${ page }`
    if ( pageSize ) url += `&pageSize=${ pageSize }`
    if ( sort ) url += `&sort=${ sort }`
    if ( search ) url += `&search=${ search }`

    return servicesClients.get(BASE_URL + url)

}

const apiStudents = ( id = null, page = null, perPage = null, sort = null, search = null ) => {
    let url = `v1/school/student/list?`

    if ( id ) url += `&schoolId=${ id }`
    if ( page ) url += `&page=${ page }`
    if ( perPage ) url += `&perPage=${ perPage }`
    if ( sort ) url+= `&filter.order=${ sort }`
    if ( search ) url+= `&filter.search=${ search }`
    return servicesClients.get(BASE_URL + url)
}

const apiActive = () => servicesClients.post(BASE_URL + `v1/school/active`)
const apiDetail = (id) => servicesClients.post(BASE_URL + `v1/school/detail?id=${id}`)
const apiCreate = (params) => servicesClients.post(BASE_URL + `v1/school/create`, params)
const apiUpdate = (id, params) => servicesClients.post(BASE_URL + `v1/school/update?id=${id}`, params)
const apiDelete = (id) => servicesClients.post(BASE_URL + `v1/school/delete?id=${id}`)

export {

    apiList,
    apiActive,
    apiCreate,
    apiUpdate,
    apiDetail,
    apiDelete,
    apiStudents

}