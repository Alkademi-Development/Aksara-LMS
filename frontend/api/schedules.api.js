import servicesClients from './servicesClients'

const BASE_URL = process.env.servicesApi

const apiGetSchedules = (day, month, year) => {
    var endpoint = `v1/statistics/schedules`

    const _day = !!day ? `day=${ day }` : ''
    const _month = !!month ? `&month=${ month }` : ''
    const _year = !!year ? `&year=${ year }` : ''

    
    endpoint += "?" + _day + _month + _year
    return servicesClients.get(BASE_URL + endpoint)
}

export {
    apiGetSchedules,
}