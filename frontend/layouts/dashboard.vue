<template>
    <div
        v-if="isLoaded && !isMaintenance && isUserPermission"
        id="dashboard"
        :class="[ stateSidebar === 'pinned' ? 'g-sidenav-show g-sidenav-pinned' : 'g-sidenav-hidden' ]"
    >
        <Sidebar
            v-if="isAuthenticated"
            :role="role"
            :layoutActive="settings.layout"
        />
        <!-- Main content -->
        <div
            :class="['main-content bottom-space', isMobile && role != 'superadmin' && role != 'admin' && isAuthenticated ? 'bottom-space' : '']"
            id="panel"
        >
            <!-- Top Nav -->
            <TopHeaderDashboard
                v-if="isTopHeaderDashboard && isAuthenticated"
                :isMobile="isMobile"
                :role="role"
                :newMessage="newMessage"
                :readedMessage="readedMessage"
                :layoutActive="settings.layout"
                :userName="userName"
                :showChatDrawer="true"
                @onPinSidenav="onPinSidenav"
                @toggleChats="toggleChats"
                @modalOpen="isModalOpen = $event"
            />

            <TopHeader
                v-if="!isTopHeaderDashboard && isAuthenticated && !isModule"
                breadcrumb
                :title="handleTitleName()"
                :tabs="dataTabs.includes($route?.name)"
                :filter="dataFilters.includes($route?.name)"
                :action="actionButtonIndex"
                :isMobile="isMobile"
                :role="role"
                :showChatDrawer="showChatDrawer"
                @onPinSidenav="onPinSidenav"
                @toggleChats="toggleChats"
            />

            <Nuxt v-if="isAuthenticated" />
        </div>

        <BottomBar
            v-if="isMobile && role != 'superadmin' && role != 'admin' && role != 'writer' && isAuthenticated"
            :isLocked="!servicesState?.isHaveSchool && sassState.isSchoolCase && role == 'student' ? true : false"
            :layoutActive="settings.layout"
            :role="role"
        />

        <div v-if="isFloatShow" :class="['float-button', isMobile ? 'mobile' : '']">
            <a href="https://t.me/+TLVLGDecGaFmZTQ1" target="_blank" class="btn btn-icon btn-primary">
                <i class="fas fa-comment-dots mr-2"></i>
                <span class="btn-inner--text m-0">Help Desk</span>
            </a>
        </div>

        <b-modal v-model="isModalOpen" hide-header hide-footer no-close-on-backdrop no-close-on-esc centered size="md">

          <div class="text-center mb-3">
            <h3>Lengkapi Profil Anda!</h3>
            <span><span class="font-weight-bold">Isi data dengan benar!</span> Karena data ini tidak bisa diubah lagi.</span>
          </div>

          <ModalRequiredForm
            :user="detailUser"
            :layoutActive="settings.layout"
            @modalOpen="isModalOpen = $event"
          />

        </b-modal>

    </div>

    <ErrorPage v-else-if="isLoaded && !isMaintenance && !isUserPermission" :page404="true" />

    <div v-else class="d-flex justify-content-center align-items-center vh-100">

		<img :src="`/dashboard/assets/image/loading.svg`" alt="Loading..." style="max-width: 100px;">

        <b-modal id="modalExpiredSession" v-model="modalExpiredSession" size="sm" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center mb-4">
                <p class="mb-0">Maaf gagal memuat data pengguna!</p>
            </div>
            <div class="d-flex align-items-center justify-content-end">
                <b-button variant="primary" block @click="logout">Login Ulang</b-button>
            </div>
        </b-modal>

	</div>
</template>

<script>
import { DATA_TABS, DATA_FILTERS, ACTION_BUTTON_HEADER } from '@/commons/constants/layouts.js'
import { mapActions, mapState } from 'vuex'
import appToken from "~/api/app-token"

import TopHeader from "@/components/template/dashboard/TopHeader.vue"
import Sidebar from "@/components/template/dashboard/Sidebar.vue"
import BottomBar from "@/components/template/dashboard/mobile/BottomBar.vue"
import ModalRequiredForm from "@/components/template/micro/form/ModalRequiredForm.vue";
import TopHeaderDashboard from '@/components/template/dashboard/TopHeaderDashboard.vue'

export default {
    middleware: ['userAccess', "accessRoute"],
    components: {
        TopHeader,
        Sidebar,
        BottomBar,
        // Chats,
        ModalRequiredForm,
        TopHeaderDashboard,
    },
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

            isModule: null,

            isDashboard: this.$route.name == 'Dashboard',

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
            },
            detailUser: null,

            // Session
            stateOfSession: [], // value between ( pause / continue )
            isProcessingSession: false,
            isEndSession: false,
        }
    },

    head() {
        return {
            title: `Dashboard ${this.settings.title.replace(/\s/g, '') != '' ? `| ${this.settings.title}` : '' }`,
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
            roleSidebar: (state) => state.Sidebar,
            stateSidebar: (state) => state.Layouts?.stateSidebar,
            classroomTitle: (state) => state.Services?.classroomDetail?.name,
            listMenuState: (state) => state.Sass?.settings?.listMenu,
            appVersion: (state) => state.Sass?.appVersion,
            isTokenValid: (state) => state.Sass?.isTokenValid,
            schoolsState: (state) => state.Schools
        }),
        currentRouteName() { return this.$route.fullPath },
        dataTabs() { return DATA_TABS },
        dataFilters() { return DATA_FILTERS },
        actionButtonIndex() {
            const arrActionButton = ACTION_BUTTON_HEADER;
            const currentRouteName = this.$route.name;

            const findActionButton = arrActionButton?.findIndex((action) => action?.routeName === currentRouteName )


            return arrActionButton?.[findActionButton]
        },
        showChatDrawer() {
            const arrListMenu = [...this.listMenuState]

            const isChatShowed = arrListMenu?.findIndex((menu) => menu === 'chat') > -1

            return isChatShowed
        },
        isTopHeaderDashboard(){
            return this.$route?.name === 'Dashboard' || this.$route?.name === 'Dashboard-Statistic';
        }
    },
    watch: {
        screenWidth() {
            if (this.screenWidth > 1200){
                this.setStateSidebar('pinned')

                this.isMobile = false
            } else if(this.screenWidth < 480) {
                this.isMobile = true

                this.setStateSidebar('closed')
            } else {
                this.isMobile = false

                this.setStateSidebar('closed')
            }
        },
        currentRouteName() {
            if (this.screenWidth < 1200) {
                if(this.stateSidebar === 'pinned') this.onPinSidenav()
            }
        },
        $route() {
            this.isDashboard = this.$route.name == 'Dashboard'
        }
    },
    methods: {
        ...mapActions({
            setStateSidebar: 'Layouts/setStateSidebar'
        }),
        handleTitleName() {
            let arrRouteName = this.$route?.name?.split('-')
            let name = arrRouteName?.[arrRouteName?.length - 1]

            if (this.$route.name === 'Dashboard-Classroom-classroom') name = this.classroomTitle
            else if (this.$route.name === 'Dashboard-Classroom-Requirements-code') name = "Persyaratan"
            else if (this.$route.name === 'Dashboard-Schools-Students-id' || this.$route.name === 'Dashboard-Schools-Edit-id'){
                name = this.schoolsState?.schoolName || "";
            } else if (
                this.$route.name === 'Dashboard-Profile' ||
                this.$route.name === 'Dashboard-Profile-Raport-classSlug-View-classroomId' ||
                this.$route.name === 'Dashboard-Profile-Certificate-classSlug-View-classroomId'
            ) name = "";
            else if(
                this.$route.name === 'Dashboard-Classroom-classroom-course-course-assignment-assignment'
            ) name = "materi";


            if (name?.toLowerCase() === 'create') {
                name = `${name} ${arrRouteName?.[arrRouteName?.length - 2]}`
            }else if (name?.toLowerCase() === 'edit') {
                // name = `${name} ${arrRouteName?.[arrRouteName?.length - 3]}` //
            }else {
                name = name
            }

            return name
        },
        isEligableTierZero() {
          return !this.detailUser?.phone
          || !this.detailUser?.name?.trim()
          || this.isOnlyNil(this.detailUser?.name)
          || !this.detailUser?.itb?.nim
          || !this.detailUser?.itb?.dptb
          && this.detailUser?.itb?.tier == 0;
        },
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
                else this.getUserDetail()
            }, 500);

            // console.log("SETTINGS: ", this.settings)
        },
        async getUserDetail() {
            await this.$store.dispatch('Services/authorize');

            if (!this.servicesState.status) {
                console.error('Failed to fetch user detail', this.servicesState.message);
                this.modalExpiredSession = true
                this.isAuthenticated = false
                this.isLoaded = false;
                // this.logout()
            } else {
                this.userName = this.servicesState.detail_auth.name[0];
                this.detailUser = this.servicesState?.detail_auth;

                // set role
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

                this.role = localStorage.getItem('user_kind') == null ? this.roleSidebar.role : localStorage.getItem('user_kind')

                this.user = JSON.parse(localStorage.getItem('user'));

                // set modal
                if (this.user.kind == 4) {
                    const cityId = this.servicesState.detail_auth.cityId;
                    if (this.settings?.layout === 'belajarbersamapuja') {
                      if (this.isEligableTierZero()) this.isModalOpen = true;
                    } else {
                      if (cityId == -1 || !this.detailUser?.name?.trim() || this.isOnlyNil(this.detailUser?.name) || !this.detailUser?.birthDate) {
                          // this.$emit('modalOpen', true)
                          this.isModalOpen = true;
                      }
                    }
                }

                // loading handler
                this.isAuthenticated = true
                this.isLoaded = true;
            }
            // this.getAnnouncementList();
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

            // Muted Color Style
            root.style.setProperty("--bs-muted-primary", cssSettings.clr_primary + '25')
		},
        handleResize() {
            this.screenWidth = window.innerWidth;
        },

        onPinSidenav() {
            this.setStateSidebar(this.stateSidebar === 'pinned' ? 'closed' : 'pinned')
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

        // Session Statistic
        // Handler session
        handleVisibilityChange(){
            // When Open other tab or application
            if(document.hidden && !this.isEndSession) this.stateOfSession.push("pause");
            // When reopen the LMS
            else if(!document.hidden) this.stateOfSession.push("continue"), this.isEndSession = false;
        },

        // some functions to fetch session
        async initiateSession(){
            const sessionId = sessionStorage.getItem("_sid");

            if(sessionId) await this.fetchContinueSession();
            else await this.fetchStartSession();

             // track user activity when leaving and entering the application
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        },
        async fetchStartSession(){
            await this.$store.dispatch("Statistics/startSessionV2");
            if(!this.statisticsState?.status){
                console.error("Failed to fetch session : " + this.statisticsState?.message);
            }else{
                sessionStorage.setItem("_sid", this.statisticsState?.session?.uuid);
            }
        },
        async fetchPauseSession(){
            this.isProcessingSession = true;
            const sessionId = sessionStorage.getItem("_sid");
            if(sessionId){
                await this.$store.dispatch("Statistics/pauseSessionV2", sessionId);
                if(!this.statisticsState?.status){
                    console.error("Failed to fetch session : " + this.statisticsState?.message);
                    this.isProcessingSession = false;
                }else this.isProcessingSession = false;
            } else this.isProcessingSession = false;
        },
        async fetchContinueSession(){
            this.isProcessingSession = true;
            const sessionId = sessionStorage.getItem("_sid");
            if(sessionId){
                await this.$store.dispatch("Statistics/continueSessionV2", sessionId);
                if(!this.statisticsState?.status){
                    console.error("Failed to fetch session : " + this.statisticsState?.message);
                    this.isProcessingSession = false;
                }else this.isProcessingSession = false;
            }else this.isProcessingSession = false;
        },
        async fetchEndSession(){
            const sessionId = sessionStorage.getItem("_sid");

            // add keep alive option to keep finish fetch although tab or browser close
            await this.$store.dispatch("Statistics/endSessionV2", {
                sessionId,
                customConfig: {
                    keepAlive: true,
                }
            });

            if(!this.statisticsState?.status) console.error("Failed to fetch session : " + this.statisticsState?.message);
        },

        // RADYA GPT
        async initiateRadyaData(){
            const token = getCookie("radyagpt_token");
            if(!token) this.fetchIdentityLogin();
            else if(token) this.fetchIdentityMe();
        },
        async fetchIdentityLogin(){
            const params = {
                username: "hanif",
                password: "Kauman.21"
            };

            await this.$store.dispatch("Radyagpt_identity/fetchIdentityLogin", params);

            if(!this.radyaGptIdentityState?.identityLogin?.status){
                console.error(this.radyaGptIdentityState.identityLogin?.message);
            }else{
                const loginData = this.radyaGptIdentityState.identityLogin?.data;
                const expiry = loginData.expiry; // nilai expiry dari JSON
                const now = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
                const maxAge = expiry - now; // Hitung selisihnya

                setCookie({
                    'radyagpt_token': loginData.access_token,
                    maxAge,
                    path: "/",
                });

                setCookie({
                    'radyagpt_refresh_token': loginData.refresh_token,
                    maxAge: ONE_MONTH,
                    path: "/",
                });

                this.fetchIdentityMe();
            }
        },
        async fetchIdentityMe(){
            await this.$store.dispatch("Radyagpt_identity/fetchIdentityMe");

            if(!this.radyaGptIdentityState?.identityMe?.status){
                console.error(this.radyaGptIdentityState?.identityMe?.message);
            }else{
                const userDetail = this.radyaGptIdentityState.identityMe?.data;
                setCookie({
                    'radyagpt_user': JSON.stringify(userDetail),
                    maxAge: ONE_MONTH,
                    path: "/"
                })
            }
        },

        isOnlyNil(str) {
            return /^(\s*<nil>\s*)+$/i.test(str);
        }
    },
    beforeDestroy(){
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize)
    },
}
</script>

<style>
.bottom-space {
    margin-bottom: 86px !important;
}
.float-button {
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    z-index: 1040;
}
.float-button.mobile {
    margin-bottom: 70px;
}
.float-button i {
    font-size: 1.2rem !important;
}
.float-button i, .float-button .btn-inner--text {
    font-size: 1.2rem !important;
}
</style>
