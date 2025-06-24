<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Peserta Pendaftar" />

        <!-- Page content -->
        <div class="container-fluid mt--6">

            <b-alert 
                :show="onEvent.alertCounter"
                variant="danger"
                @dismissed="onEvent.alertCounter=0"
                @dismiss-count-down="countDownChanged"
            >
                {{ onEvent.message }}
            </b-alert>
            
            <!-- Content Begin -->
            <div class="row">

                <UserTable
                    :isBusy="isBusy"
                    :isRequest="true"
                    :batchName="batchName"
                    :batchId="parseInt(batchId)"
                    :programName="programName"
                    :programId="parseInt(programId)"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                    :cities="cities"
                    @fetchData="getUsersRequest"
                />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import UserTable from "@/components/template/micro/table/UserTable"
import Footer from "@/components/template/dashboard/Footer"

import studentRequestFields from "@/store/global/users"

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        UserTable,
    },
    data() {
        return {
            role: 'request_siswa',
            isBusy: false,
            batchName: '',
            batchId: null,
            programName: '',
            programId: null,
            roundName: '',
            roundId: null,

            fields: [],
            items: [],
            pagination: {
                currentPage: 1,
                perPage: 10,
                totalRows: 1,
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
            },

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            page: 1,
            cities: [],
        }
    },
    mounted() {
        this.getCredentials()

        this.fields = studentRequestFields.tables.studentRequest
    },
    methods: {
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.batchId = res[4]
            this.programId = res[6]
            this.isBusy = true

            this.fetchBatchById()
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        async fetchBatchById() {
            await this.$store.dispatch('Programs/getBatchById', this.batchId)
            .then(() => {
                var statePrograms = this.$store.state.Programs

                if(!statePrograms.status) {
                    console.log('Failed get batch by id: ', statePrograms.message)
                    this.isBusy = false
                } else {
                    const batch = statePrograms.batch
                    this.batchName = batch.name
                    // console.log('Success get batch by id: ', this.batchName)
                    this.fetchProgramById()
                }
                
            })
        },
        async fetchProgramById() {
            await this.$store.dispatch('Programs/getProgramById', this.programId)
            .then(() => {
                var statePrograms = this.$store.state.Programs

                if(!statePrograms.status) {
                    console.log('Failed get program by id: ', statePrograms.message)
                    this.isBusy = false
                } else {
                    // console.log('Success get batch by id: ', statePrograms.batch)
                    const batch = statePrograms.programs
                    this.programName = batch.name
                    this.getUsersRequest({page: 1})
                }
                
            })
        },
        async getUsersRequest({ keyword, city, sortBy, sortType, page }) {
            this.isBusy = true
            await this.$store.dispatch('Users/studentRequestByProgramId', {
                search: keyword,
                program_id: this.programId,
                cityId: city,
                sortBy: sortBy,
                sortType: sortType,
                page: page
            })
            .then(() => {
                var usersState = this.$store.state.Users

                if(!usersState.status) {
                    console.log('Failed get users', usersState.message)
                    this.onEvent.message = usersState.message
                    this.onEvent.status = usersState.status
                    this.onEvent.alertCounter = 10
                    this.onEvent.variant = 'danger'
                    this.isBusy = false
                } else {
                    this.items = usersState.students
                    this.pagination = {
                        currentPage: usersState.pagination.currentPage,
                        perPage: usersState.pagination.perPage,
                        totalRows: usersState.pagination.totalRows,
                    }

                    this.cities = usersState.cities;

                    this.isBusy = false
                }
            })
        },
    }
};
</script>

<style>
</style>