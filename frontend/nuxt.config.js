export default {

  server: {
    port: 4000, // default: 3000
    host: '0.0.0.0', // default: localhost  
  },

  env: {
    alkademiAuth: process.env.ALKADEMI_AUTH,
    appSecret: process.env.APP_SECRET,
    baseAuthURL: process.env.BASE_AUTH_URL,
    baseURL: process.env.BASE_URL,
    baseUrlDrive: process.env.BASE_URL_DRIVE,
    baseUrlForm: process.env.BASE_URL_FORM,
    baseUrlStudio: process.env.BASE_STUDIO_URL,
    cdnHost: process.env.CDN_HOST,
    editorURL: process.env.EDITOR_URL,
    formURL: process.env.FORM_URL,
    sassURL: process.env.SASS_URL,
    servicesApi: process.env.SERVICES_API,
    storageURL: process.env.STORAGE_URL,
    vueAppMode: process.env.VUE_APP_MODE,
    attendanceURL: process.env.ATTENDANCE_URL
  },

  telemetry: false,

  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // title: 'SASS - Alkademi',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],

    link: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Allura&family=Crimson+Pro:wght@400;500;600;700&family=Lato:wght@400;700;900&display=swap"},
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700;800;900&display=swap"},
      { rel: "stylesheet", href: "/dashboard/assets/css/dropzone.css" },
      { rel: "stylesheet", href: "/dashboard/assets/source/fontawesome-free-6.2.0-web/css/all.min.css" },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" }
    ],

    script: [
      // Core
      { src: "/dashboard/assets/source/jquery/jquery.min.js", body: true },
      { src: "/dashboard/assets/source/bootstrap/js/bootstrap.bundle.min.js", body: true },
      { src: "/dashboard/assets/source/js-cookie/js.cookie.min.js", body: true },
      { src: "/dashboard/assets/source/jquery.scrollbar/jquery.scrollbar.min.js", body: true },
      { src: "/dashboard/assets/source/jquery-scroll-lock/jquery-scrollLock.min.js", body: true },
      // Dropzone
      { src: "/dashboard/assets/js/dropzone.min.js", body: true },

      // Argon
      { src: "/dashboard/assets/js/argon.min.js", body: true },

      // Google Tags
      { async: true, src: "https://www.googletagmanager.com/gtag/js?id=G-8H1TCBHYM9" },
    ]

  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/source/nucleo/css/nucleo.min.css',
    '@/assets/css/argon.min.css',
    '@/assets/css/leaflet.css',
    '@/assets/css/normalize.min.css',
    '@/assets/css/styles.min.css',
    '@/assets/scss/main.scss',
    'swiper/css/swiper.css',
    'quill/dist/quill.core.css',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'highlight.js/styles/base16/monokai.min.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [

    { src: '@/plugins/vue-html2pdf', mode: 'client' },
    { src: '~/plugins/chart.js', mode: 'client', },
    { src: '~/plugins/imageCompression.js', mode: 'client', },
    { src: '~/plugins/leaflet.js', mode: 'client', },
    { src: '~/plugins/nuxt-quill-plugin.js', mode: 'client' },
    '~/plugins/axios',
    '~/plugins/vue-select',

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // 404 Handle
  generate: {
    fallback: true
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [

    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',

  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      scss: {
        implementation: require('sass')
      }
    },
    postcss: null,
    publicPath: "/dashboard/_nuxt",
    // plugins: [
    //   new MonacoWebpackPlugin({
    //     publicPath: "/dashboard",
    //     languages: ['csharp', 'dart', 'go', 'java', 'javascript', 'kotlin', 'php', 'python', 'ruby', 'swift', 'typescript', 'vb']
    //   })
    // ],

    extend(config, ctx) {}
  },
  // pwa: {
  //   manifest: {
  //     name: 'Alkamedia',
  //     shortName: 'Alkamedia',
  //     icons: [
  //       {
  //         src: '/icons/64.png',
  //         sizes: '64x64',
  //         type: 'image/png'
  //       },
  //       {
  //         src: '/icons/144.png',
  //         sizes: '144x144',
  //         type: 'image/png'
  //       },
  //       {
  //         src: '/icons/192.png',
  //         sizes: '192x192',
  //         type: 'image/png'
  //       },
  //       {
  //         src: '/icons/512.png',
  //         sizes: '512x512',
  //         type: 'image/png'
  //       }
  //     ],
  //     lang: 'en',
  //     useWebmanifestExtension: false
  //   },
  //   workbox: {
  //     enabled: true
  //   }
  // },
  loading: {
    color: '#2F80ED',
  }

}
