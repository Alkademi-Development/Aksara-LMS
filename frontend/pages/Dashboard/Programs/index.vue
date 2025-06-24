<template>
    <div class="container-fluid mt-4">

        <FilterForms
            :isBusy="isBusy"
            :sortItems="sortItems"
            :showFilter="false"
            :pagination="pagination"
            :mdSize="12"
            :lgSize="6"
            :searchPlaceholder="'Cari berdasarkan nama program'"
            :isWrap="true"
            @fetchFilters="setFiltesAndFetch"
            @typingSearch="isBusy = $event"
        />

        <ProgramTable
            :isBusy="isBusy"
            :role="role"
            :fields="fields"
            :items="items"
            :pagination="pagination"
            @fetchData="handleChangePage"
            @isLoading="busyToggler"
        />
        
        <Footer />

    </div>
</template>

<script>
import { mapState } from 'vuex';
import { SORT_PROGRAM } from '~/commons/constants/filters';

import ContentHeader from "@/components/template/dashboard/ContentHeader"
import ProgramTable from "@/components/template/micro/table/ProgramTable.vue"
import Footer from "@/components/template/dashboard/Footer"
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        ProgramTable,
        Footer,
        FilterForms
    },
    data() {
        return {
            role: 'program',
            isBusy: false,
            fields: [
                {   
                    key: "index", 
                    label: 'No',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'name',
                    label: 'Judul Program'
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right',
                    thStyle: 'width: 20%'
                }
            ],
            items: [],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
            sortItems: SORT_PROGRAM,
            dataFilters: {
                sortBy: null,
                search: null,
            },
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    created(){
        this.fetchPrograms();
        
        localStorage.removeItem('programId')
    },
    methods: {
        busyToggler(data) {
            this.isBusy = data
        },
        handleChangePage(page){
            this.pagination.page = page;
            this.fetchPrograms();
        },
        setFiltesAndFetch({page, perPage, sortBy, search}){
            this.pagination.page = page;
            this.pagination.perPage = perPage;
            this.dataFilters.sortBy = sortBy;
            this.dataFilters.search = search;

            this.fetchPrograms();
        },
        async fetchPrograms(){
            this.isBusy = true

            let params = {
                page: this.pagination?.page,
                perPage: this.pagination?.perPage,
                sort: this.dataFilters?.sortBy,
                keyword: this.dataFilters?.search,
            };
            
            await this.$store.dispatch('Services/programs', params);

            if(!this.servicesState.status) {
                console.error('Failed fetch programs', this.servicesState.message)
                this.isBusy = false
            } else {
                this.items = this.servicesState.programs || [];
                this.pagination = this.servicesState.paginationPrograms;
                this.isBusy = false;
            }
        }
    }
};
</script>

<style>
</style>