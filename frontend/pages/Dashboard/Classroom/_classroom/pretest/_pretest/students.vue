<template>
    <div class="container-fluid pt-4">
        <b-card class="border">

            <PretestHeader
                title="Daftar Peserta Pretest"
                :actionBtnTitle="!isEmpty ? 'Download' : ''"
                @actionBtnCallback="clickDownload"
                class="mb-4"/>
            
            <ReviewTable
                :isBusy="isBusy"
                :fields="tableFields"
                :items="tableItems"
                :pagination="tablePagination"
                tableClass="p-0 m-0"
                class="card border m-0"
                @onClickBtnScore="toggleModalScoring"/>

            <!-- Modal Section -->
            <ModalScoring
                :onOpenModal="isModalScoring"
                :isScoring="isScoring"
                :modalError="modalError"
                :item="selectedStudent"
                :activeAssignment="activeAssignment"
                @onSubmit="scoringStudent"
                @toggleModal="toggleModalScoring"
            />
        </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { TABLE_COLUMN_PRETEST_STUDENTS } from "~/commons/constants/students";
import { toDecrypt } from '~/commons/utils';

import Assignment from '@/components/classrooms/pages/Assignment.vue';
import PretestHeader from '@/components/classrooms/pages/pretest/PretestHeader.vue';
import ReviewTable from "@/components/template/micro/table/Review/ReviewTable.vue";
import ModalScoring from "@/components/template/micro/modal/ModalScoring.vue";

export default {
    async asyncData ({ params, query }) {
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')));
        const topicId = parseInt(params?.pretest);
        return { classId, topicId };
    },
    components: { Assignment, PretestHeader, ReviewTable, ModalScoring },
    layout: "dashboard",
    data() {
        return {
            isBusy: false,
            isEmpty: true,

            selectedStudent: null,
            isScoring: false,
            isModalScoring: false,
            modalError: null,
            activeAssignment: null,

            tableFields: [],
            tableItems: [],
            tablePagination: {
                page: 1,
                perPage: 10,
                totalItems: 1,
                totalPages: 1,
            },
        }
    },
    computed: {
        ...mapState({
            assignmentsState: (state) => state?.Assignments,
            servicesState: (state) => state?.Services
        })
    },
    mounted() {
        this.setTable()
    },
    methods: {
        ...mapActions({
            getStudents: "Assignments/studentsV2",
            assignScore: "Services/classroomAssignScore",
        }),

        setTable() {
            this.isBusy = true
            this.tableFields = TABLE_COLUMN_PRETEST_STUDENTS

            const params = {
                topicId: this.topicId,
            }

            this.getStudents(params).then(() => {
                this.tableItems = this.assignmentsState?.data
                this.tablePagination = this.assignmentsState?.pagination ?? this.tablePagination

                this.isBusy = false
                if (this.tableItems?.length === 0) this.isEmpty = true
                else this.isEmpty = false
            })
        },

        scoringStudent(event) {
            event.preventDefault()

            const params = {
                classroomId: this.classId,
                topicId: this.topicId,
                userId: this.selectedStudent?.userId,
                score: parseInt(this.selectedStudent?.score),
                mentorNotes: this.selectedStudent?.mentorNotes
            }

            // console.log(params, "PARAMS")
            this.isScoring = true
            this.assignScore(params).then(() => {
                if (!this.servicesState?.status) {
                    this.modalError = this.servicesState?.message
                    this.isScoring = false
                } else {
                    const selectedItem = this.activeAssignment
                    this.activeAssignment = null
                    setTimeout(() => {
                        this.toggleModalScoring()
                        this.setTable()
                        this.modalError = null
                        this.isScoring = false
                    }, 50);
                }
            })
        },

        async fetchAssignmentDetail(){
            const params = { 
                classId: this.classId,
                topicId: this.topicId,
                userId: this.selectedStudent?.userId,
            }

            await this.$store.dispatch('Services/studentAssignmentDetail', params)

            if (!this.servicesState.status) {
                console.error('failed fetch assignments: ', this.servicesState.message);
            } else {
                this.activeAssignment = this.servicesState.data
            }
        },

        toggleModalScoring(data) {

            this.isModalScoring = !this.isModalScoring
            if (this.isModalScoring) this.selectedStudent = { ...data }
            else this.selectedStudent = null

            this.fetchAssignmentDetail()

        },

        clickDownload() {
            const params = {
                topicId: this.topicId,
                isExport: true
            }

            this.getStudents(params)
        }
    }
}
</script>