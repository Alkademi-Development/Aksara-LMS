<template>

    <div class="container-fluid mt-4">
        <FilterForms
            :isBusy="isBusy"
            :pagination="pagination"
            :sortItems="null"
            :searchPlaceholder="'Cari berdasarkan nama form'"
            :isWrap="true"
            :showFilter="false"
            @fetchFilters="setFiltersAndFetch"
            @typingSearch="isBusy = $event"
        />
        <div class="row">
            <FormTable 
                :isBusy="isBusy"
                :role="role"
                :fields="fields"
                :items="items"
                :pagination="pagination"
                @fetchData="getForms"
                @isLoading="busyToggler"
            />
        </div>
        
        <Footer />

    </div>
</template>

<script>
import { mapState } from 'vuex'

import ContentHeader from "@/components/template/dashboard/ContentHeader"
import FormTable from "@/components/template/micro/table/FormTable.vue"
import Footer from "@/components/template/dashboard/Footer"
import FilterForms from '~/components/classrooms/micro/FilterForms.vue'

export default {
    layout: 'dashboard',
    components: {
    ContentHeader,
    FormTable,
    Footer,
    FilterForms
},
    computed: {
        ...mapState({
            formsState: (state) => state.Forms
        })
    },
    data(){
        return {
            role: 'formulir',
            isBusy: true,
            fields: [
                {
                    key: 'index',
                    label: 'No',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'title',
                    label: 'Judul',
                    thStyle: 'width: 100%'
                },
                {
                    key: 'timer',
                    label: 'Waktu',
                    // sortable: true,
                },
                {
                    key: 'totalRespondent',
                    label: 'Respon',
                    // sortable: true,
                },
                {
                    key: 'totalQuestion',
                    label: 'Soal',
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
            },
            lastFiltered: null
        }
    },
    created() {
        if (this.$route.query.callback) {
            this.$router.push('/dashboard/forms')
            this.getForms(1)
        } else this.getForms(1)
    },
    methods: {
        busyToggler(data) {
            this.isBusy = data
        },
        setFiltersAndFetch({page, perPage, sortBy, search}) {
            this.lastFiltered = {
                page: page ?? null,
                perPage: perPage ?? null,
                sort: sortBy ?? null,
                keyword: search ?? null,
                kind: 'form'
            }

            this.getForms(page, perPage, sortBy, search)
        },
        async getForms(page, perPage, sort, keyword) {
            this.isBusy = true

            const dispatch = 'Forms/getForms'
            let params;

            if (!!this.lastFiltered) {
                params = this.lastFiltered

                params.page = !!page ? page : this.pagination?.page,
                params.perPage = !!perPage ? perPage : this.pagination?.perPage
            }else {
                params = {
                    page: !!page ? page : this.pagination?.page,
                    perPage: !!perPage ? perPage : this.pagination?.perPage,
                    kind: 'form',
                    keyword: !!keyword ? keyword : null
                }
            }

            await this.$store.dispatch(dispatch, params).then(() => {
                var formsState = this.$store.state.Forms

                if(!formsState.status) {
                    console.log('Failed get forms', formsState.message)
                    this.isBusy = false
                } else {
                    this.items = formsState.forms ?? []
                    this.pagination = {
                        currentPage: formsState.pagination.currentPage,
                        perPage: formsState.pagination.perPage,
                        totalRows: formsState.pagination.totalRows,
                    }

                    this.isBusy = false;
                }
            })
        }
    }
}
</script>

<style>

</style>