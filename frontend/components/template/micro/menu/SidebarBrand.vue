<template>
    <div class="box-navbar-brand d-flex align-items-center">
        <!-- Brand Logo -->
        <a :href="to" class="navbar-brand w-100"> 
            <img v-if="srcLogoDark != null && srcLogoDark != 'null' && srcLogoDark != ''" :src="srcLogoDark" class="navbar-brand-img" alt="...">
            <h1 v-else class="m-0" style="color: var(--bs-primary)">{{title}}</h1>
        </a>
        <!-- Burger Menu -->
        <div v-if="minimize" class="ml-auto">
            <!-- Sidenav toggler -->
            <div class="sidenav-toggler d-none d-xl-block" data-action="sidenav-unpin" data-target="#sidenav-main">
                <div class="sidenav-toggler-inner">
                    <i class="sidenav-toggler-line"></i>
                    <i class="sidenav-toggler-line"></i>
                    <i class="sidenav-toggler-line"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    props: {
        to: String,
        minimize: Boolean,
    },
    data() {
        return {
            srcLogoDark: '',
            title: document.location.hostname,
        }
    },
    computed: {
        ...mapState({
            authState: (state) => state.Auth,
            sassState: (state) => state.Sass,
        }),
    },
    mounted() {
        const dataSettings = this.sassState.settings

        if (dataSettings) {
            this.srcLogoDark = dataSettings.logo_dark ?? null
            this.title = dataSettings.title ?? document.location.hostname
        }
    }
}
</script>

<style>

</style>