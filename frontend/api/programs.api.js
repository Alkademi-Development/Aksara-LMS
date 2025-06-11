import httpClient from './httpClient'


const BASE_URL = process.env.baseURL

const apiGetPrograms = () => httpClient.get(BASE_URL + 'programs')

const apiGetProgramById = (program_id) => httpClient.get(BASE_URL + `program/${program_id}`)

const apiPostProgram = (params) => httpClient.post(BASE_URL + `program/`, params)

const apiEditProgram = (program_id, params) => httpClient.post(BASE_URL + `program/${program_id}/edit`, params)

const apiGetAllPrograms = () => httpClient.get(BASE_URL + 'program/list')

const apiPostBatch = (params) => httpClient.post(BASE_URL + 'programs/batch', params)

const apiEditBatch = (id, params) => httpClient.post(BASE_URL + `programs/batch/${id}/edit`, params)

const apiGetBatch = (page) => httpClient.get(BASE_URL + `batchs?page=${page}`)

const apiGetBatchs = () => httpClient.get(BASE_URL + `batchs/all`)

const apiGetBatchById = (batch_id) => httpClient.get(BASE_URL + `batch/program/${batch_id}`)

const apiGetCitiesByBatch = (batch_id) => httpClient.get(BASE_URL + `program/batch/cities/${batch_id}`)

const apiGetRanking = () => httpClient.get(BASE_URL + 'batch/rank');

export {
    apiGetPrograms,
    apiGetProgramById,
    apiPostProgram,
    apiEditProgram,
    apiPostBatch,
    apiGetBatch,
    apiGetBatchs,
    apiGetBatchById,
    apiGetCitiesByBatch,
    apiGetAllPrograms,
    apiEditBatch,
    apiGetRanking
}