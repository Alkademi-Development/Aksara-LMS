<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Tes" :sideButton="historyButton" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <!-- <div class="row" v-if="userKind == 'mentor' || userKind == 'superadmin' || userKind == 'admin' || userKind == 'lead_program'"> -->
            <div class="row">
                <ClassroomTable
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                    :isTestCase="isTestCase"
                    @fetchData="getClassroomsList"
                    @isLoading="busyToggler"
                />
            </div>
            <!-- <StudentClassroom
                v-else-if="userKind =='student'"
                :currentBatch="currentBatch"
            /> -->

            <!-- Footer -->
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"
import ClassroomTable from "@/components/template/micro/table/ClassroomTable.vue";

import StudentClassroom from "@/components/classrooms/Student"

import { mapState } from 'vuex';

export default {
    components: {
        ContentHeader,
        Footer,
        ClassroomTable,
        StudentClassroom
    },
    layout: 'dashboard',
    data () {
        return {
            role: 'Kelas',
            isBusy: false,
            fields: [],
            items: [],
            isTestCase: false,
            userKind: localStorage.getItem('user_kind'),
            currentBatch: JSON.parse(localStorage.getItem('student_batch')),

            historyButton: {
                icon: 'ni-history',
                title: 'Riwayat Tes',
                variant: 'secondary',
                pill: true,
                hidden: localStorage.getItem('user_kind') == 'student' ? false : true,
                to: '/dashboard/tes/history'
            },

            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },

        }
    },
    created() {
        // if (this.userKind == 'mentor' || this.userKind == 'superadmin' || this.userKind == 'admin' || this.userKind == 'lead_program') this.getClassroomsList(1);
        this.isTestCase = this.sassState.isTestCase
        this.getClassroomsList(1);
        this.setFields()
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            sassState: (state) => state.Sass,
        })
    },
    methods: {
        busyToggler(data) {
            this.isBusy = data
        },
        setFields() {
            if(this.userKind != 'student') {
                this.fields = [
                    {   
                        key: "index", 
                        label: 'No',
                        thStyle: 'width: 10%'
                    },
                    {
                        key: 'name',
                        label: 'Nama',
                        // sortable: true
                    },
                    {
                        key: 'totalStudent',
                        label: 'Peserta',
                        // sortable: true,
                    },
                    {
                        key: 'registration',
                        label: 'Pendaftaran',
                        // sortable: true,
                    },
                    {
                        key: 'start',
                        label: 'Dimulai',
                        // sortable: true,
                    },
                    {
                        key: 'classState',
                        label: 'Status',
                        // sortable: true,
                    },
                    {
                        key: 'action',
                        label: '',
                        class: 'text-right'
                    }
                ]
            } else {
                this.fields = [
                    {   
                        key: "index", 
                        label: 'No',
                        thStyle: 'width: 10%'
                    },
                    {
                        key: 'name',
                        label: 'Nama',
                        // sortable: true
                    },
                    {
                        key: 'totalStudent',
                        label: 'Peserta',
                        // sortable: true,
                    },
                    {
                        key: 'registration',
                        label: 'Pendaftaran',
                        // sortable: true,
                    },
                    {
                        key: 'start',
                        label: 'Dimulai',
                        // sortable: true,
                    },
                    {
                        key: 'action',
                        label: '',
                        class: 'text-right'
                    }
                ]
            }
        },
        async getClassroomsList(page) {
            this.isBusy = true;

            let params = { page: page }

            await this.$store.dispatch('Services/classrooms', params);

            if (!this.servicesState.status) {
                console.error('Failed fetch classrooms', this.servicesState.message);
                this.isBusy = false;
            } else {
                this.items = this.servicesState.classrooms;
                this.pagination = this.servicesState.pagination

                this.isBusy = false;
            }
        },
    }
}
</script>

<style>

</style>