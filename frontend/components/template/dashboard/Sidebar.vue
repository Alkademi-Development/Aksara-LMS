<template>
    <nav
        id="sidenav-main"
        class="sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white"
    >
        <div class="sidenav-header px-4 pb-4">
            <SidebarBrand
                :to='layoutActive == `pesilat` ? `https://alkademi.id/pesilat` : `/`'
                :minimize="false"
            />

            <ProfileNavItem />
        </div>

        <div class="sidenav-body scrollbar-inner">
            <div class="navbar-inner">
                <div class="collapse navbar-collapse" id="sidenav-collapse-main">
                    <ul class="navbar-nav" v-for="(nav, index) in computedSidebar" :key="index">
                        <SidebarNavDropdown
                            v-if="nav._name == 'SidebarNavDropdown'"
                            :name="nav.name"
                            :route="nav.route"
                            :icon="nav.icon"
                            :roles="nav.roles"
                            :items="nav.sub"
                            :color="nav.color"
                            :routeName="routeName"
                            :isActive="activeRoute(nav?.to)"
                        />

                        <li v-if="nav._name == 'divider'" class="nav-item">
                            <hr class="divider-menu my-3">
                        </li>

                        <SidebarNavItem
                            v-if="nav._name == 'SidebarNavItem'"
                            :name="nav.name"
                            :to="nav.to"
                            :icon="nav.icon"
                            :roles="nav.roles"
                            :color="nav.color"
                            :isActive="activeRoute(nav?.to)"
                            :isLocked="!servicesState?.isHaveSchool && sassState.isSchoolCase && role == 'student' ? true : false"
                        />
                    </ul>

                    <!-- <ul v-if="userKind !== 'student'" class="navbar-nav">
                        <li class="nav-item">
                            <hr class="divider-menu my-3">
                        </li>
                    </ul> -->

                    <ul v-if="userKind === 'admin' || userKind === 'superadmin'" class="navbar-nav">
                        <li class="nav-item">
                            <nuxt-link class="nav-link" to="/dashboard/settings/">
                                <i :class="['ri-icon ri-settings-line', activeRoute('/dashboard/settings/') && 'text-primary']"></i>
                                <span class="nav-link-text">Pengaturan</span>
                            </nuxt-link>
                        </li>
                    </ul>

                    <ul v-if="userKind === 'admin' || userKind === 'superadmin'" class="navbar-nav">
                        <li class="nav-item">
                            <hr class="divider-menu my-3">
                        </li>
                    </ul>

                    <!-- <ul v-if="userKind === 'admin' || userKind === 'superadmin'" class="navbar-nav">
                        <li class="nav-item">
                            <nuxt-link class="nav-link" to="/dashboard/newsletter/">
                                <i :class="['ri-icon ri-newspaper-line', activeRoute('/dashboard/newsletter/') && 'text-primary']"></i>
                                <span class="nav-link-text">Newsletter</span>
                            </nuxt-link>
                        </li>
                    </ul> -->

                    <ul v-if="settings?.helpdesk" class="navbar-nav mb-md-3">
                        <li class="nav-item">
                            <a class="nav-link" target="_blank" :href="settings?.helpdesk">
                                <i class="ri-icon ri-question-line"></i>
                                <span class="nav-link-text">Bantuan</span>
                            </a>
                        </li>
                    </ul>

                </div>
            </div>
        </div>

        <div class="sidenav-footer">
            <p class="text-copy">
                &copy; {{ year }} {{ settings != null ? settings?.title : "" }}
                <br>
                <strong v-if="host != 'alkamedia.id' && host != 'dev.alkamedia.id'" >
                    <a href="https://alkademi.id/" target="_blank" class="alkamedia-link">Powered by Alkademi</a>
                </strong>
            </p>
        </div>
    </nav>
</template>

<script>
import { mapState } from "vuex";

import SidebarBrand from "@/components/template/micro/menu/SidebarBrand.vue"
import SidebarNavDropdown from "@/components/template/micro/menu/SidebarNavDropdown.vue"
import SidebarNavItem from "@/components/template/micro/menu/SidebarNavItem.vue"
import sidebar from "@/static/dashboard/assets/js/components/template/_nav"
import ProfileNavItem from "../micro/menu/ProfileNavItem.vue";
import appToken from '~/api/app-token';

export default {
    sidebar,
    components: {
    SidebarBrand,
    SidebarNavDropdown,
    SidebarNavItem,
    ProfileNavItem
},
    props: {
        role: {
            type: String,
            default: 'default'
        },
        layoutActive: {
            type: String,
            default: 'default'
        },
    },
    data() {
        return {
            userKind: localStorage.getItem('user_kind'),
            settings: this.$store.state.Sass.settings || null,
            host: document.location.host,
            routeName: '',
            year: new Date().getFullYear()
        }
    },
    watch: {
        currentRouteName() {
            this.setCurrentRoute()
        }
    },
    mounted() {
        this.setCurrentRoute()
    },
    computed: {
        ...mapState({
            sassState: (state) => state.Sass,
            servicesState: (state) => state.Services,
        }),
        currentRouteName() {
            return this.$route.fullPath;
        },
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
    methods: {
        activeRoute(navRoute) {
            const route = this.$route?.fullPath?.split("/")
            const path = navRoute?.split('/')
            if (route?.length > 2 && path?.length > 2) {
                if (route[2] === path[2]) return true
                else false
            } else {
                if (route[1] === path[1] && route[2] === "") return true
                else false
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
        setCurrentRoute() {
            this.routeName  = this.currentRouteName
        },
    }
}
</script>

<!-- <style lang="css" scoped>
    /* Hide scrollbar for Chrome, Safari and Opera */
    #sidenav-main::-webkit-scrollbar {
        display: none;
    }

    #sidenav-main {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

    .divider-menu {
        margin: 0 1.5rem;
    }
</style> -->

<style lang="scss" scoped>
    @import '@/assets/scss/layouts/sidebar.scss';
</style>