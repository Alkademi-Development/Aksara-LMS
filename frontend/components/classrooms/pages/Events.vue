<template>
    <section id="event">
        <ContentHeader
            v-if="user_kind !== 'student'"
            title="Daftar Kegiatan"
            page="events"
            :actionButtons="actionsButton"
            :userKind="user_kind"
            :classId="classId"
        />

        <template v-if="isEventLoaded">
            <b-row>
                <template v-if="classEvents?.length > 0">
                    <b-col
                        cols="12"
                        md="4"
                        v-for="(event, idx) in classEvents"
                        :key="idx"
                    >
                        <b-card class="event-card border" body-class="d-flex flex-column justify-content-between">
                            <section>
                                <div class="header">
                                    <div class="title-container d-flex flex-row align-items-center justify-content-between">
                                        <span @click="onDetailClick(event)" class="title h5 cursor-pointer">{{ event?.title }}</span>
                                        <div
                                            v-if="user_kind !== 'student'"
                                            class="action-container d-flex flex-row align-items-center"
                                        >
                                            <div class="action border rounded" @click="onEditEvent(event?.slug)">
                                                <i class="ri-pencil-line"></i>
                                            </div>
                                            <div class="action text-danger border rounded" @click="toggleRemoveCourse(event)">
                                                <i class="ri-delete-bin-7-line"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="description">{{ event?.description }}</span>
                                </div>
                                <div class="content">
                                    <div class="d-flex flex-row align-items-center">
                                        <div class="date d-flex flex-row align-items-start">
                                            <i class="ri-calendar-check-fill text-primary"></i>
                                            <span style="font-weight: 700;">
                                                {{ toDateTimes(event?.datetime) }}
                                                {{ !!event?.endDate ? '-' : '' }}
                                                {{ !!event?.endDate ? toDateTimes(event?.endDate) : '' }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center">
                                        <div class="location d-flex flex-row align-items-start">
                                            <i v-if="event?.type === 'online'" class="ri-cast-line text-primary"></i>
                                            <i v-else class="ri-map-pin-2-line text-primary"></i>
                                            <div class="desc" style="font-weight: 700;">
                                                {{ event?.type === 'online' ? event?.type : event?.type === 'offline' && !!event?.place ? event?.place : event?.type === 'gmeet' ? 'Google Meet' : event?.type === 'zoom' ? 'Zoom Meeting' : event?.place || event?.type }}
                                                <br v-if="event?.type === 'offline'">
                                                <span>{{ event?.address}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div class="footer">
                                <template v-if="event?.isEnd">
                                    <span class="text-danger" style="font-size: 12px;">*Kegiatan telah berakhir</span>
                                </template>
                                <template v-if="!event?.isEnd">
                                    <a class="btn btn-text-primary" :href="event?.content" target="_blank">
                                        Ikut Kegiatan
                                        <i class="ri-arrow-drop-right-line"></i>
                                    </a>
                                </template>
                            </div>
                        </b-card>
                    </b-col>
                </template>
                <template v-else-if="!this.servicesState?.classroomDetail?.registered && userRole === 'student'">
                    <b-col>
                        <b-card class="border">
                            <b-row>
                                <b-col>Anda tidak terdaftar dikelas ini.</b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </template>
                <template v-else>
                    <b-col>
                        <b-card class="border">
                            <b-row>
                                <b-col>Belum Ada Kegiatan</b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </template>
            </b-row>
        </template>
        <template v-else>
            <b-card class="border">
                <b-row>
                    <b-col>Memuat..</b-col>
                </b-row>
            </b-card>
        </template>

        <b-modal
            v-model="isConfirmRemoveEvent"
            size="md"
            centered
            hide-header
            hide-footer
            body-class="p-0"
        >
            <ModalConfirmation
                title="Peringatan!"
                :description="`<p>Apakah anda yakin akan menghapus event <strong>${selectedEvent?.title}</strong> ini?</p>`"
                btnYesVariant="danger"
                @actionYes="onRemoveEvent"
                @actionNo="isConfirmRemoveEvent = false"
            />
        </b-modal>
    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import ContentHeader from '../micro/ContentHeader.vue';
import { toDateTimes, toEncrypt } from '~/commons/utils';
import ModalConfirmation from '~/components/template/micro/modal/ModalConfirmation.vue';

export default {
    components: {
        ContentHeader,
        ModalConfirmation
    },
    props: {
        classId: {
            type: Number,
            default: 0
        },
        classSlug: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            actionsButton: [
                {
                    text: 'Kegiatan',
                    class: 'btn btn-primary',
                    type: 'button',
                    to: `/dashboard/classroom/${this.classSlug}/event/create`,
                    iconClass: 'ri-add-fill mr-1'
                },
            ],

            isEventLoaded: false,
            isConfirmRemoveEvent: false,
            selectedEvent: null,
            userRole: null,
        }
    },
    computed: {
        ...mapState({
            classEvents: (state) => state.Meets?.meets,
            responseStatus: (state) => state.Services?.status,
            responseMessage: (state) => state.Services?.message,
            user_kind: (state) => state.Auth?.user_kind,
            servicesState: (state) => state.Services,
        }),
    },
    filters: {
        truncate(str) {
            const clip = 155
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    created() {
        this.userRole = localStorage.getItem("user_kind");
        this.getListMeets()
    },
    methods: {
        toDateTimes,
        ...mapActions({
            getMeets: 'Meets/getMeetsV2',
            deleteMeets: 'Meets/deleteMeets'
        }),
        async getListMeets() {
            await this.getMeets(this.classSlug).then(() => {

                this.isEventLoaded = true
            })
        },
        onEditEvent(eventSlug) {
            localStorage.setItem('classId', toEncrypt(this.classId))
            this.$router.push(`/dashboard/classroom/${this.classSlug}/event/${eventSlug}/edit`)
        },
        toggleRemoveCourse(event) {
            this.isConfirmRemoveEvent = !this.isConfirmRemoveEvent

            if (this.isConfirmRemoveEvent) this.selectedEvent = event
            else this.selectedEvent = null
        },
        async onRemoveEvent() {
            const params = {
                eventId: this.selectedEvent?.id,
                classroomId: this.classId
            }

            this.deleteMeets(params)

            if(!this.responseStatus) {
                console.error('Failed remove event from classroom', this.responseMessage)

                this.setEvent(this.responseMessage, false)
            } else {
                this.isConfirmRemoveEvent = false

                setTimeout(() => {
                    this.getListMeets()
                }, 500);
            }
        },
        onDetailClick(event) {
            localStorage.setItem('eventId', toEncrypt(event.id))
            localStorage.setItem('classId', toEncrypt(this.classId))
            this.$router.push(`/dashboard/classroom/${this.classSlug}/event/${event?.slug}`)
        },
    },
    mounted() {
        // console.log(this.classId)
    }
}
</script>

<style lang="scss" scoped src="@/assets/scss/components/classroom/events.scss"></style>
