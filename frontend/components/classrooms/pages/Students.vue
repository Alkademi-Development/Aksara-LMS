<template>
    <section id="students">
        <ContentHeader 
            v-if="!noHeader"
            :actionButtons="actionButtons" 
            title="Daftar Peserta" 
            page="students"
            @onDownloadLeaderboards="onClickDownload"
        />

        <FilterForms 
            v-if="!noFilter"
            :isBusy="isBusy"
            :actionButtons="filterActionButtons"
            :isCheckedBox="isChecked"
            :pagination="pagination"
            :sortItems="sortStudents"
            :fields="filterFields"
            :items="leaderboardItem"
            :searchPlaceholder="'Cari berdasarkan nama / email'"
            :isWrap="true"
            :mdSize="9"
            :lgSize="8"
            :showActionButtons="isShowActionButtons"
            @fetchFilters="filterStudents"
            @onClickModalInvite="onClickModalInvite"
            @onClickModalKickout="onClickModalKickout"
            @onSubmitInvite="onSubmitInvite"
            @typingSearch="isBusy = $event"
        />

        <b-alert 
            v-model="onEvent.show"
            :variant="onEvent.variant"
            dismissible
        >
            {{ onEvent.message?.message ? onEvent.message.message : onEvent.message }}
        </b-alert>

        <StudentsTable 
            :classroomDetail="classroomDetail"
            :classId="classId"
            :fields="leaderboardField"
            :isBusy="isBusy"
            :items="leaderboardItem"
            :leaderboardDetail="leaderboardDetail"
            :isShowCheckbox="isShowCheckbox"
            :pagination="pagination"
            @fetchData="busyToggler"
            @selected-students-changed="handleSelectedStudentsChanged"
            @openModalPreview="openModalPreview($event)"
        />

        <ModalInviteStudent 
            :onOpenModal="onOpenModalInvite"
            :classId="classId"
            :classroomDetail="classroomDetail"
            @toggleModalInvite="toggleModalInvite"
            @fetchStudents="fetchStudents"
            @setEvent="setEvent"
        />

        <ModalKickOutStudent 
            :onOpenModal="onOpenModalKickOut"
            :classId="classId"
            :selectedsStudent="selectedsStudent"
            :students="leaderboardItem"
            :pagination="pagination"
            :classroomDetail="classroomDetail"
            @toggleModalKickout="toggleModalKickout"
            @fetchStudents="fetchStudents"
            @setEvent="setEvent"
            @fetchData="busyToggler"
        />

        <ModalPreviewStudent
            :onOpenModal="onOpenModalPreview"
            :item="previewStudent"
            @toggleModal="openModalPreview"
        />

    </section>
</template>

<script>
import { mapState } from 'vuex';

import { SORT_STUDENTS } from '@/commons/constants/filters'
import { TABLE_COLUMN_STUDENTS } from "@/commons/constants/students";
import { FIELDS_FILTER_STUDENT } from '~/commons/constants/forms';
import { LIST_ICON } from "@/commons/constants/requirements-icon.js";

import ContentHeader from '../micro/ContentHeader.vue';
import FilterForms from '../micro/FilterForms.vue';
import StudentsTable from '@/components/template/micro/table/Classroom/StudentsTable.vue';
import ModalInviteStudent from '../micro/modal/ModalInviteStudent.vue';
import ModalKickOutStudent from '../micro/modal/ModalKickOutStudent.vue';
import ModalPreviewStudent from '../micro/modal/ModalPreviewStudent.vue';

export default {
    components: {
        ContentHeader,
        FilterForms,
        StudentsTable,
        ModalInviteStudent,
        ModalKickOutStudent,
        ModalPreviewStudent,
    },
    props: {
        noHeader: {
            type: Boolean,
            default: false
        },
        noFilter: {
            type: Boolean,
            default: false
        },
        classId: {
            type: Number,
            default: 0
        },
        isPretest: {
            type: Boolean,
            default: false,
        },
        isShowCheckbox: {
            type: Boolean,
            default: true
        }
    },
    
    data () {
        return {
            actionButtons: [
                {
                    class: 'btn btn-outline-primary',
                    isAction: true,
                    text: 'Download',
                    to: 'onDownloadLeaderboards',
                    type: 'button'
                }
            ],
            filterActionButtons: [
                {
                    class: 'btn btn-soft-danger',
                    isAction: true,
                    text: 'Keluarkan',
                    to: 'onClickModalKickout',
                    type: 'button',
                },
                {
                    class: 'btn btn-primary',
                    isAction: true,
                    text: 'Peserta',
                    to: 'onClickModalInvite',
                    type: 'button',
                    iconClass: 'ri-add-fill mr-1'
                },
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

            onOpenModalPreview: false,
            previewStudent: null,
            currentFilter: {
                order: '',
                search: '',
                minScore: '', 
                maxScore: '',
                isCertified: false,
            },
            userRole: localStorage.getItem("user_kind"),
        }
    },
    created() {
        this.getClassroomDetail()
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        }),
        isShowActionButtons(){
            const notAllowedActionButtons = ["teacher", "student"];
            return !notAllowedActionButtons.includes(this.userRole);
        }
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

        async onClickDownload(){
            let dispatch = 'Services/classroomLeaderboardsExport'
            
            if (this.classroomDetail?.pretest === 1) dispatch = 'Services/pretestLeaderboardsExport'

            await this.$store.dispatch(dispatch, this.classroomDetail?.id)
            .then(() => {
                if(!this.servicesState.status) {
                    console.error('Failed download leaderboard', this.servicesState.message)
                }
            })
        },
        busyToggler(page) {
            this.pagination.page = page
            this.fetchStudents()
        },
        async getClassroomDetail () {
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
        },
        filterStudents({page, perPage, sortBy, search, minimumScore, maximumScore, certified}){
            this.currentFilter.order = sortBy || "";
            this.currentFilter.search = search || "";
            this.currentFilter.minScore = minimumScore || "";
            this.currentFilter.maxScore = maximumScore || "";
            this.currentFilter.certified = certified;
            this.fetchStudents(page, perPage)
        },

        async fetchStudents(page, perPage, order, search, minScore, maxScore) {
            this.isBusy = true
            
            const dispatch = 'Services/classroomLeaderboards'
            const params = {
                classroomId: this.classId,
                page: page || this.pagination?.page, 
                pageSize: perPage || this.pagination?.perPage,
                join: true,
                order: this.currentFilter.order,
                search: this.currentFilter.search,
                minScore: this.currentFilter.minScore, 
                maxScore: this.currentFilter.maxScore,
                pretest: this.isPretest || false,
                certified: this.currentFilter?.certified,
            }

            await this.$store.dispatch(dispatch, params)

            if (!this.servicesState.status) {
                console.error('failed fetch students', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
            } else {
                this.leaderboardDetail = []
                this.leaderboardField = []

                this.leaderboardField = [...TABLE_COLUMN_STUDENTS];
                this.leaderboardDetail = this.servicesState?.leaderboardDetail
                const dataLeaderboards = this.leaderboardDetail?.items

                if (dataLeaderboards != null) {
                    const courses = dataLeaderboards?.[0]?.assignments

                    if (courses?.length > 0) {
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
                    const isThereSchool = this.leaderboardItem.every((item) => !!item.school);
                    if (!isThereSchool) this.leaderboardField = this.leaderboardField.filter((item) => item.key !== "school");
                    this.totalStudents = dataLeaderboards.totalItems
                    this.pagination = {
                        page: this.leaderboardDetail?.page,
                        perPage: this.leaderboardDetail?.perPage,
                        totalItems: this.leaderboardDetail?.totalItems,
                        totalPages: this.leaderboardDetail?.totalPages,
                    }

                    if (this.leaderboardItem?.length === 0) this.$emit('isEmpty', true)
                    else this.$emit('isEmpty', false)
                }else{
                    this.leaderboardItem = []
                    this.$emit('isEmpty', true)
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
    }

}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/components/classroom/courses.scss';
</style>
