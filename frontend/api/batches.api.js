import httpClient from './httpClient'

const BASE_URL = process.env.baseURL

const getBatchActive = () => httpClient.get(BASE_URL + 'batch/active')

const getBatchDetail = (batch_id) => httpClient.get(BASE_URL + `batch/active/${batch_id}`)

const setJoinBatch = (batch_id) => httpClient.post(BASE_URL + `/batch/${batch_id}/join`)

const postReleaseApproval = (batch_id) => httpClient.post(BASE_URL + `/batch/${batch_id}/approval/release`)

export {
    getBatchActive,
    getBatchDetail,
    setJoinBatch,
    postReleaseApproval
}