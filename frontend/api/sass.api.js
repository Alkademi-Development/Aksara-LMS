import { httpClient } from "@/utils/httpClient"

const apiGetAllSettings = (version) => httpClient.get(`${version}/cms/app/settings`)

export {
    apiGetAllSettings
}