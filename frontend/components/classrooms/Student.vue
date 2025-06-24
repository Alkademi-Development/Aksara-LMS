<template>
    <b-row>

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

        <b-col cols="12" v-if="isLoaded">
            <div v-if="classroomDetail != null">

                <b-row>
                    <b-col>
                        <b-card no-body class="border">
                            <b-card-body>
                                <b-row align-v="center">

                                    <b-col cols="12" class="d-flex align-items-start mb-3">
                                        <CircleBackButton />
                                        <div>
                                            <h3 class="w-100">{{ classroomDetail != null ? classroomDetail.name : 'Untitled' }}</h3>
                                            <!-- <p v-html="classroomDetail.description"></p> -->
                                            <p v-if="!isReadMore" class="m-0">{{ textDescription }}</p>
                                            <p v-else class="m-0">{{ textDescription }} <b-button variant="primary" class="btn-no-styles text-primary" @click="toggleMore">{{ isShowMore ? '...lebih sedikit.' : '...baca selengkapnya.' }}</b-button></p>
                                        </div>
                                    </b-col>

                                    <b-col cols="12">
                                        <b-row>
                                            <template v-if="isStudentsLoaded && classroomDetail.pretest == 0">
                                                <b-col cols="12">
                                                    <div class="d-flex align-items-end">

                                                        <div v-if="students.length != 0 && userKind != 'student'" class="box-participants mr-3">

                                                            <b-card-text class="mb-1">Peserta</b-card-text>
                                                            <b-avatar-group size="36px" >
                                                                <template v-for="(item, index) in students">
                                                                    <b-avatar
                                                                        v-if="index < 5"
                                                                        v-b-tooltip
                                                                        variant="primary"
                                                                        :src="index < 4 || students.length == 5 ? item.photo : null"
                                                                        :text="index < 4 || students.length == 5 ? item.photo ? '' : item.name.charAt(0) : `+${students.length - 4}`"
                                                                        :title="index < 4 || students.length == 5 ? item.name : `+${students.length - 4} Lainnya`"
                                                                        :key="item.id"
                                                                    ></b-avatar>
                                                                </template>
                                                            </b-avatar-group>

                                                        </div>

                                                        <div class="box-button">
                                                            <nuxt-link v-if="classroomDetail.tasks > 0 || userKind != 'student'" :to="`/dashboard/${res}/assignments/${id}`" class="btn btn-danger rounded-pill mr-0">{{ isTestCase ? 'Tes' : 'Tugas' }}</nuxt-link>
                                                        </div>

                                                    </div>
                                                </b-col>
                                                <!-- <b-col v-if="userKind != 'student'" cols="12" class="mt-3">
                                                
                                                    <b-dropdown id="dropdown-course" text="Tambah Materi" variant="primary" class="mb-3 mb-md-0 mr-3">
                                                        <b-dropdown-item @click="isModalCreateCourse = !isModalCreateCourse, isNewCourse = true">Buat Baru</b-dropdown-item>
                                                        <b-dropdown-item @click="isModalCreateCourse = !isModalCreateCourse, isNewCourse = false">Pilih Yang Sudah Ada</b-dropdown-item>
                                                    </b-dropdown>

                                                    <b-button variant="primary" @click="isModalCreateModule = !isModalCreateModule" class="mb-3 mb-md-0">Tambah Modul</b-button>

                                                </b-col> -->
                                            </template>

                                            <b-col v-if="isStudentsLoaded && classroomDetail.pretest == 1 && classroomDetail.state == 'release' && userKind != 'student'" cols="12" md="8">
                                                <b-button variant="danger" pill @click="modalPublishPretest = true">Terbitkan Hasil Pretest</b-button>
                                            </b-col>

                                            <b-col v-if="!isStudentsLoaded" cols="12">
                                                <div class="d-flex justify-content-between align-items-end">
                                                    <div class="w-50">
                                                        <b-skeleton width="50%"></b-skeleton>
                                                        <b-skeleton width="30%"></b-skeleton>
                                                    </div>
                                                    <div>
                                                        <b-skeleton width="40%"></b-skeleton>
                                                        <b-avatar-group size="36px" >
                                                            <b-skeleton type="avatar"></b-skeleton>
                                                            <b-skeleton type="avatar"></b-skeleton>
                                                            <b-skeleton type="avatar"></b-skeleton>
                                                            <b-skeleton type="avatar"></b-skeleton>
                                                            <b-skeleton type="avatar"></b-skeleton>
                                                        </b-avatar-group>
                                                    </div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>

                                </b-row>
                            </b-card-body>
                        </b-card>
                    </b-col>

                    <b-col md="5" v-if="(classroomDetail.groupLink != '#' && classroomDetail.groupLink != '' && classroomDetail.groupLink != null) && !isFormOpen">
                        <b-card no-body class="border">
                            <b-card-body>
                                <b-row no-gutters align-v="center">
                                    <b-col class="mr-2">
                                        <b-card-title class="mb-2">Grup {{ isTestCase ? 'Tes' : 'Kelas' }}</b-card-title>
                                        <b-card-text class="mb-1">
                                            Bareng mentor dan peserta lain
                                        </b-card-text>
                                    </b-col>
                                    <b-col cols="12" md="auto" class="py-2">
                                        <b-button pill variant="primary" @click="userKind != 'student' ? editGroupLink() : onJoinClass()">{{ userKind != 'student' ? 'Edit Link' : 'Gabung' }}</b-button>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                    </b-col>

                    <b-col md="5" v-else-if="(userKind != 'student' && isFormOpen) || (userKind != 'student' && !classroomDetail.groupLink)">
                        <ClassroomForm
                            :item="classroomDetail"
                            :isTestCase="isTestCase"
                            :action="classroomDetail.groupLink ? 'edit' : 'create'"
                            @editClassroom="updateData"
                        />
                    </b-col>

                    <b-col v-if="classroomDetail.state == 'release' && classroomDetail.pretest == 0 && (classroomDetail.tasks > 0 || userKind != 'student')" cols="12">
                        <b-card no-body class="bg-primary">
                            <b-card-header class="bg-transparent">
                                <div v-if="isLeaderboardLoaded" class="row">
                                    <div v-if="userKind == 'student'" class="col">
                                        <!-- <div v-if="leaderboardDetail.rank" class="d-flex-inline align-items-center">
                                            <h3 class="d-inline text-white">Anda mendapat ranking</h3>
                                            <h1 class="d-inline text-secondary mx-2">{{leaderboardDetail.rank}}</h1>
                                            <h3 class="d-inline text-white">dari</h3>
                                            <h1 class="d-inline text-secondary mx-2">{{totalStudents}}</h1>
                                            <h3 class="d-inline text-white">Peserta</h3>
                                        </div> -->
                                        <!-- <h3 v-else class="text-white">{{classroomDetail.taskSubmitted == classroomDetail.tasks ? 'Terimakasih sudah menyelesaikan soal.' : isClassEnded && isTestCase ? 'Tes telah berakhir' : 'Segera selesaikan semua soal!'}}</h3> -->
                                        <h3 class="text-white">{{classroomDetail.taskSubmitted == classroomDetail.tasks ? 'Terimakasih sudah menyelesaikan semua soal.' : isClassEnded ? `${isTestCase ? 'Tes' : 'Kelas'} telah berakhir` : 'Segera selesaikan semua soal!'}}</h3>
                                        <div class="d-flex-inline align-items-center mt-4 mt-md-0">
                                            <strong class="text-secondary mr-2">{{classroomDetail.taskSubmitted}} / {{classroomDetail.tasks}}</strong>
                                            <span class="text-white mr-2">Soal diselesaikan.</span>
                                            <template v-if="leaderboardDetail.rank">
                                                <span class="text-white mr-2">Rata-rata nilai anda</span>
                                                <strong class="text-secondary">{{leaderboardDetail.score}} / 100</strong>
                                            </template>
                                        </div>
                                    </div>
                                    <div v-else class="col">
                                        <h3 class="text-white">Leaderboard dari semua peserta</h3>
                                    </div>
                                    <!-- <div v-if="userKind == 'student' && res == 'tes' && leaderboardDetail.rank" class="col-12 col-md-4 col-lg-3 mt-4 mt-md-0 text-md-right">
                                        <b-button variant="white" pill @click="openLeaderBoard">Lihat Leaderboard</b-button>
                                    </div>
                                    <div v-else-if="userKind != 'student'" class="col-12 col-md-4 col-lg-3 mt-4 mt-md-0 text-md-right">
                                        <b-button variant="white" pill @click="openLeaderBoard">Lihat Leaderboard</b-button>
                                    </div> -->
                                    <div v-if="userKind != 'student'" class="col-12 col-md-4 col-lg-3 mt-4 mt-md-0 text-md-right">
                                        <b-button variant="white" pill @click="openLeaderBoard">Lihat Leaderboard</b-button>
                                    </div>
                                    <!-- <b-button v-if="leaderboards != null" variant="white" pill>Lihat Leaderboards</b-button> -->
                                </div>
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

                    <!-- Class Released & On Pretest -->
                    <b-col v-else-if="classroomDetail.state == 'release' && classroomDetail.pretest == 1 && userKind != 'student'" cols="12">
                        <b-card no-body class="bg-primary">
                            <b-card-header class="bg-transparent">
                                <div class="d-flex flex-wrap align-items-center justify-content-between">
                                    <h3 class="text-white mb-3 mb-md-0">Leaderboard Peserta Pretest</h3>
                                    <b-button variant="white" pill @click="openLeaderBoard">Lihat Leaderboard</b-button>
                                    <!-- <b-button v-if="leaderboards != null" variant="white" pill>Lihat Leaderboards</b-button> -->
                                </div>
                            </b-card-header>
                        </b-card>
                    </b-col>

                    <!-- Class Draft -->
                    <b-col v-else-if="classroomDetail.state == 'draft'" cols="12">
                        <b-card no-body class="bg-primary">
                            <b-card-header class="bg-transparent">
                                <div class="d-flex flex-wrap align-items-center justify-content-between">
                                    <h3 class="text-white mb-3 mb-md-0">{{ isTestCase ? 'Tes' : 'Kelas' }} belum diterbitkan!</h3>
                                    <b-button variant="white" pill @click="modalRelease = true">Terbitkan Sekarang</b-button>
                                    <!-- <b-button v-if="leaderboards != null" variant="white" pill>Lihat Leaderboards</b-button> -->
                                </div>
                            </b-card-header>
                        </b-card>
                    </b-col>

                </b-row>

                <!-- Content Body -->
                <!-- Section Course & Topics -->
                <b-row>

                    <!-- List Modules -->
                    <b-col v-if="res == 'classroom' || (res == 'tes' && userKind != 'student')" md="4">

                        <!-- Module Loaded -->
                        <div v-if="isModuleLoaded">

                            <!-- Modules Title -->
                            <div>
                                
                                <h4 class="mb-2">Materi</h4>
                                <!-- <div class="d-flex justify-content-between align-items-center"> -->
                                    <!-- <h4 class="mb-2">Materi</h4> -->
                                    <!-- <b-button v-if="userKind == 'superadmin' || userKind == 'admin'" size="sm" :variant="isAddModule ? 'danger' : 'primary'" @click="addModuleToggler">{{isAddModule ? 'Batal' : 'Tambah'}}</b-button> -->
                                <!-- </div> -->
                                
                                <!-- Add Module Form Open -->
                                <b-card v-if="(userKind == 'superadmin' || userKind == 'admin')" v-show="isAddModule" no-body>
                                    <b-card-body>
                                        <ClassroomAddModuleForm 
                                            :isAddModule="isAddModule"
                                            :classroomId="parseInt(id)"
                                            @addModuleToggler="addModuleToggler"
                                            @submitAddModule="getListModules('visible')"
                                        />
                                    </b-card-body>
                                </b-card>
                                <!-- <b-button v-if="(userKind == 'superadmin' || userKind == 'admin')" v-show="!isAddModule" variant="primary" type="submit" block class="mb-3" @click="addModuleToggler">Tambah Materi</b-button> -->

                            </div>

                            <!-- Modules Item -->
                            <div v-for="(item, index) in classroomModules" :key="index">
                                <CardCourses
                                    :item="item"
                                    :userKind="userKind"
                                    :selectedCourse="parseInt(selectedCourses)"
                                    :classId="parseInt(id)"
                                    @openCourse="openCourse"
                                    @onDelete="showDeleteModal"
                                />
                            </div>

                            <!-- Empty Modules -->
                            <b-row v-if="isModuleEmpty && !isAddModule">
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

                        <!-- Module On Load -->
                        <b-card v-else>
                            <b-card-body>
                                <b-skeleton width="100%"></b-skeleton>
                            </b-card-body>
                        </b-card>

                    </b-col>    

                    <!-- List Topics -->
                    <b-col>

                        <!-- Topics Loaded -->
                        <div v-if="isTopicsLoaded">
                            <h4 v-if="res != 'tes' || userKind != 'student'" class="mb-2">Daftar Modul</h4>

                            <!-- Topics Item -->
                            <div v-if="classroomTopics.length != 0">
                                <div v-for="(item, index) in classroomTopics" :key="index">
                                    <CardModules
                                        :item="item"
                                        :userKind="userKind"
                                        :title="res"
                                        :classroomId="parseInt(id)"
                                        :courseId="parseInt(selectedCourses)"
                                        :isClassEnded="isClassEnded"
                                        @openModal="openModal"
                                    />
                                </div>
                            </div>

                            <!-- Empty Topics -->
                            <b-card v-else no-body>
                                <b-card-body>
                                    <div class="text-center text-primary">
                                        <strong>Belum ada modul di materi ini</strong>
                                    </div>
                                </b-card-body>
                            </b-card>
                        </div>

                        <!-- Topics On Load -->
                        <b-card v-else>
                            <b-card-body>
                                <b-skeleton width="100%"></b-skeleton>
                            </b-card-body>
                        </b-card>

                    </b-col>

                </b-row>

            </div>
        </b-col>

        <!-- Loading Section -->
        <b-col cols="12" v-else>
            <div class="card">
                <div class="mx-auto my-5 text-center text-primary">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </div>
        </b-col>

        <!-- Modal Handler -->
        <b-modal
            v-if="modalPublishPretest"
            v-model="modalPublishPretest"
            id="modalPublishPretest"
            centered
            size="sm"
            hide-header
            hide-footer
        >
            <b-row>
                <b-col>
                    <h5 class="mb-3">Terbitkan hasil pretest sekarang?</h5>
                    <b-form @submit="publishPretest">
                        <b-form-group label="Nilai minimal / KKM *" label-for="inputMinScore" class="mb-4">
                            <b-form-input id="inputMinScore" type="number" min="0" max="100" required v-model="inputMinScore"></b-form-input>
                        </b-form-group>
                        <div class="d-flex justify-content-end align-items-center">
                            <b-button variant="danger" @click="modalPublishPretest = false">Batal</b-button>
                            <b-button variant="primary" type="submit">Iya</b-button>
                        </div>
                    </b-form>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal
            v-if="modalRelease"
            v-model="modalRelease"
            id="modalRelease"
            centered
            size="sm"
            hide-header
            hide-footer
        >
            <b-row>
                <b-col>
                    <p class="mb-5">Terbitkan {{ isTestCase ? 'tes' : 'kelas' }} sekarang?</p>
                    <div class="d-flex justify-content-end align-items-center">
                        <b-button variant="danger" @click="modalRelease = false">Batal</b-button>
                        <b-button variant="primary" @click="releaseClass">Iya</b-button>
                    </div>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal
            v-if="modalDeleteOpen"
            v-model="modalDeleteOpen"
            id="modalDelete"
            centered
            size="sm"
            hide-header
            hide-footer
        >
            <b-row>
                <b-col>
                    <p class="mb-5">Apakah anda yakin akan menghapus materi <strong class="text-primary">{{toDeletedCourse.title}}</strong>?</p>
                    <div class="d-flex justify-content-end align-items-center">
                        <b-button variant="danger" @click="modalDeleteOpen = false">Batal</b-button>
                        <b-button variant="primary" @click="deleteCourse">Iya</b-button>
                    </div>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal
            v-if="isModalLeaderboard"
            v-model="isModalLeaderboard"
            id="modalLeaderboard"
            centered
            size="xl"
            hide-header
            hide-footer
            body-class="p-0"
        >
            <b-row>
                <LeaderBoardTable 
                :isBusy="isLeaderboardBusy"
                :fields="leaderboardField"
                :items="leaderboardItem"
                :pagination="pagination"
                :leaderboardDetail="leaderboardDetail"
                :classroomDetail="classroomDetail"
                @fetchData="fetchAllLederboards"/>
            </b-row>
        </b-modal>

        <ModalCreateCourse 
            size="md" 
            :title="isNewCourse ? 'Buat Materi Baru' : 'Pilih Materi Yang Sudah Ada'" 
            :hideFooter="true"
            :isFromClass="true"
            :classroomId="id" 
            :vModel="isModalCreateCourse" 
            :isNewCourse="isNewCourse"
            :classroomModules="classroomModules"
            @vModelChange="isModalCreateCourse = $event"
            @submitted="getListModules('visible', $event)"
        />

        <ModalCreateModule
            size="md" 
            title="Buat Modul Baru" 
            :hideFooter="true"
            :isFromClass="true"
            :classroomId="id" 
            :vModel="isModalCreateModule"
            :classroomModules="classroomModules"
            @vModelChange="isModalCreateModule = $event"
            @submitted="getListModules('visible', $event)"
        />
    </b-row>
</template>

<script>
import ClassroomAddModuleForm from '@/components/template/micro/form/ClassroomAddModuleForm';
import ClassroomForm from '@/components/template/micro/form/ClassroomForm';
import CardCourses from '@/components/template/micro/card/CardCourses';
import CardModules from '@/components/template/micro/card/CardModules';
import LeaderBoardTable from '@/components/template/micro/table/LeaderBoardTable';
import ModalCreateCourse from '@/components/template/micro/modal/ModalCreateCourse.vue';
import ModalCreateModule from '@/components/template/micro/modal/ModalCreateModule.vue';

import { mapState } from 'vuex';

export default {
    components: {
        ClassroomAddModuleForm,
        ClassroomForm,
        CardCourses,
        CardModules,
        LeaderBoardTable,
        ModalCreateCourse,
        ModalCreateModule,
    },

    props: {
        // currentBatch: Object,
        id: Number,
    },

    data () {
        return {
            userKind: localStorage.getItem('user_kind'),
            isLoaded: false,
            isTestCase: false,
            isModuleLoaded: false,
            isTopicsLoaded: false,
            isModuleEmpty: false,
            isAddModule: false,
            isClassEnded: false,
            modalRelease: false,
            modalPublishPretest: false,

            // Leaderboard
            isLeaderboardLoaded: false,
            isModalLeaderboard: false,
            isStudentsLoaded: false,
            isLeaderboardBusy: false,
            totalStudents: 0,
            leaderboards: null,
            leaderboardDetail: null,
            leaderboardItem: [],
            leaderboardField: [
                {
                    key: "no", 
                    label: 'Ranking',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'name',
                    label: 'Nama',
                },
                {
                    key: 'score',
                    label: 'Nilai',
                    thStyle: 'width: 10%'
                },
            ],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 1,
            },

            // Form
            isFormOpen: false,
            isModalOpen: false,

            // Module
            modules: [],
            moduleSelected: null,
            selectedCourses: null,
            selectedCoursesSlug: null,
            toDeletedCourse: null,
            modalDeleteOpen: false,

            // Classroom
            classroomDetail: null,
            classroomModules: null,
            classroomTopics: null,
            classroomTopicsAll: [],
            textDescription: "",
            isReadMore: false,
            isShowMore: false,
            inputMinScore: "",
            res: '',
            // Modal Create Course & Module
            isModalCreateCourse: false,
            isNewCourse: false,
            isModalCreateModule: false,

            students: null,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },
        }
    },

    computed: {
        ...mapState({
            sassState: (state) => state.Sass,
            classroomState: (state) => state.Classrooms,
            servicesState: (state) => state.Services,
        })
    },

    created () {
        const url = this.$router.currentRoute.fullPath;
        var urlSplit = url.split("/")
        urlSplit.shift()

        this.res = urlSplit[1].toLowerCase();
        this.isTestCase = this.sassState.isTestCase

        this.getClassroomDetail();
    },

    methods: {

        async publishPretest (event) {

            event.preventDefault()
            const params = {
                classroomId: this.id,
                minScore: parseInt(this.inputMinScore)
            }

            this.isLoaded = false
            this.modalPublishPretest = false

            await this.$store.dispatch('Services/classroomPublishPretest', params);

            if (!this.servicesState.status) {

                console.error('failed publish class', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = false

            } else this.getClassroomDetail()

        },

        async releaseClass () {

            this.isLoaded = false
            await this.$store.dispatch('Services/classroomRelease', this.id);

            if (!this.servicesState.status) {

                console.error('failed release class', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)

            } else this.getClassroomDetail()

            this.modalRelease = false

        },

        async getClassroomDetail () {

            await this.$store.dispatch('Services/classroomDetail', {id: this.id});

            if (!this.servicesState.status) {

                console.error('failed fetch classroom detail', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)

            } else {

                this.classroomDetail = this.servicesState.classroomDetail

                this.textDescription = this.classroomDetail.description
                this.isReadMore = false
                
                this.clipText(this.classroomDetail.description)

                // Check Class Ended
                this.isClassEnded = this.classroomDetail.classState.ended
                
                this.isLoaded = true

                if (this.leaderboardDetail == null) this.fetchLeaderboards(1)
                else this.fetchStudents()

            }

        },
        async getListModules(state, event = null) {
            this.isModuleLoaded = false
            let params = {
                slug: this.classroomDetail?.slug,
                state: state
            }

            await this.$store.dispatch('Services/classroomModules', params)

            if (!this.servicesState.status) {

                console.error('failed fetch classroom modules: ', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isModuleLoaded = false;
                this.isModuleEmpty = true

            } else {

                this.classroomModules = this.servicesState.modules

                if (this.classroomModules.length == 0) this.isModuleEmpty = true
                else this.isModuleEmpty = false

                this.isModuleLoaded = true
                this.setActiveCourse(event)
            }

        },
        setActiveCourse(courseId = null) {
            if (courseId) this.selectedCourses = courseId
            else {
                if (this.classroomModules?.length != 0) {
                    this.selectedCourses = this.classroomModules?.[0]?.id
                    this.selectedCoursesSlug = this.classroomModules?.[0]?.slug
                }
                else {
                    this.selectedCourses = null
                    this.selectedCoursesSlug = null
                }
            }

            this.fetchListTopics(courseId)

        },
        async fetchListTopics(event) {
            const found = this.classroomTopicsAll.find((item) => item.topicId == this.selectedCourses)

            if (found && !event) this.classroomTopics = found.lists
            else {
                this.isTopicsLoaded = false
                await this.$store.dispatch('Services/classroomTopics', {classroomSlug: this.classroomDetail?.slug, moduleSlug: this.selectedCoursesSlug})

                if (!this.servicesState.status) {

                    console.error('failed fetch classroom topics', this.servicesState.message);
                    this.setEvent(this.servicesState.message, false)
                    this.isTopicsLoaded = false;

                } else {

                    this.classroomTopics = this.servicesState.topics ?? []

                    const object = {
                        topicId: this.selectedCourses,
                        lists: this.classroomTopics
                    }

                    this.classroomTopicsAll.push(object)
                    this.isTopicsLoaded = true

                }

            }

            // if (this.leaderboardDetail == null) this.fetchLeaderboards(1)
        },

        async fetchLeaderboards(page) {
            this.isLeaderboardLoaded = false

            const params = {
                classroomId: this.id,
                page: page
            }

            let dispatch = 'Services/classroomLeaderboards'
            
            if (this.classroomDetail.pretest == 1) dispatch = 'Services/pretestLeaderboards'

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
                    this.pagination = {
                        page: dataLeaderboards.page,
                        perPage: dataLeaderboards.perPage,
                        totalItems: dataLeaderboards.totalItems,
                        totalPages: dataLeaderboards.totalPages,
                    }

                }

                this.isLeaderboardLoaded = true
                this.fetchStudents()

            }
        },

        async fetchStudents() {
            this.isStudentsLoaded = false

            await this.$store.dispatch('Services/classroomStudents', this.id)

            if (!this.servicesState.status) {
                
                console.error('failed fetch students', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isStudentsLoaded = false;

            } else {

                this.students = this.servicesState.data
                this.getListModules('visible')
                this.isStudentsLoaded = true

            }
        },

        async deleteCourse() {
            // this.isLoaded = false

            const params = {
                classroomId: this.id, 
                moduleId: this.toDeletedCourse.id
            }

            await this.$store.dispatch('Services/classroomDeleteModule', params)

            if(!this.servicesState.status) {

                console.error('Failed delete modules', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                // this.$bvModal.hide('modalDelete')
                this.modalDeleteOpen = false
                this.toDeletedCourse = null

            } else {

                // this.$bvModal.hide('modalDelete')
                this.modalDeleteOpen = false
                this.toDeletedCourse = null
                this.getListModules('visible')

            }
        },

        openLeaderBoard() {
            // this.isModalLeaderboard = !this.isModalLeaderboard
            // this.fetchAllLederboards(1)
            this.$router.push(`/dashboard/classroom/${this.id}/leaderboard`)
        },

        async fetchAllLederboards(page) {
            this.isLeaderboardBusy = true
            const params = {
                classroomId: this.id,
                page: page
            }

            let dispatch = 'Services/classroomLeaderboards'
            
            if (this.classroomDetail.pretest == 1) dispatch = 'Services/pretestLeaderboards'

            await this.$store.dispatch(dispatch, params)

            if (!this.servicesState.status) {
                console.error('failed fetch leaderboards', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isLeaderboardBusy = false
            } else {
                const dataLeaderboards = this.servicesState.leaderboardDetail.leaderboards

                this.leaderboardItem = dataLeaderboards.items ?? []
                this.pagination = {
                    page: dataLeaderboards.page,
                    perPage: dataLeaderboards.perPage,
                    totalItems: dataLeaderboards.totalItems,
                    totalPages: dataLeaderboards.totalPages,
                }

                this.isLeaderboardBusy = false
            }
        },

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

        addModuleToggler() {
            this.isAddModule = !this.isAddModule
        },

        onJoinClass() {
            window.open(this.classroomDetail.groupLink, '_blank');
        },

        editGroupLink() {
            this.isFormOpen = true;
        },

        async updateData (state) {
            if (!state) {
                this.isLoaded = false;
                this.isFormOpen = false;
                await this.getClassroomDetail();
            } else {
                this.isFormOpen = false;
            }
        },

        async getStudentClassroom () {
            await this.$store.dispatch('Classrooms/getActiveClassroom');

            if (!this.classroomState.status) {
                console.error('failed fetch classroom detail', this.classroomState.message);
                this.isLoaded = true;
            } else {
                this.setActiveCourse();
            }
        },

        openCourse (id) {
            // this.isTopicsLoaded = false;
            this.selectedCourses = id;
            this.fetchListTopics()

            // const courses = this.classroomState.classroom.courses.find(item => item.courseId === id);
            // this.modules = courses.modules;
            // this.isTopicsLoaded = true;
        },

        showDeleteModal(item) {
            this.toDeletedCourse = item
            this.modalDeleteOpen = true
            // this.$bvModal.show('modalDelete')
        },

        openModal (item) {
            this.moduleSelected = item;
            this.isModalOpen = true;
            this.$bvModal.show('start-classroom');
        },

        startClassroom () {
            const id = this.moduleSelected.moduleId;
            this.closeModal();
            this.$router.push(`/dashboard/classroom/${this.classroomState.classroom.id}/course/module/${id}`);
        },

        closeModal () {
            this.moduleSelected = null;
            this.isModalOpen = false;
            this.$bvModal.hide('start-classroom');
        },

        markdownReader(string) {
            let text = string.replace(/<[^>]+>/g, '')
            return text
        },

        clipText(text) {
            var clip = 200

            if ((this.userKind != 'student' && this.isFormOpen) || (this.userKind != 'student' && !this.classroomDetail.groupLink)) clip = 80

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
    },

    watch: {
        modalPublishPretest() {
            this.inputMinScore = ""
        }
    }

}
</script>

<style scoped>
.text-add {
    cursor: pointer;
}
.text-add-course:hover {
    color: var(--bs-primary) !important;
}
.b-skeleton-avatar {
    width: 36px !important;
    height: 36px !important;
    margin-left: calc(-5.4px) !important;
    margin-right: calc(-5.4px) !important;
    border: 1px solid #dee2e6 !important;
}
.modal-body {
    padding: 0 !important;
}
</style>