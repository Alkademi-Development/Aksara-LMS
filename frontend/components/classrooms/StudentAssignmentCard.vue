<template>
    <b-card no-body>
        <b-card-body>

            <b-row v-if="!isBusy" align-v="center">

                <template v-if="moduleDetail.kind == 'assignment' && assignment.type != 'link'">
                    <b-col cols="12" md="8" lg="12" class="mb-4">
                        <div class="d-flex align-items-center">
                            <h5 class="text-muted mr-1">{{ assignmentDetail ? assignment.type == 'studio' ? 'Editor' : 'Quiz' : 'Tugas' }}</h5>
                            <template v-if="assignmentDetail != null">
                                <h5 v-if="assignment.type == 'form'" class="text-muted mr-1"> &bull; {{assignmentDetail.questions}} Soal</h5>
                                <template v-if="assignmentDetail.timer != 0">
                                    <h5 v-if="timeInterval == null" class="text-muted">&bull; {{assignmentDetail.timer}} Menit</h5>
                                    <h5 v-else class="text-muted">&bull; {{ times[1].time | timeFormat }}:{{ times[2].time | timeFormat }}:{{ times[3].time | timeFormat }} Tersisa</h5>
                                </template>
                            </template>
                        </div>
                        <b-card-title class="mb-2">{{ assignmentDetail ? assignment.type == 'studio' ? assignmentDetail.name : assignmentDetail.title : 'Kerjakan Tugas'}}</b-card-title>
                    </b-col>

                    <b-col cols=12 md=4 lg=12 class="d-flex align-items-center justify-content-end">
                        <b-button v-if="!isAssign && assignment.externalId == ''" pill variant="primary" @click="assignTask">Mulai Mengerjakan</b-button>
                        <template v-else-if="!isAssign && assignment">
                            <b-button v-if="assignment.submitted_at == null" pill variant="primary" @click="openTask(null)">Lanjut Mengerjakan</b-button>
                            <b-button v-else pill variant="primary" disabled>Sudah dikerjakan</b-button>
                        </template>
                        <b-button v-else-if="isAssign" pill variant="primary" class="d-flex align-items-center" ><b-spinner small class="mr-2"></b-spinner>Loading...</b-button>
                    </b-col>
                </template>

                <template v-if="moduleDetail.kind == 'assignment' && assignment.type == 'link'">
                    <b-col cols="12" md="8" lg="12">
                        <h5 class="text-muted">Tugas</h5>
                        <b-card-title class="mb-2">Kumpulkan Tugas</b-card-title>
                    </b-col>

                    <b-col cols="12" md="4" lg="12">
                        <b-form @submit="assignLink" class="w-100">
                            <b-form-group label-for="">
                                <b-form-input
                                    v-model="taskLink"
                                    id="inputLink"
                                    placeholder="Masukan url tugas"
                                    type="url"
                                    required
                                ></b-form-input>
                            </b-form-group>
                            <div class="d-flex align-items-center justify-content-end">
                                <b-button v-if="!isAssign" variant="primary" type="submit" pill>{{assignment.submitted_at == null ? 'Kumpulkan' : 'Kumpulkan Ulang'}}</b-button>
                            </div>
                        </b-form>
                        <div class="d-flex align-items-center justify-content-end">
                            <b-button v-if="isAssign" variant="primary" pill><b-spinner small class="mr-2"></b-spinner>Loading...</b-button>
                        </div>
                    </b-col>
                </template>

            </b-row>

            <b-row v-else no-gutters align-v="center">

                <b-col cols="12" md="8" lg="12" class="mb-4">
                    <b-skeleton width="100%"></b-skeleton>
                </b-col>

                <b-col cols=12 md=4 lg=12 class="d-flex align-items-center justify-content-end">
                    <b-skeleton width="40%"></b-skeleton>
                </b-col>
                <b-col cols=12 md=4 lg=12 class="d-flex align-items-center justify-content-end">
                    <b-skeleton width="40%"></b-skeleton>
                </b-col>

            </b-row>

        </b-card-body>
    </b-card>
</template>

<script>
import { mapState } from 'vuex';
import moment from "moment";

import appToken from '~/api/app-token'

export default {
    props: {
        classroomId: Number,
        topicId: Number,
        autoStartAssignment: {
            type: Boolean,
            default: false,
        },
        openAssignment: {
            type: Boolean,
            default: false,
        },
        assignment: {
            type: Object,
            default: null
        },
        assignmentDetail: {
            type: Object,
            default: null
        },
        moduleDetail: {
            type: Object,
            default: null
        },
        isBusy: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    data() {
        return {
            isAssign: false,
            taskLink: "",
            title: "",
            // Time
            timeout: false,
            startTime: "July 7, 2017 12:03:00",
            endTime: "March 10, 2022 18:13:00",
            times: [
            { id: 0, text: "Days", time: 1 },
            { id: 1, text: "Hours", time: 1 },
            { id: 2, text: "Minutes", time: 1 },
            { id: 3, text: "Seconds", time: 1 }
            ],
            progress: 100,
            timeInterval: null,
        }
    },
    filters: {
        timeFormat: function (time) {
            if (time.toString().length == 1) {
                return `0${time}`
            } else {
                return time
            }
        }
    },
    created() {
        this.getCredentials()
    },
    mounted() {
        this.setTaskLink()
        this.setTime()
        // this.setAutoStart()
    },
    watch: {
        isBusy() {
            this.setTaskLink()
            this.setTime()
            this.setAutoStart()
        },
        openAssignment() {
            if (this.openAssignment) this.setAutoStart()
        }
    },
    methods: {
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.title = res[1].toLowerCase()
        },
        async assignTask() {
            this.isAssign = true;

            const params = {
                classId: this.classroomId,
                topicId: this.topicId,
            }

            await this.$store.dispatch('Services/classroomAssignTask', params)

            if(!this.servicesState.status) {
                console.error('Failed start assign task: ', this.servicesState.message)
                this.isAssign = false
            } else {
                // this.isAssign = false
                setTimeout(async () => {
                    await this.openTask(this.servicesState.data.externalId)
                    if (!this.autoStartAssignment) this.$emit('loadModule')
                    this.isAssign = false
                }, 1000);
            }
        },
        async assignLink(event) {
            event.preventDefault()
            this.isAssign = true;

            const params = {
                classroomId: this.classroomId,
                topicId: this.topicId,
                link: this.taskLink
            }

            await this.$store.dispatch('Services/classroomAssignLink', params)

            if(!this.servicesState.status) {
                console.error('Failed assign task: ', this.servicesState.message)
                this.isAssign = false
            } else {
                // this.isAssign = false
                setTimeout(() => {
                    this.$emit('loadModule')
                    this.isAssign = false
                }, 1000);
            }
        },
        async openTask(data) {
            const redirectLms = "redirectTo=" + window.location.href

            var urlTarget = ""
            if (this.assignment.type == 'studio') urlTarget = process.env.editorURL + `compiler?&metronomId=${data ?? this.assignment.externalId}` + "&" + redirectLms
            if (this.assignment.type == 'form') urlTarget = process.env.formURL + "fill?" + '&formId=' + this.moduleDetail.externalId + "&responseId=" + (data ?? this.assignment.externalId) + "&" + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            const url = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;
            // console.log(this.assignment)
            // const tes = "responseId=" + (data ?? this.assignment.externalId)
            // console.log(tes, "URL")
            setTimeout(() => {
                window.open(url, '_blank')
            }, 250);
        },
        setTaskLink() {
            if (!this.isBusy && this.moduleDetail.kind == 'assignment' && this.assignment.type == 'link') {
                if (this.assignment.submitted_at != null) this.taskLink = this.assignment.link
            }
        },
        setAutoStart() {
            // console.log("AUTO")
            if (!this.isBusy && this.moduleDetail.kind == 'assignment' && this.assignment.type != 'link' && this.title == 'tes') {
                // console.log("If Handle")
                setTimeout(() => {
                    if (this.assignment.externalId == '') this.assignTask()
                    else if (this.assignment) {
                        // console.log("Open")
                        if (this.assignment.submitted_at == null) this.openTask(null)
                        else this.$emit('assignmentSubmitted')
                    } else console.error("ANY")
                    this.$emit('processAutoStart')
                }, 500);
            }
            this.$emit('stopOpenAssignment')
        },
        setTime() {
            if (!this.isBusy && this.moduleDetail.kind == 'assignment') {
                if (this.assignment.externalId != '') {
                    if (this.assignmentDetail.timer != 0 && !this.assignment.submitted_at) {
                        this.startTime = this.assignmentDetail.startTime
                        this.endTime = moment(this.startTime).add(this.assignmentDetail.timer, 'minutes').valueOf()

                        const end = moment(this.endTime).valueOf()
                        const now = moment().valueOf()

                        this.timeout = now > end

                        // console.log(now, end, this.timeout, this.startTime, this.endTime)

                        if (!this.timeout) {
                            this.updateTimer();
                            this.timeInterval = setInterval(this.updateTimer, 1000);
                        } else {
                            this.timeOutHandler()
                        }

                    } else {
                        this.endTime = null
                        this.timeout = false
                    }
                }
            }
        },
        updateTimer() {
            if (
                this.times[3].time > 0 ||
                this.times[2].time > 0 ||
                this.times[1].time > 0 ||
                this.times[0].time > 0
            ) {
                this.getTimeRemaining();
                this.updateProgressBar();
            } else {
                clearTimeout(this.timeInterval);
                // this.times[3].time = this.times[2].time = this.times[1].time = this.times[0].time = 0;
                this.progress = 0;
                this.timeOutHandler()
            }
        },
        getTimeRemaining() {
            let t = Date.parse(new Date(this.endTime)) - Date.parse(new Date());
            if(t >= 0){
                this.times[3].time = Math.floor(t / 1000 % 60); //seconds
                this.times[2].time = Math.floor(t / 1000 / 60 % 60); //minutes
                this.times[1].time = Math.floor(t / (1000 * 60 * 60) % 24); //hours
                this.times[0].time = Math.floor(t / (1000 * 60 * 60 * 24)); //days
            }else {
                this.times[3].time = this.times[2].time = this.times[1].time = this.times[0].time = 0;
                this.progress = 0;
            }
        },
        updateProgressBar() {
            let startTime = Date.parse(new Date(this.startTime));
            let currentTime = Date.parse(new Date());
            let endTime = Date.parse(new Date(this.endTime));
            let interval = parseFloat(
                (currentTime - startTime) / (endTime - startTime) * 100
            ).toFixed(2);
            this.progress = 100-interval;
        },
        timeOutHandler() {
            this.timeout = true
            this.timeInterval = null
            this.times.map((item, index) => {
                this.times[index].time = 0
            })
        },
    }
}
</script>