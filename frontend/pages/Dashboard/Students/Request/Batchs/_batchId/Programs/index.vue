<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Program" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <div class="row">

                <ProgramTable
                    :isBusy="isBusy"
                    :isRequest="true"
                    :batchId="parseInt(batchId)"
                    :batchName="batchName"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                />

            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import ProgramTable from "@/components/template/micro/table/ProgramTable"
import Footer from "@/components/template/dashboard/Footer"

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        ProgramTable,
        Footer,
    },
    data() {
        return {
            role: 'program_by_batch',
            isBusy: true,
            batchId: 0,
            batchName: '',
            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'name',
                    label: 'Judul Program',
                    // sortable: true
                },
                {
                    key: 'totalRegistrar',
                    label: 'Pendaftar'
                },
                // {
                //     key: 'totalStudent',
                //     label: 'Siswa'
                // },
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
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
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

            this.batchId = res[4]

            this.fetchBatchById()
        },
        async fetchBatchById() {
            this.isBusy = true

            await this.$store.dispatch('Programs/getBatchById', this.batchId)
            .then(() => {
                var statePrograms = this.$store.state.Programs

                if(!statePrograms.status) {
                    console.log('Failed get batch by id: ', statePrograms.message)
                    this.isBusy = false
                } else {
                    this.isBusy = false
                    this.batchName = statePrograms.batch.name
                    this.items = statePrograms.batch.programs
                }
            })
        }
    }
};
</script>

<style>
</style>