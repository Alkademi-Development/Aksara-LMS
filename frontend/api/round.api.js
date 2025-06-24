import httpClient from './httpClient'

const BASE_URL = process.env.baseURL

const apiGetRounds = (batch_id, page) => httpClient.get(BASE_URL + `batch/${batch_id}/rounds?page=${page}`)

const apiGetRoundDetail = (round_id) => httpClient.get(BASE_URL + `batch/round/${round_id} `)

const apiCreateRound = (batch_id, params) => httpClient.post(BASE_URL + `batch/${batch_id}/round`, params)

const apiEditRound = (batch_id, round_id, params) => httpClient.post(BASE_URL + `batch/${batch_id}/round/${round_id}`, params)

const apiGetCurrentRound = () => httpClient.get(BASE_URL + `batch/round/current`);

const apiPostScore = (round_id, student_id, params) => httpClient.post(BASE_URL + `batch/round/${round_id}/user/${student_id}/evaluate`, params);

const apiContinueRound = () => httpClient.get(BASE_URL + `batch/round/student/upgrade`)

export {
    apiGetRounds,
    apiGetRoundDetail,
    apiCreateRound,
    apiEditRound,
    apiGetCurrentRound,
    apiPostScore,
    apiContinueRound
}