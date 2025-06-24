import axios from 'axios'
import sassClient from './sassClient'
import appToken from './app-token'

const SASS_URL = process.env.servicesApi

const httpClient = axios.create({
  baseURL: SASS_URL
})

const apiGetLmsId = (version) => sassClient.get(SASS_URL + `${version}/cms/app/id`)

const apiGetAllSettings = (version) => sassClient.get(SASS_URL + `${version}/cms/app/settings`)

const apiGetSettingByKey = (version, key) => sassClient.get(SASS_URL + `${version}/cms/app/setting/${key}`)

const apiUpdateAllSettings = (version, params) => sassClient.post(SASS_URL + `${version}/cms/app/settings/update`, params)

const apiUpdateSettingByKey = (version, key, params) => sassClient.post(SASS_URL + `${version}/cms/app/setting/update/${key}`, params)

const apiZoomPlatform = () => sassClient.get(SASS_URL + `v0/cms/zoom/detail`)

const apiUpdateZoomPlatform = (params) => sassClient.post(SASS_URL + `v0/cms/zoom/update`, params)

const apiGmeetPlatform = () => sassClient.get(SASS_URL + `v0/cms/gmeet/detail`)

const apiUploadGmeetCredentials = (redirect_uri, params) => sassClient.post(SASS_URL + `v0/cms/gmeet/update?redirect_uri=${ redirect_uri }`, params)

const apiUpdateGmeetPlatform = (code, redirect_uri) => sassClient.post(SASS_URL + `v0/cms/gmeet/authorize?code=${ code }&redirect_uri=${ redirect_uri }`)

const apiGenerateAppToken = (params) => httpClient.post(SASS_URL + 'v1/authorizer/token/generate', params)

const apiAuthorizeTokenExchange = (params) => httpClient.post(SASS_URL + 'v1/authorizer/token/exchange', params)

const apiCheckAppVersion = () => httpClient.get(SASS_URL + 'v1/authorizer/version')

const apiValidateToken = () => {
  const httpClient = axios.create({ baseURL: SASS_URL })

  const authInterceptor = async (config) => {
    config.headers['appToken'] = await appToken.generateDAppToken()
    return config
  }

  httpClient.interceptors.request.use(authInterceptor)

  return httpClient.get(SASS_URL + 'v1/authorizer/validate')
}

export {
    apiAuthorizeTokenExchange,
    apiGetLmsId,
    apiGetAllSettings,
    apiGetSettingByKey,
    apiUpdateAllSettings,
    apiUpdateSettingByKey,
    apiZoomPlatform,
    apiUpdateZoomPlatform,
    apiGmeetPlatform,
    apiUploadGmeetCredentials,
    apiUpdateGmeetPlatform,
    apiGenerateAppToken,
    apiCheckAppVersion,
    apiValidateToken
  }
