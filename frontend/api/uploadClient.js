import axios from "axios"
import appToken from "./app-token"

const uploadClient = axios.create({
    baseURL: process.env.baseURL,
})

const authInterceptor = async (config) => {
    while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
    }

    if (await appToken.getAuthorizationTokenExchange()) config.headers['Authorization'] = await appToken.getAuthorizationTokenExchange()

    config.headers['lmsId'] = localStorage.getItem('lmsId')
    return await config
}


uploadClient.interceptors.request.use(authInterceptor)

export default uploadClient
