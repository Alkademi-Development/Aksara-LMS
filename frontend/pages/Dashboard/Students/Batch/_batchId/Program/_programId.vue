<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Peserta" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <div class="row">
                
                <UserTable
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                    :batchName="batchName"
                    :batchId="parseInt(batchId)"
                    :programName="programName"
                    :programId="parseInt(programId)"
                    :cities="cities"
                    @fetchData="getUsersApproved"
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

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        UserTable,
    },
    data() {
        return {
            role: 'siswa',
            isBusy: true,
            batchName: '',
            batchId: null,
            programName: '',
            programId: null,

            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'name',
                    label: 'Nama Lengkap',
                    // sortable: true
                },
                {
                    key: 'email',
                    label: 'Kontak',
                },
                {
                    key: 'program',
                    label: 'Program',
                    // sortable: true
                },
                {
                    key: 'origin',
                    label: 'Asal',
                    // sortable: true
                },
                {
                    key: 'status',
                    label: 'Status',
                    // sortable: true,
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                }
            ],
            items: [],
            pagination: {
                currentPage: 1,
                perPage: 10,
                totalRows: 1,
            },
            cities: [],
        }
    },
    created() {
        this.getCredentials();
    },
    methods: {
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.batchId = res[3]
            this.programId = res[5]

            this.fetchBatchById()
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
                    this.getUsersApproved({page: 1})
                }
                
            })
        },
        async getUsersApproved({ keyword, city, sortBy, sortType, page }) {
            this.isBusy = true
            await this.$store.dispatch('Users/studentByBatchIdProgramId', {
                search: keyword,
                batch_id: this.batchId,
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