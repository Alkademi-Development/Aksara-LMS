<template>
    <div class="container-fluid pt-4">
        <b-card class="border">

            <PretestHeader
                :title="headerContent?.title"
                :actionBtnTitle="headerContent?.btn1"
                :actionBtnTitle2="headerContent?.btn2"
                @actionBtnCallback="$router.push({
                    path: `/dashboard/classroom/${ $route.params.classroom }/pretest/recap`,
                    query: {
                        id: $route.query.id,
                    }
                })"
                @actionBtnCallback2="addPretest()"
                class="mb-4"/>

            <div class="divider"></div>

            <Assignment
                v-if="isStudentPretest"
                :classId="classId"
                :withHeader="false"
                :classSlug="slug"
                @onUpdateList="fetchClassroom"
                isPretest
                class="mt-4"/>
            
        </b-card>

        <b-modal v-model="isPrestestDenied" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                :title="modalDataPretestDenied?.title"
                :description="modalDataPretestDenied?.description"
                btnYesHide
                :btnNoVariant="modalDataPretestDenied?.btnNoVariant"
                :btnNoTitle="modalDataPretestDenied?.btnNoTitle"
                @actionNo="isPrestestDenied = false"/>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Assignment from '@/components/classrooms/pages/Assignment.vue';
import PretestHeader from '@/components/classrooms/pages/pretest/PretestHeader.vue';
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import { toDecrypt } from '~/commons/utils';

export default {
    async asyncData ({ params, query }) {
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')));
        const slug = params.classroom;
        return { classId, slug };
    },
    components: { Assignment, PretestHeader, ModalConfirmation },
    layout: "dashboard",
    data() { return { 
        userKind: localStorage.getItem('user_kind'),
        isPrestestDenied: false,
        isStudentPretest: true,

        dataDetail: null,

        headerContent: {
            title: "",
            btn1: "",
            btn2: "",
        },

        // userKind != 'student' ? 'Rekap Pretest' : ''
        // userKind != 'student' ? '+ Pretest' : ''

        modalDataPretestDenied: {
            title: "Maaf, Anda Tidak Dapat Menambahkan Pretest",
            description: "<p>Perhatikan Hal di Bawah ini :</p><ul><li>Anda tidak dapat menambahkan pretest ketika kelas berlangsung</li></ul>",
            btnNoVariant: "danger",
            btnNoTitle: "Oke",
        },

    } },
    computed: {
        ...mapState({
            servicesState: (state) => state?.Services
        })
    },
    mounted() {

        if (typeof document.hidden !== "undefined") {
            // add listener for visibility change
            document.addEventListener("visibilitychange", this.focusWindowListener);
        }

        this.fetchClassroom()

    },
    methods: {
        ...mapActions({
            classroomDetail: 'Services/classroomDetail'
        }),

        focusWindowListener() {
            if (!document.hidden && this.userKind === 'student') this.fetchClassroom()
        },

        addPretest() {
            if (this.dataDetail?.state === 'release') this.isPrestestDenied = true
            else this.$router.push({
                path: `/dashboard/classroom/${ this.$route.params.classroom }/pretest/create`,
                query: {
                    id: this.$route.query.id,
                }
            })
        },

        fetchClassroom() {
            this.classroomDetail({id: this.classId}).then(() => {
                this.dataDetail = this.servicesState?.data ?? null

                // Set Content Header in Other Role
                if (this.userKind === 'student') {
                    this.headerContent = {
                        title: `Hai, Sebelum Mengikuti Kelas <strong class="text-primary">${ this.dataDetail?.name }</strong>, Kamu Harus Mengerjakan Pretest Dulu`,
                        btn1: "",
                        btn2: ""
                    }
                    if (this.dataDetail?.userState) {
                        this.isStudentPretest = false
                        this.headerContent.title = "Terimakasih Sudah Mengerjakan Semua Pretest"
                    }
                } else {
                    this.headerContent = {
                        title: "Peserta Akan Mengerjakan Pretest Sebelum Mengikuti Kelas Ini",
                        btn1: "Rekap Pretest",
                        btn2: "+ Pretest",
                    }
                }
            })
        }
    },
    destroyed() { document.removeEventListener("visibilitychange", this.focusWindowListener); }
}
</script>