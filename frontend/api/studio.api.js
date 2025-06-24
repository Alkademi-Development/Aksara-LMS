
import studioClients from "./studioClients"

const BASE_URL_SERVICES = process.env.servicesApi

const apiGetExt = (version = null) => {
    let url = 'v1/metronom/ce/lang'
    if (version) {
        url += `?v=${version}`
    }
    return studioClients.get(BASE_URL_SERVICES + url)
}
const apiGetAllStudio = () => studioClients.get(BASE_URL_SERVICES + `v1/metronom/ce`)
const apiGetStudio = (id) => studioClients.get(BASE_URL_SERVICES + `v1/metronom/ce/${id}`)
const apiCreateStudio = (params) => studioClients.post(BASE_URL_SERVICES + `v1/metronom/ce/file`, params)
const apiEditStudio = (id, params) => studioClients.post(BASE_URL_SERVICES + `v1/metronom/ce/${id}/edit`, params)
const apiDeleteStudio = (id) => studioClients.post(BASE_URL_SERVICES + `v1/metronom/ce/${id}/delete`)

const apiGetListStudio = (page, kind, keyword) => {
    let url = `v1/metronom/ce`

    const tempPage = !!page ? `page=${page}` : ''
    const tempKind = !!kind ? `&kind=${kind}` : ''
    const tempKeyword = !!keyword ? `&search=${keyword}` : ''

    const params = '?' + tempPage + tempKind + tempKeyword

    return studioClients.get(BASE_URL_SERVICES + url + params)
}
const apiGetDetailProject = (metronomId) =>
  studioClients.get(`${BASE_URL_SERVICES}v1/metronom/ce/${metronomId}/answer`)

const apiSaveCode = (metronomId, payload) =>
  studioClients.post(`${BASE_URL_SERVICES}v1/metronom/ce/${metronomId}/save`, payload)

const apiRunCode = (metronomId, payload) =>
  studioClients.post(`${BASE_URL_SERVICES}v1/metronom/ce/${metronomId}/run`, payload)

const apiSubmitCode = (metronomId, stdin = '') =>
  studioClients.post(`${BASE_URL_SERVICES}v1/metronom/ce/${metronomId}/submit`, stdin)

export {
    apiGetExt,
    apiGetAllStudio,
    apiGetListStudio,
    apiGetStudio,
    apiCreateStudio,
    apiEditStudio,
    apiDeleteStudio,
    apiGetDetailProject,
    apiSaveCode,
    apiRunCode,
    apiSubmitCode
}