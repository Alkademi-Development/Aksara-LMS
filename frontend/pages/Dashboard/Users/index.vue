<template>
    <div class="container-fluid mt-4">
        <FilterForms 
            :isBusy="isBusy"
            :actionButtons="filterActionButtons"
            :pagination="pagination"
            :sortItems="sortStudents"
            :searchPlaceholder="'Cari berdasarkan nama / email'"
            :fields="filterFields"
            :filtersData="filtersData"
            :withPaginationFilter="false"
            :withSearchFilter="false"
            :isWrap="true"
            @onClickModalInvite="onClickModalInvite"
            @fetchFilters="setFiltersAndFetch"
            :showFilter="role === 'lead_region' ? false : true"
            :showActionButtons="role === 'lead_region' ? false : true"
            @typingSearch="isBusy = $event"
        />
        
        <UsersTable
            title="Daftar Pengguna"
            :fields="fields"
            :items="users"
            :isBusy="isBusy"
            :pagination="pagination"
            @getUserList="getUserList"
        />

        <Footer />
    </div>
</template>

<script>
import { mapState } from 'vuex';

import ContentHeader from "@/components/template/dashboard/ContentHeader"
import UsersTable from "@/components/template/micro/table/UsersTable.vue"
import Footer from "@/components/template/dashboard/Footer"
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';

import { TABLE_COLUMN_USERS } from "@/commons/constants/users"
import { FIELDS_FILTER_USERS } from '~/commons/constants/forms';
import { ROLE_TYPE } from '~/commons/constants/filters'

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        UsersTable,
        FilterForms
    },
    data() {
        return {
            isBusy: true,
            users: [],
            fields: TABLE_COLUMN_USERS,
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
            filterActionButtons: [
                {
                    class: 'btn btn-primary',
                    isAction: true,
                    text: 'User',
                    to: 'onClickModalInvite',
                    type: 'button',
                    iconClass: 'ri-add-fill mr-1'
                }
            ],
            
            sortStudents: null,
            filterFields: FIELDS_FILTER_USERS,

            lastFiltered: null,
            role: localStorage.getItem('user_kind') == null ? this.$store.state.Sidebar.role : localStorage.getItem('user_kind'),

            // Filter Actions (Course and Type Assignment)
            // the name of variable state programs, I take the name from value of "options" filter data in forms.js, so it can dynamic
            filtersData: {
                roleTypes: [...ROLE_TYPE],
            },

        }
    },
    computed: {
        ...mapState({
            usersState: (state) => state.Users
        })
    },
    mounted() {
        this.getUserList(1, 10, null, '', this.role === 'lead_region' ? 4 : null)
    },
    methods: {
        setFiltersAndFetch({page, perPage, sortBy, search, roleTypes, certified}) {
            this.lastFiltered = {
                page: page ?? null,
                perPage: perPage ?? null,
                sort: sortBy ?? null,
                keyword: search ?? null,
                kind: roleTypes ?? null,
                certified,
            }

            this.getUserList(page, perPage, sortBy, search, this.role === 'lead_region' ? 4 : roleTypes)
        },
        async getUserList(page, perPage, sort, keyword, kind) {
            this.isBusy = true
            
            const dispatch = 'Users/users'
            let params;

            if (!!this.lastFiltered) {
                params = this.lastFiltered

                params.page = !!page ? page : this.pagination?.page,
                params.perPage = !!perPage ? perPage : this.pagination?.perPage
            }else {
                params = {
                    page: !!page ? page : this.pagination?.page,
                    perPage: !!perPage ? perPage : this.pagination?.perPage,
                    kind: !!kind ? kind : null,
                    keyword: !!keyword ? keyword : null
                }
            }

            await this.$store.dispatch(dispatch, params)

            if (!this.usersState?.status) {
                console.error(this.usersState?.message)
                this.isBusy = false
            } else {
                this.users = this.usersState?.users ?? []
                this.pagination = this.usersState?.pagination
                this.isBusy = false
            }
        },
        onClickModalInvite() {
            this.$router.push(`/dashboard/users/create`)
        }
    }
};
</script>

<style>
</style>