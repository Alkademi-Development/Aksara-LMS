<template>
  <div class="auth-layout">
    <div v-if="isLoaded">
      <Nuxt />
    </div>
    <div v-else class="d-flex justify-content-center align-items-center vh-100">
      <img
        :src="`/dashboard/assets/image/loading.svg`"
        alt="Loading..."
        style="max-width: 100px"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import appToken from "~/api/app-token";
import Header from "@/components/template/landing/Header.vue";
import Footer from "@/components/template/dashboard/Footer";
export default {
	components: {
		Header,
		Footer,
	},
	data() {
		return {
			isLoaded: false,
			cdnHost: process.env.cdnHost,
			settings: {
				title: "",
				logoDark: process.env.cdnHost + 'themes/static/assets/img/logos/alkademi-dark.png',
                logoLight: process.env.cdnHost + 'themes/static/assets/img/logos/alkademi-light.png',
                favicon: process.env.cdnHost + 'themes/static/assets/img/logos/alkademi-fav.png',
				css: {
					ft_primary: "Raleway",
					ft_secondary: "Inter",
					clr_primary: "#2096C4",
					clr_secondary: "#2F80ED",
					clr_success: "#2dce89",
					clr_info: "#11cdef",
					clr_warning: "#fb6340",
					clr_danger: "#f5365c",
					clr_light: "#adb5bd",
					clr_dark: "#212529",
				},
			},
		};
	},
	computed: {
		...mapState({
			sassState: (state) => state.Sass,
			appVersion: (state) => state.Sass?.appVersion,
            isTokenValid: (state) => state.Sass?.isTokenValid,
		}),
	},
	head() {
			return {
					title: `${this.settings?.title}`,
					link: [
							{ hid: "icon", rel: "icon", type: "image/x-icon", href: this.settings?.favicon },
			{ hid: "shortcut-icon", rel: "shortcut icon", type: "image/x-icon", href: this.settings?.favicon },
					]
			}
	},
	created() {
		// this.redirectAuth()
		// this.setCurrentRoute();
		// this.permission();
		this.fetchSettings();
	},
	mounted() {
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-8H1TCBHYM9');
	},
	methods: {
		async fetchSettings() {
			// Wait until appToken.code or appToken.generatedToken() is filled
			while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
				await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
			}
			await this.checkAppVersion()
			await this.$store.dispatch("Sass/lmsId", { version: "v0" });
			await this.$store.dispatch("Sass/allSettings", { version: "v0" });
			if (!this.sassState.status) {
				console.error(
					"Error get all sass settings: ",
					this.sassState.message
				);
				this.setupSettings(false);
			} else {
				if (this.sassState.settings == null || JSON.stringify(this.sassState.settings) == '{}') this.setupSettings(false)
				this.setupSettings(true);
			}
		},
		setupSettings(isDefault) {
			if (isDefault) {
				// Setup Setting Variable
				const dataSettings = this.sassState.settings;
				// Setup Meta
				this.settings.title = dataSettings.title;
				this.settings.logoDark = dataSettings.logo_dark;
				this.settings.logoLight = dataSettings.logo_light;
				this.settings.favicon = dataSettings.favicon;
				// Setup CSS Variable
				this.settings.css = dataSettings.css;
			}
			// Implement Setting
			// this.loadMetaSeo();
			this.loadStyleConfig();
			setTimeout(() => {
				this.isLoaded = true;
			}, 500);
			// console.log("SETTINGS: ", this.settings)
		},
		loadMetaSeo() {
			// Web Title
			const head = document.getElementsByTagName("head")[0];
			if (head) {
				if (head.querySelector("title"))
					head.querySelector("title").remove();
			}
			const title = document.createElement("title");
			title.text = this.settings.title;
			document.head.append(title);
			// Favicon
			const linkIcon = document.getElementsByTagName("head")[0];
			const attr = linkIcon.querySelectorAll("link");
			for (var i = 0; i < attr.length; i++) {
				if (attr[i].attributes.rel.value == "icon") {
					attr[i].remove();
				}
			}
			const favicon = document.createElement("link");
			favicon.setAttribute("rel", "icon");
			favicon.setAttribute("type", "image/png");
			favicon.setAttribute("href", this.settings.favicon);
			document.head.append(favicon);
			// Meta
			const meta = [
				[
					{ attr: "hid", value: "description" },
					{ attr: "name", value: "description" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "hid", value: "keywords" },
					{ attr: "name", value: "keywords" },
					{ attr: "content", value: "" },
				],
				// Google / Search Engine Tags
				[
					{ attr: "itemprop", value: "name" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "itemprop", value: "description" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "itemprop", value: "image" },
					{ attr: "content", value: "" },
				],
				// Facebook Meta Tags
				[
					{ attr: "property", value: "og:url" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "property", value: "og:type" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "property", value: "og:title" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "property", value: "og:description" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "property", value: "og:image" },
					{ attr: "content", value: "" },
				],
				// Twitter Meta Tags
				[
					{ attr: "name", value: "twitter:card" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "name", value: "twitter:title" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "name", value: "twitter:description" },
					{ attr: "content", value: "" },
				],
				[
					{ attr: "name", value: "twitter:image" },
					{ attr: "content", value: "" },
				],
			];
			meta.map((item) => {
				const meta = document.createElement("meta");
				item.map((data) => {
					meta.setAttribute(data.attr, data.value);
				});
				document.head.append(meta);
			});
			// Logo & Title
			// localStorage.setItem("logo-dark", this.settings.logoDark);
			// localStorage.setItem("logo-light", this.settings.logoLight);
			// localStorage.setItem("title", this.settings.title);
		},
		loadStyleConfig() {
			// Root Variable
			const root = document.querySelector(":root");
			const cssSettings = this.settings.css;
			// Font Name
			var ft_primary = cssSettings.ft_primary;
			var ft_secondary = cssSettings.ft_secondary;
			if (ft_primary.trim() != "") {
				let fontP = document.createElement("link");
				fontP.rel = "stylesheet";
				fontP.href =
					"https://fonts.googleapis.com/css2?family=" +
					ft_primary.replace(/\s/g, "+") +
					":wght@300;400;500;600;700&display=swap";
				document.head.appendChild(fontP);
			}
			if (ft_secondary.trim() != "") {
				let fontS = document.createElement("link");
				fontS.rel = "stylesheet";
				fontS.href =
					"https://fonts.googleapis.com/css?family=" +
					ft_secondary.replace(/\s/g, "+") +
					":wght@300;400;500;600;700&display=swap";
				document.head.appendChild(fontS);
			}
			// Change Font Family
			root.style.setProperty(
				"--bs-font-heading",
				`${ft_primary}, sans-serif`
			);
			root.style.setProperty(
				"--bs-font-paragraph",
				`${ft_secondary}, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
			);
			// Color Style
			root.style.setProperty("--bs-primary", cssSettings.clr_primary);
			root.style.setProperty("--bs-secondary", cssSettings.clr_secondary);
			root.style.setProperty("--bs-success", cssSettings.clr_success);
			root.style.setProperty("--bs-info", cssSettings.clr_info);
			root.style.setProperty("--bs-warning", cssSettings.clr_warning);
			root.style.setProperty("--bs-danger", cssSettings.clr_danger);
			root.style.setProperty("--bs-light", cssSettings.clr_light);
			root.style.setProperty("--bs-dark", cssSettings.clr_dark);
		},
		async checkAppVersion() {
            const appVer = localStorage.getItem('appVersion')
            await this.$store.dispatch('Sass/checkAppVersion')
            if (!!appVer && appVer !== this.appVersion) {
                localStorage.clear()
                // delete exiting token and code from cookie
                document.cookie = "_gt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                document.cookie = "_ct=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                document.cookie = "_ift=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            }
            if (!!this.appVersion && this.appVersion !== null) {
                localStorage.setItem('appVersion', this.appVersion)
                await this.$store.dispatch('Sass/validateAppToken')
                if (!this.isTokenValid) {
                    // delete exiting token and code from cookie
                    document.cookie = "_gt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                    document.cookie = "_ct=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
					document.cookie = "_ift=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                    await appToken?.generatedToken()
                }
            }
    },
	},
	watch: {},
};
</script>

<style scoped lang="scss">
.auth-layout {
  &::v-deep {
    @import '~/assets/scss/auth.scss';
 }
}
</style>