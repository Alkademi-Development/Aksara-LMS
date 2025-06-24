<template>

    <div class="container-fluid mt-4">

        <div class="row">

            <FormCategoryTable 
                :isBusy="isBusy"
                :role="role"
                :fields="fields"
                :items="items"
                :pagination="pagination"
                @fetchData="getForms"
                @isLoading="busyToggler"
            />

        </div>
        
        <!-- Footer -->
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import FormCategoryTable from "@/components/template/micro/table/FormCategoryTable"
import Footer from "@/components/template/dashboard/Footer"
import { mapState } from 'vuex'

export default {
    layout: 'dashboard',
    components: {
        ContentHeader,
        FormCategoryTable,
        Footer
    },
    computed: {
        ...mapState({
            formsState: (state) => state.Forms
        })
    },
    data(){
        return {
            role: 'kategori',
            isBusy: true,
            fields: [
                {
                    key: 'index',
                    label: 'No',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'name',
                    label: 'Nama',
                    // sortable: true,
                },
                {
                    key: 'score',
                    label: 'Nilai',
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
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
            }
        }
    },
    created() {
        this.getForms()
    },
    methods: {
        busyToggler(data) {
            this.isBusy = data
        },
        async getForms(val = null) {
            this.isBusy = true

            await this.$store.dispatch('Forms/categories', val || this.pagination.currentPage)
            .then(() => {
                var formsState = this.$store.state.Forms

                if(!formsState.status) {
                    console.log('Failed get categories', formsState.message)
                    this.isBusy = false
                } else {
                    this.items = formsState.categories
                    this.pagination = {
                        currentPage: formsState.pagination.currentPage,
                        perPage: formsState.pagination.perPage,
                        totalRows: formsState.pagination.totalRows,
                    }

                    setTimeout(() => {
                        this.isBusy = false
                    }, 1000);
                }
            })
        }
    }
}
</script>

<style>

</style>