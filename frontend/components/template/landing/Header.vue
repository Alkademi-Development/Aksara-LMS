<template>
    <div 
        id="header" 
        :class="[
            'wrapper', 
            (
                routeName != '' && routeName != 'register' && routeName != 'activate' && routeName != 'forgot' && routeName != 'login'  
                    ? 'content-page' 
                    : ''
            ), 
            (
                scrollPosition > 10 
                    ? 'scrolled' 
                    : ''
            ), 
            (
                collapse 
                    ? 'scrolled' 
                    : ''
            )
        ]">
        
        <div class="container">
            <b-navbar 
                toggleable="lg" 
                :type="(
                    scrollPosition > 10 || collapse 
                        ? 'light' 
                        : (
                            routeName != '' && routeName != 'login' && routeName != 'register' && routeName != 'activate'
                                ? 'light' 
                                : 'dark'
                        )
                    )" 
                variant="info">

                <b-navbar-nav>
                    <b-nav-item>
                        <b-navbar-toggle target="nav-collapse" @click="collapse = !collapse"></b-navbar-toggle>
                    </b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav>
                    <b-nav-item>
                        <nuxt-link to="/">
                            <div v-if="scrollPosition > 10 || collapse ">
                                <img :src="srcLogoDark" class="collapse-logo" alt="">
                            </div>
                            <div v-else>
                                <img :src="srcLogoLight" class="collapse-logo" alt="">
                            </div>
                        </nuxt-link>
                    </b-nav-item>
                </b-navbar-nav>

                <!-- <b-navbar-toggle target="nav-collapse"></b-navbar-toggle> -->

                <b-navbar-nav class="navbar-small">
                    
                    <template v-if="!isAuthenticated">
                        <b-nav-item v-if="isLoaded" href="#" class="button py-md-2" @click="onLoginClicked">Masuk</b-nav-item>
                        <div class="media align-items-center text-white" v-else>
                            <b-spinner label="memuat data" class="align-middle"></b-spinner>
                        </div>
                    </template>
                    <b-nav-item to="/dashboard" class="nav-item dropdown" v-else>
                        <div class="media align-items-center" v-if="isLoaded">
                            <a class="pr-0 nav-link" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <b-avatar 
                                    variant="primary"
                                    :src="servicesState.detail_auth.photo"
                                    :text="servicesState.detail_auth.photo == '' || servicesState.detail_auth.photo == null ? name : ''">
                                </b-avatar>
                            </a>
                        </div>
                        <div class="media align-items-center" v-else>
                            <b-spinner label="memuat data" class="align-middle"></b-spinner>
                        </div>
                    </b-nav-item>
                </b-navbar-nav>
                
                <b-collapse id="nav-collapse" is-nav>

                        <b-navbar-nav class="col col-lg-6 left-item">
                            <b-nav-item>
                                <nuxt-link to="/">
                                    <div v-if="scrollPosition > 10 || collapse || routeName == 'curriculum' || routeName == 'mentor' || routeName == 'about' || routeName == 'news' || routeName == 'gallery'" >
                                        <img :src="srcLogoDark" class="img-logo" alt="">
                                    </div>
                                    <div v-else>
                                        <img :src="srcLogoLight" class="img-logo" alt="">
                                    </div>
                                </nuxt-link>
                            </b-nav-item>
                        </b-navbar-nav>

                        <b-navbar-nav class="col col-lg-6 right-item">
                            <b-nav-item>
                                <nuxt-link to="/about" :class="routeName == 'about' ? 'active' : ''">Tentang Kami</nuxt-link>
                            </b-nav-item>
                            <b-nav-item>
                                <nuxt-link to="/curriculum" :class="routeName == 'curriculum' ? 'active' : ''">Kurikulum</nuxt-link>
                            </b-nav-item>
                            <b-nav-item>
                                <nuxt-link to="/mentor" :class="routeName == 'mentor' ? 'active' : ''">Mentor</nuxt-link>
                            </b-nav-item>
                            <!-- <b-nav-item>
                                <nuxt-link to="/network" :class="routeName == 'network' ? 'active' : ''">Jangkauan</nuxt-link>
                            </b-nav-item> -->
                            <b-nav-item>
                                <nuxt-link to="/news" :class="routeName == 'news' ? 'active' : ''">Berita</nuxt-link>
                            </b-nav-item>
                            <b-nav-item>
                                <nuxt-link to="/gallery" :class="routeName == 'gallery' ? 'active' : ''">Galeri</nuxt-link>
                            </b-nav-item>
                            <template v-if="!isAuthenticated">
                                <b-nav-item v-if="isLoaded" href="#" class="button py-md-2" @click="onLoginClicked">Masuk</b-nav-item>
                                <div class="media align-items-center text-white" v-else>
                                    <b-spinner label="memuat data" class="align-middle"></b-spinner>
                                </div>
                            </template>
                            <b-nav-item to="/dashboard/" class="nav-item dropdown" v-else>
                                <div class="media align-items-center" v-if="isLoaded">
                                    <a class="pr-0 nav-link" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <b-avatar 
                                            variant="primary"
                                            :src="servicesState.detail_auth.photo"
                                            :text="servicesState.detail_auth.photo == '' || servicesState.detail_auth.photo == null ? name : ''">
                                        </b-avatar>
                                    </a>
                                </div>
                                <div class="media align-items-center" v-else>
                                    <b-spinner label="memuat data" class="align-middle"></b-spinner>
                                </div>
                            </b-nav-item>
                        </b-navbar-nav>

                </b-collapse>
            </b-navbar>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            authState: (state) => state.Auth,
        }),
        currentRouteName() {
            return this.$route.fullPath;
        },
    },
    data() {
        return {
            srcLogoDark: '',
            srcLogoLight: '',
            routeName: '',
            scrollPosition: 0,

            isAuthenticated: localStorage.getItem('access_token') != null || '',
            isLoaded: true,
            name: '',

            collapse: false,
        }
    },
    mounted() {
        this.srcLogoDark = localStorage.getItem('logo-dark')
        this.srcLogoLight = localStorage.getItem('logo-light')
        window.addEventListener("scroll", this.updateScroll);
        if (this.isAuthenticated) this.checkAuthSession();
    },
    created(){
        this.setCurrentRoute()
        this.resetCollapse()
    },
    methods: {
        async checkAuthSession() {
            this.getUserDetail()
        },
        updateScroll() {
            this.scrollPosition = window.scrollY;
        },
        async setCurrentRoute() {
            var route = await this.currentRouteName;
            var routeArray = route.split("/");
            routeArray.shift()

            this.routeName = routeArray[1];
        },
        async onLoginClicked() {
            this.isLoaded = false;

            const baseUrl = process.env.alkademiAuth
            const redirect = "&redirectTo=" + window.location.origin
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

            const url = `${baseUrl}/auth?${redirect}${lmsId}`;

            window.open(url, "_self")
        },
        async getUserDetail() {
            this.isLoaded = false

            await this.$store.dispatch('Services/authorize');

            if (!this.servicesState.status) {
                if (this.servicesState.message == 'Forbidden Access !' || this.servicesState.message == 'Forbidden Access!') {
                    localStorage.clear()
                    this.isAuthenticated = false
                    this.isLoaded = true
                } else {
                    console.error('Failed to fetch user detail', this.servicesState.message);
                    this.isAuthenticated = false
                    this.isLoaded = true
                }
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
                this.isLoaded = true;
            }
        },
        resetCollapse() {
            this.collapse = false
            this.scrollPosition = 0
        }
    },
    watch: {
        currentRouteName() {
            this.setCurrentRoute();
            this.resetCollapse()
        },
    }
}
</script>