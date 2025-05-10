import { httpClient } from "@/utils/httpClient"

const apiGetClassOverview = (slug) => httpClient.get(`v1/class/overview?slug=${slug}`)

export {
    apiGetClassOverview
}