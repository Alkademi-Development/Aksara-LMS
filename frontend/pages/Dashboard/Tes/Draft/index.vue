<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Draft Tes"/>

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <div class="row" v-if="userKind == 'mentor' || userKind == 'superadmin' || userKind == 'admin' || userKind == 'lead_program'">
                <ClassroomTable
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                    @fetchData="getClassroomsList"
                    @isLoading="busyToggler"
                />
                
            </div>
            <StudentClassroom
                v-else-if="userKind =='student'"
                :currentBatch="currentBatch"
            />

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
            role: 'DraftKelas',
            isBusy: false,
            fields: [
                {   
                    key: "index", 
                    label: 'No'
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
            ],
            items: [],
            userKind: localStorage.getItem('user_kind'),
            currentBatch: JSON.parse(localStorage.getItem('student_batch')),

            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },

        }
    },
    created() {
        this.getClassroomsList(1);
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },
    methods: {
        busyToggler(data) {
            this.isBusy = data
        },
        async getClassroomsList(page) {
            this.isBusy = true;
            await this.$store.dispatch('Services/draftClassrooms', page);

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