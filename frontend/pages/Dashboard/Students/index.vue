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
                    :programs="programs"
                    :cities="cities"
                    :filters="filters"
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
import { mapState } from 'vuex';

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        UserTable,
    },
    computed: {
        ...mapState({
            usersState: (state) => state.Users
        })
    },
    data() {
        return {
            role: 'siswa',
            isBusy: true,
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
                // {
                //     key: 'score',
                //     label: 'Skor',
                //     // sortable: true
                // },
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
            userKind: localStorage.getItem('user_kind'),
            programs: [],
            cities: [],
            approvalStatus: [],
            pretestStatus: [],
            filters: [],
        }
    },
    mounted() {
        if(this.userKind != 'teacher') this.getUsersApproved({page: 1});
        else this.getUserDetail()
    },
    methods: {
        async getUserDetail() {
            await this.$store.dispatch('Users/fetchDetailUser');

            if (!this.usersState.status) {
                console.error('Failed to fetch user detail', this.userState.message);
            } else {
                this.getUsersApproved({page: 1});
            }
        },
        async getUsersApproved({ keyword, program, city, sortBy, sortType, studentStatus, page }) {
            this.isBusy = true

            var dispatch = ''
            var schoolId = null

            if(this.userKind == 'teacher') {
                dispatch = 'Users/getUsersApprovedBySchool'
                schoolId = this.usersState.detail_auth.schoolId
            } else {
                dispatch = 'Users/getUsersApproved'
            }

            await this.$store.dispatch(dispatch, {
                search: keyword,
                sortBy: sortBy,
                sortType: sortType,
                page: page,
                programId: program,
                cityId: city,
                studentStatus: studentStatus,
                schoolId: schoolId
            })
            .then(() => {
                var usersState = this.$store.state.Users

                if(!usersState.status) {
                    console.error('Failed get users', usersState.message)
                    this.isBusy = false
                } else {
                    this.items = usersState.students
                    this.pagination = {
                        currentPage: usersState.pagination.currentPage,
                        perPage: usersState.pagination.perPage,
                        totalRows: usersState.pagination.totalRows,
                    }

                    if (this.userKind != 'industry') {
                        if (this.userKind != 'partner') {
                            this.cities = usersState.cities;
                        }
                        this.filters = usersState.studentStatus;
                    }

                    this.programs = usersState.programs;

                    this.isBusy = false
                }
            })
        },
    }
};
</script>

<style>
</style>