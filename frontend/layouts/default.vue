<template>
	<div
		v-if="isLoaded"
		:class="[routeName, routeName != '' ? 'content-page' : '']"
	>
		<!-- <Header />
		<Nuxt />
		<Footer /> -->
	</div>
	<div v-else class="d-flex justify-content-center align-items-center vh-100">
		<img
			:src="`/dashboard/assets/image/loading.svg`"
			alt="Loading..."
			style="max-width: 100px"
		/>
	</div>
</template>

<style>
</style>

<script>
import Header from "@/components/template/landing/Header.vue";
import Footer from "@/components/template/landing/Footer.vue";
import { DEFAULT_PAGE } from "~/commons/constants/setting-page";

// import firebase from "firebase/app";
// import "firebase/messaging";
import redirectSSL from "redirect-ssl";
import { mapState } from "vuex";

import appToken from "~/api/app-token";

export default {
	serverMiddleware: [
		redirectSSL.create({ enabled: process.env.NODE_ENV === "production" }),
	],
	components: {
		Header,
		Footer,
	},
	data() {
		return {
			BASE_URL: process.env.baseURL,
			routeName: "",
			isLoaded: false,
			cdnHost: process.env.cdnHost,
			settings: {
				title: "",
				logoDark:
					process.env.cdnHost +
					"themes/static/assets/img/logos/alkademi-dark.png",
				logoLight:
					process.env.cdnHost +
					"themes/static/assets/img/logos/alkademi-light.png",
				favicon:
					process.env.cdnHost +
					"themes/static/assets/img/logos/alkademi-fav.png",
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
				meta: {
                    name: "-",
                    description: "-",
                    keywords: "-",
                    type: "-",
                    image: "-",
                    card: "-",
                    site_name: "-",
                    url: "-",
                    twitter_site: "-",
					robots: "noindex,nofollow",
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
		currentRouteName() {
			return this.$route.fullPath;
		},
	},
	created() {
		// this.redirectAuth()
		this.setCurrentRoute();
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
				await this.setupSettings(false);
			} else {
				if (this.sassState.settings == null || JSON.stringify(this.sassState.settings) == '{}') await this.setupSettings(false)
				await this.setupSettings(true);
			}
		},
		async setupSettings(isDefault) {
			if (isDefault) {
				// Setup Setting Variable

				const dataSettings = this.sassState.settings;

				// Setup
				this.settings.title = dataSettings.title;
				this.settings.logoDark = dataSettings.logo_dark;
				this.settings.logoLight = dataSettings.logo_light;
				this.settings.favicon = dataSettings.favicon;

                // Setup Meta
                this.settings.meta = dataSettings.meta

				// Setup CSS Variable
				this.settings.css = dataSettings.css;
			}

			// Implement Setting
			// // this.loadMetaSeo();
			this.loadStyleConfig();

			setTimeout(async () => {
				// this.isLoaded = true;
				if (localStorage.getItem('access_token')) {
					window.open(DEFAULT_PAGE, "_self")
				} else {
					const baseUrl = process.env.alkademiAuth
					const redirect = "&redirectTo=" + window.location.origin

					const codeToken = `&code=${await appToken?.getCode()}`
					const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

					const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

					const url = `${baseUrl}/auth?${redirect}${lmsId}${codeToken}${generatedToken}`;

					window.open(url, "_self")
				}
			}, 2000);

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
			favicon.setAttribute("type", "image/x-icon");
			favicon.setAttribute("href", this.settings.favicon);

			document.head.append(favicon);

			// Meta
            const metaTag = document.getElementsByTagName("head")[0];
			const attrMeta = metaTag.querySelectorAll("meta");

			for (var i = 0; i < attrMeta.length; i++) {
                // console.log(attrMeta[i].name)
                // break;
				if (
                    attrMeta[i].name == "description" ||
                    attrMeta[i].name == "og:type" ||
                    attrMeta[i].name == "og:title" ||
                    attrMeta[i].name == "og:site_name" ||
                    attrMeta[i].name == "og:description" ||
                    attrMeta[i].name == "og:url" ||
                    attrMeta[i].name == "og:image" ||
                    attrMeta[i].name == "twitter:card" ||
                    attrMeta[i].name == "twitter:site" ||
                    attrMeta[i].name == "twitter:creator" ||
                    attrMeta[i].name == "twitter:title" ||
                    attrMeta[i].name == "twitter:description" ||
                    attrMeta[i].name == "twitter:image" ||
                    attrMeta[i].name == "theme-color" ||
					attrMeta[i].name == "robots" // Remove existing robots meta tag
                    ) {
                    // console.log(attrMeta[i].name)
					attrMeta[i].remove();
				}
			}

            const metaSettings = this.settings.meta
			const meta = [
				[
					{ attr: "data-hid", value: "description" },
					{ attr: "name", value: "description" },
					{ attr: "content", value: metaSettings.description },
				],
				[
					{ attr: "data-hid", value: "keywords" },
					{ attr: "name", value: "keywords" },
					{ attr: "content", value: metaSettings.keywords },
				],
				// Google / Search Engine Tags
				// [
				// 	{ attr: "data-hid", value: metaSettings.name },
				// 	{ attr: "name", value: "name" },
				// 	{ attr: "content", value: metaSettings.name },
				// ],
				// [
				// 	{ attr: "data-hid", value: metaSettings.description },
				// 	{ attr: "name", value: "description" },
				// 	{ attr: "content", value: metaSettings.description },
				// ],
				// [
				// 	{ attr: "itemprop", value: "image" },
				// 	{ attr: "content", value: metaSettings.image },
				// 	{ attr: "data-hid", value: metaSettings.image },
				// ],

				// Facebook Meta Tags
				[
					{ attr: "data-hid", value: "og:site_name" },
					{ attr: "name", value: "og:site_name" },
					{ attr: "property", value: "og:site_name" },
					{ attr: "content", value: metaSettings.site_name },
				],
				[
					{ attr: "data-hid", value: "og:url" },
					{ attr: "name", value: "og:url" },
					{ attr: "property", value: "og:url" },
					{ attr: "content", value: metaSettings.url },
				],
				[
                    { attr: "data-hid", value: "og:type" },
					{ attr: "name", value: "og:type" },
					{ attr: "property", value: "og:type" },
					{ attr: "content", value: metaSettings.type },
				],
				[
                    { attr: "data-hid", value: "og:title" },
					{ attr: "name", value: "og:title" },
					{ attr: "property", value: "og:title" },
					{ attr: "content", value: metaSettings.name },
				],
				[
					{ attr: "data-hid", value: "og:description" },
					{ attr: "name", value: "og:description" },
					{ attr: "property", value: "og:description" },
					{ attr: "content", value: metaSettings.description },
				],
				[
					{ attr: "data-hid", value: "og:image" },
					{ attr: "name", value: "og:image" },
					{ attr: "property", value: "og:image" },
					{ attr: "content", value: metaSettings.image },
				],

				// Twitter Meta Tags
				[
					{ attr: "data-hid", value: "twitter:site" },
					{ attr: "name", value: "twitter:site" },
					{ attr: "property", value: "twitter:site" },
					{ attr: "content", value: metaSettings.twitter_site },
				],
				[
					{ attr: "data-hid", value: "twitter:card" },
					{ attr: "name", value: "twitter:card" },
					{ attr: "property", value: "twitter:card" },
					{ attr: "content", value: metaSettings.card },
				],
				[
					{ attr: "data-hid", value: "twitter:title" },
					{ attr: "name", value: "twitter:title" },
					{ attr: "property", value: "twitter:title" },
					{ attr: "content", value: metaSettings.name },
				],
				[
					{ attr: "data-hid", value: "twitter:description" },
					{ attr: "name", value: "twitter:description" },
					{ attr: "property", value: "twitter:description" },
					{ attr: "content", value: metaSettings.description },
				],
				[
					{ attr: "data-hid", value: "twitter:image" },
					{ attr: "name", value: "twitter:image" },
					{ attr: "property", value: "twitter:image" },
					{ attr: "content", value: metaSettings.image },
				],
				// Add robots meta tag
				[
					{ attr: "data-hid", value: "robots" },
					{ attr: "name", value: "robots" },
					{ attr: "content", value: `${metaSettings.robot_index || "noindex"},${metaSettings.robot_follow || "nofollow"}` },
				],
			];

			meta.map((item) => {
				const meta = document.createElement("meta");

                meta.setAttribute('data-n-head', 1)
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

		redirectAuth() {
			var isAuthenticated = localStorage.getItem("access_token");

			if (isAuthenticated) {
				this.$router.push("dashboard");
			} else if (!isAuthenticated) {
				this.$router.push("login");
			} else {
				this.$router.push("err");
			}
		},

		async setCurrentRoute() {
			var route = await this.currentRouteName;
			var routeArray = route.split("/");
			routeArray.shift()

			this.routeName = routeArray[1];

			// console.log('ROUTENAME: ' + this.routeName);
			// console.log('ROUTEARRAY: ' + routeArray[1]);
		},

		permission() {
			if (Notification.permission === "granted") {
				this.configFCM();
			} else {
				var ini = this;
				Notification.requestPermission().then(function (permission) {
					// If the user accepts, let's create a notification
					// console.log("request")
					if (permission === "granted") {
						ini.configFCM();
						// var notification = new Notification("Hi there!");
					}
				});
			}
		},

		configFCM() {
			try {
				firebase
					.messaging()
					.requestPermission()
					.then(() => {
						console.log("Notification permission granted");
						firebase
							.messaging()
							.getToken()
							.then((token) => {
								// window.console.log("token ", token);
								this.setFCM(token);
								this.receiveMessage();
							});
					})
					.catch((err) => {
						console.error("Unable to get token ", err);
					});
			} catch (e) {
				console.error(e);
			}
		},

		async setFCM(token) {
			await this.$store.dispatch("Auth/updateFCMr", {
				fcm: token,
			});
		},

		receiveMessage() {
			try {
				firebase.messaging().onMessage((payload) => {
					const notificationTitle = payload.data.senderName;
					const notificationOptions = {
						body: payload.data.message,
						icon:
							payload.data.senderPhoto == null ||
							payload.data.senderPhoto == "" ||
							payload.data.senderPhoto == undefined
								? "@/static/logo.png"
								: payload.data.senderPhoto,
						vibrate: [200, 100, 200, 100, 200, 100, 200],
						tag: "vibration-sample",
					};
					var notification = new Notification(
						notificationTitle,
						notificationOptions
					);
					notification.onclick = function (event) {
						event.preventDefault(); // prevent the browser from focusing the Notification's tab
						window.open(`${this.BASE_URL}dashboard/`, "_blank");
						notification.close();
					};
				});
			} catch (e) {
				console.error(e);
			}
		},
		async checkAppVersion() {
            await this.$store.dispatch('Sass/checkAppVersion')

            const appVer = localStorage.getItem('appVersion')

            if (!appVer || appVer === null || appVer !== this.appVersion) {
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
	watch: {
		currentRouteName() {
			this.setCurrentRoute();
		},
	},
};
</script>

<style lang="scss">
</style>