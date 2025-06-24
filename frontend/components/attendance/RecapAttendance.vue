<template>
    <div id="attendance-recap">
        <b-row>
            <b-col cols="12">

                <b-card>

                    <b-row>
                        <b-col cols="12" lg="7">
                            <b-row>
                                <b-col
                                    v-for="(item, idx) of attendanceStats"
                                    :key="idx"
                                    cols="12"
                                    md="4"
                                >
                                    <div class="d-flex py-3 justify-content-center align-items-center bg-stats rounded mb-4">
                                        <div class="text-center">
                                            <h2>{{ item?.value }}</h2>
                                            <p>{{ item?.title }}</p>
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>

                        <b-col cols="12" lg="5">
                            <b-row>
                                <b-col cols="12" md="6" lg="12">
                                    <b-form class="mb-3">
                                        <button
                                            id="dropdown-student"
                                            class="btn w-100 d-flex justify-content-between align-items-center border text-darker"
                                            type="button"
                                            data-toggle="dropdown" 
                                            aria-haspopup="true" 
                                            aria-expanded="false"
                                            style="font-size: .875rem"
                                        >
                                            <div class="d-flex flex-row align-items-center gap-2">
                                                <i class="ri-group-line" style="font-size: 1.125rem"></i>
                                                {{ selectedUser.name ? selectedUser.name : 'Semua Peserta' }}
                                            </div>
                                            <i class="ri-arrow-drop-down-line" style="font-size: 1.125rem"></i>
                                        </button>

                                        <div
                                            aria-labelledby="dropdown-student"
                                            class="dropdown-menu dropdown-menu-left mt-3 w-100"
                                            style="z-index: 99; transform: translate3d(12px, 43px, 0px) !important;"
                                        >
                                            <div
                                                v-if="userLists?.length > 0"
                                                class="dropdown-item cursor-pointer"
                                                @click="onSelectUser(null)"
                                            >
                                                Semua Peserta
                                            </div>
                                            <template v-if="userLists?.length > 0">
                                                <div
                                                    class="dropdown-item cursor-pointer"
                                                    v-for="(item, idx) in userLists"
                                                    :key="idx"
                                                    @click="onSelectUser(item)"
                                                >
                                                    {{ item?.name }}
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="dropdown-item">Tidak ada siswa di kelas</div>
                                            </template>
                                        </div>
                                    </b-form>
                                </b-col>

                                <b-col cols="12" md="6" lg="12" class="mb-4">
                                    <DateRangePicker
                                        ref="picker"
                                        v-model="dateRange"
                                        class="w-100"
                                        singleDatePicker="range"
                                        opens="right"
                                        :showWeekNumbers="false"
                                        :ranges="false"
                                        :autoApply="true"
                                        :minDate="enabledDates?.from"
                                        :maxDate="enabledDates?.to"
                                    >
                                        <template v-slot:input="picker">
                                            <button
                                                type="button"
                                                class="border btn w-100 d-flex justify-content-between align-items-center text-darker"
                                                style="font-size: .875rem"
                                            >
                                                <div class="d-flex flex-row align-items-center gap-2">
                                                    <i class="ri-calendar-2-line" style="font-size: 1.125rem"></i>
                                                    {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
                                                </div>
                                                <i class="ri-arrow-drop-down-line" style="font-size: 1.125rem"></i>
                                            </button>
                                        </template>
                                    </DateRangePicker>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>

                    <FilterForms 
                        :isBusy="false"
                        :actionButtons="actionButtons"
                        :showFilter="false"
                        :sortItems="sortStudents"
                        :searchPlaceholder="'Cari berdasarkan nama / email'"
                        :mdSize="8"
                        :lgSize="6"
                        :isWrap="true"
                        @fetchFilters="setFilter"
                        @onDownloadAttendance="onClickDownload"
                        @typingSearch="isBusy = $event"
                    />

                    <RecapTable
                        :isBusy="isBusy"
                        :fields="recapFields"
                        :items="recapItems ?? []"
                        :pagination="pagination"
                        :isSelectedUser="!!selectedUser?.id"
                        @fetchData="busyToggler"
                        @onDateClick="openModalDetail"
                        @onPreviewClick="openModalPreview"
                    />

                </b-card>

                <ModalDetailAttendance
                    :onOpenModal="onOpenModalDetail"
                    :detailAttend="modalDetailRecord"
                    @openModal="openModalDetail"
                    @onPreviewClick="openModalPreview"
                />

                <ModalPreviewItem
                    :onOpenModal="onOpenModalPreview"
                    :item="detailPreview"
                    @openModal="openModalPreview"
                />
            </b-col>
        </b-row>

    </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

import ModalDetailAttendance from '@/components/attendance/micro/modal/ModalDetailAttendance.vue'
import ModalPreviewItem from '@/components/attendance/micro/modal/ModalPreviewItem.vue'
import FilterForms from '@/components/classrooms/micro/FilterForms.vue'
import RecapTable from '@/components/template/micro/table/Attendance/RecapTable.vue'
import { SORT_ATTENDANCE } from '@/commons/constants/filters'
import { TABLE_COLUMN_RECAP } from '@/commons/constants/attendance'
import { toDecrypt } from '~/commons/utils';
import { LIST_ICON, INFORMATION_PREVIEW_STUDENT } from "@/commons/constants/requirements-icon.js";
import ModalPreviewStudent from '../classrooms/micro/modal/ModalPreviewStudent.vue'

export default {
    components: {
        FilterForms,
        RecapTable,
        DateRangePicker,
        ModalDetailAttendance,
        ModalPreviewItem,
    },
    props: {
        classroomId: {
            type: Number,
            default: null
        },
        attendanceType: {
            type: String,
            default: ''
        },
        attendanceId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            actionButtons: [
                {
                    class: 'btn btn-primary',
                    isAction: true,
                    text: 'Download',
                    to: 'onDownloadAttendance',
                    type: 'button'
                }
            ],
            attendanceStats: [
                { name: 'present', title: 'Hadir', value: '0%' },
                { name: 'absent', title: 'Tidak Hadir', value: '0%' },
                { name: 'students', title: 'Total Peserta', value: 0 },
            ],

            sortStudents: SORT_ATTENDANCE,
            recapFields: [],
            recapItems: [],
            userLists: [],
            selectedUser: {
                id: null,
                name: '',
            },

            ranges: [],
            dateRange: {
                startDate: null,
                endDate: null,
            },
            enabledDates: {
                from: null,
                to: null,
            },

            isBusy: true,
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },

            onOpenModalDetail: false,
            onOpenModalPreview: false,
            modalDetailRecord: {
                name: '',
                email: '',
                items: []
            },

            recurseDays: [],
            detailPreview: {
                action: '',
                data: null
            },

            recapParams: {
                id: this.classroomId,
                page: null,
                perPage: null,
                startDate: null,
                endDate: null,
                order: null,
                search: null,
                userId: null
            }
        }
    },
    filters: {
        formatDate(val) {
            moment.locale('id')
            if (!val) return ''

            return moment(val).format('DD MMMM YYYY')
        }
    },
    watch: {
        dateRange() {
            moment.locale('id')
            
            let start = this.dateRange.startDate
            this.ranges = []
            while(start <= this.dateRange.endDate) {
                const dayName = moment(start).format('dddd')
                this.recurseDays.map((item) => {
                    if (item == dayName) this.ranges.push(start)
                })

                const nDate = new Date(start)
                nDate.setDate(nDate.getDate() + 1)
                start = new Date(nDate)
            }

            this.fetchAttendaceRecap()

        }
    },
    created() {
        this.fetchUser()
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            attendanceData: (state) => state.Services?.data,
            attendanceRecap: (state) => state.Services?.attendanceRecap ?? [],
            attendanceUser: (state) => state.Services?.attendanceUser ?? [],
        })
    },
    methods: {
        async onClickDownload() {
            const params = {...this.recapParams}
            params['isExport'] = true

            if (this.attendanceType === 'class') await this.$store.dispatch('Services/recapClassAttendanceExport', params)
            if (this.attendanceType === 'meet') await this.$store.dispatch('Services/recapMeetAttendanceExport', params)
            if (this.attendanceType === 'post') await this.$store.dispatch('Services/recapPostAttendanceExport', params)

            if (!this.servicesState?.status) {
                console.error('Failed download recap attendance', this.servicesState?.message)
            }
        },

        setInitialDate() {
            moment.locale('id')
            const thisDay = new Date()

            // this.dateRange.endDate = new Date('2023-05-29')
            // this.dateRange.startDate = new Date('2023-05-24')
            this.dateRange.endDate = new Date()
            this.dateRange.startDate = thisDay.setDate(thisDay.getDate() - 5)

            const attendanceStart = new Date(this.enabledDates.from)
            const attendanceEnd = new Date(this.enabledDates.to)
            const fiveDayStart = new Date(this.enabledDates.from)
            fiveDayStart.setDate(fiveDayStart.getDate() + 5)

            if (attendanceStart > this.dateRange.startDate) this.dateRange.startDate = attendanceStart
            if (new Date() > attendanceEnd) {
                this.dateRange.startDate = attendanceStart
                this.dateRange.endDate = fiveDayStart
            }
            if (fiveDayStart > attendanceEnd) this.dateRange.endDate = attendanceEnd

            let start = this.dateRange.startDate
            this.ranges = []
            while(start <= this.dateRange.endDate) {
                const dayName = moment(start).format('dddd')
                this.recurseDays.map((item) => {
                    if (item == dayName) this.ranges.push(start)
                })

                const nDate = new Date(start)
                nDate.setDate(nDate.getDate() + 1)
                start = new Date(nDate)
            }
        },

        async fetchAttendanceDetail() {
            await this.$store.dispatch('Services/getDetailAttendance', this.attendanceId)

            if (!this.servicesState.status) {
                console.error('Failed get detail attendance: ', this.servicesState?.message)
            } else {
                const detailAttendance = {...this.servicesState?.data}
                const recurse = detailAttendance?.recurse?.days || []
                recurse.map((item) => {
                    switch (item) {
                        case 1:
                            this.recurseDays.push('Senin')
                            break
                        case 2:
                            this.recurseDays.push('Selasa')
                            break
                        case 3:
                            this.recurseDays.push('Rabu')
                            break
                        case 4:
                            this.recurseDays.push('Kamis')
                            break
                        case 5:
                            this.recurseDays.push('Jumat')
                            break
                        case 6:
                            this.recurseDays.push('Sabtu')
                            break
                        case 0:
                            this.recurseDays.push('Minggu')
                            break
                    }
                })

                this.enabledDates.from = detailAttendance?.startDate
                this.enabledDates.to = detailAttendance?.endDate

                this.setInitialDate()
            }
        },

        setFilter({page, perPage, sortBy, search}){
            this.pagination.page = page ?? this.pagination?.page;
            this.pagination.perPage = perPage ?? this.pagination?.perPage;
            this.recapParams.order = sortBy;
            this.recapParams.search = search;
            this.fetchAttendaceRecap();
        },

        async fetchAttendaceRecap() {
            moment.locale('id')
            this.isBusy = true;

            const params = {
                id: this.classroomId,
                page: this.pagination.page,
                perPage: this.pagination.perPage,
                startDate: moment(this.dateRange.startDate).format('YYYY-MM-DD'),
                endDate: moment(this.dateRange.endDate).format('YYYY-MM-DD'),
                order: this.recapParams?.order || null,
                search: this.recapParams?.search || null,
                userId: this.selectedUser.id || null
            }

            if (this.attendanceType === 'class') await this.$store.dispatch('Services/getClassAttendanceRecap', params);
            if (this.attendanceType === 'meet') await this.$store.dispatch('Services/getMeetAttendanceRecap', params);
            if (this.attendanceType === 'post') await this.$store.dispatch('Services/getPostAttendanceRecap', params);

            if (!this.servicesState?.status) {
                console.error('failed fetch attendance recap', this.servicesState?.message)
                this.recapItems = []
                this.isBusy = false
            } else {
                this.recapFields = []

                if (!this.selectedUser.id) {
                    this.recapItems = this.attendanceRecap
    
                    TABLE_COLUMN_RECAP.forEach((item) => {
                        if (item.key == 'no' || item.key == 'name' || item.key == 'email') this.recapFields.push(item)
                    })
    
                    this.ranges.forEach((item, idx) => {
    
                        const objDate = {
                            key: `attendDate-${idx}`,
                            label: moment(item).format('DD MMMM'),
                            thStyle: '20%'
                        }
    
                        this.recapFields.push(objDate)
    
                        this.recapItems.forEach((student) => {
    
                            if (!student[`attendDate-${idx}`]) {
                                student[`attendDate-${idx}`] = '-'
    
                                student?.records?.forEach((record) => {
                                    const attendDate = moment(item).format('DD MMMM YYYY')
                                    const studentAttend = moment(record?.date.replace('Z', '')).format('DD MMMM YYYY')
    
                                    if (attendDate === studentAttend && record?.status === 1) student[`attendDate-${idx}`] = 'Hadir'
                                    if (attendDate === studentAttend && record?.status === 0) student[`attendDate-${idx}`] = 'Tidak'
                                })
                            }
    
                        })
                    })
    
                    this.attendanceStats.map((item) => {
                        const counter = this.attendanceData?.counter
                        if (item.name === 'present') item.value = (counter?.present || 0) + '%'
                        if (item.name === 'absent') item.value = (counter?.absent || 0) + '%'
                        if (item.name === 'students') {
                            item.title = 'Total Peserta'
                            item.value = counter?.students || 0
                        }
                    });

                } else {
                    TABLE_COLUMN_RECAP.forEach((item) => {
                        if (item.key != 'email') this.recapFields.push(item)
                    })

                    this.recapItems = []

                    this.attendanceRecap[0]?.records?.map((item) => {
                        if (item) this.recapItems.push(item)
                    })

                    this.recapItems.map((item) => {
                        item['name'] = this.attendanceRecap[0]?.name
                        item['dateAttend'] = moment(item?.date.replace('Z', '')).format('DD MMMM YYYY')
                        item['timeIn'] = item?.status ? item?.in.split('.')[0]?.replace('Z', '') : '--.--'
                        item['timeOut'] = item?.status ? item?.out.split('.')[0]?.replace('Z', '') : '--.--'
                        item['info'] = item?.status ? 'Hadir' : 'Tidak'
                    })

                    this.attendanceStats.map((item) => {
                        const counter = this.attendanceData?.counter
                        if (item.name === 'present') item.value = (counter?.present || 0) + '%'
                        if (item.name === 'absent') item.value = (counter?.absent || 0) + '%'
                        if (item.name === 'students') {
                            item.title = 'Total Keseluruhan'
                            item.value = counter?.present + counter?.absent || 0
                        }
                    })
                }

                const attendancePagination = this.servicesState?.pagination
                this.pagination = {
                    page: attendancePagination?.page,
                    perPage: attendancePagination?.perPage,
                    totalItems: attendancePagination?.totalItems,
                    totalPages: attendancePagination?.totalPages
                }

                this.isBusy = false
            }
        },
        openModalDetail(data) {
            moment.locale('id')

            this.onOpenModalDetail = !this.onOpenModalDetail

            if (data) {
                this.modalDetailRecord.items = []
    
                const dateFieldClicked = data?.field?.label
                const records = data?.item?.records || []
                this.modalDetailRecord.name = data?.item?.name
                this.modalDetailRecord.email = data?.item?.email
    
                records.forEach((record) => {
                    if(record){
                        const recordDate = moment(record?.date.replace('Z', '')).format('DD MMMM');

                        if (dateFieldClicked === recordDate) {
                            const result = {...record}
                            
                            result.date = moment(record?.date.replace('Z', '')).format('DD MMMM YYYY')
                            result.in = record?.in.split('.')[0]?.replace('Z', '')
                            result.out = record?.status ? record?.out.split('.')[0]?.replace('Z', '') : '--.--'

                            this.modalDetailRecord.items.push(result)
                        }
                    }
                })
            }
        },
        openModalPreview(params = null) {
            this.onOpenModalPreview = !this.onOpenModalPreview

            if (params) {
                this.detailPreview.action = params?.action
                this.detailPreview.data = params?.data
            }
        },
        busyToggler(page) {
            this.pagination.page = page
            this.fetchAttendaceRecap()
        },
        async fetchUser() {
            this.isBusy = true

            const params = toDecrypt(localStorage.getItem('classId'))

            if (this.attendanceType === 'class') await this.$store.dispatch('Services/getClassAttendanceUser', this.classroomId)
            if (this.attendanceType === 'meet') await this.$store.dispatch('Services/getClassAttendanceUser', params)
            if (this.attendanceType === 'post') await this.$store.dispatch('Services/getPostAttendanceUser', this.classroomId)

            if (!this.servicesState?.status) {
                console.error('failed fetch attendance recap', this.servicesState?.message)
                this.isBusy = false
            } else {
                this.userLists = this.attendanceUser

                await this.fetchAttendanceDetail()
                await this.fetchAttendaceRecap()
                this.isBusy = false
            }
        },
        onSelectUser(item) {
            this.pagination.page = 1
            this.selectedUser.name = item?.name || ''
            this.selectedUser.id = item?.id || null

            this.fetchAttendaceRecap()
        },

        /**
         * @param {Number} id - id of student
         */
        openModalDetailStudent(id){
            this.onOpenModalDetailStudent = !this.onOpenModalDetailStudent;

            if(this.onOpenModalDetailStudent){
                if(this.detailStudent?.data?.id != id){
                    this.fetchDetailStudent(id);
                }
            }
        },

        async fetchDetailStudent(id){
            this.detailStudent.isLoading = true;

            await this.$store.dispatch("Users/getDetailUser", id);

            if(!this.usersState?.status){
                console.error("Failed to fetch detail user : " + this.usersState?.message);
                this.detailStudent.isLoading = false;
            }else{
                this.detailStudent.data = this.usersState?.user?.user;
                this.setDataDetailStudent();
                this.detailStudent.isLoading = false;
            }
        },

        setDataDetailStudent(){
            this.detailStudent.data.requirements = [];

            Object.keys(this.detailStudent?.data).map(item => {
                if(this.detailStudent?.data?.[item]){
                    let foundInformation = INFORMATION_PREVIEW_STUDENT?.[item];
    
                    if (item === 'gender') foundInformation.value = this.detailStudent?.data?.[item] === 'L' ? 'Laki - laki' : 'Perempuan';
                    else if (item === 'city') foundInformation.value = this.detailStudent?.data?.[item]?.name;
                    else if(foundInformation) foundInformation.value = this.detailStudent?.data?.[item];
                    
                    if(foundInformation) this.detailStudent.data.requirements.push(foundInformation);
                }
            });
        },
        generateCustomFieldTitle(string) {
            var capitalizeText = ""
            string = string?.replace("_", " ")
            string?.split(" ")?.map(item => {
                capitalizeText += item?.charAt(0)?.toUpperCase() + item?.slice(1) + " "
            })
            return capitalizeText
        },
    }
}
</script>
<style lang="scss">

    #attendance-recap {
        .bg-stats {
            background: rgba(32, 150, 196, 0.15);
        }

        .form-control {
            &.reportrange-text {
                display: flex;
                height: max-content;
                border: 0;
                padding: 0;
            }
        }

        form {
            &.mb-3 {
                .dropdown-menu {
                    &.dropdown-menu-left {
                        transform: translate3d(12px, 43px, 0) !important;
                        max-height: 500px;
                        overflow: scroll;
                    }
                }
            }
        }
    }

</style>
