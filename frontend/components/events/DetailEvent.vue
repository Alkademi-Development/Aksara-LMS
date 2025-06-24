<template>
    <section id="detail-event">
        <b-row>

            <!-- left Content -->
            <b-col cols="12" lg="5">
                
                <h4 class="mb-4">Jadwal Kegiatan</h4>

                <template v-if="isLoaded">
                    <b-card class="border card-group">
                        <div>
                            <div class="d-flex flex-row align-items-center gap-3">
                                <i class="ri-calendar-2-line" style="font-size: 20px"></i>
                                <span>
                                    {{ formatDate(detailEvent?.start, detailEvent?.end) }}
                                </span>
                            </div>

                            <div class="py-3 my-3 d-flex flex-row align-items-center gap-3">
                                <i class="ri-cast-line" style="font-size: 20px"></i>
                                <span>
                                    {{ detailEvent?.type === 'online' ? detailEvent?.type : detailEvent?.type === 'offline' && !!detailEvent?.place ? detailEvent?.place : detailEvent?.type === 'gmeet' ? 'Online On Google Meet' : detailEvent?.type === 'zoom' ? 'Online On Zoom Meeting' : detailEvent?.type }}
                                </span>
                            </div>

                            <div>
                                <b-button
                                    v-if="!!detailEvent?.link"
                                    :variant="userKind === 'student' ? 'outline-primary' : 'primary'"
                                    class="btn-action-add"
                                    @click="onJoinClick(detailEvent)"
                                    pill>Join Sekarang</b-button>
                            </div>
                        </div>

                        <template v-if="userKind !== 'student' && detailEvent?.attendanceId === 0">
                            <b-button
                                variant="primary"
                                class="btn-action-add mt-5"
                                @click="attendanceAction(detailEvent, 'create')"
                                block>Buat Absen</b-button>
                        </template>

                        <!-- <template v-if="userKind !== 'student' && detailEvent?.attendanceId !== 0">
                            <b-button
                                variant="outline-primary"
                                class="btn-action-add mt-5"
                                @click="attendanceAction(detailEvent, 'recap')"
                                block>Rekap Absen</b-button>
                        </template> -->

                        <template v-if="userKind === 'student' && detailEvent?.attendanceId !== 0 && isShowAttendance">
                            <b-button
                                variant="primary mt-5"
                                class="btn-action-add"
                                @click="attendanceAction(detailEvent, 'attendIn')"
                                block>Absen</b-button>
                        </template>
                    </b-card>

                    <template v-if="userKind !== 'student' && detailEvent?.attendanceId != 0">
                        <b-card class="border card-group">
                            <StatisticCard
                                :attendanceStats="attendanceStats"
                                :chartData="attendancePost?.data"
                                :chartProps="attendancePost"
                                :urlQR="urlQR"
                                @onEdit="onEdit"
                            />

                            <template>
                                <b-button
                                    variant="outline-primary"
                                    class="btn-action-add"
                                    @click="attendanceAction(detailEvent, 'recap')"
                                    block>Rekap Absen</b-button>
                            </template>
                        </b-card>
                    </template>
                </template>


                <b-card class="border card-group" v-if="!isLoaded">
                    <div class="mb-4">
                        <b-skeleton type="p" width="100%" class="mb-2"></b-skeleton>
                        <b-skeleton type="p" width="100%" class="mb-2"></b-skeleton>
                        <b-skeleton type="button" width="45%"></b-skeleton>
                    </div>
                    <b-skeleton type="button" width="100%"></b-skeleton>
                </b-card>

            </b-col>

            <!-- Right Content -->
            <b-col cols="12" lg="7">

                <h4 class="mb-4">Detail Kegiatan</h4>

                <b-card class="border card-group" v-if="isLoaded">
                    <p class="text-break" v-html="detailEvent?.summary ?? ''"></p>
                </b-card>

                <b-card class="border card-group" v-if="!isLoaded">
                    <div class="mb-4">
                        <b-skeleton width="100%"></b-skeleton>
                        <b-skeleton width="80%"></b-skeleton>
                        <b-skeleton width="75%"></b-skeleton>
                        <b-skeleton width="90%"></b-skeleton>
                        <b-skeleton width="70%"></b-skeleton>
                    </div>
                    <div>
                        <b-skeleton width="80%"></b-skeleton>
                        <b-skeleton width="95%"></b-skeleton>
                        <b-skeleton width="85%"></b-skeleton>
                        <b-skeleton width="65%"></b-skeleton>
                        <b-skeleton width="70%"></b-skeleton>
                    </div>
                </b-card>

            </b-col>

        </b-row>
    </section>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import { toEncrypt } from '~/commons/utils'
import appToken from '~/api/app-token'

import StatisticCard from '@/components/attendance/micro/StatisticCard.vue'

export default {
    components: { StatisticCard },
    props: {
        classroomId: {
            type: Number,
            default: 0,
        },
        eventSlug: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            userKind: localStorage.getItem('user_kind'),

            isLoaded: false,
            isShowAttendance: false,

            attendanceStats: [
                { name: 'present', title: 'Hadir', value: '0%' },
                { name: 'absent', title: 'Tidak Hadir', value: '0%' },
                { name: 'percentage', title: 'Persentase', value: 0 },
            ],
            urlQR: ''
        }
    },
    computed: {
        ...mapState({
            detailEvent: (state) => state.Post?.post?.post,
            servicesState: (state) => state.Services,
            statePost: (state) => state?.Post,
            attendancePost: (state) => state.Dashboard.attendancePost,
        })
    },
    created() {
        this.getDetailEvent()
    },
    methods: {
        ...mapActions({
            getPost: "Post/getDetailPostV2",
            getAttendancePost: 'Dashboard/fetchAttendancePost',
        }) ,
        async getDetailEvent() {
            // const params = {
            //     classroomId: this.classroomId,
            //     eventId: this.eventId
            // }

            await this.getPost(this.eventSlug)
            
            if (!this.statePost.status) {
                console.error('Failed fetch detail event', this.statePost.message)

                this.isLoaded = false
            } else {
                if (this.detailEvent?.attendanceId && this.userKind !== 'student') {
                    await this.getAttendanceStats()

                    await this.generateQR()

                    this.attendanceStats.map((item) => {
                        if (item.name == 'absent') return item.value = (this.attendancePost?.data?.datasets[0]?.data[0] || 0) + '%'
                        if (item.name == 'present') return item.value = (this.attendancePost?.data?.datasets[0]?.data[1] || 0) + '%'
                        if (item.name == 'percentage') {
                            if (this.attendancePost?.data?.datasets[0]?.data[1] > 0) {
                                const value = Math.floor(this.attendancePost?.data?.datasets[0]?.data[1] / (this.attendancePost?.data?.datasets[0]?.data[0] + this.attendancePost?.data?.datasets[0]?.data[1]) * 100)
                                return item.value = value
                            }
                        }
                    })
                }

                this.setShowAttendance()

                this.isLoaded = true
            }
        },
        formatDate(start, end) {
            moment.locale('id')
            if (!start && !end) return

            const fixedStart = start.replace('Z', '')
            const fixedEnd = end.replace('Z', '')

            if (moment(fixedStart).format('DD MMMM YYYY') == moment(fixedEnd).format('DD MMMM YYYY')) {
                return moment(fixedStart).format('dddd, DD MMMM YYYY HH:mm') + ' - ' + moment(fixedEnd).format('HH:mm')
            } else {
                return moment(fixedStart).format('dddd, DD MMMM YYYY HH:mm') + ' - ' + moment(fixedEnd).format('dddd, DD MMMM YYYY HH:mm')
            }
        },
        setShowAttendance() {
            moment.locale('id')
            const currentDate = new Date()
            const eventStart = new Date(this.detailEvent?.start?.replace('Z', ''))
            const eventEnd = new Date(this.detailEvent?.end?.replace('Z', ''))

            if (currentDate >= eventStart && currentDate <= eventEnd) this.isShowAttendance = true
        },
        onJoinClick(event) {
            window.open(event?.link, '_blank')
        },
        async attendanceAction(detailEvent, action) {
            if (action === 'create') {
                localStorage.setItem('startDate', toEncrypt(detailEvent?.start))
                localStorage.setItem('endDate', toEncrypt(detailEvent?.end))
                localStorage.setItem('eventId', toEncrypt(detailEvent?.id))

                this.$router.push(`${this.$route?.fullPath}/attendance/create`)
            }

            if (action === 'recap') {
                localStorage.setItem('eventId', toEncrypt(detailEvent?.id))
                localStorage.setItem('attendanceId', toEncrypt(detailEvent?.attendanceId))
                this.$router.push(`${this.$route?.fullPath}/attendance/recap`)
            }

            if (action == 'attendIn') {
                const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=800,height=500,left=200,top=200`

                // const baseUrl = process?.env?.alkademiAuth
                // const urlTarget = process?.env?.attendanceURL
                // const token = localStorage.getItem('access_token')

                // const redirect = `&redirectTo=${urlTarget}`
                // const attendanceId = `&attendanceId=${toEncrypt(detailEvent?.attendanceId)}`
                // const lmsId = "&lmsId=" + localStorage.getItem('lmsId')
                // const code = `&code=${await appToken?.getCode()}`
                // const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

                // // const url = `${baseUrl}/check?${redirect}${lmsId}${attendanceId}${code}${generatedToken}`
                // const url = `${urlTarget}?${attendanceId}${code}${generatedToken}&token=${token}`

                // const handle =  window.open(url, 'Absen Masuk', params)
                // if (!handle) window.open(url, 'Absen Masuk')

                // Redirect to auth
                const attendanceId = `&attendanceId=${toEncrypt(detailEvent?.attendanceId)}`
                const redirectLms = "&redirectTo=" + window.location.href

                const urlTarget = `${process?.env?.attendanceURL}${attendanceId}` + redirectLms;

                const baseUrl = process.env.alkademiAuth;
                const redirect = "&redirectTo=" + urlTarget;
                const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
                const codeToken = `&code=${await appToken?.getCode()}`
                const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
                const url = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;
                const handle =  window.open(url, 'Absen Masuk', params)
                if (!handle) window.open(url, 'Absen Masuk')
            }
        },
        onEdit() {
            localStorage.setItem('eventId', toEncrypt(this.detailEvent?.id))
            localStorage.setItem('attendanceId', toEncrypt(this.detailEvent?.attendanceId))
            this.$router.push(`${this.$route?.fullPath}/attendance/edit`)
        },
        async getAttendanceStats() {
            const payload = {
                id: this.detailEvent?.attendanceId,
            }

            await this.getAttendancePost(payload)
        },
        async generateQR() {
            // const baseUrl = process.env.attendanceURL
            // const attendanceId = `&attendanceId=${toEncrypt(this.detailEvent?.attendanceId)}`
            // const code = `&code=${await appToken?.getCode()}`
            // const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            // const source = `&source=${toEncrypt('guest')}`

            // this.urlQR = `${baseUrl}?${attendanceId}${code}${generatedToken}${source}`

            // Redirect to auth
            const attendanceId = `&attendanceId=${toEncrypt(this.detailEvent?.attendanceId)}`
            const redirectLms = "&redirectTo=" + window.location.href

            const urlTarget = `${process?.env?.attendanceURL}${attendanceId}` + redirectLms;

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            this.urlQR = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;
        },
    }
}
</script>
