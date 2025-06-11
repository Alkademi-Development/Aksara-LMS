<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Mentor" />

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
                    @fetchData="getMentors"
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
import { mapState } from 'vuex'

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        UserTable,
    },
    computed: {
        ...mapState({
            userState: (state) => state.Users,
        })
    },
    data() {
        return {
            role: 'mentor',
            userKind: localStorage.getItem('user_kind'),
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
                    // sortable: true
                },
                // {
                //     key: 'phone',
                //     label: 'No Handphone'
                // },
                {
                    key: 'program',
                    label: 'Program',
                    // sortable: true,
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
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
            }
        }
    },
    created() {
        this.fetchUserDetail()
    },
    methods: {
        async fetchUserDetail() {
            this.isBusy = true
            await this.$store.dispatch('Users/fetchDetailUser');

            if (!this.userState.status) {
                console.error('Failed to fetch user detail', this.userState.message);
                this.isBusy = false
            } else {
                this.fetchUserDetailById()
            }
        },
        async fetchUserDetailById() {
            const userId = this.userState.detail_auth.id
            await this.$store.dispatch('Users/fetchDetailUserById', userId);

            if (!this.userState.status) {
                console.error('Failed to fetch user detail by id', this.userState.message);
            } else {
                this.isBusy = false
                this.getMentors({page: 1})
            }
        },
        async getMentors({page}) {
            this.isBusy = true

            var params = {
                page: page
            }

            if(this.userKind == 'lead_program') {
                var params = {
                    page: page,
                    programId: this.userState.detail_user.program.id
                }
            }

            await this.$store.dispatch('Users/getMentors', params).then(() => {
                var mentorsState = this.$store.state.Users

                if(!mentorsState.status) {
                    console.log('Failed get mentors', mentorsState.message)
                    this.isBusy = false
                } else {
                    this.items = mentorsState.mentors

                    this.pagination = {
                        currentPage: mentorsState.pagination.currentPage,
                        perPage: mentorsState.pagination.perPage,
                        totalRows: mentorsState.pagination.totalRows,
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