<template>
    <div>
        <div class="container-fluid mt-4" v-if="!isLoaded">

            <div v-if="certificates?.length > 0">
                <!-- Content Begin -->
                <div v-for="(certificate, index) in filteredCertificates" :key="index">
                    <CardCertificate :certificate="certificate" kind="certificate" isMySelf />
                </div>
                <card-pagination :pagination="pagination" @pageChange="onPageChange"/>
            </div>
            <div v-else>
                <b-card>
                    <b-card-body class="text-center">
                        <div class="mx-auto my-2 text-center text-primary">
                            <strong>Belum ada sertifikat.</strong>
                        </div>
                    </b-card-body>
                </b-card>    
            </div>
            
            
            <Footer />
        </div>

        <div class="container-fluid mt--6" v-else>
            <card-loading />
        </div>
    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"

import CardCertificate from "@/components/template/micro/card/CardCertificate.vue"
import { mapState } from 'vuex'

export default {
    layout: 'dashboard',
    components: {
        ContentHeader,
        Footer,
        CardCertificate,
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        }),

        // HIDE RADYA FELLOWSHIP CERTIFICATE
        filteredCertificates() {
            const tempCertificates = this.certificates.filter((item) => item?.slug !== 'radyafellowship')

            return tempCertificates
        }
    },
    data() {
        return {
            certificates: [],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
            isLoaded: false
        }
    },
    created() {
        this.fetchStudentClass()
    },
    methods: {
        async fetchStudentClass() {
            this.isLoaded = true

            let params = {
                page: this.pagination.page,
            }

            await this.$store.dispatch('Services/classroomsHistory', params)

            if(!this.servicesState.status) {

                console.error('Failed fetch user classrooms history: ', this.servicesState.message)
                this.isLoaded = false

            } else {
                
                this.certificates = this.servicesState.classrooms ?? []
                this.pagination = this.servicesState.pagination

                this.isLoaded = false

            }
        },
        onPageChange(page) {
            this.pagination.page = page
            this.fetchStudentClass()
        }
    }
}
</script>

<style>

</style>