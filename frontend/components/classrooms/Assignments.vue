<template>
    <b-row>

        <!-- Alert Section -->
        <b-col cols="12">
            <b-alert
                :show="onEvent.alertCounter"
                :variant="onEvent.variant"
                @dismissed="onEvent.alertCounter=0"
                @dismiss-count-down="countDownChanged"
                >
                {{ onEvent.message }}
            </b-alert>
        </b-col>

        <!-- Section Header -->
        <b-col cols="12">
            <b-card no-body>
                <b-card-body>

                    <div v-if="isLoaded" class="d-block d-md-flex justify-content-between align-items-start">
                        <div :class="`d-flex ${isTestCase && userKind == 'student' ? 'align-items-start' : 'align-items-center'}`">
                            <CircleBackButton />
                            <div>
                                <h3 class="w-100">{{ classroomDetail != null ? classroomDetail.name : 'Untitled' }}</h3>
                                <div v-if="isTestCase && userKind == 'student'">
                                    <p v-if="!isReadMore">{{ textDescription }}</p>
                                    <p v-else>{{ textDescription }} <b-button variant="primary" class="btn-no-styles text-primary" @click="toggleMore">{{ isShowMore ? '...lebih sedikit.' : '...baca selengkapnya.' }}</b-button></p>
                                </div>
                            </div>
                        </div>
                        <div v-if="userKind != 'student'" class="mt-3 mt-md-0">
                            <nuxt-link class="btn btn-danger rounded-pill" :to="`/dashboard/classroom/assignments/${classroomId}/create`">Tambah {{ isTestCase ? 'Tes' : 'Tugas' }}</nuxt-link>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-else class="d-flex align-items-start w-100">
                        <b-skeleton type="avatar"></b-skeleton>
                        <div class="ml-3 w-100">
                            <b-skeleton width="80%"></b-skeleton>
                            <b-skeleton width="40%"></b-skeleton>
                        </div>
                    </div>

                </b-card-body>
            </b-card>
        </b-col>

        <!-- Section Ribbon -->
        <b-col v-if="isTestCase && userKind == 'student' && classroomTopics.length != 0" cols="12">
            <b-card no-body class="bg-primary">
                <b-card-header class="bg-transparent">

                    <div v-if="isLeaderboardLoaded" class="row">

                        <!-- Ribbon Messages -->
                        <div class="col">
                            <div v-if="leaderboardDetail.rank" class="d-flex-inline align-items-center">
                                <h3 class="d-inline text-white">Anda mendapat ranking</h3>
                                <h1 class="d-inline text-secondary mx-2">{{leaderboardDetail.rank}}</h1>
                                <h3 class="d-inline text-white">dari</h3>
                                <h1 class="d-inline text-secondary mx-2">{{totalStudents}}</h1>
                                <h3 class="d-inline text-white">Peserta</h3>
                            </div>
                            <h3 v-else class="text-white">{{classroomDetail.taskSubmitted == classroomDetail.tasks ? 'Terimakasih sudah menyelesaikan soal.' : isClassEnded && isTestCase ? 'Tes telah berakhir' : 'Segera selesaikan semua soal!'}}</h3>
                            <div class="d-flex-inline align-items-center mt-4 mt-md-0">
                                <strong class="text-secondary mr-2">{{classroomDetail.taskSubmitted}} / {{classroomDetail.tasks}}</strong>
                                <span class="text-white mr-2">Soal diselesaikan.</span>
                                <template v-if="leaderboardDetail.rank">
                                    <span class="text-white mr-2">Rata-rata nilai anda</span>
                                    <strong class="text-secondary">{{leaderboardDetail.score}} / 100</strong>
                                </template>
                            </div>
                        </div>

                        <!-- Button Leaderboard -->
                        <div v-if="leaderboardDetail.rank" class="col-12 col-md-4 col-lg-3 mt-4 mt-md-0 text-md-right">
                            <nuxt-link :to="`/dashboard/classroom/${this.classroomId}/leaderboard`" class="btn btn-white rounded-pill">Lihat Leaderboard</nuxt-link>
                        </div>

                    </div>

                    <!-- Loading State -->
                    <div v-else class="d-flex align-items-center justify-content-between">
                        <div class="w-100">
                            <b-skeleton width="60%"></b-skeleton>
                            <b-skeleton width="80%"></b-skeleton>
                        </div>
                        <b-skeleton width="40%"></b-skeleton>
                    </div>

                </b-card-header>
            </b-card>
        </b-col>

        <!-- Content Section -->
        <b-col cols="12">

            <!-- Modules & Topics -->
            <b-row>

                <!-- List Modules -->
                <b-col :hidden="true" cols="12" md="4">

                    <!-- Title -->
                    <h4 class="mb-2">Materi</h4>

                    <div v-if="isModuleLoaded">

                        <!-- List Item-->
                        <div v-for="(item, index) in classroomModules" :key="index">
                            <CardCourses
                                :item="item"
                                :userKind="userKind"
                                :selectedCourse="parseInt(selectedCourse)"
                                :classId="parseInt(classroomId)"
                                :isAssignment="true"
                                @openCourse="openCourse"
                            />
                        </div>

                        <!-- Empty State -->
                        <b-row v-if="classroomModules.length == 0">
                            <b-col>
                                <b-card no-body>
                                    <b-card-body>
                                        <div class="text-center text-primary">
                                            <strong>Belum ada materi di {{ isTestCase ? 'tes' : 'kelas' }} ini</strong>
                                        </div>
                                    </b-card-body>
                                </b-card>
                            </b-col>
                        </b-row>

                    </div>

                    <!-- Loading State -->
                    <b-card v-else>
                        <b-card-body>
                            <b-skeleton width="100%"></b-skeleton>
                        </b-card-body>
                    </b-card>

                </b-col>

                <!-- List Topics -->
                <b-col>
                    
                    <!-- Title -->
                    <!-- <h4 :hidden="isTestCase && userKind == 'student'" class="mb-2">Modul</h4> -->

                    <!-- List Item -->
                    <div v-if="isTopicsLoaded">

                        <div v-if="classroomTopics.length != 0">
                            <div v-for="(item, index) in classroomTopics" :key="index">
                                <CardModules
                                    :isAssignment="true"
                                    :item="item"
                                    :userKind="userKind"
                                    :classroomId="parseInt(classroomId)"
                                    :courseId="item.moduleId"
                                    :title="isTestCase ? 'tes' : 'classroom'"
                                    :isClassEnded="isClassEnded"
                                    @onDelete="setSelectedTopic"
                                />
                            </div>
                        </div>

                        <!-- Empty State -->
                        <b-card v-else no-body>
                            <b-card-body>
                                <div class="text-center text-primary">
                                    <strong v-if="isTestCase">Belum ada tes</strong>
                                    <strong v-else>Belum ada tugas di kelas ini</strong>
                                </div>
                            </b-card-body>
                        </b-card>

                    </div>

                    <!-- Loading State -->
                    <b-card v-else>
                        <b-card-body>
                            <b-row>
                                <b-col cols="10">
                                    <b-skeleton width="100%"></b-skeleton>
                                    <b-skeleton width="40%"></b-skeleton>
                                </b-col>
                                <b-col cols="2">
                                    <b-skeleton width="100%"></b-skeleton>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>

                </b-col>

            </b-row>

        </b-col>

        <!-- Modal Handler -->
        <b-modal
            v-if="isModalDeleteAssignment"
            v-model="isModalDeleteAssignment"
            id="isModalDeleteAssignment"
            centered
            size="sm"
            hide-header
            hide-footer
        >
            <b-row>
                <b-col>
                    <h5 class="mb-3">Anda yakin akan menghapus <strong class="text-primary">{{ selectedTopic.title }}</strong> ?</h5>
                    <div v-if="!isDeleteAssignment" class="d-flex justify-content-end align-items-center">
                        <b-button variant="danger" @click="setSelectedTopic(false)">Batal</b-button>
                        <b-button variant="primary" @click="deleteAssignment">Iya</b-button>
                    </div>
                    <div v-else class="d-flex justify-content-end align-items-center">
                        <b-button variant="primary" disabled><b-spinner small class="mr-2"></b-spinner>Loading...</b-button>
                    </div>
                </b-col>
            </b-row>
        </b-modal>

    </b-row>
</template>

<script>
import CardCourses from '@/components/template/micro/card/CardCourses.vue';
import CardModules from "@/components/template/micro/card/CardModules.vue";

import { mapState } from 'vuex';

export default {

    components: {
        CardCourses,
        CardModules,
    },
    
    computed: {
        ...mapState({
            sassState: (state) => state.Sass,
            servicesState: (state) => state.Services,
            assignmentsState: (state) => state.Assignments,
        })
    },

    data() {
        return {
            // User Role
            userKind: localStorage.getItem('user_kind') ?? 'student',

            // Classroom State
            isLoaded: false,
            isModuleLoaded: false,
            isTopicsLoaded: false,
            isTestCase: false,
            isClassEnded: false,
            isShowMore: false,
            isReadMore: false,
            isModalDeleteAssignment: false,
            isDeleteAssignment: false,

            classroomDetail: null,

            // Modules
            classroomModules: [],
            moduleSelected: null,
            selectedCourse: null,

            // Topics
            classroomTopicsAll: [],
            classroomTopics: [],
            selectedTopic: null,

            // Leaderboard State
            isLeaderboardLoaded: false,

            totalStudents: 0,
            leaderboardDetail: null,

            // State Alert
            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },
        }
    },

    mounted() {

        this.isTestCase = this.sassState.isTestCase
        this.getClassroomDetail()

    },

    methods: {
        /**
         * Classroom Detail
         */
        async getClassroomDetail () {

            await this.$store.dispatch('Services/classroomDetail', {id: this.classroomId});

            if (!this.servicesState.status) {

                console.error('failed fetch classroom detail', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)

            } else {

                this.classroomDetail = this.servicesState.classroomDetail

                if (this.isTestCase) {
                    this.textDescription = this.classroomDetail.description
                    this.isReadMore = false
                    
                    this.clipText(this.classroomDetail.description)
                }

                this.isClassEnded = this.classroomDetail.classState.ended
                
                this.isLoaded = true

                if (this.isTestCase && this.userKind == 'student') this.fetchLeaderboards()
                else this.fetchListModule()

            }

        },

        /**
         * Leaderboard Detail
         */
        async fetchLeaderboards() {

            this.isLeaderboardLoaded = false

            const params = {
                classroomId: this.classroomId,
                page: 1
            }

            let dispatch = 'Services/classroomLeaderboards'

            await this.$store.dispatch(dispatch, params)

            if (!this.servicesState.status) {

                console.error('failed fetch leaderboards', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                
                this.isLeaderboardLoaded = false;

            } else {

                this.leaderboardDetail = this.servicesState.leaderboardDetail
                const dataLeaderboards = this.leaderboardDetail.leaderboards

                if (dataLeaderboards != null) {

                    this.leaderboards = dataLeaderboards.items ?? []
                    this.totalStudents = dataLeaderboards.totalItems

                }

                this.isLeaderboardLoaded = true
                this.fetchListModule()

            }

        },

        /**
         * List Modules
         */
        async fetchListModule() {
            
            this.fetchListTopic()

        },

        /**
         * List Topics
         */
        async fetchListTopic() {

            const found = this.classroomTopicsAll.find((item) => item.topicId == this.selectedCourse)

            if (found) this.classroomTopics = found.lists
            else {

                this.isTopicsLoaded = false

                let params = { 
                    classroomId: this.classroomId
                }

                await this.$store.dispatch('Assignments/list', params)

                if (!this.assignmentsState.status) {

                    console.error('failed fetch assignments: ', this.assignmentsState.message);
                    this.setEvent(this.assignmentsState.message, false)

                    this.isTopicsLoaded = false;

                } else {

                    this.classroomTopics = this.assignmentsState.data ?? []
                    const object = {
                        topicId: this.selectedCourse,
                        lists: this.classroomTopics
                    }
                    this.classroomTopicsAll.push(object)
                    this.isTopicsLoaded = true

                }
                
            }

        },

        /**
         * Delete Assignments
         */
        async deleteAssignment() {

            this.isDeleteAssignment = true

            const params = {
                classroomId: this.classroomId,
                topicId: this.selectedTopic?.id
            }
            
            await this.$store.dispatch('Assignments/delete', params)

            if(!this.assignmentsState?.status) {

                console.error('Failed get topic by detail: ', this.assignmentsState?.message)
                this.setEvent(this.assignmentsState, false)

                this.isDeleteAssignment = false
                this.isModalDeleteAssignment = false

            } else {

                const found = this.classroomTopicsAll.findIndex((item) => item.topicId == this.selectedCourse)
                this.classroomTopicsAll.splice(found, 1)

                setTimeout(() => {

                    this.fetchListTopic()

                    this.isDeleteAssignment = false
                    this.isModalDeleteAssignment = false

                }, 500);

            }

        },

        /**
         * Selected Topic
         */
        setSelectedTopic(item) {

            if (item) {

                this.selectedTopic = item
                this.isModalDeleteAssignment = true

            } else {

                this.selectedTopic = null
                this.isModalDeleteAssignment = false

            }

        },

        /**
         * Toggler Modules
         */
        openCourse (id) {

            if (this.selectedCourse != id) {

                this.selectedCourse = id;
                this.fetchListTopic()

            }

        },

        /**
         * Clip Text
         */
        markdownReader(string) {

            let text = string.replace(/<[^>]+>/g, '')
            return text

        },

        clipText(text) {

            var clip = 200
            text = this.markdownReader(text)

            if (text.length > clip) {
                this.isReadMore = true
                text = text.substr(0, clip-1) + ' ' 
            } else this.isReadMore = false

            this.textDescription = text

        },

        toggleMore() {

            this.isShowMore = !this.isShowMore

            if (this.isShowMore) this.textDescription = this.markdownReader(this.classroomDetail.description)
            else this.clipText(this.classroomDetail.description)

        },

        /**
         * Alert Handler
         */
        setEvent(message, status) {

            window.scrollTo(0,0)

            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status ? 'success' : 'warning'
            this.onEvent.alertCounter = 10

        },

        countDownChanged() {

            this.onEvent.alertCounter = 10
            
        },

    },

    props: {
        classroomId: {
            type: Number,
            default: -1
        }
    }
}
</script>