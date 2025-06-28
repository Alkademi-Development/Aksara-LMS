import axios from "axios"
import appToken from "./app-token"

const uploadClient = axios.create({
    baseURL: process.env.baseURL,
})

const getAuthToken = () => localStorage.getItem('access_token')
const authInterceptor = async (config) => {
    while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
    }

    config.headers['Authorization'] = getAuthToken()
    config.headers['AppToken'] = await appToken.generateDAppToken()
    // config.headers['lmsId'] = localStorage.getItem('lmsId')
    return await config
}

uploadClient.interceptors.request.use(authInterceptor)

export default uploadClient