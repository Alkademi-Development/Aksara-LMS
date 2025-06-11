<template>
    <div v-if="isLoaded && !isMaintenance">
        <Nuxt />
    </div>
    <div v-else class="d-flex justify-content-center align-items-center vh-100">

		<img :src="`/dashboard/assets/image/loading.svg`" alt="Loading..." style="max-width: 100px;">

	</div>
</template>


<script>
import { mapState } from 'vuex'
import appToken from "~/api/app-token"

export default {
    data() {
        return {
            isAuthenticated: false,
            BASE_URL: process.env.baseURL,
            role: null,
            screenWidth: 0,

            isToggled: false,
            isMobile: false,
            isChatsOpen: false,
            isFloatShow: false,
            isMaintenance: false,
            isModalOpen: false,
            isUserPermission: false,
            modalExpiredSession: false,
            newMessage: 0,
            reloadMessage: 0,
            readedMessage: 0,
            onChatingID: -1,

            isLoaded: false,
            cdnHost: process.env.cdnHost,
            userName: "A",

            settings: {
                title: document.location.hostname.split('.')[0],
                logoDark: null,
                logoLight: null,
                favicon: process.env.cdnHost + 'themes/static/assets/img/logos/alkademi-fav.png',
                layout: null,
                isMaintenance: false,
                listMenu: ["dashboard", "schedules", "program", "module", "class", "test", "certificate", "raport", "form", "studio"],
                css: {
                    ft_primary: 'Raleway',
                    ft_secondary: 'Inter',
                    clr_primary: '#2096C4',
                    clr_secondary: '#2F80ED',
                    clr_success: '#2dce89',
                    clr_info: '#11cdef',
                    clr_warning: '#fb6340',
                    clr_danger: '#f5365c',
                    clr_light: '#adb5bd',
                    clr_dark: '#212529',
                },
                meta: {
					name: "",
					description: "",
					keywords: "",
					type: "",
					image: "",
					card: "",
					site_name: "",
					url: "",
					twitter_site: "",
				},
            }
        }
    },

    head() {
        return {
            title: `Profil ${this.settings.title.replace(/\s/g, '') != '' ? `| ${this.settings.title}` : '' }`,
            link: [
                { hid: "icon", rel: "icon", type: "image/x-icon", href: this.settings.favicon },
				{ hid: "shortcut-icon", rel: "shortcut icon", type: "image/x-icon", href: this.settings.favicon },
            ]
        }
    },

    created() {
        this.isUserPermission = this.authState.userPermission ?? false
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
        this.fetchSettings();
    },
    mounted() {
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'G-8H1TCBHYM9');
	},
    computed: {
        ...mapState({
            authState: (state) => state.Auth,
            servicesState: (state) => state.Services,
            sassState: (state) => state.Sass,
            sidebarState: (state) => state.Sidebar,
            appVersion: (state) => state.Sass?.appVersion,
            isTokenValid: (state) => state.Sass?.isTokenValid,
        }),
        currentRouteName() {
            return this.$route.fullPath;
        },
    },
    watch: {
        screenWidth() {
            if (this.screenWidth < 1200 && this.screenWidth > 480){
                this.isToggled = true
                
                this.isMobile = false
            } else if(this.screenWidth < 480) {
                this.isMobile = true

                this.isToggled = true
            } else {
                this.isMobile = false

                this.isToggled = false
            }
        },
        currentRouteName() {
            if (this.screenWidth < 1200 && this.screenWidth > 480) {
                this.onPinSidenav()
            }
        }
    },
    methods: {
        async fetchSettings() {
            // Wait until appToken.code or appToken.generatedToken() is filled
			while (!await appToken?.getCode() && !await appToken?.generatedToken()) {
				await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 100 milliseconds
			}

			await this.checkAppVersion()
            await this.$store.dispatch("Sass/lmsId", { version: "v0" });
            await this.$store.dispatch('Sass/allSettings', { version: "v0" })

            if (!this.sassState.status) {
                console.error('Error get all sass settings: ', this.sassState.message)
                this.setupSettings(false)
            } else {
                // console.log('settings', JSON.stringify(this.sassState.settings) == '{}')
                if (this.sassState.settings == null || JSON.stringify(this.sassState.settings) == '{}') this.setupSettings(false)
                else this.setupSettings(true)
            }
        },
        setupSettings(isDefault) {
            if (isDefault) {
                // Setup Setting Variable

                const dataSettings = this.sassState.settings

                // Setup Meta
                this.settings.title = dataSettings.title ?? ''
                this.settings.logoDark = dataSettings.logo_dark ?? ''
                this.settings.logoLight = dataSettings.logo_light ?? ''
                this.settings.favicon = dataSettings.favicon ?? ''
                this.settings.layout = dataSettings.layout ?? null
                this.settings.isMaintenance = dataSettings.isMaintenance ?? true

                // Setup CSS Variable
                this.settings.css = dataSettings.css ?? ''

            }

            // Implement Setting
            localStorage.setItem('title', this.settings.title)
            this.loadStyleConfig();

            const layout = this.settings.layout

            if (layout == 'umptn' && this.role == 'student') this.isFloatShow = true

            // Maintenance Handle
            this.isMaintenance = this.settings.isMaintenance
            // if (layout == 'alkademi' || layout == 'jambore' || layout == 'umptn' || layout == 'farcapital') this.isMaintenance = false
            // else this.isMaintenance = true

            setTimeout(() => {
                if (this.isMaintenance) window.location.replace(window.location.origin)
                this.isLoaded = true
            }, 2000);

            // console.log("SETTINGS: ", this.settings)
        },
        loadStyleConfig() {
			// Root Variable
			const root = document.querySelector(":root");
            const cssSettings = this.settings.css

			// Font Name
			var ft_primary = cssSettings.ft_primary
			var ft_secondary = cssSettings.ft_secondary

			if(ft_primary.replace(/\s/g, '') != "") {
				let fontP = document.createElement("link");
				fontP.rel = "stylesheet";
				fontP.href = 'https://fonts.googleapis.com/css2?family=' + ft_primary.replace(/\s/g, '+') + ':wght@300;400;500;600;700&display=swap';

				document.head.appendChild(fontP);
			}

			if(ft_secondary.replace(/\s/g, '') != "") {
				let fontS = document.createElement("link");
				fontS.rel = "stylesheet";
				fontS.href = 'https://fonts.googleapis.com/css?family=' + ft_secondary.replace(/\s/g, '+') + ':wght@300;400;500;600;700&display=swap';

				document.head.appendChild(fontS);
			}

			// Change Font Family
			root.style.setProperty("--bs-font-heading", `${ft_primary}, sans-serif`);
			root.style.setProperty("--bs-font-paragraph", `${ft_secondary}, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`);

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
        handleResize() {
            this.screenWidth = window.innerWidth;
        },

        onPinSidenav() {
            this.isToggled = !this.isToggled
        },

        toggleChats() {
            this.isChatsOpen = !this.isChatsOpen
        },

        permission() {
            if (Notification.permission === 'granted') {
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
                        this.setFCM(token)
                        this.receiveMessage();
                        });
                    })
                    .catch((err) => {
                    console.log("Unable to get token ", err);
                    });
            } catch (e) {
                console.log(e);
            }
        },

        async setFCM(token) {
            await this.$store.dispatch("Auth/updateFCM", {
                fcm: token,
            });
        },

        loadChats() {
            this.readedMessage += 1
            // console.log("Load", this.readedMessage)
        },

        onChatingId(id) {
            // console.log("ChatId: ", id)
            this.onChatingID = id
        },

        receiveMessage() {
            try {
                firebase.messaging().onMessage((payload) => {
                    console.log("payload: ", payload)

                    if(this.onChatingID != payload.data.groupId) {
                        // console.log('Notif Show', this.onChatingID, payload.data.groupId)
                        this.newMessage += 1
                        // console.log("NEW", this.newMessage)

                        const notificationTitle = payload.data.senderName;
                        const notificationOptions = {
                            body: payload.data.message,
                            icon: payload.data.senderPhoto == null || payload.data.senderPhoto == "" || payload.data.senderPhoto == undefined ? '@/static/logo.png' : payload.data.senderPhoto,
                            vibrate: [200, 100, 200, 100, 200, 100, 200],
                            tag: 'vibration-sample'
                        };

                        var notification = new Notification(notificationTitle, notificationOptions);
                        notification.onclick = function(event) {
                            event.preventDefault(); // prevent the browser from focusing the Notification's tab
                            window.open(`${this.BASE_URL}dashboard/` , '_blank');
                            notification.close();
                        }
                    } else {
                        this.reloadMessage += 1
                    }
                })
            } catch (e) {
                console.error(e)
            }
        },
        async checkAuthSession() {
            // await this.$store.dispatch('Auth/getCurrentSession');

            // if (!this.authState.session) {

            //     localStorage.clear()
            //     window.open(window.location.origin, "_self")
            //     this.isAuthenticated = false

            // } else {
                this.isAuthenticated = true
            // }
        },
        async logout() {
            
            const redirectTo = "?redirectTo=" + (this.layoutActive == `pesilat` ? `https://alkademi.id/pesilat` : window.location.origin)
            const alkademiAuth = process.env.alkademiAuth + "/logout"
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

            const url = alkademiAuth + redirectTo + lmsId + codeToken + generatedToken

            localStorage.clear()
            window.location.replace(url)
            
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

    destroyed() {
        window.removeEventListener('resize', this.handleResize)
    },
}
</script>