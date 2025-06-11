<template>
    <div class="container-fluid mt-4">
        <FilterForms
            :isBusy="isBusy"
            :pagination="pagination"
            :sortItems="null"
            :searchPlaceholder="'Cari berdasarkan nama studio'"
            :fields="filterFields"
            :isWrap="true"
            :showFilter="false"
            @fetchFilters="setFiltersAndFetch"
            @typingSearch="isBusy = $event"
        />

        <div class="row">
            <StudioTable 
                :isBusy="isBusy"
                :role="role"
                :fields="fields"
                :items="items"
                :pagination="pagination"
                @fetchData="getListStudio"
                @isLoading="busyToggler"
            />

        </div>
        
        <Footer />
    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import StudioTable from "@/components/template/micro/table/StudioTable.vue"
import Footer from "@/components/template/dashboard/Footer"
import FilterForms from "~/components/classrooms/micro/FilterForms.vue"

export default {
    layout: 'dashboard',
    components: {
    ContentHeader,
    StudioTable,
    Footer,
    FilterForms
},
    data(){
        return {
            role: 'studio',
            isBusy: true,
            fields: [
                {
                    key: 'index',
                    label: 'No',
                    thStyle: 'width: 5%'
                },
                {
                    key: 'name',
                    label: 'Nama',
                    thStyle: 'width: 55%'
                },
                {
                    key: 'timer',
                    label: 'Waktu',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'template',
                    label: 'Bahasa',
                    thStyle: 'width: 15%'
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right',
                    thStyle: 'width: 15%'
                }
            ],
            items: [],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
            },
            lastFiltered: null,
        }
    },
    created() {
        this.getListStudio(1)
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
            }

            this.getListStudio(page, perPage, sortBy, search);
        },
        async getListStudio(page, perPage, sort, keyword) {
            this.isBusy = true

            const dispatch = 'Studio/getList'
            let params;

            if (!!this.lastFiltered) {
                params = this.lastFiltered

                params.page = !!page ? page : this.pagination?.page,
                params.perPage = !!perPage ? perPage : this.pagination?.perPage
            }else {
                params = {
                    page: !!page ? page : this.pagination?.page,
                    perPage: !!perPage ? perPage : this.pagination?.perPage,
                    keyword: !!keyword ?? null
                }
            }

            await this.$store.dispatch(dispatch, params)
            .then(() => {
                var stateStudio = this.$store.state.Studio

                if(!stateStudio.status) {
                    console.log('Failed get list studio', stateStudio.message)
                    this.isBusy = false
                } else {
                    this.items = stateStudio.studio
                    this.pagination = {
                        currentPage: stateStudio.pagination.currentPage,
                        perPage: stateStudio.pagination.perPage,
                        totalRows: stateStudio.pagination.totalRows,
                    }

                    // setTimeout(() => {
                        this.isBusy = false
                    // }, 500);
                }
            })
        }
    }
}
</script>

<style>

</style>