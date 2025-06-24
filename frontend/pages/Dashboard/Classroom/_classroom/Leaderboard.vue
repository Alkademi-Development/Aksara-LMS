<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Leaderboard" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <div class="row">
                <LeaderBoardTable 
                    :isBusy="isLeaderboardBusy"
                    :fields="leaderboardField"
                    :items="leaderboardItem"
                    :pagination="pagination"
                    :leaderboardDetail="leaderboardDetail"
                    :classroomDetail="classroomDetail"
                    @fetchData="busyToggler"
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
import LeaderBoardTable from '@/components/template/micro/table/LeaderBoardTable.vue';

import { mapState } from 'vuex';

export default {
    layout: 'dashboard',
    async asyncData ({ params }) {
        const classId = parseInt(params.classroom);
        return { classId };
    },
    components: {
        ContentHeader,
        Footer,
        LeaderBoardTable
    },
    data () {
        return {
            role: 'Leaderboard',
            isLeaderboardBusy: true,
            classroomDetail: null,
            totalStudents: false,
            leaderboardDetail: null,
            leaderboardItem: [],
            leaderboardField: [
                {
                    key: "no", 
                    label: 'Ranking',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'name',
                    label: 'Nama',
                },
                {
                    key: 'score',
                    label: 'Nilai',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                }
            ],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 1,
            },

        }
    },
    created() {
        this.getClassroomDetail()
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },
    methods: {
        busyToggler(page) {
            this.pagination.page = page
            this.fetchLeaderboards()
        },
        async getClassroomDetail () {
            this.isLeaderboardBusy = true

            await this.$store.dispatch('Services/classroomDetail', {id: this.classId});

            if (!this.servicesState.status) {
                console.error('failed fetch classroom detail', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
            } else {
                this.classroomDetail = this.servicesState.classroomDetail
                if (this.leaderboardDetail == null) this.fetchLeaderboards()
                else this.setEvent("Tidak ada leaderboards", false)
            }
        },
        async fetchLeaderboards() {
            this.isLeaderboardBusy = true

            const params = {
                classroomId: this.classId,
                page: this.pagination.page
            }

            let dispatch = 'Services/classroomLeaderboards'
            
            if (this.classroomDetail.pretest == 1) dispatch = 'Services/pretestLeaderboards'

            await this.$store.dispatch(dispatch, params)

            if (!this.servicesState.status) {
                console.error('failed fetch leaderboards', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
            } else {
                this.leaderboardDetail = this.servicesState.leaderboardDetail
                const dataLeaderboards = this.leaderboardDetail.leaderboards

                if (dataLeaderboards != null) {
                    this.leaderboardItem = dataLeaderboards.items ?? []
                    this.totalStudents = dataLeaderboards.totalItems
                    this.pagination = {
                        page: dataLeaderboards.page,
                        perPage: dataLeaderboards.perPage,
                        totalItems: dataLeaderboards.totalItems,
                        totalPages: dataLeaderboards.totalPages,
                    }
                }
                this.isLeaderboardBusy = false
            }
        },
    }
}
</script>

<style>

</style>