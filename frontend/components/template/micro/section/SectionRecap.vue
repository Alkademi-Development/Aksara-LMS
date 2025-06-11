<template>
    <b-row>

        <b-col cols="12" class="mx-h-content">

            <FilterForms 
                :isBusy="isBusy"
                :actionButtons="actionButtons"
                :isCheckedBox="isChecked"
                :pagination="pagination"
                :sortItems="sortStudents"
                :fields="filterFields"
                :items="leaderboardItem"
                :searchPlaceholder="'Cari berdasarkan nama / email'"
                :mdSize="10"
                :lgSize="9"
                :isWrap="true"
                @fetchFilters="setFilters"
                @onClickModalInvite="onClickModalInvite"
                @onClickModalKickout="onClickModalKickout"
                @onSubmitInvite="onSubmitInvite"
                @onDownloadLeaderboards="onClickDownload"
                @typingSearch="isBusy = $event"
            />

            <StudentsTable 
                :classroomDetail="classroomDetail"
                :classId="classId"
                :fields="leaderboardField"
                :isBusy="isBusy"
                :items="leaderboardItem"
                :leaderboardDetail="leaderboardDetail"
                :pagination="pagination"
                empty-text="Belum ada peserta"
                @fetchData="busyToggler"
                @selected-students-changed="handleSelectedStudentsChanged"
                @openModalPreview="openModalPreview($event)"
            />

            <ModalPreviewStudent
                :onOpenModal="onOpenModalPreview"
                :item="previewStudent"
                @toggleModal="openModalPreview"
            />

        </b-col>
    </b-row>
</template>

<script>
import { mapState } from 'vuex';

import { SORT_STUDENTS } from '@/commons/constants/filters'
import { TABLE_COLUMN_RECAP } from "@/commons/constants/students";
import { FIELDS_FILTER_STUDENT } from '~/commons/constants/forms';
import { LIST_ICON } from "@/commons/constants/requirements-icon.js";

import StudentsTable from '../table/Classroom/StudentsTable.vue';
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';
import ModalPreviewStudent from '~/components/classrooms/micro/modal/ModalPreviewStudent.vue';

export default {
    components: {
        StudentsTable,
        FilterForms,
        ModalPreviewStudent
    },
    
    data () {
        return {
            actionButtons: [
                {
                    class: 'btn btn-outline-primary',
                    isAction: true,
                    text: 'Download',
                    to: 'onDownloadLeaderboards',
                    type: 'button',
                    isLoading: false,
                    key: "download",
                }
            ],
            role: 'Leaderboard',
            isBusy: true,
            classroomDetail: null,
            totalStudents: false,
            leaderboardDetail: null,
            leaderboardItem: [],
            leaderboardField: [],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 1,
            },

            onOpenModalInvite: false,
            onOpenModalKickOut: false,
            onOpenModalPreview: false,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            sortStudents: SORT_STUDENTS,
            filterFields: FIELDS_FILTER_STUDENT,

            selectedsStudent: [],
            isChecked: false,

            previewStudent: null,
            filterOptions: {
                order: '',
                search: '',
                minScore: '',
                maxScore: '',
            },
        }
    },
    watch: {
        classId() {
            this.fetchStudents()
        },
    },
    async created() {
        await this.getClassroomDetail()
        this.fetchStudents()
    },
    computed: {
        ...mapState({
            classId: (state) => state?.Layouts?.stateFilter?.value ?? null,
            servicesState: (state) => state.Services,
        })
    },
    methods: {
        setEvent(message, status){
            this.onEvent = {
                message: message,
                status: status,
                variant: status === true ? 'success' : 'warning',
                show: true,
                dismissed: false,
            }

            window.scrollTo(0,0)
        },
        toggleModalInvite() {
            this.onOpenModalInvite = !this.onOpenModalInvite
        },
        toggleModalKickout() {
            this.onOpenModalKickOut = !this.onOpenModalKickOut
            this.isChecked = false;
            const checkboxesStudent = document.querySelectorAll('#student-table input[type=checkbox]:checked');
            checkboxesStudent.forEach((checkbox) => {
                // selectedIds.push(parseInt(checkbox.value));
                checkbox.checked = false;
            });
            document.querySelector('#checkboxAllStudent').checked = false;
        },
        onClickModalInvite() {
            this.onOpenModalInvite = !this.onOpenModalInvite
        },
        onClickModalKickout() {
            this.onOpenModalKickOut = !this.onOpenModalKickOut
        },
        onSubmitInvite(event) {
            event.preventDefault()
        },
        openModalPreview(data) {
            this.onOpenModalPreview = !this.onOpenModalPreview

            if (this.onOpenModalPreview) {
                this.previewStudent = data
                this.previewStudent.requirements = []

                var customFields = {}
                var requirements = null

                if (data?.custom_fields) customFields = JSON.parse(data?.custom_fields) ?? null
                // console.log(customFields, Object.keys(customFields).length != 0 && customFields.constructor === Object, "CUSTOMFIELDS")
                if (Object.keys(customFields).length != 0 && customFields.constructor === Object) requirements = JSON.parse(customFields?.custom_fields) ?? null
                if (requirements) {
                    Object.keys(requirements).map(item => {
                        const object = {
                            title: this.generateCustomFieldTitle(item),
                            value: requirements[item]
                        }
                        this.previewStudent?.requirements.push(object)
                    })
                }

                Object.keys(data).map(item => {
                    if ( item === 'city' || item === 'gender' || item === 'onlineCv' || item === 'portfolio' || item === 'address' || item === 'statementLetter' || item === 'transcriptFile' || item === 'certificate') {
                        let object = {
                            name: item,
                            title: this.generateCustomFieldTitle(item),
                            value: data[item]
                        }
                        if (item === 'gender') {
                            object.title = "Jenis Kelamin"
                            object.value = data[item] === 'L' ? 'Laki - laki' : 'Perempuan'
                        }
                        if (item === 'city') object.title = "Asal Kota"
                        if (item === 'address') object.title = "Alamat"
                        if (item === 'portfolio') object.title = "Portofolio"
                        if (item === 'onlineCv') object.title = "Online CV"
                        if (item === 'transcriptFile') object.title = "Rapor"
                        if (item === 'certificate') object.title = "Ijazah"
                        if (item === 'statementLetter') object.title = "Surat Keterangan"
                        if (data[item]) {
                            if (item === 'city') this.previewStudent?.requirements.unshift(object)
                            else this.previewStudent?.requirements.push(object)
                        }
                    }
                })

                if (this.previewStudent?.length != 0) {
                    this.previewStudent?.requirements?.map((item, index) => {
                        const findIcon = LIST_ICON?.find(icon => icon?.name === item?.name)
                        if (findIcon) this.previewStudent.requirements[index]['icon'] = findIcon?.icon
                    })
                }
            } else this.previewStudent = null
        },
        generateCustomFieldTitle(string) {
            var capitalizeText = ""
            string = string?.replace("_", " ")
            string?.split(" ")?.map(item => {
                capitalizeText += item?.charAt(0)?.toUpperCase() + item?.slice(1) + " "
            })
            return capitalizeText
        },

        async onClickDownload(){
            const indexItem = this.actionButtons.findIndex((action) => action?.key === "download");
            this.actionButtons[indexItem].isLoading = true;

            let dispatch = 'Services/classroomLeaderboardsExport'
            
            if (this.classroomDetail?.pretest === 1) dispatch = 'Services/pretestLeaderboardsExport'

            await this.$store.dispatch(dispatch, this.classId)
            .then(() => {
                if(!this.servicesState.status) {
                    console.error('Failed download leaderboard', this.servicesState.message)
                }

                this.actionButtons[indexItem].isLoading = false;
            })
        },
        busyToggler(page) {
            this.pagination.page = page
            this.fetchStudents();
        },
        async getClassroomDetail () {
            if(this.classId){
                this.isBusy = true

                await this.$store.dispatch('Services/classroomDetail', {id: this.classId});

                if (!this.servicesState.status) {
                    console.error('failed fetch classroom detail', this.servicesState.message);
                    this.setEvent(this.servicesState.message, false)
                } else {
                    this.classroomDetail = this.servicesState.classroomDetail
                    if (this.leaderboardDetail === null) this.fetchStudents()
                    else this.setEvent("Tidak ada leaderboards", false)
                }
            }
        },
        setFilters({page, perPage, sortBy, search, minimumScore, maximumScore}) {
            this.pagination.page = page ?? this.pagination?.page;
            this.pagination.perPage = perPage ?? this.pagination?.perPage;
            this.filterOptions.order = sortBy
            this.filterOptions.search = search
            this.filterOptions.minScore = minimumScore
            this.filterOptions.maxScore = maximumScore
            this.fetchStudents();
        },
        async fetchStudents() {
            this.isBusy = true
            
            // this.getClassroomDetail()
            const dispatch = 'Services/classroomLeaderboards'
            const params = {
                classroomId: this.classId,
                page: this.pagination?.page, 
                pageSize: this.pagination?.perPage,
                join: true,
                order: this.filterOptions.order ?? '',
                search: this.filterOptions.search ?? '',
                minScore: this.filterOptions.minScore ?? '', 
                maxScore: this.filterOptions.maxScore ?? '',
                pretest: !!this.isPretest ? this.isPretest : false,
            }

            if (!!this.classId) await this.$store.dispatch(dispatch, params)

            if (!this.servicesState.status) {
                console.error('failed fetch students', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isBusy = false
            } else {
                this.leaderboardItem = []
                this.leaderboardDetail = []
                this.leaderboardField = []

                this.leaderboardField = [...TABLE_COLUMN_RECAP];
                this.leaderboardDetail = this.servicesState?.leaderboardDetail
                const dataLeaderboards = this.leaderboardDetail?.items

                if (dataLeaderboards != null) {
                    const courses = dataLeaderboards?.[0]?.assignments

                    if (courses?.length > 0) {
                        // console.log(dataLeaderboards);
                        dataLeaderboards?.forEach((leaderboard) => {

                            courses?.forEach((course, idx) => {
                                const objCourse = {
                                    courseId: idx,
                                    key: `task-${idx}`,
                                    label: course?.title,
                                    thStyle: 'width: 20%'
                                }

                                const findExistCourse = this.leaderboardField.findIndex((leaderboard) => leaderboard?.key === objCourse?.key)

                                leaderboard[`task-${idx}`] = leaderboard?.assignments != null ? leaderboard?.assignments[idx]?.score : 'Belum ada nilai'

                                if (findExistCourse === -1) this.leaderboardField.push(objCourse)
                            });
                            
                        });
                    }

                    this.leaderboardItem = dataLeaderboards ?? []
                    this.totalStudents = dataLeaderboards.totalItems

                    if (this.leaderboardItem?.length === 0) this.$emit('isEmpty', true)
                    else this.$emit('isEmpty', false)
                }

                this.pagination = {
                    page: this.leaderboardDetail?.page,
                    perPage: this.leaderboardDetail?.perPage,
                    totalItems: this.leaderboardDetail?.totalItems,
                    totalPages: this.leaderboardDetail?.totalPages,
                }

                this.isBusy = false
            }
        },

        handleSelectedStudentsChanged(selectedsStudent) {
            this.selectedsStudent = selectedsStudent;
            if(this.selectedsStudent.length > 0) {
                this.isChecked = true;
            } else {
                this.isChecked = false;
            }
        },
    }
    
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/components/classroom/courses.scss';
</style>