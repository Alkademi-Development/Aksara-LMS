<template>
    <div class="container-fluid mt-4">
        
        <div class="row" v-if="isLoaded">

            <!-- <div class="col-xl-4 order-xl-2">
                <CardProfile
                    v-if="!userLoading"
                    :photo="servicesState?.userDetail?.photo"
                    :name="servicesState?.userDetail?.name"
                    :city="servicesState?.userDetail?.city"
                    :email="servicesState?.userDetail?.email"
                    :phone="servicesState?.userDetail?.phone"
                    :linkedIn="servicesState?.userDetail?.linkedIn"
                    :github="servicesState?.userDetail?.github" />
            </div> -->

            <div class="col-12">
                <ProfileForm
                    :user="userDetail"
                    :isUpdated="updated"
                    @updated="updateData"
                />
            </div>

        </div>

        <div class="row" v-else>
            <div class="col">
                <CardLoading />
            </div>
        </div>

    </div>
</template>

<script>
import { mapState } from "vuex"

import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"
import ProfileForm from "@/components/template/micro/form/ProfileForm.vue"
import CardProfile from "@/components/template/micro/card/User/Profile.vue"

export default {
    components: {
        ContentHeader,
        Footer,
        ProfileForm,
        CardProfile
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    layout: 'dashboard',
    data() {
        return {
            isLoaded: false,
            updated: false,
            userDetail: null,
            user: JSON.parse(localStorage.getItem('user'))
        }
    },
    filters: {
        location: function (value) {
            if (!value) return ''
            value = value.toString().toLowerCase();
            value = value.charAt(0).toUpperCase() + value.slice(1);
            if (value.startsWith('Kota')) {
                return value.slice(0, 5) + value.charAt(5).toUpperCase() + value.slice(6);
            } else if (value.startsWith('Kabupaten')) {
                return value.slice(0, 10) + value.charAt(10).toUpperCase() + value.slice(11);
            }
        }
    },
    mounted () {
        this.getUserDetails();
    },
    methods: {
        async getUserDetails() {
            // if (this.servicesState.userDetail == null) {
                await this.$store.dispatch('Services/userDetailUpdate', this.user.id);

                if (!this.servicesState.status) {
                    console.error('Failed to fetch user detail', this.servicesState.message);
                    this.isLoaded = true;
                } else {
                    this.userDetail = this.servicesState.data
                    const user = {
                        id: this.userDetail.id,
                        email: this.userDetail.email,
                        name: this.userDetail.name,
                        kind: this.userDetail.kind,
                    };

                    const params = {
                        kind: user.kind,
                    };

                    localStorage.setItem("user", JSON.stringify(user));

                    await this.$store.dispatch("Sidebar/setSidebarRole", params);
                    this.isLoaded = true;
                }
            // } else {
            //     this.userDetail = this.servicesState.userDetail
            //     this.isLoaded = true;
            // }
        },
        updateData () {
            this.isLoaded = false;
            this.updated = true;
            this.getUserDetails();
        }
    }
}
</script>

<style>

</style>