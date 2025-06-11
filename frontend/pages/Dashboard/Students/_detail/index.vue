<template>
    <div class="container-fluid mt-4">

        <b-alert
            :show="onEvent.show"
            :variant="onEvent.variant"
            dismissible
        >
            {{ onEvent.message }}
        </b-alert>
            
        <DetailProfile 
            :userId="userId"
            :isStudent="true"
            @isEvent="setEvent"
            @removeEvent="onEvent.show = false"
        />

    </div>
</template>

<script>
import DetailProfile from "@/components/user/DetailProfile.vue";
import { mapState } from 'vuex';

import { toDecrypt } from '~/commons/utils'

export default {
    layout: 'dashboard',
    asyncData({ params, query }) {
        const userId = parseInt(toDecrypt(localStorage.getItem('userId')))
        return { userId }
    },
    components: {
        DetailProfile
    },
    created() {
        this.getUserDetail();
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            authState: (state) => state.Auth,
        }),
    },
    data() {
        return {
            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: '',
                show: false,

                // User Data
                userDetail: null,
            },
        }
    },
    methods: {
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        setEvent(data) {
            window.scrollTo(0,0)
            this.onEvent.message = data.message
            this.onEvent.status = data.status
            this.onEvent.variant = data.status ? 'success' : 'warning'
            this.onEvent.show = true
        },
        async getUserDetail() {
            this.isLoaded = false

            await this.$store.dispatch('Services/authorize');

            if (!this.servicesState.status) {
                if (this.servicesState.message == 'Forbidden Access !' || this.servicesState.message == 'Forbidden Access!') {
                    localStorage.clear()
                    this.isAuthenticated = false
                    this.isLoaded = true
                    // const url = window.location.origin
                    // window.open(url, "_self")
                } else {
                    console.error('Failed to fetch user detail', this.servicesState.message);
                    this.isAuthenticated = false
                    this.isLoaded = true
                }
            } else {

                this.userDetail = this.servicesState.detail_auth;

                this.isLoaded = true;
            }
        },
    },

}
</script>