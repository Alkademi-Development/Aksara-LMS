import { httpClient } from "@/utils/httpClient"

const apiGetDetailNews = (id) => httpClient.get(`v1/post/detail?id=${id}`)

export {
    apiGetDetailNews
}