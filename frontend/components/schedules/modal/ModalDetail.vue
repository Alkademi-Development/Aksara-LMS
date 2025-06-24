<template>
    <div>
        <template v-if="!isModalBusy && modalData">
            <h3 
                :class="`title ${ (userKind != 'writer' && userKind != 'partner') || modalData?.kind === 'announcement' ? 'pointer' : '' }`" 
                @click="directEvent"
            >{{ modalData?.title }}</h3>
            <!-- <h3 v-else class="title">{{ modalData?.title }}</h3> -->
            <div class="box-content">
                <div v-if="modalData?.assignment" class="box-information d-flex align-items-center gap-2">
                    <span class="text-success">{{ modalData?.assignment?.type === 'form' ? 'Formulir' : capitalizeAllFirst(modalData?.assignment?.type) }}</span>
                    <span v-if="modalData?.assignment?.type === 'form'">{{ modalData?.assignment?.time }} Menit {{ modalData?.assignment?.questions }} Soal</span>
                </div>
                <p v-else class="description text-limit limit-5" v-html="modalData?.description"></p>
            </div>
            <div v-if="modalData?.class" class="box-information d-flex align-items-center gap-2">
                <i class="ri-stack-fill"></i>
                <span>{{ modalData?.class }}</span>
            </div>
            <div v-if="modalData?.kind === 'class'" class="box-information">
                <div class="d-flex align-items-center gap-2">
                    <i class="ri-calendar-2-line"></i>
                    <span>{{ convertDate(modalData?.registrationStart) }} - {{ convertDate(modalData?.registrationEnd) }}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <i class="ri-calendar-2-line"></i>
                    <span>{{ convertDate(modalData?.start) }} - {{ convertDate(modalData?.end) }}</span>
                    <span class="text-primary">Berlangsung</span>
                </div>
            </div>
            <div v-else class="box-information d-flex align-items-center gap-2">
                <template v-if="modalData?.kind === 'assignment' && modalData?.deadline">   
                    <i class="ri-calendar-2-line"></i>
                    <span>{{ convertDate(modalData?.deadline) }}, {{ convertTime(modalData?.deadline) }}</span>
                </template>
                <template v-else>
                    <i class="ri-calendar-check-fill"></i>
                    <span>{{ convertDate(modalData?.start) }}</span>
                    <i class="ri-time-line"></i>
                    <span>{{ convertTime(modalData?.start) }} - {{ convertTime(modalData?.end) }}</span>
                </template>
            </div>
            <div v-if="modalData?.kind === 'assignment' && userKind != 'writer' && userKind != 'partner'" class="box-information d-flex mt-4">

                <span class="place-link d-flex flex-row align-items-center" @click="directEvent">
                    Lihat Tugas
                    <i class="ri-arrow-drop-right-line"></i>
                </span>
            </div>
            <template v-if="modalData?.kind === 'meet' || modalData?.kind === 'announcement'">
                <div v-if="modalData?.type === 'offline'" class="box-information d-flex align-items-center gap-2">
                    <i class="ri-map-pin-2-line"></i>
                    <div>
                        <a :href="modalData?.link ?? modalData?.content" target="_blank">
                            <strong class="place-link d-block">{{ modalData?.place}}</strong>
                        </a>
                        <span class="d-block">{{ modalData?.address }}</span>
                    </div>
                </div>
                <div v-else class="box-information d-flex align-items-center gap-2">
                    <i class="ri-cast-line"></i>
                    <strong>Online on</strong>
                    <a :href="modalData?.type === 'manual' ? modalData?.content ?? modalData?.link : modalData?.link ?? modalData?.content" target="_blank">
                        <span class="place-link"> {{ modalData?.type === 'zoom' ? 'Zoom Meeting' : modalData?.type === 'gmeet' ? 'Google Meet' : 'Custom Platform' }}</span>
                    </a>
                </div>
            </template>
        </template>
        <template v-else-if="!isModalBusy && !modalData">
            <div class="text-center">
                Tidak ada data untuk ditampilkan
            </div>
        </template>
        <template v-else>
            <div class="text-center">
                <b-spinner small></b-spinner>
                Loading...
            </div>
        </template>
    </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import { capitalizeAllFirst } from "@/commons/utils"
import { TAB_MENU_CLASSROOM } from "~/commons/constants/layouts"

import { toEncrypt } from '~/commons/utils';

export default {
    props: [ 'isModalBusy', 'modalData' ],

    data() {
        return { 
            userKind: localStorage.getItem('user_kind')
         }
    },

    methods: {

        capitalizeAllFirst,

        ...mapActions({
            setTabs: 'Layouts/getTabs',
            setActiveTab: 'Layouts/setActiveTab',
        }),

        convertDate(date, format = "DD MMMM YYYY") {
            moment.locale('id')
            if (!date) return ''
            date = this.dateFilter(date)
            return moment(date).format(format)
        },

        convertTime(date) {
            date = this.dateFilter(date)
            date = moment(date).format("H.mm")
            return date
        },

        dateFilter(value) {
            if (value) {
                const splitDot = value.split(".");
                const splitZ = value.split("Z");
                if (splitDot.length > 1)
                    value = splitDot[0];
                else if (splitZ.length > 1)
                    value = splitZ[0];
            }
            return value;
        },

        directEvent() {
            if (this.userKind != 'writer' && this.userKind != 'partner') {
                if (this.modalData?.kind === 'class') {
                    this.setTabs(TAB_MENU_CLASSROOM)
                    this.setActiveTab('overview')
                    this.$router?.push(`/dashboard/classroom/${ this.modalData?.slug }`)
                } else if (this.modalData?.kind === 'meet') {
                    this.setTabs(TAB_MENU_CLASSROOM)
                    this.setActiveTab('events')
                    this.$router?.push(`/dashboard/classroom/${ this.modalData?.classSlug }/event/${this.modalData?.slug}`);
                } else if (this.modalData?.kind === 'assignment') {
                    this.setTabs(TAB_MENU_CLASSROOM)
                    this.setActiveTab('assignments')
                    localStorage.setItem('classId', toEncrypt(this.modalData?.classroomId))
                    localStorage.setItem('assignmentId', toEncrypt(this.modalData?.id))

                    this.$router?.push(`/dashboard/classroom/${ this.modalData?.classSlug }/assignment/${this.modalData?.slug}`);
                }
            }

            if (this.modalData?.kind === 'announcement') {
                localStorage.setItem('eventId', toEncrypt(this.modalData?.id))
                this.$router?.push(`/dashboard/schedules/${this.modalData?.slug}`)
            }
        }

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/micro/modal/modal-detail-schedule.scss';


a .place-link {
    color: var(--bs-primary);
    cursor: pointer;
}
</style>