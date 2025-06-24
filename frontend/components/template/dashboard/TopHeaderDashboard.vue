<template>
    <!-- Topnav -->
    <div class="bg-primary top-header position-sticky sticky-top">

        <nav :class="['navbar navbar-top navbar-expand navbar-dark']">
            <div class="container-fluid">

                <h1 v-if="!isMobile" class="text-white text-welcome">Selamat Datang, {{ servicesState.detail_auth != null ? servicesState.detail_auth.name : user != null ? user.name : '' }}</h1>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">

                    <div v-if="isMobile" class="brand">
                        <div class="navbar-nav navbar-mobile align-items-center">
                            <a href="/">
                                <img v-if="srcLogoLight != null && srcLogoLight != 'null' && srcLogoLight != ''" :src="srcLogoLight" class="logo-head" alt="...">
                                <h1 v-else class="m-0 text-white">{{title}}</h1>
                            </a>
                        </div>
                    </div>

                    <!-- Navbar links -->
                    <ul :class="['navbar-nav align-items-center ml-auto']">


                        <!-- Logo Brand on Mobile -->
                        <!-- <li v-if="isMobile" class="navbar-nav navbar-mobile align-items-center">
                            <a href="/" class="logo"><img src="@/assets/img/brand/logo.png" alt="..."></a>
                        </li> -->

                        <div
                            v-if="showChatDrawer"
                            id="button-chats-header"
                            class="toggle-chats pointer"
                            @click="toggleChats"
                        >
                            <b-avatar variant="none">
                                <i class="ri-chat-3-line primary"></i>
                            </b-avatar>
                        </div>

                        <!-- Sidenav toggler -->
                        <li v-if="!isMobile" class="nav-item d-xl-none">
                            <div class="pr-3 sidenav-toggler sidenav-toggler-dark" data-action="sidenav-pin" data-target="#sidenav-main" @click="onClickMenu">
                                <div class="sidenav-toggler-inner">
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                                </div>
                            </div>
                        </li>

                        <!-- Announcement -->
                        <li class="nav-item dropdown">

                            <a v-if="isAnnouncementLoaded" class="nav-link d-flex align-item-center px-2 px-sm-3" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-bell"></i>
                                <span v-if="announcementState.authAnnouncements.data.notReaded > 0" class="badge badge-primary ml-1">{{announcementState.authAnnouncements.data.notReaded}}</span>
                            </a>

                            <div class="py-0 overflow-hidden dropdown-menu dropdown-menu-xl dropdown-menu-right" v-if="isAnnouncementLoaded">

                                <!-- Dropdown header -->
                                <div class="px-3 py-3">
                                    <h6 v-if="announcementState.authAnnouncements.data.notReaded > 0" class="m-0 text-sm text-muted">
                                        <strong class="text-primary">Terdapat {{ announcementState.authAnnouncements.data.notReaded }} pemberitahuan baru</strong>
                                    </h6>
                                    <h6 v-else>
                                        <strong class="text-primary">Tidak ada pemberitahuan baru</strong>
                                    </h6>
                                </div>

                                <!-- List group -->
                                <div class="list-group list-group-flush">
                                    <div
                                        v-for="item in announcementState?.authAnnouncements?.data?.data"
                                        :key="item.id"
                                    >
                                        <div
                                            :class="['cursor-pointer', 'list-group-item', 'list-group-item-action', (item.readed == 0 ? 'bg-light' : '')]"
                                            @click="getAnnouncementDetail(item.id)">

                                            <div class="row align-items-center">
                                                <div class="col">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h4 class="mb-0 text-sm">{{ item.authorName }}</h4>
                                                        </div>
                                                        <div class="text-right text-muted">
                                                            <small>{{ item.created_at | date }}</small>
                                                        </div>
                                                    </div>
                                                    <div class="mb-0 d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <p class="text-sm">{{ item.title }}</p>
                                                        </div>
                                                        <div v-if="item.readed == 0" class="text-right badge badge-pill badge-danger">Belum Dibaca</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="py-0 overflow-hidden dropdown-menu dropdown-menu-xl dropdown-menu-right" v-else>
                                <div class="text-center">
                                    <b-spinner label="memuat data"></b-spinner>
                                </div>
                            </div>
                        </li>

                        <!-- Menu Item on Admin -->
                        <li v-if="isMobile && (role == 'admin' || role == 'superadmin')" class="nav-item dropdown menu-mobile">
                            <a class="nav-link px-2 px-sm-3" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="sidenav-toggler-line bg-white"></i>
                                <i class="sidenav-toggler-line bg-white"></i>
                                <i class="sidenav-toggler-line bg-white"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-right">
                                <!-- <div class="row shortcuts px-4"> -->
                                <div class="row shortcuts p-0 m-0">
                                    <MobileMenu
                                        v-for="(nav, index) in computedSidebar" :key="index"
                                        :type="nav._name"
                                        :name="nav.name"
                                        :icon="nav.icon"
                                        :color="nav.color"
                                        :to="nav.to"
                                    />
                                    <MobileMenu
                                        type="SidebarNavItem"
                                        name="Profil"
                                        icon="ri-user-3-line"
                                        color="gray"
                                        to="/dashboard/profile"
                                    />
                                    <MobileMenu
                                        type="SidebarNavItem"
                                        name="Logout"
                                        icon="ni-user-run"
                                        color="gray"
                                        :isLogout="true"
                                        @isModalLogout="isModalLogout = true"
                                    />
                                </div>
                            </div>
                        </li>

                        <li v-if="role == 'writer'" class="nav-item d-sm-none">
                            <div class="pr-3 sidenav-toggler sidenav-toggler-dark" data-action="sidenav-pin" data-target="#sidenav-main" @click="onClickMenu">
                                <div class="sidenav-toggler-inner">
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                                </div>
                            </div>
                        </li>

                        <li class="d-sm-none" v-if="role != 'admin' && role != 'superadmin' && role != 'writer'">
                            <ProfileMenu />
                        </li>
                    </ul>
                </div>
            </div>

            <b-modal
                hide-footer
                centered
                title="Pemberitahuan"
                size="md"
                body-class="container"
                id="detail-notification"
                v-model="isModalOpen"
                v-if="isModalOpen"
                @hide="closeModal"
            >

                <b-row v-if="isDetailLoaded" class="pb-4">
                    <b-col cols="12">
                        <h1 class="mb-4">
                            {{ announcementState.announcement.title }}
                        </h1>

                        <div class="mb-3" v-html="announcementState.announcement.content"></div>

                        <p><em>{{ announcementState.announcement.created_at | date }}</em></p>
                    </b-col>
                </b-row>

                <b-row v-else>
                    <b-col class="pb-4 text-center">
                        <b-spinner label="memuat data" class="align-middle"></b-spinner>
                    </b-col>
                </b-row>

            </b-modal>
        </nav>

        <h1 v-if="isMobile" class="container-fluid text-white pb-3">
            Selamat Datang, {{ servicesState.detail_auth != null ? servicesState.detail_auth.name : user != null ? user.name : '' }}
        </h1>

        <b-modal id="modalExpiredSession" v-model="modalExpiredSession" size="sm" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center mb-4">
                <p class="mb-0">Maaf sesi login anda berakhir!</p>
            </div>
            <div class="d-flex align-items-center justify-content-end">
                <b-button variant="primary" block @click="logout">Login Ulang</b-button>
            </div>
        </b-modal>

        <!-- <b-modal id="modalConfirmationLogout" v-model="isModalLogout" size="sm" centered hide-header hide-footer>
            <div class="d-flex align-items-center justify-content-center mb-4">
                <p class="mb-0">Apakah anda yakin untuk <strong class="text-danger">logout</strong> sekarang!</p>
            </div>
            <div class="d-flex align-items-center justify-content-end">
                <b-button variant="primary" @click="isModalLogout = false">Batal</b-button>
                <b-button variant="danger" @click="logout">Iya</b-button>
            </div>
        </b-modal> -->

        <b-modal id="modalConfirmationLogout" v-model="isModalLogout" size="sm" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                :title="`Peringatan!`"
                :description="`Apakah anda yakin akan melakukan <strong class='text-danger'>Logout</strong> sekarang?`"
                :btnYesVariant="`danger`"
                :btnNoVariant="`outline-primary`"
                :btnNoTitle="`Tidak`"
                @actionYes="logout"
                @actionNo="isModalLogout = false"
            />
        </b-modal>

    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

import SidebarBrand from "@/components/template/micro/menu/SidebarBrand.vue"
import MobileMenu from "@/components/template/micro/menu/MobileMenu.vue"
import ProfileMenu from "@/components/template/micro/menu/ProfileMenu.vue"
import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue"

import sidebar from "@/static/dashboard/assets/js/components/template/_nav"
import appToken from '~/api/app-token';

// import firebase from "firebase/app";
// import "firebase/messaging";

export default {
    sidebar,
    components: {
        SidebarBrand,
        MobileMenu,
        ProfileMenu,
        ModalConfirmation,
    },
    props: {
        isMobile: Boolean,
        role: String,
        newMessage: {
            type: Number,
            default: 0
        },
        readedMessage: {
            type: Number,
            default: 0
        },
        layoutActive: {
            type: String,
            default: 'default'
        },
        userName: String,
        showChatDrawer: Boolean
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            announcementState: (state) => state.Announcements,
            sassState: (state) => state.Sass,
        }),
        computedSidebar() {
            const listSidebar = sidebar[0]._children
            const settings = this.sassState.settings

            if (!settings.listMenu) settings.listMenu = ["dashboard", "schedules"]

            return listSidebar.filter(item => {

                const menuItem = settings.listMenu.find((menu) => menu == item.slug)

                if (menuItem) {
                    return item.roles.includes(this.role) || item.roles.includes("all")
                } else if (item._name == 'divider') {
                    let showDivider = false

                    item.slug.map((divider) => {
                        if (settings.listMenu.includes(divider)) showDivider = true
                    })

                    if (showDivider) return item.roles.includes(this.role) || item.roles.includes("all")
                }
            })
        },
    },
    data() {
        return {
            LOADMORE: 'loadmore',

            isLoaded: false,
            isAnnouncementLoaded: false,
            isDetailLoaded: false,
            isModalOpen: false,
            isModalLogout: false,
            modalExpiredSession: false,

            user: '',
            name: this.userName,
            unreadedMessage: 0,
            srcLogoLight: '',
            title: document.location.hostname,

            pagination: {
                currentPage: 1,
                perPage: 1,
                totalRows: 1,
                lastPage: 1,
            },
        }
    },
    filters: {
        date: function (value) {
            if (!value) return '';
            return moment(value).locale('ID').fromNow();
        }
    },
    watch: {
        newMessage: function () {
            this.getAllChats()
        },
        readedMessage: function () {
            this.getAllChats()
        }
    },
    mounted() {
        this.getLmsDetail()
        // this.getUserDetail();
        // this.getAnnouncementList();
    },
    methods: {
        getLmsDetail() {
            const dataSettings = this.sassState.settings

            if (dataSettings) {
                this.srcLogoLight = dataSettings.logo_light ?? null
                this.title = dataSettings.title ?? document.location.hostname
            }
            this.isLoaded = true
            // this.getUserDetail()
        },
        async getUserDetail() {
            await this.$store.dispatch('Services/authorize');

            if (!this.servicesState.status) {
                console.error('Failed to fetch user detail', this.servicesState.message);
                this.modalExpiredSession = true
                // this.isLoaded = true;
                // this.logout()
            } else {
                this.name = this.servicesState.detail_auth.name[0];
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

                this.user = JSON.parse(localStorage.getItem('user'));

                if (this.user.kind == 4) {
                    const cityId = this.servicesState.detail_auth.cityId;
                    const name = this.servicesState?.detail_auth?.name;
                    if (cityId == 0 || !name?.trim() || this.isOnlyNil(name)) {
                        this.$emit('modalOpen', true)
                    }
                }
                this.isLoaded = true;
            }
            // this.getAnnouncementList();
        },
        async getAnnouncementList() {
            await this.$store.dispatch('Announcements/fetchAnnouncementAuthList');

            if (!this.announcementState.status) {
                console.error('Failed to fetch announcement list', this.announcementState.message);
                this.isAnnouncementLoaded = false;
            } else {
                this.getAllChats()
                this.isAnnouncementLoaded = true;
            }
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
        async getAnnouncementDetail(id) {
            this.isModalOpen = true;
            this.isDetailLoaded = false;

            try {
                await this.$store.dispatch('Announcements/getAnnouncementById', {
                    id: id
                });

                if (!this.announcementState.status) {
                    console.error('failed fetch announcement detail: ', this.announcementState.message);
                    this.isDetailLoaded = true;
                } else {
                    this.isDetailLoaded = true;
                }
            } catch (error) {
                console.error('failed fetch announcement detail: ', error);
                this.isDetailLoaded = true;
            }
        },
        async getAllChats(type) {
            try {
                await this.$store.dispatch('Chats/allChats', this.pagination.currentPage).then(() => {
                    const response = this.$store.state.Chats

                    if (!response.status) {
                        console.error('failed fetch chats: ', this.chatsState.message);
                    } else {

                        if(type != this.LOADMORE) {
                            this.unreadedMessage = 0
                        }

                        var chats = response.chats

                        this.pagination = response.pagination
                        // console.log(this.pagination)
                        chats.map((item) => {
                            if(item.unreaded >= 1) {
                                this.unreadedMessage += item.unreaded
                            }
                        })

                        if(this.pagination.currentPage < this.pagination.lastPage) {
                            this.pagination.currentPage += 1
                            this.getAllChats(this.LOADMORE)
                        }

                        if (this.pagination.currentPage == this.pagination.lastPage) {
                            this.pagination = {
                                currentPage: 1,
                                perPage: 1,
                                totalRows: 1,
                                lastPage: 1,
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('failed fetch chats: ', error);
            }
        },
        async closeModal () {
            this.isModalOpen = false;
            this.isDetailLoaded = false;
            this.isAnnouncementLoaded = false;
            // await this.getAnnouncementList();
        },
        onClickMenu(){
            this.$emit('onPinSidenav')
        },
        toggleChats() {
            this.$emit('toggleChats')
        },
        isOnlyNil(str) {
            return /^(\s*<nil>\s*)+$/i.test(str);
        }
    }
}
</script>

<style scoped>
.logo-head {
    max-height: 44px;
    max-width: 180px;
}
@media (min-width: 320px) {
    .navbar-top .menu-mobile .dropdown-menu {
        position: absolute;
        right: auto;
        left: 3%;
        width: 94%;
        height: 76vh;
        overflow: overlay;
        min-width: auto;
    }
}
</style>
<style lang="scss">
</style>