<template>
	<div
		id="callback-auth"
		class="d-flex justify-content-center align-items-center vh-100"
	>
		<div
			v-if="!isAuthFailed"
			class="d-flex justify-content-center align-items-center vh-100"
		>
			<img
				:src="`/dashboard/assets/image/loading.svg`"
				alt="Loading..."
				style="max-width: 100px"
			/>
		</div>
		<div v-else>
			<h2 class="mb-3">Login Gagal</h2>
			<p>
				Tunggu sebentar dan mohon melakukan login ulang.<br />Tekan
				tombol di bawah ini jika halaman tidak otomatis kembali ke
				beranda.
			</p>
			<b-button @click="goHome" variant="primary"
				>Kembali ke beranda</b-button
			>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { DEFAULT_PAGE } from "~/commons/constants/setting-page";

export default {
	layout: "blank",

	computed: {
		...mapState({
			servicesState: (state) => state.Services,
		}),
	},

	data() {
		return {
			oldToken: localStorage.getItem("access_token"),
			newToken: this.$route.query.authToken || "",

			isAuthFailed: false,
			cdnHost: process.env.cdnHost
		};
	},

	created() {
		if (this.oldToken != null && this.oldToken != "undefined") {
			if (this.oldToken != this.newToken) {
				return this.saveToken();
			}
			return this.$router.push("/");
		}
		return this.saveToken();
	},

	methods: {
		goHome() {
			const alkademiAuth = process.env.alkademiAuth + "/logout";
			const redirectTo = "?redirectTo=" + window.location.origin;
			const lmsId = "&lmsId=" + localStorage.getItem("lmsId");

			const url = alkademiAuth + redirectTo + lmsId;

			window.open(url, "_self");
		},
		async saveToken() {
			const tempAppVer = localStorage.getItem('appVersion')
			localStorage.clear();
			localStorage.setItem('appVersion', tempAppVer)
			localStorage.setItem("access_token", this.newToken);

			await this.$store.dispatch("Sass/lmsId", { version: "v0" }).then(() => {
				this.getUserDetail();
			});
		},
		async getUserDetail() {
			await this.$store.dispatch("Services/authorize");

			if (!this.servicesState.status) {
				this.isAuthFailed = true;
				localStorage.clear();
				await this.$store.dispatch("Sass/lmsId", { version: "v0" }).then(() => {
					this.goHome();
				});
			} else {
				const user = {
					id: this.servicesState.detail_auth.id,
					email: this.servicesState.detail_auth.email,
					name: this.servicesState.detail_auth.name,
					kind: this.servicesState.detail_auth.kind,
				};

				const params = {
					kind: user.kind,
				};

				localStorage.setItem("user", JSON.stringify(user));

				await this.$store.dispatch("Sidebar/setSidebarRole", params);

				const redirectTo = this.$route.query?.redirectTo ?? null

				if (redirectTo) {
					window.location.replace(redirectTo);
				} else {
					window.location.replace(window.location.origin + DEFAULT_PAGE);
				}
			}
		},
	},
};
</script>