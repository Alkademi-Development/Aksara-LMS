<template>
    <div>
        <div class="row" v-if="attendanceId">
            <Doughnat
                containerClass="col-12 col-md-5"
                title="Persentase Kehadiran"
                showDateRangePicker
                :chartProps="attendanceClass"
                :chartData="attendanceClass?.data"
                :height="300"
                @onDateChange="onDateChange"
            />
            <LineVue
                containerClass="col-12 col-md-7"
                title="Kehadiran"
                showDropdown
                :isBusy="attendanceStatus"
                :chartProps="attendanceChart"
                :chartData="attendanceChart?.data"
                :filtersItems="filterAttendance"
                :height="235"
                :selectedFilterValue="selectedAttendanceFilter"
                @onChangeFilter="(...args) => filterItem(...args)"
            />
        </div>
        <div class="row">
            <LineVue
                containerClass="col-12 col-md-7"
                title="Participant Funel"
                :chartProps="participantFunnelChart"
                :chartData="participantFunnelChart?.data"
            />
            <Doughnat
                containerClass="col-12 col-md-5"
                title="Participant Submission Rate"
                :chartProps="submissionRateChart"
                :chartData="submissionRateChart?.data"
                :height="300"
            />
        </div>
        <div class="row">
            <Bar
                v-if="!!registrarDataChart"
                containerClass="col-12 col-md-7"
                title="Participant Submission Monitoring"
                showLegend
                :chartProps="registrarDataChart"
                :chartData="registrarDataChart?.data"
                :isStacked="false"
            />
            <ParticipantsTableVue 
                containerClass="col-12 col-md-5"
                title="Peringkat Teratas Minggu Ini"
                :fields="participantFields"
                :items="participants?.items"
                :isBusy="participants?.isBusy ?? false"
                :classroomId="classId"
            />
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'

import Bar from "@/components/template/micro/chart/Bar.vue"
import Chart from '~/components/template/micro/chart/Chart.vue'
import Doughnat from '~/components/template/micro/chart/Doughnat.vue'
import ParticipantsTableVue from '~/components/template/micro/table/Dashboard/Admin/ParticipantsTable.vue'
import LineVue from '@/components/template/micro/chart/Line.vue'
import CardTaskProgress from '~/components/template/micro/card/CardTaskProgress.vue'

export default {
    props: {
        classId: {
            type: Number,
            default: 0
        },
        attendanceId: {
            type: Number,
            default: 0
        }
    },
    components: {
        Bar,
        Chart,
        Doughnat,
        LineVue,
        ParticipantsTableVue,
        CardTaskProgress
    },
    data() {
        return {
            assignment: [],
            pagination: {
                page: 1,
                perPage: 4,
                totalItems: 0,
                totalPages: 0,
            },

            participantFunnelChart: {},
            submissionRateChart: {},
            registrarDataChart: {},

            selectedAttendanceFilter: null,

            filterAttendance: [
                { label: 'Monthly', value: 1 },
                { label: 'Weekly', value: 2 },
            ],

            attendanceParams: {
                id: this.classId,
                type: 'monthly'
            },
            attendanceStatus: false
        }
    },  
    computed: {
        ...mapState({
            submissionRate: (state) => state.Dashboard.submissionRate,
            participants: (state) => state.Dashboard.participants,
            participantFields: (state) => state.Dashboard.participants?.fields?.filter(item => item.key != 'classroomName'),
            participantFunnel: (state) => state.Dashboard.participantFunnel,
            registrarChart: (state) => state.Dashboard.registrarChart,
            attendanceClass: (state) => state.Dashboard.attendanceClass,
            attendanceChart: (state) => state.Dashboard.attendChart,
        }),
    },
    mounted() {
        this.getSubmissionRate(this.classId).then(() => {
            this.submissionRateChart = this.submissionRate;
            this.getParticipants(this.classId).then(() => {
                this.getParticipantFunnel(this.classId).then(() => {
                    this.participantFunnelChart = this.participantFunnel;
                    this.getRegistrarChart(this.classId).then(() => {
                        this.registrarDataChart = this.registrarChart;
                        this.getAttendanceChart(this.attendanceParams)
                    })
                })
            })
        })
    },
    beforeDestroy() {
        this.clearParticipants();
    },
    methods: {
        ...mapActions({
            getSubmissionRate: 'Dashboard/fetchSubmissionRate',
            getParticipants: 'Dashboard/fetchParticipants',
            getParticipantFunnel: 'Dashboard/fetchParticipantFunnel',
            getRegistrarChart: 'Dashboard/fetchRegistrarChart',
            getAttendanceClass: 'Dashboard/fetchAttendanceClass',
            getAttendanceChart: 'Dashboard/fetchAttendanceChart',
            clearParticipants: "Dashboard/clearParticipants",
        }),
        async onDateChange(dateRange) {
            moment.locale('id')
            if (this.attendanceId) {
                const startDate = moment(dateRange?.startDate)?.format('YYYY-MM-DD')
                const endDate = moment(dateRange?.endDate)?.format('YYYY-MM-DD')
    
                const payload = {
                    id: this.classId,
                    startDate: startDate,
                    endDate: endDate
                }
    
                await this.getAttendanceClass(payload)
            }

        },
        filterItem(filter) {
            this.attendanceStatus = true
            this.selectedAttendanceFilter = filter

            if (filter?.value == 1) this.attendanceParams.type = 'monthly'
            if (filter?.value == 2) this.attendanceParams.type = 'weekly'

            this.getAttendanceChart(this.attendanceParams).then(() => {
                this.attendanceStatus = false
            })
        },
    },

}
</script>

<style>
</style>