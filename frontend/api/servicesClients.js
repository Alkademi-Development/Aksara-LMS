import axios from "axios"
import appToken from "./app-token"

const httpClient = axios.create({
    baseURL: process.env.servicesApi,
})

const getAuthToken = () => localStorage.getItem('access_token')
const authInterceptor = async (config) => {
    while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
    }

    if (getAuthToken()) config.headers['Authorization'] = getAuthToken()
    config.headers['AppToken'] = await appToken.generateDAppToken()
    return await config
}

httpClient.interceptors.request.use(authInterceptor)

export default httpClient