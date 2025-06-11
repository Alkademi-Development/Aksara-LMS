import { createCipheriv } from 'crypto'
import store from '@/store'

const isLocalHost = document.location.host?.indexOf('192.168') > -1;

const DOMAIN = isLocalHost ? 'dev.alkademi.id' : document.location.host

const appSecret = process.env.appSecret
const nodeENV = process.env.NODE_ENV

const params = {
  id: '6209479186242a387494680d',
  secret: 'ab89d3a579eaf78207bd6e1f2fa88fb1cf1fce58b161a5f93462ea6cc81497df',
  scopes: [
    'alkamedia'
  ]
}

if (!isLocalHost) {
  params.id = ''
  params.secret = ''
}

const getCookieValue = (val) => {
  const cookies = document.cookie.split(';')
  let result = ''
  cookies.forEach((cookie) => {
    if (cookie.trim().startsWith(val + '=')) result = cookie.trim().substring(val.length + 1)
  })
  return result
}

// get token and code from cookie
let token = getCookieValue('_gt')
let code = getCookieValue('_ct')

const getToken = async (params) => {
  token = getCookieValue('_gt')
  code = getCookieValue('_ct')

  const isFetchToken = getCookieValue('_ift') || false

  if (!isFetchToken && (!token || !code)) {
    const currentTimeFetch = new Date()
    currentTimeFetch.setSeconds(currentTimeFetch.getSeconds() + 30)

    document.cookie = `_ift=true; expires=${new Date(currentTimeFetch).toUTCString()}; path=/`

    await store().dispatch('Sass/generateAppToken', params)

    const currentTime = new Date()
    currentTime.setHours(currentTime.getHours() + 23)
    const data = await store().state.Sass

    // delete exiting token and code from cookie
    // document.cookie = "_gt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    // document.cookie = "_ct=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // set token and code to cookie
    document.cookie = `_gt=${data?.data.token}; expires=${new Date(currentTime).toUTCString()}; path=/`
    document.cookie = `_ct=${data?.data.code}; expires=${new Date(currentTime).toUTCString()}; path=/`

  }

  const checkToken = async () => {
    token = getCookieValue('_gt')
    code = getCookieValue('_ct')

    if (!token || !code) {
      setTimeout(checkToken, 500)
    }

    if (!!token && !!code) {
      document.cookie = "_ift=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
  }

  await checkToken()
}

const generate = (code, token) => {
  const ci = createCipheriv(
    'aes-256-ctr',
    Buffer.from(appSecret),
    Buffer.from(code)
  )

  return ci.update(token, 'utf8', 'hex') + ci.final('hex')
}

const getCode = async () => {
  await getToken(params)

  return code = getCookieValue('_ct')
}

const generatedToken = async () => {
  await getToken(params)

  code = getCookieValue('_ct')
  token = getCookieValue('_gt')
  
  if (!!code && !!token) {
    return generate(code, `${new Date().getTime()}:${generate(code, token)}`);
  }
}

const generateDAppToken = async () => {
  await getToken(params)
  // while (!token || !code) {
  //   token = getCookieValue('_gt')
  //   code = getCookieValue('_ct')
  // }

  if (!token || !code) {
    setTimeout(async () => {
      // return await getCode() + ':' + await generatedToken()
    }, 500)
  }

  return await getCode() + ':' + await generatedToken()
}

export default {
    DOMAIN,
    getCode,
    generatedToken,
    generateDAppToken,
}
