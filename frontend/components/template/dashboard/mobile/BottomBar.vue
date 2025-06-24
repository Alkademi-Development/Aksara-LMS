<template>
    <b-navbar type="light" fixed="bottom">
        <b-navbar-nav class="d-flex flex-row justify-content-around w-100">
            <li v-for="(nav, index) in computedSidebar" :key="index">
                <template v-if="nav._name !== 'divider'">
                    <nuxt-link :class="['navigation__link', activeRoute(nav.to) ? 'link__active' : '']" v-if="!isLocked" :key="index" :to="isLocked ? '#' : nav.to" >
                        <div class="d-flex flex-column align-items-center">
                            <i v-if="isLocked" class="fas fa-lock"></i>
                            <i v-else :class="['ni', nav.icon]"></i>

                            <div class="navigation__title mt-1">
                                {{ nav.name == 'Jadwal Kegiatan' ? 'Jadwal' : nav.name == 'Review Tugas' ? 'Review' : nav.name == 'Rekap Nilai' ? 'Rekap' : nav.name }}
                            </div>
                        </div>
                    </nuxt-link >
                </template>
            </li>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
import SidebarBrand from "@/components/template/micro/menu/SidebarBrand.vue"
import SidebarNavDropdown from "@/components/template/micro/menu/SidebarNavDropdown.vue"
import SidebarNavItem from "@/components/template/micro/menu/SidebarNavItem.vue"

import sidebar from "@/static/dashboard/assets/js/components/template/_nav"
import { mapState } from 'vuex'

export default {
    sidebar,
    components: {
        SidebarBrand,
        SidebarNavDropdown,
        SidebarNavItem,
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
        isLocked: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            routeName: '',
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
                } else if (item._name === 'divider') {
                    let showDivider = false
                    
                    if (showDivider) return item.roles.includes(this.role) || item.roles.includes("all")
                }
            })
        },
    },
    methods: {
        setCurrentRoute() {
            var route = this.currentRouteName
            var arr = route.split("/");
            arr.shift()

            this.routeName = '/'+arr[1];
        },
        activeRoute(navRoute) {
            const route = this.$route?.fullPath?.split("/")
            const path = navRoute?.split('/')
            
            if (route?.length > 2 && path?.length > 2) {
                if (route[2] === path[2]) return true
                else false
            } else {
                if (route[1] === path[1] && path[2] === "") return true
                else false
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    @import '/assets/scss/utilities/_colors.scss';

    .navigation__link {
        color: $light;

        &.link__active {
            color: $primary;
        }
    }

    .navbar {
        box-shadow: 2rem 0 2rem 0 rgb(136 152 170 / 15%);
    }

    .bg-light {
        background-color: #fff !important;
    }
    .d-flex {
        i {
            font-size: 20px !important;
        }
        span {
            strong {
                color: #adb5bd !important;
            }
        }
    }
</style>