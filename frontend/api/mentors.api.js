import httpClient from './httpClient'


const BASE_URL = process.env.baseURL

const apiGetMentors = () => httpClient.get(BASE_URL + `active/mentors`)

export {
    apiGetMentors,
}