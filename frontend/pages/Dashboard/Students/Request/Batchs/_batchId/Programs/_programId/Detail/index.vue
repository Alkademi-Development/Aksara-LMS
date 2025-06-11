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
                    :roundName="roundName"
                    :roundId="parseInt(roundId)"
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
            role: 'students_by_batch',
            isBusy: true,
            batchName: '',
            batchId: null,
            programName: '',
            programId: null,
            roundName: '',
            roundId: null,

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
                    key: 'score',
                    label: 'Skor',
                    // sortable: true
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
            }
        }
    },
    created() {
        this.getCredentials()
    },
    methods: {
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.batchId = res[2]
            this.roundId = res[4]
            this.programId = res[6]

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
                    this.fetchRoundById()
                }
                
            })
        },
        async fetchRoundById() {
            await this.$store.dispatch('Rounds/getRoundDetail', this.roundId)
            .then(() => {
                var stateRounds = this.$store.state.Rounds

                if(!stateRounds.status) {
                    console.log('Failed get round by id: ', stateRounds.message)
                    this.isBusy = false
                } else {
                    // console.log('Success get batch by id: ', stateRounds.batch)
                    this.roundName = stateRounds.rounds.name
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
        async getUsersApproved({page}) {
            this.isBusy = true
            await this.$store.dispatch('Users/studentByBatchIdRoundIdProgramId', {
                batch_id: this.batchId, 
                round_id: this.roundId, 
                program_id: this.programId, 
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

                    this.isBusy = false
                }
            })
        }
    }
};
</script>

<style>
</style>