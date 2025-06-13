<template>
    <div id="auth" :class="['wrapper full d-flex flex-column', saasState?.settings?.isCustomAuth ? 'custom-background' : 'alkademi-background']">
        <div class="grow-1 d-flex align-items-center">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-6 col-md-8">
                        <b-alert
                            :show="onEvent.alertCounter"
                            :variant="onEvent.variant"
                            @dismissed="onEvent.alertCounter=0"
                            @dismiss-count-down="countDownChanged"
                        >
                            {{ onEvent.message }}
                        </b-alert>
                        <div class="border-0 card">
                            <div class="card card-profile bg-light">
                                <div class="px-5 py-5 card-body">
                                    <div class="mb-2 text-center">
                                        <h1>Verifikasi Email Kamu</h1>
                                    </div>
                                    <div class="mb-4 text-center">
                                        <span>Kami akan mengirimkan link verifikasi ke email <strong>{{ emailToVerify }}</strong>, periksa email kamu.</span>
                                    </div>
                                    <div class="text-center">
                                        <small>Tidak mendapatkan email verifikasi?</small>
                                    </div>
                                    <div class="text-center">
                                        <button class="mt-2 disabled btn btn-primary" type="button" v-if="isDisabled" disabled>
                                            <span> Kirim Ulang Dalam {{ countdown | secondsToMinutes }}</span>
                                        </button>

                                        <b-spinner v-else-if="isSendingVerifyEmail" label="resend email"></b-spinner>

                                        <button type="button" v-else class="mt-2 btn btn-primary" @click="verifyEmail">
                                            <span>Kirim Ulang Link Verifikasi</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer :container="'container'" :textColor="'text-white'"  />
    </div>
</template>

<script>
import Footer from "@/components/template/dashboard/Footer"
import { mapState } from 'vuex'

export default {
    layout: 'auth',
    components: {
        Footer
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            saasState: (state) => state.Saas,
        })
    },
    head() {
        return {
            title: `Verifikasi Email | Akun Alkademi`
        }
    },
    data() {
        return {
            isDisabled: true,
            countdown: 60*1,
            resendStatus: this.$route.query.resendStatus,
            appToken: this.$route.query.appToken,
            redirectTo: this.$route.query.redirectTo,
            lmsId: this.$route.query.lmsId,
            emailToVerify: this.$route.query.emailToVerify || localStorage.getItem('emailToVerify'),

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            isSendingVerifyEmail: true,
            intervalCountdown: null
        }
    },
    mounted() {
        if (this.resendStatus == 'true' || this.resendStatus == true) {
            this.verifyEmail()
        } else {
            this.onEvent.alertCounter = 3
            this.onEvent.message = 'Link verifikasi berhasil dikirim.'
            this.onEvent.variant = 'default'
            this.countdown = 60*1
            this.onCountdown()
            this.isDisabled = true;
            this.isSendingVerifyEmail = false;
        }
    },
    watch: {
        countdown() {
            this.onCountdown()
        }
    },
    filters: {
        secondsToMinutes(value) {
            var seconds = Math.floor( value % 60 ).toString();
            var minutes = Math.floor( value / 60 ).toString();

            if( seconds.length === 1 ) seconds = '0' + seconds;
            return minutes + ':' + seconds;
        }
    },
    methods: {
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        onCountdown() {
            if(this.intervalCountdown) clearInterval(this.intervalCountdown)
            this.intervalCountdown = setTimeout(() => {
                if (this.countdown == 1) {
                    this.isDisabled = false
                } else {
                    this.countdown--
                }
            }, 1000);
        },
        onRegisterClicked() {
            this.$router.push('/dashboard')
        },
        onBackClicked() {
            this.$router.go(-1)
        },
        stripslashes(str) {
            return str.replace(/\\'/g,'\'').replace(/\"/g,'"').replace(/\\\\/g,'\\').replace(/\\0/g,'\0');
        },
        async verifyEmail() {
            this.isSendingVerifyEmail = true;

            localStorage.setItem("redirectTo", this.redirectTo)
            localStorage.setItem("lmsId", this.lmsId)
            localStorage.setItem("emailToVerify", this.emailToVerify)
            const email = this.stripslashes(this.emailToVerify)

            const params = {
                email: email,
                redirect: this.redirectTo
            }

            await this.$store.dispatch('Services/resendEmail', params)

            if (!this.servicesState.status) {
                this.onEvent.message = this.servicesState.message
                this.onEvent.status = this.servicesState.status
                this.onEvent.variant = 'warning'
                this.onEvent.alertCounter = 10
                this.isSendingVerifyEmail = false;
            } else {
                this.onEvent.alertCounter = 3
                this.onEvent.message = 'Link verifikasi berhasil dikirim.'
                this.onEvent.variant = 'default'
                this.countdown = 60*1
                this.onCountdown()
                this.isDisabled = true;
                this.isSendingVerifyEmail = false;
            }

        }
    }
}
</script>

<style>

</style>