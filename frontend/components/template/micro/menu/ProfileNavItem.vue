<template>
    <div class="dropdown navbar-profile">
        <a 
            class="btn-dropdown" 
            role="button" 
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="false"
        >  
            <div class="media align-items-center">
                <b-avatar
                    variant="primary"
                    size="md"
                    :src="servicesState?.detail_auth?.photo"
                    :text="!!servicesState?.detail_auth?.photo ? getFirstWord(servicesState?.detail_auth?.name[0]) : ''"
                    class="profile-img"
                ></b-avatar>
            </div>
            <div class="box-profile-text">
                <h5 class="profile-name text-limit limit-1 ">
                    {{ getFirstWord(!!servicesState?.detail_auth ? servicesState?.detail_auth?.name : 'noname') }}
                </h5>
                <div class="profile-role">{{ capitalizeAllFirst(userRole) }}</div>
            </div>
            <i class="ri-arrow-right-s-line"></i>
        </a>

        <div class="dropdown-menu dropdown-menu-left">
            <nuxt-link class="dropdown-item" to="/dashboard/profile">
                <i class="ri-user-3-fill"></i>
                <span>Profil</span>
            </nuxt-link>

            <div class="dropdown-divider"></div>
            <button class="dropdown-item" @click="isModalLogout = true">
                <i class="ni ni-user-run"></i>
                <span class="text-darker">Logout</span>
            </button>
        </div>

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
import { getFirstWord, capitalizeAllFirst } from "@/commons/utils";
import { ROLES_USERS_EN } from "@/commons/constants/users"

import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue"
import appToken from '~/api/app-token';

export default {
    components: { ModalConfirmation },
    data() {
        return {
            user: JSON.parse(localStorage?.getItem('user')) || null,
            isModalLogout: false,
            userRole: "",
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            sassState: (state) => state.Sass,
        }),
    },
    mounted() {
        this.userRole = this.getUserRole(this.user?.kind ?? "")
    },
    methods: {
        getFirstWord,
        capitalizeAllFirst,
        
        getUserRole(kind) {
            const userRole = ROLES_USERS_EN.find((item) => item?.value === kind)
            return userRole?.label
        },

        async logout() {
            
            const redirectTo = "?redirectTo=" + (this.layoutActive == `pesilat` ? `https://alkademi.id/pesilat` : window?.location?.origin)
            const alkademiAuth = process.env.alkademiAuth + "/logout"
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const appId = "&appId=" + appToken.getAppId();
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

            const url = alkademiAuth + redirectTo + appId + lmsId + codeToken + generatedToken

            localStorage.clear()
            window.location.replace(url)
        },
    }
}
</script>

<style scoped>

.font-semibold {
    font-weight: 600;
}
.font-small {
    font-size: 12px;
    font-weight: 500;
}
.logo-head {
    max-height: 44px;
    max-width: 180px;
}
.btn-logout span {
    color: #000000 !important;
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