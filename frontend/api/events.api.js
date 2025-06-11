import httpClient from "./httpClient"

const BASE_URL = process.env.baseURL

const getIncomingEvents = () => httpClient.get(BASE_URL + `events/incoming`)

const apiGetEvents = (page) => httpClient.get(BASE_URL + `events?page=${page}`)

const apiGetEventDetail = (event_id) => httpClient.get(BASE_URL + `v1/event/${event_id}`)

const apiGetEventsActive = () => httpClient.get(BASE_URL + `events/active`)

const apiJoinEvent = (event_id) => httpClient.post(BASE_URL + `event/${event_id}/join`)

const apiCreateEvent = (params) => httpClient.post(BASE_URL + 'event', params)

const apiEditEvent = (event_id, params) => httpClient.post(BASE_URL + `event/${event_id}`, params)

export {
    apiGetEvents,
    apiGetEventDetail,
    apiGetEventsActive,
    apiJoinEvent,
    apiCreateEvent,
    apiEditEvent,
    getIncomingEvents
}