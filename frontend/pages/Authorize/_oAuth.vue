<template>
</template>
<script>
export default {
    methods: {
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        callbackAuth(token_access) {
            const redirect = localStorage.getItem("oAuthRedirectTo");
            const lmsId = localStorage.getItem("oAuthLmsId");
            if (redirect == null || redirect === "") this.$router.push("/");
            let url = redirect + "/callbackAuth?authToken=" + token_access;
            
            const backTo = localStorage.getItem("oAuthBackTo")
            if (backTo) {
                url += "&redirectTo=" + backTo
            }
            
            localStorage.setItem(lmsId, token_access)
            localStorage.removeItem("oAuthRedirectTo")
            localStorage.removeItem("oAuthBackTo")
            localStorage.removeItem("oAuthLmsId")
            localStorage.removeItem("targetLMS")
            window.open(url, "_self");
        },
        async authorize(accessToken) {
            const oAuth = this.$route.params.oAuth
            const oAuthServices = oAuth === 'auth0' ? 'Zero' : this.capitalize(oAuth)

            let payload = {
                redirectUri: `${process.env.host}authorize/${oAuth}`,
                accessToken: accessToken
            }
            await this.$store
                .dispatch(`Services/oAuth${oAuthServices}`, payload).then(() => {
                    if (!this.$store.state.Services.status) {

                        /**
                         * Tolong Di Handle
                         */
                        console.log(this.$store.state.Services.message)
                    } else {
                        const data = this.$store.state.Services.data
                        this.callbackAuth(data.token)
                    }
                })
        }
    },
    async created() {
        let accessToken = this.$route.query.code;
        if (accessToken === "" || accessToken === undefined || accessToken == null)
            await this.$router.push("/");
        await this.authorize(accessToken)
    }
}
</script>
