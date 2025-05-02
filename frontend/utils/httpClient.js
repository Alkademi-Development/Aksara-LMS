import axios from 'axios'

class HTTPClient {
  constructor() {
    this.baseURL = ''
    this.instance = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  init(baseURL) {
    this.baseURL = baseURL
    this.instance.defaults.baseURL = baseURL
  }

  setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem('access_token')
        const lmsId = localStorage.getItem('lmsId')

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        if (lmsId) {
          config.headers['lmsId'] = lmsId
        }

        return config
      },
      (error) => Promise.reject(error)
    )
  }

  get(url, config = {}) {
    return this.instance.get(url, config)
  }

  post(url, data = {}, config = {}) {
    return this.instance.post(url, data, config)
  }

  put(url, data = {}, config = {}) {
    return this.instance.put(url, data, config)
  }

  patch(url, data = {}, config = {}) {
    return this.instance.patch(url, data, config)
  }

  delete(url, config = {}) {
    return this.instance.delete(url, config)
  }

  raw() {
    return this.instance
  }
}

export const httpClient = new HTTPClient()
