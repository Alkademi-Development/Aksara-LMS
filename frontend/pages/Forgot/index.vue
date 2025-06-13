<template>
    <div id="auth" :class="['wrapper full d-flex flex-column vh-100', saasState?.settings?.isCustomAuth ? 'custom-background' : 'alkademi-background']">
        <!-- Page content -->
        <div class="grow-1 d-flex align-items-center">
            <div class="container">
                <!-- Form -->
                <div v-if="isLoaded" class="row justify-content-center">
                    <div class="col-lg-5 col-md-7">

                        <div v-if="isAppRegistered && !isEmailSended" class="mb-0 border-0 card bg-light">
                            <div class="bg-transparent card-header pt-lg-5">
                                <div class="text-center">
                                    <h1 class="mb-1">Lupa Kata Sandi?</h1>
                                    <small class="text-muted">
                                        Masukkan alamat email yang anda gunakan ketika daftar dan kami akan mengirimkan instruksi untuk menyetel ulang kata sandi anda.
                                    </small>
                                </div>
                            </div>
                            <div class="card-body pb-lg-5 px-lg-5">
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
                                <b-form @submit="onSubmit">
                                    <div class="form-group">
                                        <div class="mb-3 input-group input-group-merge input-group-alternative">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                                            </div>
                                            <input class="form-control" placeholder="Alamat Email" type="email" v-model="email" required>
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <b-button v-if="isLoaded" type="submit" variant="primary" block>Kirim Instruksi Setel Ulang</b-button>
                                        <b-button v-else variant="primary" block><b-spinner label="Spinning"></b-spinner></b-button>
                                    </div>
                                </b-form>
                            </div>
                        </div>
                        <div class="card border-0" v-else-if="isAppRegistered && isEmailSended">
                            <div class="card mb-0 card-profile bg-light">
                                <div class="card-body py-5 px-5">
                                    <div class="text-center mb-2">
                                        <h1>Periksa Email Kamu.</h1>
                                    </div>
                                    <div class="text-center mb-4">
                                        <span>Kami telah mengirim link reset password ke email <strong>{{ email }}</strong></span>
                                    </div>
                                    <div class="text-center">
                                        <small>Tidak mendapatkan email reset?</small>
                                    </div>
                                    <div class="text-center">
                                        <button type="button" :class="['btn btn-primary mt-2', isDisabled ? 'disabled' : '']" :disabled="isDisabled" @click="onSubmit">
                                            <span v-if="isDisabled"> Kirim Ulang Dalam {{ countdown | secondsToMinutes }}</span>
                                            <span v-else>Kirim Ulang Link Reset</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="card bg-light border-0">
                            <div class="card-body pb-lg-5 px-lg-5 d-flex flex-column align-items-center">
                                <img
                                    :src="
                                        saasState?.settings?.isCustomAuth ?
                                        saasState?.settings?.logo_dark : isLayoutBersamaPuja ?
                                        saasState?.settings?.logo_dark :'/assets/image/logo.png'
                                    "
                                    :class="isLayoutBersamaPuja ? 'logo mb-2' : 'logo'"
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

export default {
    head() {
        return {
            title: 'Lupa Kata Sandi? | Akun Alkademi'
        }
    },
    layout: "auth",
    components: {
        Footer
    },
    data() {
        return {
            alkademiLMS: process.env.alkademiLMS,
            appToken: this.$route.query.appToken,
            redirectTo: this.$route.query.redirectTo,
            lmsId: this.$route.query.lmsId,
            isAppRegistered: false,

            isDisabled: true,
            countdown: 60*1,

            email: '',
            password: '',

            message: null,
            isLoaded: false,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },
            isSendingVerifyEmail: false,
            isEmailSended: false,
            intervalCountdown: null,
        }
    },
    filters: {
        secondsToMinutes(value) {
            var seconds = Math.floor( value % 60 ).toString();
            var minutes = Math.floor( value / 60 ).toString();
            if( seconds.length === 1 ){
                seconds = '0' + seconds;
            }
            return minutes + ':' + seconds;
        }
    },
    computed: {
        ...mapState({
            saasState: (state) => state.Saas,
        }),
        isLayoutBersamaPuja(){
            return this.saasState?.settings?.layout === 'bekerjabersamapuja' || this.saasState?.settings?.layout === 'belajarbersamapuja';
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
        async checkAppRegistered() {
            this.isAppRegistered = true
            this.isLoaded = true
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        onCountdown() {
            if (this.intervalCountdown) clearInterval(this.intervalCountdown)
            this.countdown = 60*30
            this.isDisabled = true
            this.intervalCountdown = setInterval(() => {
                if (this.countdown < 1) {
                    this.isDisabled = false
                } else {
                    this.countdown --
                }
            }, 1000);
        },
        stripslashes(str) {
            return str.replace(/\\'/g,'\'').replace(/\"/g,'"').replace(/\\\\/g,'\\').replace(/\\0/g,'\0');
        },
        async onSubmit(event) {
            event.preventDefault()

            this.isLoaded = false

            let params = {
                email: this.email,
                host: document.location.origin + '/forgot/reset',
                redirect: this.redirectTo,
            }

            params.email = this.stripslashes(params.email)

            localStorage.setItem('targetLMS', this.lmsId)
            await this.$store
                .dispatch('Services/forgot', params)
                .then(() => {
                    if (!this.$store.state.Services.status) {

                        this.onEvent.message = this.$store.state.Services.message
                        this.onEvent.status = this.$store.state.Services.status

                        if (this.onEvent.message != 'Email belum diverifikasi') {
                            this.onEvent.alertCounter = 10
                        }

                        this.isLoaded= true

                    } else {
                        this.isLoaded= true

                        localStorage.setItem("redirectTo", this.redirectTo)
                        localStorage.setItem("lmsId", this.lmsId)

                        this.onCountdown()
                        this.isEmailSended = true

                    }
                })
        }
    }
}
</script>

<style>

</style>