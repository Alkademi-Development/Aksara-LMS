<template>
    <b-card no-body :class="thisClass">
        <b-card-body>
            <b-row align-v="start">
                <b-col cols="12" md class="mt-4 mt-md-0">
                    <b-card-title class="mb-2">{{ kind == 'certificate' ? 'Sertifikat' : '' }} {{ certificate.name }}</b-card-title>
                    <b-card-text class="text-limit mb-3 mb-md-0" v-html="certificate.description"></b-card-text>
                </b-col>
                <b-col cols="12" md="4" class="text-right">
                    <b-button v-if="!isDownload" pill :variant="kind == 'certificate' ? 'success' : 'primary'" @click="clickDownload">{{ kind == 'certificate' ? 'View' : 'Detail' }}</b-button>
                    <b-button v-else pill :variant="kind == 'certificate' ? 'success' : 'primary'">Loading...</b-button>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    data() {
        return {
            isDownload: false,
        }
    },

    methods: {
        async clickDownload() {
            if (this.kind == 'certificate') {
                // this.isDownload = true
                // let user = JSON.parse(localStorage.getItem('user'))
                // let dispatch = 'Services/certificateDownload'
                
                // let params = {
                //     type: this.kind,
                //     userId: user.id,
                //     classroomId: this.certificate.id,
                // }

                // await this.$store.dispatch(dispatch, params)
                // .then(() => {
                //     var servicesState = this.$store.state.Services

                //     if(!servicesState.status) {
                //         console.error('Failed download leaderboard: ', servicesState.message)
                //         this.isDownload = false
                //     } else {
                //         this.isDownload = false
                //     }
                // })
                if (this.isMySelf) this.$router.push(`/dashboard/certificate/${this.certificate.slug}/view/${this.certificate.id}`)
                else this.$router.push(`/dashboard/students/${this.userId}/raport/${this.certificate.slug}`)

            } else {
                if (this.isMySelf) this.$router.push(`/dashboard/profile/raport/${this.certificate.slug}`)
                else this.$router.push(`/dashboard/students/${this.userId}/raport/${this.certificate.slug}`)
            }
        }
    },

    props: {
        certificate: Object,
        kind: String,
        thisClass: {
            type: String,
            default: ''
        },
        userId: {
            type: Number,
            default: -1,
        },
        isMySelf: {
            type: Boolean,
            default: false,
        }
    },
}
</script>

<style>

</style>