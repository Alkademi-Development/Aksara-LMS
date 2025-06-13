<template>
    <div id="auth" :class="['wrapper full d-flex flex-column', saasState?.settings?.isCustomAuth ? 'custom-background' : 'alkademi-background']">
        <!-- Page content -->
        <div class="grow-1 d-flex align-items-center">
            <div class="container">
                <!-- Table -->
                <div class="row justify-content-center">

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
        <Footer :container="'container'" :textColor="'text-white'" :lmsId="lmsId" />
    </div>
</template>

<script>
import Footer from "@/components/template/dashboard/Footer"
import { mapState } from 'vuex'

export default {
    head() {
        return {
            title: 'Logout | Akun Alkademi'
        }
    },
    layout: 'auth',
    components: {
        Footer
    },
    data() {
        return {
            redirectTo: this.$route.query.redirectTo,
            lmsId: this.$route.query.lmsId
        }
    },
    computed: {
        ...mapState({
            saasState: (state) => state.Saas,
        })
    },
    created() {
        this.logout()
    },
    methods: {
        async logout() {
            // console.log("LMSID: ", this.lmsId)
            const token = localStorage.getItem(this.lmsId)
            const dataSettings = this.saasState.settings;
            if (token) {
                localStorage.setItem('authorization', token)
                await this.$store.dispatch('Services/logout').then(() => {

                    if (!this.$store.state.Services.status) {

                        console.error("Failed to logout: ", this.$store.state.Services.message)

                    } else {

                        if (dataSettings?.layout === 'sekolahbeta') {
                            localStorage.clear()
                            this.onLogoutOAuthZero()
                            return
                        }

                        setTimeout(() => {
                            localStorage.removeItem(this.lmsId)
                            if (this.redirectTo) {
                                // window.open(this.redirectTo, "_self")
                                window.location.replace(this.redirectTo)
                            } else {
                                this.$router.push("/auth")
                            }
                        }, 1000);

                    }

                    localStorage.removeItem('authorization')
                    localStorage.clear()
                })
            } else {
                if (dataSettings?.layout === 'sekolahbeta') {
                    localStorage.clear()
                    this.onLogoutOAuthZero()
                    return
                }

                if (this.redirectTo) {
                    localStorage.clear()
                    // window.open(this.redirectTo, "_self")
                    window.location.replace(this.redirectTo)
                } else {
                    localStorage.clear()
                    this.$router.push("/auth")
                }
            }

        },
        onLogoutOAuthZero() {
            let oAuthURL = new URL("https://1000startupdigital.us.auth0.com/v2/logout")
            oAuthURL.searchParams.append("client_id", "2VhH61sEJ7yjoK4VCfriTtJRoQdQJRPc")
            oAuthURL.searchParams.append("returnTo", this.$route.query.redirectTo)
            window.location.replace(oAuthURL.href)
        },
    }
}
</script>

<style>

</style>