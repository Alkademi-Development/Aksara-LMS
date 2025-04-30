// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    baseURL: process.env.NUXT_BASE_URL,
    servicesApi: process.env.NUXT_SERVICES_API,
    vueAppMode: process.env.NUXT_VUE_APP_MODE,
    public: {
      baseURL: process.env.NUXT_BASE_URL,
      servicesApi: process.env.NUXT_SERVICES_API,
      vueAppMode: process.env.NUXT_VUE_APP_MODE,
    },
  },
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  plugins: ['~/plugins/vuex.js']
})
