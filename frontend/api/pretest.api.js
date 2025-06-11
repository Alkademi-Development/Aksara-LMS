import httpClient from './httpClient'

const BASE_URL = process.env.baseURL

const getPretestQuestion = (program_id) => httpClient.get(BASE_URL + `program/${program_id}/pretests/questions`)

const getStudentPretestById = (batch_id, program_id, student_id) => httpClient.get(BASE_URL + `batch/${batch_id}/program/${program_id}/pretests/${student_id}`)

const postPretestAnswer = (answer) => httpClient.post(BASE_URL + 'batch/program/pretests/answer', answer)

const pretestMetronom = (moduleId) => httpClient.get(BASE_URL + `custom/module/${moduleId}/metronom`)

const pretestMetronomRespondents = (moduleId, userId) => httpClient.get(BASE_URL + `custom/module/${moduleId}/user/${userId}/metronom`)


export {
    getPretestQuestion,
    getStudentPretestById,
    postPretestAnswer,
    pretestMetronom,
    pretestMetronomRespondents
}
