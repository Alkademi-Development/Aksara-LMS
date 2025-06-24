<template>
    <div id="register" class="wrapper full d-flex flex-column">
        <!-- Page content -->
        <div class="grow-1 d-flex align-items-center">
            <div class="container">
                <!-- Form -->
                <div class="row justify-content-center">
                    <div class="col-lg-5 col-md-7">

                        <div class="card bg-light border-0 mb-0" v-if="!isEmailSended">
                            <div class="card-header bg-transparent pt-lg-5">
                                <div class="text-center">
                                    <h1 class="mb-1">Lupa Kata Sandi?</h1>
                                    <small class="text-muted">
                                        Masukkan alamat email yang anda gunakan ketika daftar dan kami akan mengirimkan instruksi untuk menyetel ulang kata sandi anda.
                                    </small>
                                </div>
                            </div>
                            <div class="card-body pb-lg-5 px-lg-5">
                                <b-alert 
                                    :show="onEvent.alertCounter"
                                    variant="warning"
                                    @dismissed="onEvent.alertCounter=0"
                                    @dismiss-count-down="countDownChanged"
                                >
                                    {{ onEvent.message }}
                                </b-alert>
                                <b-form @submit="onSendClicked">
                                    <div class="form-group">
                                        <div class="input-group input-group-merge input-group-alternative mb-3">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                                            </div>
                                            <input class="form-control" placeholder="Alamat Email" type="email" v-model="email" required>
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <b-button v-if="isLoaded" type="submit" variant="primary" block>Kirim Instruksi Setel Ulang</b-button>
                                        <b-spinner v-else label="Spinning"></b-spinner>
                                    </div>
                                </b-form>
                            </div>
                        </div>

                        <div class="card bg-primary border-0" v-else>
                            <div class="card card-profile bg-light">
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
                                        <button type="button" :class="['btn btn-primary mt-2', isDisabled ? 'disabled' : '']" @click="onSendClicked">
                                            <span v-if="isDisabled"> Kirim Ulang Dalam {{ countdown | secondsToMinutes }}</span>
                                            <span v-else>Kirim Ulang Link Reset</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- Footer -->
        <Footer :container="'container'" :backgroundColor="'bg-primary'" :textColor="'text-white'"  />  
    </div>
</template>

<script>
import Footer from "@/components/template/dashboard/Footer"

export default {
    // head() {
    //     return {
    //         title: 'Lupa Kata Sandi? | Alkademi'
    //     }
    // },
    layout: 'blank',
    components: {
        Footer
    },
    data() {
        return {
            email: '',
            isDisabled: true,
            message: null,
            isLoaded: true,

            countdown: 60*5,
            forgotEmail: localStorage.getItem('forgotEmail'),

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            isEmailSended: false,
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
    methods: {
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        onCountdown() {
            setTimeout(() => {
                if (this.countdown == 1) {
                    this.isDisabled = false
                }else {
                    this.countdown--
                }
            }, 1000); 
        },
        stripslashes(str) {
            return str.replace(/\\'/g,'\'').replace(/\"/g,'"').replace(/\\\\/g,'\\').replace(/\\0/g,'\0');
        },
        async onSendClicked(event) {
            event.preventDefault()
            this.isLoaded = false

            var user = { email: this.email }

            user.email = this.stripslashes(user.email)

            await this.$store
                .dispatch('Auth/storeEmailForgot', user)
                .then(() => {
                    if (!this.$store.state.Auth.status) {
                        this.onEvent.message = this.$store.state.Auth.message
                        this.onEvent.status = this.$store.state.Auth.status
                        this.onEvent.variant = 'warning'
                        this.onEvent.alertCounter = 10
                        
                        this.isLoaded= true
                    }else {
                        localStorage.setItem('forgotEmail', this.email)
                        this.onCountdown()
                        this.isEmailSended = true
                    }
                })
            
        },
        onRegisterClicked() {
            this.$router.push('/curriculum')
        },
    }
}
</script>

<style>

</style>