<template>
    <section id="schedules-event">

        <div class="container-fluid py-4">
            <b-row>

                <b-col class="mb-4 mb-lg-0">

                    <ScheduleHeader
                        :isLoaded="isLoaded"
                        :fcMonth="fcMonth"
                        :fcYear="fcYear"
                        @prev="fcPrev"
                        @next="fcNext"
                        @modalMonth="showModalMonth"
                    />

                    <div class="row col-10 col-md-5 position-relative px-4" v-if="isModalMonthOpen">
                        <ModalMonthPicker 
                            :fcMonth="fcMonth" 
                            :fcYear="fcYear" 
                            @chMonth="changeMonth"
                            @modalMonth="showModalMonth" 
                        />
                    </div>

                    <div class="content-body bg-white">
                        <FullCalendar
                            v-if="isLoaded"
                            ref="fullCalendar"
                            class="calendar"
                            :options="calendarOptions"
                            :view-title="viewTitle"
                        />

                        <div v-else class="card-body text-center">
                            <b-skeleton-img></b-skeleton-img>
                        </div>
                    </div>

                </b-col>

                <b-col md="4" class="d-flex flex-column justify-content-between gap-5">
                    <div>
                        <EventsHeader :title="`Detail Kegiatan ${dateTitle}`" :urlAction="`/dashboard/schedules/create`" />

                        <template v-if="isLoaded">
                            <template v-if="events?.length != 0">
                                <EventCardItem
                                    v-for="(item, index) in events" :key="index"
                                    :item="item"
                                    :editAction="`/dashboard/schedules/${ item?.slug }/edit`"
                                    @toggleModal="toggleModal(item, item?.className, item?.classSlug)"
                                    @toggleRemove="toggleRemove(item)"
                                />
                            </template>
                            <template v-else>
                                <b-card>
                                    <span>Belum ada kegiatan</span>
                                </b-card>
                            </template>
                        </template>

                        <b-card v-else>
                            <b-skeleton width="100%"></b-skeleton>
                            <b-skeleton width="70%"></b-skeleton>
                        </b-card>
                    </div>

                    <EventsPagination
                        v-if="pagination?.totalPages > 1 && isLoaded"
                        :pagination="pagination"
                        @prev="evtPrev"
                        @next="evtNext"
                    />

                </b-col>

            </b-row>

        </div>

        <b-modal v-model="isModalRemove" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                :description="`<p>Apakah anda yakin akan menghapus kegiatan <strong class='text-primary'>${ modalData?.name }</strong>?</p>`"
                :btnYesVariant="'danger'"
                :btnNoVariant="'outline-primary'"
                @actionYes="removeAnnouncement()"
                @actionNo="toggleRemove"/>
        </b-modal>


        <b-modal v-model="isModalOpen" size="md" centered hide-header hide-footer body-class="modal-schedule-detail">
            <ModalDetail
                :isModalBusy="isModalBusy"
                :modalData="modalData"
            />
        </b-modal>

    </section>
</template>

<script>
import moment from "moment"
import { mapActions, mapState } from 'vuex'

import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import ScheduleHeader from "~/components/schedules/micro/ScheduleHeader.vue";
import EventsHeader from "~/components/schedules/micro/EventsHeader.vue";
import EventsPagination from "~/components/schedules/micro/EventsPagination.vue";
import EventCardItem from "~/components/schedules/card/EventCardItem.vue";
import ModalDetail from "~/components/schedules/modal/ModalDetail.vue";
import ModalMonthPicker from "~/components/schedules/modal/ModalMonthPicker.vue";

export default {
    layout: "dashboard",
    components: { FullCalendar, ModalConfirmation, ScheduleHeader, EventsHeader, EventsPagination, EventCardItem, ModalDetail, ModalMonthPicker },
    data() {
        return {
            userKind: localStorage?.getItem('user_kind') || null,

            isLoaded: false,
            isModalRemove: false,
            isModalOpen: false,
            isModalBusy: false,
            isBoxAction: false,
            isModalMonthOpen: false,

            modalData: null,

            role: 'admin',
            fcMonth: "",
            fcYear: "",
            viewTitle: "",

            dateTitle: "",
            events: [],
            allEvents: [],
            filteredEvents: [],
            calendarOptions: {
                plugins: [ dayGridPlugin, interactionPlugin ],
                initialView: 'dayGridMonth',
                initialEvents: [],
                dayMaxEvents: 2,
                displayEventTime: false,
                moreLinkContent: (args) => `${args?.num} lainnya`,
                dateClick: (info) => this.getDaySchedules(info),
                eventClick: (info) => this.getDetailSchedule(info)
            },

            pagination: {
                page: 1,
                totalPages: 1,
                perPage: 4,
            }
        }
    },
    computed: {
        ...mapState({
            schedulesState: (state) => state?.Schedules,
            stateMeets: (state) => state?.Meets,
            statePost: (state) => state?.Post,
            stateAssignment: (state) => state?.Assignments,
            stateServices: (state) => state?.Services,
            schedules: (state) => state?.Schedules?.schedules ?? [],
        })
    },
    created() {
        this.getFcMonth()
        this.fetchSchedules()
    },
    methods: {
        ...mapActions({
            getSchedules: "Schedules/getSchedules",
            getMeet: "Meets/detailMeetsV2",
            getPost: "Post/getDetailPost",
            getAssignment: "Assignments/detail",
            getClassroom: "Services/classroomOverview",
            removePost: "Post/deletePost",
        }),
        getFcMonth() {
            let month = moment().format('M')
            let year = moment().format('YYYY')

            this.fcMonth = month - 1
            this.fcYear = year
        },
        showModalMonth() {
            this.isModalMonthOpen = !this.isModalMonthOpen
        },
        changeMonth(val) {
            this.fcMonth = val
            this.dateTitle = ''
            this.fetchSchedules('next')
        },
        fcNext() {
            // const ctx = this
            // this.$nextTick(() => {
            //     const calendar = ctx.$refs.fullCalendar.getApi()
            //     calendar.next()
            //     ctx.viewTitle = calendar.view.title
            // })
            if (this.fcMonth == 11) {
                this.fcMonth = 0
                this.fcYear++
            }
            else {
                this.fcMonth++
            }
            this.dateTitle = ''
            this.fetchSchedules('next')
        },
        fcPrev() {
            // const ctx = this
            // this.$nextTick(() => {
            //     const calendar = ctx.$refs.fullCalendar.getApi()
            //     calendar.prev()
            //     ctx.viewTitle = calendar.view.title
            // })
            if (this.fcMonth == 0) {
                this.fcMonth = 11
                this.fcYear--
            }
            else {
                this.fcMonth--
            }

            this.dateTitle = ''
            this.fetchSchedules('prev')
        },
        async fetchSchedules(state = null, value = null) {
            if (!value) {
                this.isLoaded = false
                this.calendarOptions.initialEvents = []
    
                const params = {
                    month: this.fcMonth + 1,
                    year: this.fcYear
                }
    
                this.getSchedules(params).then(() => {
                    if (!this.schedulesState?.status) {
                        console.error('Failed get schedules', this.schedulesState?.message)
                        this.isLoaded = true
                    } else {
    
                        this.schedules?.map(item => {
                            var startEvent = moment(this.dateFilter(item?.startDate)).format('YYYY-MM-DD')
                            var endEvent = moment(this.dateFilter(item?.endDate)).format('YYYY-MM-DD') + 'T12:00:00'
    
                            // console.log(startEvent, endEvent, "DATETIME")
    
                            // if (item?.startDate) {
                            //     if (item?.startDate?.toString().includes("Z")) startEvent = moment(item?.startDate).format('YYYY-MM-DD')
                            // }
                            // if (item?.endDate) {
                            //     if (item?.endDate?.toString().includes("Z")) endEvent = moment(item?.endDate).format('YYYY-MM-DD')
                            // }
    
                            const object = {
                                title: this.limitStr(item?.kind === 'class' ? item?.className : item?.name),
                                start: startEvent,
                                end: endEvent,
                                backgroundColor: this.generateFcColor(item?.kind),
                                borderColor: this.generateFcColor(item?.kind)
                            }
    
                            // this.events.push(object)
    
                            this.pagination.page = 1
                            // this.allEvents.push(object)
                            this.calendarOptions.initialEvents.push(object)
                        })
    
                        this.events = this.paginateArray(this.schedules)
                        this.allEvents = this.schedules
    
                        this.isLoaded = true
    
                        if (state) {
                            // setTimeout(() => {
                                const ctx = this
                                this.$nextTick(() => {
                                    const month = moment().format('M')
                                    const year = moment().format('YYYY')
                                    const calendar = ctx.$refs.fullCalendar.getApi()
    
                                    const nextMonth = () => {
                                        let monthCount = ((ctx.fcYear - year) * 12) + ctx.fcMonth
                                        for (let i = 0; i <= (monthCount - month); i++) calendar.next()
                                    }
                                    const prevMonth = () => {
                                        let monthCount = -(((year - ctx.fcYear) * 12) - ctx.fcMonth)
                                        for (let i = 1; i < (month - monthCount); i++) calendar.prev()
                                    }
    
                                    if (state === 'prev') {
                                        let monthCount = ((ctx.fcYear - year) * 12) + ctx.fcMonth
                                        if (ctx.fcYear > year || monthCount >= month) nextMonth()
                                        else prevMonth()
                                    } else {
                                        let monthCount = -(((year - ctx.fcYear) * 12) - ctx.fcMonth)
                                        if (ctx.fcYear < year || monthCount < month) prevMonth()
                                        else nextMonth()
                                    }
                                    ctx.viewTitle = calendar.view.title
                                })
                            // }, 500);
                        } else {
                            const ctx = this
                            this.$nextTick(() => {
                                const calendar = ctx.$refs.fullCalendar.getApi()
                                ctx.viewTitle = calendar.view.title
                            })
                        }
    
                        // setTimeout(() => {
                        //     var el = document?.getElementsByClassName('fc-daygrid-day-events')
    
                        //     for (let idx = 0; idx < el.length; idx++) {
                        //         const element = el[idx];
                        //         var elGrid = element.getElementsByClassName('fc-daygrid-event-harness-abs')
                        //         if (elGrid?.length > 2) {
                        //             for (let index = 0; index < elGrid.length; index++) {
                        //                 const elementGrid = elGrid[index];
                        //                 if (index > 1) {
                        //                     elementGrid.style["visibility"] = "hidden"
                        //                 }
                        //             }
    
                        //             // console.log(elGrid?.length, "ELEMENT")
                        //             var otherEl = document.createElement("span")
                        //             otherEl.innerText = '+1 Lainnya'
                        //             // otherEl.style["margin-top"] = "15px"
                        //             otherEl.style["display"] = "block"
                        //             // console.log(otherEl)
                        //             element.appendChild(otherEl)
                        //         }
                        //     }
    
                        // }, 100);
                    }
                })
            } else {
                const params = value

                this.getSchedules(params).then(() => {
                    if (!this.schedulesState?.status) {
                        console.error('Failed get schedules', this.schedulesState?.message)
                        this.isLoaded = true
                    } else {
                        this.schedules?.map(item => {
                            var startEvent = moment(this.dateFilter(item?.startDate)).format('YYYY-MM-DD')
                            var endEvent = moment(this.dateFilter(item?.endDate)).format('YYYY-MM-DD')
    
                            const object = {
                                title: this.limitStr(item?.kind === 'class' ? item?.className : item?.name),
                                start: startEvent,
                                end: endEvent,
                                backgroundColor: this.generateFcColor(item?.kind),
                                borderColor: this.generateFcColor(item?.kind)
                            }
    
                            this.pagination.page = 1

                            this.calendarOptions.initialEvents.push(object)
                        })
    
                        this.events = this.paginateArray(this.schedules)
                        // console.log(this.schedules)
                    }
                })
            }
        },

        getDaySchedules(info) {
            const elDays = document.getElementsByClassName('fc-daygrid-day')
            elDays.forEach((day) => day.style.background = '#fff')
            info.dayEl.style.background = '#ebebf0'

            // const formatDate = (val) => moment(val).format()

            // const date = moment(info?.dateStr).format()
            // const events = this.schedules
            // this.filteredEvents = []

            // events?.filter((item) => {
            //     if (date >= formatDate(item?.startDate) && date <= formatDate(item?.endDate))
            //         this.filteredEvents.push(item)
            // })
            // this.events = this.paginateArray(this.filteredEvents)
            
            const params = {
                day: moment(info?.dateStr).format('D'),
                month: moment(info?.dateStr).format('M'),
                year: moment(info?.dateStr).format('Y')
            }
            this.dateTitle = moment(info?.dateStr).format('DD MMM')
            this.fetchSchedules(null, params)
        },
        getDetailSchedule(info) {
            const startDateEvent = moment(info?.event.start).format('YYYY MM DD')
            const endDateEvent = moment(info?.event.end).format('YYYY MM DD')
            // const eventEnd = moment(this.events[1]?.endDate).format('YYYY MM DD')
            // console.log(this.allEvents)
            // console.log(eventEnd)
            // console.log(endDateEvent)
            // console.log(info)

            const events = []
            this.allEvents.map((item) => {
                const eventStart = moment(this.dateFilter(item?.startDate)).format('YYYY MM DD')
                const eventEnd = moment(this.dateFilter(item?.endDate)).format('YYYY MM DD')
                const nameItem = this.limitStr(item?.kind === 'class' ? item?.className : item?.name).trim()
                if (
                    (eventStart == startDateEvent || eventEnd == endDateEvent)
                    && 
                    (nameItem == info?.event.title.trim())
                    ) {
                    // this.toggleModal(item, item?.class)
                    events.push(item)
                }
            })

            this.toggleModal(events[0], events[0]?.className, events[0]?.classSlug)
        },

        toggleRemove(item) {
            this.isModalRemove = !this.isModalRemove

            if (this.isModalRemove) this.modalData = item
            else this.modalData = null
        },

        removeAnnouncement() {
            this.removePost(this.modalData?.id).then(() => {
                this.toggleRemove()
                this.fetchSchedules()
            })
        },

        toggleModal(item, className, classSlug) {
            this.isModalOpen = !this.isModalOpen
            // console.log(item, "ITEM")

            if (this.isModalOpen) {
                if (item.kind === 'meet') this.fetchEvent(item.slug, className, classSlug)
                else if (item.kind === 'class') this.fetchClass(item.classSlug)
                else if (item.kind === 'assignment') this.fetchAssignment(item, className, classSlug)
                else if (item.kind === 'announcement') this.fetchAnnouncement(item)
            } else this.modalData = null
        },

        fetchEvent(slug, className, classSlug) {
            this.isModalBusy = true

            const payload = {
                classroomSlug: null,
                eventSlug: slug,
            }

            this.getMeet(payload).then(() => {
                this.modalData = this.stateMeets?.detailMeet ?? null
                this.modalData.className = className
                this.modalData.classSlug = classSlug
                this.modalData.start = this.modalData?.datetime
                this.modalData.end = this.modalData?.endDate
                this.modalData.kind = "meet"
                this.isModalBusy = false
            })
        },

        fetchClass(slug) {
            this.isModalBusy = true

            this.getClassroom(slug).then(() => {
                if (!this.stateServices?.status) this.modalData = null
                else {
                    this.modalData = this.stateServices?.data ?? null
                    this.modalData.title = this.modalData?.name
                    this.modalData.kind = "class";
                }

                this.isModalBusy = false
            })
        },

        fetchAssignment(item, className, classSlug) {
            this.isModalBusy = true

            const params = {
                topicId: item?.id
            }

            this.getAssignment(params).then(() => {
                this.modalData = this.stateAssignment?.data ?? null
                this.modalData.kind = "assignment"
                this.modalData.start = this.modalData?.startDate
                this.modalData.end = this.modalData?.endDate
                this.modalData.className = className
                this.modalData.slug = item?.slug
                this.modalData.classSlug = classSlug
                this.modalData.assignment = {
                    type: this.modalData?.type,
                    time: this.modalData?.externalData?.timer,
                    questions: this.modalData?.externalData?.questions
                }
                this.isModalBusy = false
            })
        },

        fetchAnnouncement(item) {
            this.isModalBusy = true

            this.getPost(item?.id).then(() => {
                this.modalData = this.statePost?.post?.post ?? null
                this.modalData.description = this.modalData?.summary
                this.modalData.address = this.modalData?.content
                this.modalData.slug = item?.slug;
                this.modalData.kind = "announcement"

                this.isModalBusy = false
            })
        },


        evtPrev() {
            this.pagination.page--
            // if (this.filteredEvents?.length > 0) this.events = this.paginateArray(this.filteredEvents)
            // else this.events = this.paginateArray(this.schedules)
            this.events = this.paginateArray(this.schedules)
        },

        evtNext() {
            this.pagination.page++
            // if (this.filteredEvents?.length > 0) this.events = this.paginateArray(this.filteredEvents)
            // else this.events = this.paginateArray(this.schedules)
            this.events = this.paginateArray(this.schedules)
        },

        paginateArray(params) {
            this.pagination.totalPages = (params?.length / this.pagination?.perPage)
            var array = params?.slice((this.pagination?.page - 1) * this.pagination?.perPage, this.pagination?.page * this.pagination?.perPage) || []
            array.map((item, index) => {
                var startEvent = moment(this.dateFilter(item?.startDate)).format('YYYY-MM-DD HH:mm')
                var endEvent = moment(this.dateFilter(item?.endDate)).format('YYYY-MM-DD HH:mm')

                array[index].startDate = startEvent
                array[index].endDate = endEvent
            })
            return array
        },

        dateFilter(value) {
            if (value) {
                const splitDot = value.split('.')
                const splitZ = value.split('Z')

                if (splitDot.length > 1) value = splitDot[0]
                else if (splitZ.length > 1) value = splitZ[0]
            }

            return value
        },

        generateFcColor(kind) {
            switch (kind) {
                case "class":
                    return "#8BE5BB"
                    break;
                case "meet":
                    return "#4791FF"
                    break;
                case "assignment":
                    return "#F97E7E"
                    break;
                case "announcement":
                    return "#AE47FF"
                    break;

                default:
                    return "#8BE5BB"
                    break;
            }
        },

        limitStr(value) {
            if (!value) return ''
            if (value.length <= 35) return value
            return value.substring(0, 35) + '...'
        },
    }
};
</script>

<style lang="scss">
@import '@/assets/scss/components/schedules/schedules-event.scss';
@import '@/assets/scss/components/micro/modal/modal-detail-schedule.scss';
</style>
