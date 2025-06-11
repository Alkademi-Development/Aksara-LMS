<template>
    <div id="register" class="wrapper full d-flex flex-column">
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
                                    <!-- <div class="form-group">
                                        <div class="input-group input-group-merge input-group-alternative">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                            </div>
                                            <input class="form-control" placeholder="Ulangi Password" type="password" required v-model="confirm_password">
                                        </div>
                                    </div> -->
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
        <Footer :container="'container'" :backgroundColor="'bg-primary'" :textColor="'text-white'"  />  
    </div>
</template>

<script>
import Footer from "@/components/template/dashboard/Footer"

export default {
    // head() {
    //     return {
    //         title: 'Setel Ulang Kata Sandi | Alkademi'
    //     }
    // },
    layout: 'blank',
    components: {
        Footer
    },
    data() {
        return {
            password: '',
            confirm_password: '',
            token: '',

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
    created() {
        this.setUserToken()
        localStorage.setItem("access_token", this.token)
    },
    methods: {
        setUserToken() {
            const url = this.$route.fullPath
            const arrUrl = url.split('/')
            arrUrl.shift()
            
            var token = arrUrl[2]

            this.token = token
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

            var payload = {
                password: this.password
            }

            await this.$store
                .dispatch('Auth/storeUserPassword', payload)
                .then(() => {
                    if (!this.$store.state.Auth.status) {
                        this.onEvent.message = this.$store.state.Auth.message
                        this.onEvent.status = this.$store.state.Auth.status
                        this.onEvent.variant = 'warning'
                        this.onEvent.alertCounter = 10
                        
                        this.isLoaded= true
                    }else {
                        this.onEvent.message = "Berhasil setel ulang kata sandi"
                        this.onEvent.status = this.$store.state.Auth.status
                        this.onEvent.variant = 'success'
                        this.onEvent.alertCounter = 2

                        localStorage.clear()

                        setTimeout(() => {
                            this.$router.push('/login')
                        }, 3000);
                    }
                })
            
        },
    }
}
</script>

<style>

</style>