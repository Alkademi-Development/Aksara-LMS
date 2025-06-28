import Cookie from "json-schema";

export default {
  computed: {
    userCookie() {
      const userStr = Cookie.get('user')
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    },
    localUserRole() {
      return Cookie.get('user_kind') || null
    },
    localAppVersion() {
      return Cookie.get('appVersion') || null
    },
    localAccessToken() {
      return Cookie.get('access_token') || null
    }
  },
  methods: {
    setAccessToken(token) {
      Cookie.set('access_token', token, { path: '/', expires: 7 })
    },
    setLocalAppVersion(token) {
      Cookie.set('appVersion', token, { path: '/', expires: 7 })
    },
    setUser(user) {
      Cookie.set('user', JSON.stringify(user), { path: '/', expires: 7 })
    },
    setLocalUserRole(role) {
      Cookie.set('user_kind', role, { path: '/', expires: 7 })
    },
    deleteSavedCookies() {
      ['redirect', 'targetLMS', 'appVersion', '_ct', '_gt', 'user'].forEach(Cookie.remove)
    },
    checkAppVersion() {
      const serverAppVersion = this.$store.state.auth.appVersion
      const currentAppVersion = this.localAppVersion
      const tempRedirect = Cookie.get('redirect')
      const tempAccessToken = this.localAccessToken

      if (!currentAppVersion || currentAppVersion !== serverAppVersion) {
        this.deleteSavedCookies()

        if (tempRedirect) Cookie.set('redirect', tempRedirect, { path: '/', expires: 7 })
        if (tempAccessToken) this.setAccessToken(tempAccessToken)
      }

      if (serverAppVersion) this.setLocalAppVersion(serverAppVersion)
    },
    revalidateAppToken() {
      const isAppTokenValid = this.$store.state.auth.isAppTokenValid

      if (!isAppTokenValid) {
        Cookie.remove('_ct')
        Cookie.remove('_gt')

        const urlArr = (Cookie.get('redirect') || '').split('/')
        if (urlArr.length >= 3) {
          const externalUrl = urlArr[0] + '//' + urlArr[2]
          window.location.href = externalUrl
        }
        return
      }

      const metronomId = this.$route.query.metronomId
      const currentPath = this.$route.fullPath
      const targetUrl = `/compiler?metronomId=${metronomId}`

      if (targetUrl !== currentPath) {
        this.$router.push(targetUrl)
      }
    }
  }
}