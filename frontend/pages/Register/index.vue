<template>
  <div id="auth" :class="['wrapper full d-flex flex-column', sassState?.settings?.isCustomAuth ? 'custom-background' : 'alkademi-background']">

      <!-- Page content -->
      <div class="grow-1 d-flex align-items-center mb-5">

          <div class="container">

              <div v-if="isLoaded" class="row justify-content-center">

                  <div class="col-lg-5 col-md-7">

                      <div v-if="isAppRegistered" class="mb-0 border-0 card bg-light">

                          <div class="bg-transparent card-header">

                              <div class="d-flex flex-column align-items-center justify-content-center text-center" style="gap: 12px">
                                  <div class="d-flex flex-row align-items-center justify-content-center">
                                      <img
                                          :src="
                                              sassState?.settings?.isCustomAuth ?
                                              sassState?.settings?.logo_dark : isLayoutBersamaPuja ?
                                              sassState?.settings?.logo_dark :'/assets/image/logo.png'
                                          "
                                          :class="isLayoutBersamaPuja ? 'logo mb-2' : 'logo'"
                                          alt=""
                                      >
                                  </div>
                                  <span class="text-center">
                                      Mendaftar akun {{ sassState?.settings?.isCustomAuth ? sassState?.settings?.title : isLayoutBersamaPuja ? 'Bersama Puja' : 'Alkademi' }}
                                  </span>
                              </div>

                          </div>

                          <div class="card-body">

                              <!-- Alert Email -->
                              <b-alert
                                  :show="onEvent.show"
                                  variant="warning"
                                  dismissible
                              >
                                  {{ onEvent.message }}
                              </b-alert>

                              <!-- Form -->
                              <b-form @submit="onRegisterClicked">

                                  <!-- Email -->
                                  <div class="form-group">
                                      <label for="inputEmail">Email</label>
                                      <div class="mb-3 input-group input-group-merge input-group-alternative">

                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                                          </div>
                                          <input id="inputEmail" class="form-control" placeholder="hai@dinda.id" type="email" v-model="form.email" required>

                                      </div>
                                  </div>

                                  <!-- Name -->
                                  <div class="form-group">
                                      <label for="inputName">Name</label>
                                      <div class="mb-3 input-group input-group-merge input-group-alternative">

                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-single-02"></i></span>
                                          </div>
                                          <input id="inputName" class="form-control" type="text" v-model="form.name" required>

                                      </div>
                                  </div>

                                  <!-- Phone -->
                                  <div class="form-group" >
                                      <label for="inputPhone">No. Telepon</label>
                                      <div class="mb-2 input-group input-group-merge input-group-alternative">

                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-tablet-button"></i></span>
                                          </div>
                                          <input id="inputPhone" class="form-control" placeholder="08XXXXXXXXXX" type="number" min="0" v-model="form.phone" required>

                                      </div>
                                  </div>

                                  <div class="form-group">
                                      <label for="inputPhone">Tanggal Lahir</label>
                                      <div class="mb-2 input-group input-group-merge input-group-alternative">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                                          </div>
                                          <input id="birthDate" class="form-control" placeholder="01/01/1967" type="date" min="0" v-model="form.birthDate" required>

                                      </div>
                                  </div>

                                  <!-- Gender -->
                                  <div class="form-group">
                                      <label for="inputGender">Jenis Kelamin</label>
                                      <div class="input-group input-group-merge input-group-alternative mb-3">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-single-02"></i></span>
                                          </div>
                                          <v-select
                                          id="inputGender"
                                          class="form-control"
                                          :options="[{ id: 'L', label: 'Laki - Laki'}, { id: 'P', label: 'Perempuan' }]"
                                          v-model="selectedGender">
                                          <template v-slot:no-options="{ search, searching }">
                                              <template v-if="searching">
                                                  Tidak ada hasil untuk <em>{{ search }}</em>.
                                              </template>
                                              <em style="opacity: 0.5;" v-else>Ketik untuk mencari Gender.</em>
                                          </template>
                                          </v-select>

                                      </div>
                                  </div>

                                  <!-- Province -->
                                  <div class="form-group">
                                      <label for="inputProvince">Asal Provinsi</label>
                                      <div class="input-group input-group-merge input-group-alternative">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-pin-3"></i></span>
                                          </div>
                                          <v-select
                                          id="inputProvince"
                                          class="form-control"
                                          :placeholder="isGetProvinces ? 'Loading...' : ''"
                                          :options="provinces"
                                          label="name"
                                          v-model="selectedProvinces">
                                          <template v-slot:no-options="{ search, searching }">
                                              <template v-if="searching">
                                                  Tidak ada hasil untuk <em>{{ search }}</em>.
                                              </template>
                                              <em style="opacity: 0.5;" v-else>Ketik untuk mencari provinsi.</em>
                                          </template>
                                          </v-select>

                                      </div>
                                  </div>

                                  <!-- City -->
                                  <div class="form-group">
                                      <label for="inputCity">Asal Kota</label>
                                      <div class="input-group input-group-merge input-group-alternative">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-pin-3"></i></span>
                                          </div>
                                          <v-select
                                          class="form-control"
                                          id="inputCity"
                                          :placeholder="isGetCities ? 'Loading...' : selectedProvinces == null ? 'Pilih Provinsi Terlebih Dahulu' : ''"
                                          :options="cities"
                                          label="name"
                                          v-model="selectedCity">
                                          <template v-slot:no-options="{ search, searching }">
                                              <template v-if="searching">
                                                  Tidak ada hasil untuk <em>{{ search }}</em>.
                                              </template>
                                              <em style="opacity: 0.5;" v-else>Ketik untuk mencari kota.</em>
                                          </template>
                                          </v-select>

                                      </div>
                                  </div>

                                  <!-- Password -->
                                  <div class="text-left form-group">
                                      <label for="inputPassword">Kata Sandi</label>
                                      <div class="mb-2 input-group input-group-merge input-group-alternative">

                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                          </div>
                                          <input id="inputPassword" class="form-control" type="password" v-model="form.password" required>

                                      </div>
                                      <span class="text-muted "><small>Minimal 8 karakter</small></span>
                                  </div>

                                  <!-- Repeat Password -->
                                  <div class="form-group">
                                      <label for="inputRepeat">Ulangi Kata Sandi</label>
                                      <div class="mb-2 input-group input-group-merge input-group-alternative">

                                          <div class="input-group-prepend">
                                              <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                          </div>
                                          <input id="inputRepeat" class="form-control" type="password" v-model="confirmPassword" required>

                                      </div>
                                  </div>

                                  <!-- Confirm Newsletter -->
                                  <div class="d-flex align-items-start mb-1" style="gap: 10px;">
                                      <div class="input-group-prepend mt-2">
                                          <input id="acceptNewsletter" type="checkbox" v-model="form.acceptNewsletter" aria-label="Confirm Newsletter">
                                      </div>
                                      <label for="acceptNewsletter" class="text-base">
                                          Saya setuju untuk menerima informasi atau pembaruan terbaru melalui email dari {{ sassState?.settings?.isCustomAuth ? sassState?.settings?.title : 'Alkademi' }}.
                                      </label>
                                  </div>

                                  <!-- Confirm Terms & Conditions -->
                                  <div class="d-flex align-items-start mb-3" style="gap: 10px;">
                                      <div class="input-group-prepend mt-2">
                                          <input id="agreementTermsConditionAccepted" type="checkbox" v-model="agreementTermsConditionAccepted" aria-label="Confirm Terms & Conditions">
                                      </div>
                                      <label for="agreementTermsConditionAccepted" class="text-base">
                                          Dengan mendaftar, saya menyatakan telah membaca dan menyetujui <a href="https://alkademi.id/terms-and-conditions" target="_blank" class="font-weight-bolder">
                                              Terms & Conditions
                                          </a> serta <a href="https://alkademi.id/privacy-policy" target="_blank" class="font-weight-bolder">
                                              Privacy Policy
                                          </a> yang berlaku.
                                      </label>
                                  </div>

                                  <b-button v-if="isLoaded" type="submit" variant="primary" block class="mb-5">Daftar</b-button>
                                  <b-button v-else variant="primary" block class="mb-5"><b-spinner label="Spinning"></b-spinner></b-button>

                              </b-form>

                              <!-- Go to Login -->
                              <div class="text-center">
                                  <span>Sudah punya akun? <nuxt-link class="font-weight-bold color-primary" :to="goTo('auth')">Masuk Sekarang</nuxt-link></span>
                              </div>

                          </div>

                      </div>

                      <div v-else class="mb-0 border-0 card bg-light">
                          <div class="bg-transparent card-header pt-lg-5">
                              <div class="text-center">
                                  <img src="@/assets/img/brand/logo.png" class="logo mb-4" alt=""> <br>
                                  <span class="text-center">Gagal Memuat, Kembali ke Halaman Utama.</span> <br>
                                  <button class="btn btn-primary mt-4" @click="goHome">Kembali</button>
                              </div>
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
      <Footer :container="'container'" :textColor="'text-white'" :lmsId="lmsId"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Footer from "@/components/template/auth/Footer"

export default {
  head() {
      return {
          title: 'Mendaftar | Akun Alkademi'
      }
  },
  layout: "auth",
  components: {
      Footer
  },
  asyncData({query}) {
      const redirectTo = query.redirectTo
      const code = query.code
      const generatedToken = query.generatedToken
      const lmsId = query.lmsId
      const appId = query.appId

      return { redirectTo, code, generatedToken, lmsId, appId }
  },
  data() {
      return {
          alkademiLMS: process.env.alkademiLMS,
          appToken: this.$route.query.appToken,
          // redirectTo: this.$route.query.redirectTo,
          lmsId: this.$route.query.lmsId,
          classCode: this.$route.params.code,
          classroom: null,

          isAppRegistered: false,
          isGetProvinces: false,
          isGetCities: false,
          isGetSchools: false,
          layoutActive: '',

          provinces: [],
          cities: [],
          schools: [],
          selectedSchool: null,
          selectedGender: null,
          selectedCity: null,
          selectedProvinces: null,

          ktpFile: null,
          transcriptFile: null,

          form: {
              host: window.location.origin + '/activate',
              redirect: this.$route.query.redirectTo,
              // nik: "",
              email: "",
              name: "",
              password: "",
              gender: "",
              phone: "",
              birthDate: "",
              cityId: "",
              provinceId: "",
              classroomCode: this.$route.params.code,
              acceptNewsletter: true,
          },
          formRegisterPuja: {
              nim: "",
              dpt: ""
          },
          agreementTermsConditionAccepted: false,

          confirmPassword: "",

          message: null,
          isLoaded: false,

          onEvent: {
              message: '',
              status: true,
              show: false,
              variant: ''
          },
          isSendingVerifyEmail: false,

          educations: [],
          selectedEducation: null,
      }
  },
  computed: {
      ...mapState({
          sassState: (state) => state.Saas,
          servicesState: (state) => state.Services,
      }),
      isLayoutBersamaPuja(){
          return this.sassState?.settings?.layout === 'bekerjabersamapuja' || this.sassState?.settings?.layout === 'belajarbersamapuja';
      }
  },
  created() {

      this.checkAppRegistered()
  },
  methods: {

      goHome() {
          if (this.redirectTo) window.open(this.redirectTo, "_self")
          else window.open(this.alkademiLMS, "_self")
      },

      setEvent(message, status){
          window.scrollTo(0,0)
          this.onEvent.message = message
          this.onEvent.status = status
          this.onEvent.variant = status == true ? 'success' : 'warning'
          this.onEvent.show = true
      },

      async checkAppRegistered() {
          if (this.lmsId && this.lmsId != 'null') {

              localStorage.setItem('targetLMS', this.lmsId)

              // generatedToken & codeToken
              localStorage.setItem('gt', this.generatedToken)
              localStorage.setItem('ct', this.code)

              this.isAppRegistered = true

              this.getProvinces();
          } else {
              this.isAppRegistered = false
          }
          this.isLoaded = true
      },

      async fetchPrograms() {
          localStorage.setItem('targetLMS', this.lmsId)
          await this.$store.dispatch("Services/classOverview", this.classCode)
          const servicesState = this.$store.state.Services;

          if (!servicesState.status) {
              console.error('Failed fetch class', servicesState.message)
              this.isLoaded = true
              this.isAppRegistered = false
          } else {
              this.classroom = servicesState.data;
              this.getProvinces();
          }
      },

      async getProvinces() {
          this.isGetProvinces = true
          await this.$store.dispatch('Services/provinces')
          if (!this.servicesState.status) {

              this.setEvent(this.servicesState.message, false)

              this.isGetProvinces = false
              this.isLoaded = true

          } else {

              this.provinces = this.servicesState.provinces
              this.isGetProvinces = false
              this.isLoaded = true

          }
      },

      async getCities(id) {
          this.isGetCities = true
          await this.$store.dispatch('Services/cities', id)
          if (!this.servicesState.status) {

              this.setEvent(this.servicesState.message, false)

              this.isGetCities = false

          } else {

              this.cities = this.servicesState.cities
              this.isGetCities = false

          }
      },

      async onRegisterClicked(event) {
          event.preventDefault()
          this.isLoaded = false

          if (this.selectedGender == null) {

              this.setEvent("Pilih jenis kelamin terlebih dahulu", false)
              this.isLoaded = true
              return

          }

          if (this.selectedProvinces == null) {

              this.setEvent("Pilih provinsi terlebih dahulu", false)
              this.isLoaded = true
              return

          }

          if (this.selectedCity == null) {

              this.setEvent("Pilih kota terlebih dahulu", false)
              this.isLoaded = true
              return

          }

          if (this.form.password.length < 8 || this.confirmPassword.length < 8) {

              this.setEvent("Password minimal 8 karakter", false)
              this.isLoaded = true
              return

          }

          if (this.form.password !== this.confirmPassword) {

              this.setEvent("Password yang anda masukan tidak sama", false)
              this.isLoaded = true
              return

          }

          if (!this.agreementTermsConditionAccepted) {

              this.setEvent("Anda harus konfirmasi Syarat & Ketentuan serta Kebijakan Privasi terlebih dahulu untuk melanjutkan.", false)
              this.isLoaded = true
              return

          }


          this.setSelectedOption()

          var params = this.form

          // setTimeout(() => {
          //     this.isLoaded = true
          // }, 2000);

          // return console.log("PARAMS: ", params)

          await this.$store
              .dispatch('Services/signup', params)
              .then(() => {
                  if (!this.servicesState.status) {

                      console.error("Register gagal", this.servicesState.message)

                      this.setEvent(this.servicesState.message, false)

                      this.isLoaded = true

                  } else {
                      this.setEvent("Berhasil mendaftar", true)

                      localStorage.setItem('emailToVerify', this.form.email)

                      const redirect = "&redirectTo=" + this.redirectTo
                      const lmsId = "&lmsId=" + this.lmsId
                      const resendStatus = "&resendStatus=false"

                      const url = `/register/verify?${redirect}${lmsId}${resendStatus}`

                      localStorage.setItem("redirectTo", this.redirectTo)
                      localStorage.setItem("lmsId", this.lmsId)
                      this.$router.push(url)
                      // this.isLoaded = true

                  }
              })
      },

      goTo(to) {
          const redirect = "&redirectTo=" + this.redirectTo
          const lmsId = "&lmsId=" + this.lmsId
          const code = "&code=" + this.code
          const generatedToken = "&generatedToken=" + this.generatedToken

          return `/${to}?${redirect}${lmsId}${code}${generatedToken}`
      },

      setSelectedOption() {
          this.form.gender = this.selectedGender.id
          this.form.cityId = this.selectedCity.id
      },
  },
  watch: {
      selectedProvinces: function () {
          if (this.selectedProvinces) {
              this.getCities(this.selectedProvinces.id)
              this.form.provinceId = this.selectedProvinces?.id;
          } else {
              this.cities = []
              this.selectedCity = null
          }
      }
  }
}
</script>

<style>

</style>