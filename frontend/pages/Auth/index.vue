<template>
  <div id="auth" :class="['wrapper full d-flex flex-column', sassState?.settings?.isCustomAuth ? 'custom-background' : 'alkademi-background']">
      <!-- Page content -->
      <div class="grow-1 d-flex align-items-center mb-5">
          <div class="container">
              <!-- Form -->
              <div v-if="isLoaded" class="row justify-content-center">
                  <div class="col-lg-5 col-md-7">
                      <div v-if="isAppRegistered" class="mb-0 border-0 card bg-light">
                          <div class="bg-transparent card-header">
                              <div class="d-flex flex-column align-items-center justify-content-center text-center" style="gap: 12px">

                                  <div class="d-flex flex-row align-items-center justify-content-center">
                                      <img
                                          :src="
                                              sassState?.settings?.isCustomAuth ?
                                              sassState?.settings?.logo_dark : '/assets/image/logo.png'
                                          "
                                          :class="'logo'"
                                          alt=""
                                      >
                                  </div>
                                  <span class="text-center">
                                      Gunakan akun {{ sassState?.settings?.isCustomAuth ? sassState?.settings?.title :'Alkademi' }} anda untuk melanjutkan
                                  </span>
                              </div>
                          </div>
                          <div class="card-body">
                              <b-alert
                                  v-if="onEvent.message != 'Email belum diverifikasi'"
                                  :show="onEvent.alertCounter"
                                  variant="warning"
                                  @dismissed="onEvent.alertCounter=0"
                                  @dismiss-count-down="countDownChanged"
                              >
                                  {{ onEvent.message }}
                              </b-alert>
                              <b-alert
                                  v-else
                                  :show="true"
                                  class="d-flex justify-content-between align-items-center"
                                  variant="warning"
                              >
                                  {{ onEvent.message }}
                                  <b-button v-if="!isSendingVerifyEmail" size="sm" variant="primary" @click="verifyEmail">Verifikasi Sekarang</b-button>
                                  <b-spinner v-else label="sending verify email"></b-spinner>
                              </b-alert>
                              <b-form @submit="onLoginClicked">
                                  <div class="form-group">
                                      <div class="mb-3 input-group input-group-merge input-group-alternative">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                                          </div>
                                          <input class="form-control" placeholder="Alamat Email" type="email" v-model="email" required>
                                      </div>
                                  </div>
                                  <div class="text-right form-group">
                                      <div class="mb-2 input-group input-group-merge input-group-alternative">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                          </div>
                                          <input class="form-control" placeholder="Kata Sandi" :type="isShowPass ? 'text' : 'password' " v-model="password" required>
                                          <div class="input-group-prepend">
                                              <span class="input-group-text" style="cursor: pointer;" @click="togglePass()"><i :class="`fa ${isShowPass ? 'fa-eye' : 'fa-eye-slash'}`" aria-hidden="true"></i></span>
                                          </div>
                                      </div>
                                      <span>
                                          <nuxt-link class="font-weight-bold color-primary" :to="goTo('forgot')" style="font-size: 14px;">
                                              Lupa Kata Sandi?
                                          </nuxt-link>
                                      </span>
                                  </div>

                                  <button v-if="isLoaded" type="submit" class="d-block mb-4 btn btn-primary">Masuk</button>
                                  <button v-else class="d-block mb-4 btn btn-primary"><b-spinner label="Spinning"></b-spinner></button>
                              </b-form>

                              <div class="d-flex justify-content-center align-items-center mb-2">
                                  <hr class="w-100 m-0 mx-3">
                                  <span class="text-center">Atau</span>
                                  <hr class="w-100 m-0 mx-3">

                              </div>

                              <div class="d-flex justify-content-center align-items-center mb-2">
                                  <b-button variant="btn-primary-outline" class="btn-icon" @click="onOAuthGoogle">
                                      <span class="btn-inner--icon">
                                          <img src="@/assets/img/google.svg">
                                      </span>
                                  </b-button>
                                  <b-button variant="btn-primary-outline" class="btn-icon" @click="onOAuthGithub">
                                      <span class="btn-inner--icon">
                                          <img src="@/assets/img/github.png">
                                      </span>
                                  </b-button>
                                  <b-button variant="btn-primary-outline" class="btn-icon" @click="onOAuthLinkedin">
                                      <span class="btn-inner--icon">
                                          <img src="@/assets/img/linkedin.png">
                                      </span>
                                  </b-button>
                              </div>

                              <div v-if="sassState?.settings?.layout !== 'jda'" class="text-center">
                                  <span>Ingin bergabung? <nuxt-link class="font-weight-bold color-primary" :to="goTo('register')">Daftar Sekarang</nuxt-link></span>
                              </div>
                          </div>
                      </div>
                      <div v-else class="card bg-light border-0">
                          <div class="card-body pb-lg-5 px-lg-5 d-flex flex-column align-items-center">
                              <img
                                  :src="
                                      sassState?.settings?.isCustomAuth ?
                                      sassState?.settings?.logo_dark : '/assets/image/logo.png'
                                  "
                                  :class="'logo'"
                                  alt=""
                              >
                              <span class="text-center mb-3">Gagal Memuat, Kembali ke Halaman Utama.</span>
                              <button class="btn btn-primary w-50" @click="goHome">Kembali</button>
                          </div>
                      </div>
                  </div>
              </div>
              <div v-else class="row justify-content-center">

                  <div class="col-lg-6 col-md-8">
                      <div class="card bg-light border-0">
                          <div class="card-body pb-lg-5 px-lg-5">
                              <div class="text-center mb-2">
                                  <b-spinner label="Loading..."></b-spinner>
                              </div>
                              <div class="text-center">
                                  <span>Tunggu sebentar...</span>
                              </div>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>
      <!-- Footer -->
      <Footer :container="'container'" :textColor="'text-white'" :lmsId="lmsId" />
  </div>
</template>

<script>
import Footer from "@/components/template/auth/Footer"
import { mapState } from 'vuex'

const SMKCODING = "smkcoding"

export default {
  layout: "auth",
  components: {
      Footer
  },
  asyncData({query}) {
      const redirectTo = query.redirectTo
      const code = query.code
      const generatedToken = query.generatedToken
      const lmsId = query.lmsId

      return { redirectTo, code, generatedToken, lmsId }
  },
  data() {
      return {
          alkademiLMS: process.env.alkademiLMS,

          // appToken: this.$route.query.appToken,
          // redirectTo: this.$route.query.redirectTo,
          // lmsId: this.$route.query.lmsId,

          isAppRegistered: false,

          email: '',
          password: '',
          layoutActive: '',

          isShowPass: false,

          message: null,
          isLoaded: false,

          onEvent: {
              message: '',
              status: true,
              alertCounter: 0,
              variant: ''
          },
          isSendingVerifyEmail: false,

          allowedAdditionalQueryUrl: [process.env.attendanceUrl],
          allowedQueryBackTo: [process.env.attendanceUrl],
      }
  },
  computed: {
  ...mapState({
    sassState: (state) => state.Sass,
  }),
},
  created() {
      if (this.lmsId == 'c2acf3790ae8d4e209ce8998e53b629e0e659a3dfcb05325fe0fb25fa369c8c3') this.layoutActive = SMKCODING

      this.checkAppRegistered()
  },
  methods: {
      togglePass() {
          this.isShowPass = !this.isShowPass
      },
      async checkUserToken(userToken) {
          localStorage.setItem('authorization', userToken)
          await this.$store
              .dispatch("Services/authorize").then(() => {
                  if (this.$store.state.Services.status) {
                      this.callbackAuth(userToken)
                  } else {
                      this.isAppRegistered = true
                      this.isLoaded = true
                  }
                  localStorage.removeItem('authorization')
              })
      },
      checkAppRegistered() {
          if (this.lmsId && this.lmsId != 'null') {

              localStorage.setItem('targetLMS', this.lmsId)

              // generatedToken & codeToken
              localStorage.setItem('gt', this.generatedToken)
              localStorage.setItem('ct', this.code)

              const queryAuth = this.$route.query.authToken
              if (!!queryAuth) localStorage.setItem(this.lmsId, queryAuth)

              const token = localStorage.getItem(this.lmsId)

              if (token) this.checkUserToken(token)
              else {
                  this.isAppRegistered = true
                  this.isLoaded = true
              }
          } else {
              this.isAppRegistered = false
              this.isLoaded = true
          }
      },
      countDownChanged() {
          this.onEvent.alertCounter = 10
      },
      stripslashes(str) {
          return str.replace(/\\'/g,'\'').replace(/\"/g,'"').replace(/\\\\/g,'\\').replace(/\\0/g,'\0');
      },
      async onLoginClicked(event) {
          event.preventDefault()

          this.isLoaded = false

          var params = { email: this.email, password: this.password }

          params.email = this.stripslashes(params.email)
          params.password = this.stripslashes(params.password)

          await this.$store
              .dispatch('Services/signin', params)
              .then(() => {
                  if (!this.$store.state.Services.status) {

                      this.onEvent.message = this.$store.state.Services.message
                      this.onEvent.status = this.$store.state.Services.status

                      if (this.onEvent.message != 'Email belum diverifikasi') {
                          this.onEvent.alertCounter = 10
                      }

                      this.isLoaded= true

                  } else {

                      const data = this.$store.state.Services.data
                      localStorage.setItem(this.lmsId, data.token)
                      this.callbackAuth(data.token)

                  }
              })
      },
      async onOAuthGoogle() {
          let oAuthURL = new URL("https://accounts.google.com/o/oauth2/auth")
          oAuthURL.searchParams.append("client_id", process.env.google.clientId)
          oAuthURL.searchParams.append("scope", process.env.google.scope)
          oAuthURL.searchParams.append("state", "state-token")
          oAuthURL.searchParams.append("access_type", "offline")
          oAuthURL.searchParams.append("response_type", "code")
          oAuthURL.searchParams.append("redirect_uri", `${process.env.host}authorize/google`)
          localStorage.setItem("oAuthRedirectTo", this.redirectTo)
          localStorage.setItem("oAuthLmsId", this.lmsId)
          // window.open(oAuthURL.href, "_self")
          if (this.$route.query.backTo) {
              localStorage.setItem("oAuthBackTo", this.$route.query.backTo)
          }
          window.location.replace(oAuthURL.href)
      },
      async onOAuthGithub() {
          let oAuthURL = new URL("https://github.com/login/oauth/authorize")
          oAuthURL.searchParams.append("client_id", process.env.github.clientId)
          oAuthURL.searchParams.append("scope", "user")
          oAuthURL.searchParams.append("redirect_uri", `${process.env.host}authorize/github`)
          localStorage.setItem("oAuthRedirectTo", this.redirectTo)
          localStorage.setItem("oAuthLmsId", this.lmsId)
          // window.open(oAuthURL.href, "_self")
          if (this.$route.query.backTo) {
              localStorage.setItem("oAuthBackTo", this.$route.query.backTo)
          }
          window.location.replace(oAuthURL.href)
      },
      async onOAuthLinkedin() {
          let oAuthURL = new URL("https://www.linkedin.com/oauth/v2/authorization")
          oAuthURL.searchParams.append("client_id", process.env.linkedin.clientId)
          oAuthURL.searchParams.append("response_type", "code")
          oAuthURL.searchParams.append("redirect_uri", `${process.env.host}authorize/linkedin`)
          oAuthURL.searchParams.append("scope", "r_liteprofile r_emailaddress")
          localStorage.setItem("oAuthRedirectTo", this.redirectTo)
          localStorage.setItem("oAuthLmsId", this.lmsId)
          // window.open(oAuthURL.href, "_self")
          if (this.$route.query.backTo) {
              localStorage.setItem("oAuthBackTo", this.$route.query.backTo)
          }
          window.location.replace(oAuthURL.href)
      },
      async onOAuthMicrosoft() {
          let oAuthURL = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize")
          oAuthURL.searchParams.append("client_id", process.env.microsoft.clientId)
          oAuthURL.searchParams.append("response_type", "code")
          oAuthURL.searchParams.append("redirect_uri", `${process.env.host}authorize/microsoft`)
          oAuthURL.searchParams.append("response_mode", "query")
          oAuthURL.searchParams.append("scope", "offline_access user.read")
          oAuthURL.searchParams.append("state", "12345")
          oAuthURL.searchParams.append("code_challenge", "_r67lcj4MoDNBAkhxS7ke_YKhKCBAiM0SgzNCagbCxo")
          localStorage.setItem("oAuthRedirectTo", this.redirectTo)
          localStorage.setItem("oAuthLmsId", this.lmsId)
          // window.open(oAuthURL.href, "_self")
          if (this.$route.query.backTo) {
              localStorage.setItem("oAuthBackTo", this.$route.query.backTo)
          }
          window.location.replace(oAuthURL.href)
      },
      callbackAuth(token) {

          const token_access = "authToken=" + token

          let redirect = this.redirectTo;
          const objRedirectUrl = new URL(redirect);

          if (redirect == null || redirect === "") this.$router.push("/")

          let url = `${redirect}/callbackAuth?${token_access}`
          if (this.$route.query.backTo) {
              if(this.allowedQueryBackTo.includes(objRedirectUrl.origin)) url += "&backTo=" + this.$route.query.backTo;
              else url += "&redirectTo=" + this.$route.query.backTo
          }

          localStorage.removeItem('targetLMS')

          const additionalQuery = this.addAdditionalQuery();
          const isAllowedAdditionalQuery = this.allowedAdditionalQueryUrl.includes(objRedirectUrl.origin);
          if(isAllowedAdditionalQuery) url += additionalQuery;

          // window.open(url, "_self")
          window.location.replace(url)

      },
      goHome() {
          // if (this.redirectTo) window.open(this.redirectTo, "_self")
          // else window.open(this.alkademiLMS, "_self")
          if (this.redirectTo) window.location.replace(this.redirectTo)
          else window.location.replace(this.alkademiLMS)

      },
      goTo(to) {
          const redirect = "&redirectTo=" + this.redirectTo
          const lmsId = "&lmsId=" + this.lmsId
          const code = "&code=" + this.code
          const generatedToken = "&generatedToken=" + this.generatedToken

          const url = `/${to}?${redirect}${lmsId}${code}${generatedToken}`

          return url
      },
      async verifyEmail() {
          const redirect = "&redirectTo=" + this.redirectTo
          const lmsId = "&lmsId=" + this.lmsId
          const resendStatus = "&resendStatus=true"

          const url = `/register/verify?${redirect}${lmsId}${resendStatus}`

          localStorage.setItem("redirectTo", this.redirectTo)
          localStorage.setItem("emailToVerify", this.email)
          localStorage.setItem("lmsId", this.lmsId)
          this.$router.push(url)
      },
      addAdditionalQuery(){
          const allowedAdditionalQuery = ['attendanceId', "code", "generatedToken", "lmsId"];
          let additionalQuery = "";

          allowedAdditionalQuery.forEach(query => {
              if(this.$route?.query?.[query]) additionalQuery += `&${query}=${this.$route?.query?.[query]}`;
          });

          return additionalQuery;
      },
  }
}
</script>

<style>

</style>
