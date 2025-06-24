<template>
    <div id="auth" :class="['wrapper full d-flex flex-column vh-100', saasState?.settings?.isCustomAuth ? 'custom-background' : 'alkademi-background']">
        <!-- Page content -->
        <div class="grow-1 d-flex align-items-center">
            <div class="container">
                <!-- Form -->
                <div class="row justify-content-center">
                    <div class="col-lg-5 col-md-7">
                        <div class="card bg-light border-0 mb-0">
                            <div class="card-header bg-transparent pt-lg-5">
                                <div class="text-center">
                                    <h1 class="mb-1">Setel Ulang Kata Sandi</h1>
                                </div>
                            </div>
                            <div class="card-body pb-lg-5 px-lg-5">
                                <b-alert
                                    :show="onEvent.alertCounter"
                                    :variant="onEvent.variant"
                                    @dismissed="onEvent.alertCounter=0"
                                    @dismiss-count-down="countDownChanged"
                                >
                                    {{ onEvent.message }}
                                </b-alert>
                                <b-form @submit="onSendClicked">
                                    <div class="form-group">
                                        <div class="input-group input-group-merge input-group-alternative">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                            </div>
                                            <input class="form-control" placeholder="Kata Sandi Baru" type="password" v-model="password" required>
                                        </div>
                                        <span class="text-muted"><small>Minimal 6 karakter</small></span>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group input-group-merge input-group-alternative">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                            </div>
                                            <input class="form-control" placeholder="Ulangi Password" type="password" required v-model="confirm_password">
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <b-button v-if="isLoaded" type="submit" variant="primary" block>Setel Ulang Kata Sandi</b-button>
                                        <b-spinner v-else label="Spinning"></b-spinner>
                                    </div>
                                </b-form>
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
import { mapState } from "vuex"

export default {
    head() {
        return {
            title: 'Setel Ulang Kata Sandi | Akun Alkademi'
        }
    },
    layout: 'auth',
    components: {
        Footer
    },
    data() {
        return {
            appToken: this.$route.query.token || localStorage.getItem('appToken'),
            redirectTo: this.$route.query.redirect || localStorage.getItem('redirectTo'),
            lmsId: this.$route.query.app || localStorage.getItem('lmsId'),
            password: '',
            confirm_password: '',
            token: this.$route.query.token || '',

            message: null,
            isLoaded: true,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            saasState: (state) => state.Saas,
        })
    },
    created() {
        this.setUserToken()
    },
    methods: {
        setUserToken() {
            var token = this.$route.query.token
            var redirect = this.$route.query.redirect

            this.token = token
            this.redirectTo = redirect

            localStorage.setItem(this.lmsId, this.token)
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        stripslashes(str) {
            return str.replace(/\\'/g,'\'').replace(/\"/g,'"').replace(/\\\\/g,'\\').replace(/\\0/g,'\0');
        },
        async onSendClicked(event) {
            event.preventDefault()
            this.isLoaded = false

            if (this.password != this.confirm_password) {
                this.onEvent.message = "Password yang anda masukan tidak sama"
                this.onEvent.status = false
                this.onEvent.variant = 'warning'
                this.onEvent.alertCounter = 10
                this.isLoaded= true
                return
            }

            var payload = {
                password: this.password
            }
            localStorage.setItem('authorization', this.token)
            localStorage.setItem('targetLMS', this.lmsId)
            await this.$store
                .dispatch('Services/forgotVerify', payload)
                .then(() => {
                    if (!this.servicesState.status) {
                        this.onEvent.message = this.servicesState.message
                        this.onEvent.status = this.servicesState.status
                        this.onEvent.variant = 'warning'
                        this.onEvent.alertCounter = 10

                        this.isLoaded= true
                    } else {
                        this.onEvent.message = "Berhasil setel ulang kata sandi"
                        this.onEvent.status = this.servicesState.status
                        this.onEvent.variant = 'success'
                        this.onEvent.alertCounter = 2

                        localStorage.removeItem('appToken'),
                        localStorage.removeItem('redirectTo'),
                        localStorage.removeItem('lmsId'),

                        setTimeout(() => {
                            // this.$router.push(`/auth?appToken=${this.appToken}&redirectTo=${this.redirectTo}`)
                            localStorage.setItem(this.lmsId, this.servicesState.data.token)
                            this.callbackAuth(this.servicesState.data.token)
                        }, 1000);
                    }
                    localStorage.removeItem('authorization')
                })

        },
        callbackAuth(token) {

            const token_access = "authToken=" + token

            const redirectParam = this.redirectTo
            var redirect = ""

            if (redirectParam == null || redirectParam == undefined || redirectParam == "") {
                redirect = process.env.alkademiLMS
            } else {
                redirect = redirectParam
            }

            const url = redirect + "/callbackAuth?" + token_access
            // console.log(url, "URL")
            window.open(url, "_self")

        },
    }
}
</script>

<style>

</style>