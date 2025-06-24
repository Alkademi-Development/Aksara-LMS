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
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                    @fetchData="fetchUser"
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
        }
    },
    mounted() {
        this.fetchUser({page: 1})

        this.fields = studentRequestFields.tables.studentRequest
    },
    methods: {
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        async fetchUser({page}) {
            this.isBusy = true

            this.page = page == null | undefined ? 1 : page

            await this.$store.dispatch('Requests/fetchRequestStudents', this.page)
                .then(() => {
                    if (!this.$store.state.Requests.status) {
                        this.onEvent.message = this.$store.state.Requests.message
                        this.onEvent.status = this.$store.state.Requests.status
                        // this.onEvent.variant = 'warning'
                        this.onEvent.alertCounter = 10
                        
                        this.isBusy= false
                    }else {
                        setTimeout(() => {
                            this.items = this.$store.getters['Requests/getRequestStudents']
                            this.setTablePagination()
                            this.isBusy = false
                        }, 400)
                    }
                })

        },
        setTablePagination() {
            var storePagination = this.$store.state.Requests

            this.pagination.currentPage = storePagination.page.current_page
            this.pagination.perPage = storePagination.data_count.per_page
            this.pagination.totalRows = storePagination.data_count.total_data
        }
    }
};
</script>

<style>
</style>