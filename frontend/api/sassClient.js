import axios from "axios"
import appToken from "./app-token"

const sassClient = axios.create({
    baseURL: process.env.sassURL,
    // timeout: 5000,
})

const getAuthToken = () => localStorage.getItem('access_token')
const authInterceptor = async (config) => {
    while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
    }

    if (getAuthToken()) config.headers['Authorization'] = getAuthToken()
    config.headers['appToken'] = await appToken.generateDAppToken()
    return await config
}

sassClient.interceptors.request.use(authInterceptor)

export default sassClient