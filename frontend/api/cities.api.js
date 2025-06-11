
import httpClient from './httpClient';
import servicesClients from "./servicesClients"

const BASE_URL = process.env.baseURL
const SERVICES_URL = process.env.servicesApi

const apiGetLocationCities = () => servicesClients.get(SERVICES_URL + 'v1/location/cities')

const apiGetCities = () => httpClient.get(BASE_URL + 'cities')

const apiGetAvailableCities = (batchId, programId) => httpClient.get(BASE_URL + `/batch/${batchId}/program/${programId}/cities`)

const apiSearchCities = (keyword) => httpClient.get(BASE_URL + `cities/${keyword}`)

export {
  apiGetLocationCities,
  apiGetCities,
  apiGetAvailableCities,
  apiSearchCities
}