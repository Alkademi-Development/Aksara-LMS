import axios from "axios"
import appToken from "./app-token"

const authClient = axios.create({
    baseAuthURL: process.env.baseAuthURL,
    // timeout: 5000,
})

const getAuthToken = () => localStorage.getItem('access_token')
const authInterceptor = async (config) => {
    while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
    }

    config.headers['X-App-Authorization'] = localStorage.getItem('lmsId')
    config.headers['AppToken'] = await appToken.generateDAppToken()
    if (getAuthToken() != null && getAuthToken() != undefined && getAuthToken() != "") {
        config.headers['Authorization'] = `${getAuthToken()}`
    }
    return await config
}

authClient.interceptors.request.use(authInterceptor)

export default authClient