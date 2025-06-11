<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Leaderboards"/>

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <div class="row">
                <LeaderboardsTable
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :leaderboardDetail="leaderboardDetail"
                    :pagination="pagination"
                    @page="pageChange"
                />
                
            </div>

            <!-- Footer -->
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"
import LeaderboardsTable from "@/components/template/micro/table/LeaderboardsTable.vue";

import { mapState } from 'vuex';

export default {
    components: {
        ContentHeader,
        Footer,
        LeaderboardsTable,
    },
    layout: 'dashboard',
    data () {
        return {
            role: 'leaderboards',
            classroomId: parseInt(this.$route.params.classroomId),
            isBusy: false,
            fields: [],
            items: [],
            leaderboardDetail: null,
            pagination: {
                currentPage: 1,
                perPage: 10,
                totalRows: 1,
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
            },
            userKind: localStorage.getItem('user_kind'),
            currentBatch: JSON.parse(localStorage.getItem('student_batch')),
        }
    },
    created() {
        this.setFields()
    },
    computed: {
        ...mapState({
            classroomsState: (state) => state.Classrooms,
        })
    },
    methods: {
        setFields() {
            this.fields = [
                {   
                    key: "index", 
                    label: 'Ranking',
                    thStyle: { width: "10%" }
                },
                {
                    key: 'name',
                    label: 'Nama',
                    // sortable: true
                },
                {
                    key: 'score',
                    label: 'Nilai',
                    // sortable: true,
                },
                {
                    key: 'action',
                    label: '',
                    thStyle: { width: "10%" }
                    // sortable: true,
                },
            ]
            this.getLeaderboards()
        },
        async getLeaderboards() {
            this.isBusy = true;
            await this.$store.dispatch('Classrooms/getLeaderboards', this.classroomId);

            if (!this.classroomsState.status) {
                console.error('Failed fetch leaderboards', this.classroomsState.message);
                this.isBusy = true;
            } else {
                this.leaderboardDetail = this.classroomsState.leaderboardDetail
                this.leaderboardDetail.classroomId = this.classroomId
                this.items = this.leaderboardDetail.leaderboards

                this.pagination = {
                    currentPage: 1,
                    perPage: 10,
                    totalRows: this.items.length,
                };

                this.isBusy = false;
            }
        },
        async pageChange(e) {
            this.pagination.currentPage = e;
            await this.getLeaderboards();
        }
    }
}
</script>