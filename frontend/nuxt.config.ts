import sass from 'sass';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV != 'production' },
  runtimeConfig: {
    baseURL: process.env.BASE_URL,
    servicesApi: process.env.SERVICES_API,
    vueAppMode: process.env.VUE_APP_MODE,
    public: {
      baseURL: process.env.BASE_URL,
      servicesApi: process.env.SERVICES_API,
      vueAppMode: process.env.VUE_APP_MODE,
    },
  },
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  css: ['@/assets/css/main.scss', 'remixicon/fonts/remixicon.css'],
  components: [
    '~/components'
  ],
  plugins: ['~/plugins/vuex.js', '~/plugins/bootstrapClient.js']
})
