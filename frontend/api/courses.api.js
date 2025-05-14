import { httpClient } from "@/utils/httpClient"

const apiGetCoursesById = (id) => httpClient.get(`course/${id}`)

export {
    apiGetCoursesById
}