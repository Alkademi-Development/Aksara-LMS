<template>
	<div
		class="
            loading-wrapper
			d-flex
			justify-content-center
			align-items-center
			vh-100
		"
	>
		<div class="text-center">
            <img
                :src="page404 ? '/dashboard/assets/image/404.webp' : `/dashboard/assets/image/loading.svg`"
                alt="Loading..."
                style="max-width: 100px"
            />
            <div v-if="page404 || isError" class="mt-3">
                <h1>{{ page404 ? 'Oops.. Maaf halaman tidak ditemukan' : isError ? 'Opps.. Maaf terjadi kesalahan pada website' : '' }}</h1>
                <a href="/dashboard" class="back-home">Kembali ke halaman dashboard</a>
            </div>
        </div>
	</div>
</template>
<script>
import { mapState } from "vuex";

export default {
    props: {
        redirectLogin: {
            type: Boolean,
            default: false
        },
        page404: {
            type: Boolean,
            default: false
        },
        isError: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            cdnHost: process.env.cdnHost,
        }
    },
    mounted() {
        if (this.redirectLogin) this.goToLogin()
    },
    methods: {
        async goToLogin() {
            const baseUrl = process.env.alkademiAuth
            const redirect = "&redirectTo=" + window.location.origin
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

            const url = `${baseUrl}/auth?${redirect}${lmsId}`;

            window.open(url, "_self")
        }
    }
}
</script>
<style scoped>
.loading-wrapper {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: #ffffff;
	z-index: 2000;
}
.back-home {
    color: #5eb9f0 !important;
}
</style>