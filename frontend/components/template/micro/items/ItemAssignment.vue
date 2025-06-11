<template>
    <b-card :class="`item-assignment border ${ isActiveCard ? 'active' : '' } mb-4`" @click="$emit('onClickCard')">
        <b-row class="mb-2">
            <b-col class="title-container">
                <div class="d-flex flex-column align-items-start flex-sm-row align-items-sm-center">
                    <div class="title d-flex align-items-center gap-2 mb-2 mb-sm-0">
                        <template v-if="!!assignment?.submitted_at">
                            <img v-if="assignment?.scored" src="/dashboard/assets/image/checklistgreen.svg" alt="">
                            <img v-else src="/dashboard/assets/image/progressyellow.svg" alt="">
                        </template>
                        <div
                            @click="$emit(isPretest && user_kind != 'student' ? 'onClickReviewStudents' : 'onClickDetail', isPretest && user_kind != 'student' ? {} : { task: assignment })"
                            class="cursor-pointer text-limit limit-1"
                        >
                            {{ assignment?.title }}
                        </div>
                    </div>
                    <div 
                        :class="`course d-flex flex-row align-items-center ${ isPretest ? 'pointer-default' : '' }`" 
                        @click="$emit('onClickCourse')"
                    >
                        <i class="ri-file-list-line"></i>
                        <span class="text text-limit limit-1">{{ assignment?.moduleName }}</span>
                    </div>
                </div>
            </b-col>
            <b-col v-if="!isReview" class="action-container" cols="auto">
                <div 
                    class="d-flex flex-column align-items-center flex-sm-row flex-sm-nowrap gap-2 gap-sm-0" 
                    v-if="user_kind !== 'student' && user_kind !== 'teacher'"
                >
                    <div class="action border rounded" @click="$emit('onEditAssignment')">
                        <i class="ri-pencil-line"></i>
                    </div>
                    <div class="action text-danger border rounded" @click="$emit('toggleRemoveAssignment')">
                        <i class="ri-delete-bin-7-line"></i>
                    </div>
                </div>
            </b-col>
        </b-row>
        <div class="d-flex flex-row align-items-center">
            <div class="assignment-type mr-2">
                <span :class="assignment?.type">{{ assignment?.type }}</span>
            </div>
            <div v-if="assignment?.type === 'form'" class="time">
                <span v-if="assignment?.externalData?.timer">
                    {{ assignment?.externalData?.timer }} Menit
                </span>
                <span v-if="assignment?.externalData?.questions">
                    {{ assignment?.externalData?.questions }} Soal
                </span>
            </div>
        </div>

        <hr class="divider">

        <b-row no-gutters>
            <b-col cols="12" md class="description-container d-flex flex-row align-items-center mb-3 mb-md-0">
                <div class="description d-flex flex-column flex-md-row align-items-start align-items-md-center ">
                    <div v-if="user_kind !== 'student' && !isPretest" class="d-flex flex-row align-items-center mb-2 mb-md-0">
                        <template v-if="isAssignmentCounterLoaded">
                            <CircularProgresBar 
                                v-if="assignment?.totalStudent === 0"
                                :containerClass="'mr-1'"
                                :value="0" 
                                :max="1" 
                            />
                            <CircularProgresBar 
                                v-else-if="assignment?.scored < assignment?.totalStudent"
                                :containerClass="'mr-1'"
                                :value="assignment?.scored" 
                                :max="assignment?.totalStudent" 
                            />
                            <i v-else class="ri-checkbox-circle-fill done"></i>

                            <!-- <div class="mr-3">Tugas diperiksa <strong>({{ assignment?.scored }}/{{ assignment?.totalStudent }})</strong></div> -->
                            <div class="mr-3">Tugas diperiksa <strong>({{ assignmentCounter?.scored }}/{{ assignmentCounter?.totalStudent }})</strong></div>
                        </template>
                        <div v-else style="width: 250px !important">
                            <b-skeleton width="100%"></b-skeleton>
                        </div>
                    </div>
                    <div v-if="isPretest" :class="`help-container d-flex flex-row align-items-center mb-2 mb-md-0 ${ isHelpOpen ? 'active' : '' }`" @click="isHelpOpen = !isHelpOpen">
                        <i class="ri-question-line"></i>
                        <div class="mr-3">Baca Petunjuk</div>
                    </div>
                    <div class="d-flex flex-row align-items-center" v-if="!!assignment?.deadline">
                        <i class="ri-calendar-2-line"></i>
                        <span :style="`color : ${isDate == 0 || isDate == -1 || isDate <= -1 ? '#CD0404' : isDate == 1 ? '#FFC93C' : 'black' }`">{{ humanizeDate(assignment?.deadline) | formatDate }}</span>
                    </div>
                </div>
            </b-col>
            <template v-if="!isReview">
                <b-col v-if="isPretest && user_kind != 'student' && user_kind !== 'teacher'" cols="12" md="auto" >
                    <button :class="['btn rounded-pill btn-primary text-uppercase px-4']" @click="$emit('onClickReviewStudents')">
                        Lihat Peserta
                    </button>
                </b-col>
                <!-- <b-col v-else-if="isPretest && user_kind === 'student'" cols="12" md="auto" >
                    <button v-if="!assignment?.submitted_at && !assignment?.externalId" :class="['btn rounded-pill btn-primary text-uppercase px-4']" @click="assignTask" :disabled="isAssign ? true : false">
                        {{ isAssign ? 'Loading...' : 'Kerjakan' }}
                    </button>
                    <button v-else-if="!assignment?.submitted_at && assignment?.externalId" :class="['btn rounded-pill btn-primary text-uppercase px-4']" @click="openTask(assignment?.externalId)">
                        Lanjut Mengerjakan
                    </button>
                    <button v-else :class="['btn rounded-pill btn-outline-primary text-uppercase px-4']" disabled>
                        Sudah Mengerjakan
                    </button>
                </b-col> -->
                <b-col v-else cols="12" md="auto" >
                    <template v-if="user_kind !== 'teacher'">
                        <button :class="['btn rounded-pill px-4', user_kind === 'student' ? 'btn-primary' : 'btn-outline-primary']" @click="$emit(user_kind !== 'student' ? 'onClickReview' : 'onClickDetail', {
                            task: assignment
                        })">
                            <div v-if="isTestCase">
                                {{ user_kind === 'student' ? 'Buka Tes' : 'Periksa Tes'  }}
                            </div>
                            <div v-else>
                                {{ user_kind === 'student' ? 'Buka Tugas' : 'Periksa Tugas'  }}
                            </div>
                        </button>
                    </template>
                </b-col>
            </template>
        </b-row>
        <div v-if="isHelpOpen" class="help-description" v-html="assignment?.description"></div>
    </b-card>
</template>
<script>
import { mapState } from 'vuex';
import { toDateFromNow } from '@/commons/utils/.'
import moment from 'moment'

import CircularProgresBar from '@/components/classrooms/micro/CircularProgresBar.vue';

import appToken from '~/api/app-token'

export default {
    components: { CircularProgresBar },
    props: {
        classId: {
            type: Number,
            default: -1
        },
        user_kind: {
            type: String,
            default: 'student'
        },
        assignment: {
            type: Object,
            default: () => {}
        },
        isPretest: {
            type: Boolean,
            default: false
        },
        isReview: {
            type: Boolean,
            default: false
        },
        isActiveCard: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isHelpOpen: false,
            isDate:null,
            isColor:null,
            isTanggal: ["2023-03-10T17:00:00Z", "2023-03-26T19:48:00Z", "2023-03-28T19:48:00Z", "2023-03-29T19:48:00Z", "2023-03-30T19:48:00Z", "2023-03-31T19:48:00Z", "2023-04-01T19:48:00Z", "2023-04-02T19:48:00Z", "2023-04-03T19:48:00Z", "2023-03-05T19:48:00Z"],
            isAssign: false,
            isTestCase: false,
            assignmentCounter: {
                scored: 0,
                totalStudent: 0
            },
            isAssignmentCounterLoaded: false,
            isMovingCardAsssignment: false,
        }
    },
    watch: {
        assignment(item){
            if (this.user_kind !== 'student' && this.classId !== -1) this.isMovingCardAsssignment = true, this.getAssignmentCounter(this.classId, item?.id);
        },
    },
    computed: {
        ...mapState({
            servicesState: (state) => state?.Services,
            sassState: (state) => state.Sass,
            assignmentState: (state) => state.Assignments,
        })
    },
    mounted(){
        this.isTestCase = this.sassState.isTestCase
        this.humanizeDate(this.assignment?.deadline)

        if (this.user_kind !== 'student' && this.classId !== -1) this.getAssignmentCounter(this.classId, this.assignment?.id)

    },
    filters: {
        formatDate(value){
            moment.locale('id')
            if (!value) return ''

            let fixedDate = ''
        
            // const dateDue = moment(fixedDate).format()
            const dateNow = moment(new Date()).format()
            // const diffHours = moment(dateDue).diff(moment(dateNow), 'hours')
            let diffDay = moment(value).diff(dateNow, "days")
            if (typeof value == 'object') {
                diffDay = moment(value.diff).diff(dateNow, "days")
                fixedDate = value.date.replace('Z', '')
            } else fixedDate = value.replace('Z', '')

            // const deadlineTime = new Date(value),
            //     deadlineHours = deadlineTime.getUTCHours().toString().padStart(2, '0'),
            //     deadlineMinutes = deadlineTime.getUTCMinutes().toString().padStart(2, '0');
            
            // let formatingDate = value == 0 ? `Hari Ini, ${deadlineHours}:${deadlineMinutes}` : diffDay == 1 ? `Besok, ${deadlineHours}:${deadlineMinutes}` : value == -1 ? `Kemarin ${deadlineHours}:${deadlineMinutes}` : diffDay > 1 || diffDay ? moment(value).format("DD MMMM, YYYY") : ""
            // let times = `${deadlineHours}:${deadlineMinutes}`
            // let formattedDate;

            // if (diffHours > 0 && diffHours < 24) {
            //     formattedDate = `Hari ini, ${times}`
            // } else if (diffHours > 0 && diffHours < 48) {
            //     formattedDate = `Besok, ${times}`
            // } else if (diffHours > 48 || diffHours) {
            //     formattedDate = moment(fixedDate).format("DD MMMM, YYYY HH:mm")
            // } else {
            //     formattedDate = ''
            // }

            const startDay = moment().startOf('day')
            const diffHours = moment(fixedDate).diff(moment(startDay), 'hours')
            const diffMinutes = moment(fixedDate).diff(moment(startDay), 'minutes')
            let formattedDate = ""
            if (value?.diff == 0 && diffMinutes <= -1 && diffMinutes >= -1440) formattedDate = `Kemarin - ${moment(fixedDate).format('HH:mm')}`
            else if (value?.diff == 0 && diffHours < 24) formattedDate = `Hari Ini - ${moment(fixedDate).format('HH:mm')}`
            else if ((diffDay == 1 || diffDay == 0) && diffHours < 48) formattedDate = `Besok - ${moment(fixedDate).format('HH:mm')}`
            else if (diffDay > 1 || diffHours >= 48 || diffDay < 0) formattedDate = moment(fixedDate).format("DD MMMM, YYYY HH:mm")
            else formattedDate = ""

            return formattedDate
        }
    },
    methods: {
        toDateFromNow,
        humanizeDate(value){
            moment.locale('id')
            if (!value) return ''

            const fixedDate = value.replace('Z', '')
            const startDay = moment().startOf('day')
            const endDay = moment().endOf('day')
            let now = moment()
            let diffDay = moment(fixedDate).diff(now, "days")
            const diffHours = moment(fixedDate).diff(startDay, "hours")

            if(diffHours > 24 && diffHours < 48) this.isDate = 1

            if(diffHours > -24 && diffHours < 24){
                const diffHours = moment(fixedDate).diff(endDay, "hours")
                let quotient = diffHours / 24

                if(diffHours < -24) {
                    diffDay = -1
                }
                else{
                    this.isDate = 0
                    return {
                        diff: 0,
                        date: fixedDate
                    }
                }
            }
            if(diffDay == -1){
                const diffHours = moment(fixedDate).diff(endDay, "hours")
                let quotient = diffHours / 24

                if(diffHours >= -48){
                    this.isDate = -1
                    return {
                        diff: -1,
                        date: fixedDate
                    }
                }
                this.isDate = moment(value).diff(now, "days")
                return fixedDate
                
            }
            
            if (diffDay >= 0 && diffHours > 0 && diffHours < 48) this.isDate = 1
            else if(diffDay >= 1 && diffHours >= 48) this.isDate = 2
            else this.isDate = diffDay

            return fixedDate
        },

        vd(value){
            return moment(value).diff(moment(), "days")
        },
        async assignTask(){
            this.isAssign = true;

            const params = {
                classId: this.classId,
                topicId: this.assignment?.id,
            }

            await this.$store.dispatch('Services/classroomAssignTask', params)

            if(!this.servicesState?.status) {
                console.error('Failed start assign task: ', this.servicesState?.message)
                this.isAssign = false
            } else {
                setTimeout(async () => {
                    await this.openTask(this.servicesState?.data?.externalId)
                    this.isAssign = false
                }, 500);
            }
        },

        async openTask(id) {
            const responseId = "&responseId=" + id
            const redirectLms = "&redirectTo=" + window.location.href

            var urlTarget = ''
            if (this.assignment?.type == 'studio') urlTarget = process.env.editorURL + `compiler?&metronomId=${id}` + redirectLms
            if (this.assignment?.type == 'form') urlTarget = process.env.formURL + "/preview?" + responseId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const code = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            const url = `${baseUrl}/check?${redirect}${lmsId}${code}${generatedToken}`;

            this.$emit('onRefresh')
            window.open(url, '_blank')
        },
        async getAssignmentCounter(classroomId, topicId) {
            if(!this.isMovingCardAsssignment) this.isAssignmentCounterLoaded = false;
            const payload = { classroomId, topicId }
            await this.$store.dispatch('Assignments/counter', payload)

            if (!this.assignmentState.status) {
                this.assignmentCounter = { scored: 0, totalStudent: 0 }
                this.isAssignmentCounterLoaded = true;
                this.isMovingCardAsssignment = false;
            } else {
                this.assignmentCounter = { ...this.assignmentState.counterAssignment }
                this.isAssignmentCounterLoaded = true;
                this.isMovingCardAsssignment = false;
            }
        }
    }
}
</script>