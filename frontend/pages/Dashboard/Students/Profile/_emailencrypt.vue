<template>
    <div>

        <ContentHeaderProfile :title="title" :description="description"/>

        <div class="container-fluid mt--6">

            <DetailProfileGlobal v-if="emailEncrypt" :emailEncrypt="emailEncrypt" @programTitle="programTitle"/>

            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeaderProfile from "@/components/template/dashboard/ContentHeaderProfile.vue"
import DetailProfileGlobal from "@/components/user/DetailProfileGlobal.vue"
import Footer from "@/components/template/dashboard/Footer.vue"


export default {
    layout: 'profile',

    components: {
        ContentHeaderProfile,
        Footer,
        DetailProfileGlobal
    },

    data() {
        return {

        title: "Profil Peserta",
        description: "Anda dapat melihat hasil proyek atau tugas yang telah diberikan kepada peserta.",
        // userId: null

        }
    },

    created() {
        // this.getCredentials()
    },

    methods: {

        getCredentials() {
        const url = this.$router.currentRoute.fullPath
        var res = url.split('/')
        res.shift()

        this.userId = res[res.length - 1]
        // console.log('USERID: ', this.userId)
        },

        programTitle(data) {

            this.title = "Profil Peserta " + data

        }

    },

    async asyncData({ params }) {
        const emailEncrypt = params.emailencrypt
        return { emailEncrypt }
    }

}
</script>