<template>
    <b-row>

        <!-- Alert Section -->
        <div class="col">
            <b-alert
                :show="onEvent.alertCounter"
                :variant="onEvent.variant"
                @dismissed="onEvent.alertCounter=0"
                @dismiss-count-down="countDownChanged"
                >
                {{ onEvent.message }}
            </b-alert>
        </div>

        <!-- Header Section -->
        <b-col v-show="userKind == 'student' && title == 'tes'" cols="12">
            <b-card no-body class="border">

                <b-card-header>
                    <b-row>

                        <b-col cols="12" class="d-flex align-items-center">

                            <!-- Header Content -->
                            <template v-if="isLoaded">
                                <div>
                                    <h3>{{ moduleDetail.title }}</h3>
                                    <h5 class="text-muted d-md-flex flex-wrap align-items-center"><span :class="['mr-2 badge', `badge-${generateBadge(moduleDetail.kind)}`]">{{ moduleDetail.kind == 'assignment' ? 'TUGAS' : 'LATIHAN' }}</span>{{ moduleDetail.module }}</h5>
                                </div>
                            </template>

                            <!-- Loading State -->
                            <div v-else class="w-100">
                                <b-skeleton width="40%"></b-skeleton>
                                <b-skeleton width="60%"></b-skeleton>
                            </div>

                        </b-col>

                    </b-row>
                </b-card-header>

                <!-- Auto Open Task on LMS Type Test like (UMPTN or Jambore) -->
                <b-card-body>

                    <!-- Loading State -->
                    <div v-if="!processAutoStart" class="d-flex align-items-center justify-content-center">
                        <b-spinner small variant="primary" class="mr-2"></b-spinner>
                        <span class="text-primary">Loading...</span>
                    </div>

                    <!-- Action Handler -->
                    <div v-else-if="assignmentSubmitted" class="d-flex align-items-center justify-content-center">
                        <span class="text-primary">Anda sudah mengerjakan tes ini.</span>
                    </div>
                    <div v-else class="text-center">
                        <p class="text-primary mb-3">Klik tombol dibawah jika tes tidak terbuka</p>
                        <b-button variant="primary" @click="onOpenAssignment">Buka Tes</b-button>
                    </div>

                </b-card-body>

            </b-card>
        </b-col>

        <!-- Content Section -->
        <b-col v-show="(userKind != 'student' && title == 'tes') || (title == 'classroom' || title == 'courses')" cols="12">
            <b-col class="mb-5">
                <!-- <button @click="onBackClick()" class="d-flex border-0 bg-transparent font-weight-500 gap-2 mb-4 align-items-center backButton">
                    <i class="ri-arrow-left-s-line"></i>
                    KEMBALI KE MATERI
                </button> -->
                <!-- <BackButton class="border-0"/> -->
                <b-row>
                    <!-- Content Left -->
                    <b-col cols="12" lg="4" md="10" sm="12" class="mb-3 mb-lg-0 mx-auto mx-lg-0 px-0">
                        <template v-if="isLoaded">
                            <div class="py-4 d-flex flex-column justify-content-center rounded-lg" style="background: white; padding-inline:12px">
                                <h4 style="font-size: 18px">File Modul</h4>
                                <div v-if="moduleDetail.files.length >= 1">
                                    <div v-for="(data, id) in moduleDetail.files" :key="id">
                                        <div @click="isFiles = {data:data, id:id}" v-if="isFiles?.id == id" :class="`my-2 p-2 d-flex align-items-center flex-row bg-primary text-white rounded`" style="gap:.7rem; cursor:pointer">
                                            <div class="d-flex align-items-center" style="gap:.7rem">
                                                <i :class="`${filterIcons(data?.kind)} text-white`"></i>
                                                <p class="mb-0 text-white">{{ data?.kind }}</p>
                                            </div>
                                        </div>
                                        <div @click="isFiles = {data:data, id:id}" v-else :class="`my-2 p-2 d-flex align-items-center flex-row list-files`" style="gap:.7rem; cursor:pointer">
                                            <i :class="filterIcons(data?.kind)"></i>
                                            <p class="mb-0">{{ data?.kind }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-else><p class="my-2">Modul ini tidak memberikan materi berupa file</p></div>
                            </div>
                        </template>
                    </b-col>
                    <b-col cols="12" lg="8" md="10" sm="12" class="mb-3 mb-lg-0 mx-auto mx-lg-0 pl-0 pl-lg-3 pr-0">
                        <!-- <b-card no-body class="border overflow-hidden"> -->

                            <!-- Content Header -->
                            <!-- <b-card-header> -->
                                <!-- <b-row>
                                    <b-col cols="10" class="py-2 d-flex align-items-center">

                                        <template v-if="isLoaded">
                                            <div>
                                                <h3>{{ moduleDetail.title }}</h3>
                                                <h5 class="text-muted d-md-flex flex-wrap align-items-center"><span :class="['mr-2 badge', `badge-${generateBadge(moduleDetail.kind)}`]">{{ moduleDetail.kind == 'assignment' ? 'TUGAS' : 'LATIHAN' }}</span> {{ moduleDetail.module }}</h5>
                                            </div>
                                            
                                        </template>

                                        Loading State
                                        <div v-else class="w-100">
                                            <b-skeleton width="40%"></b-skeleton>
                                            <b-skeleton width="60%"></b-skeleton>
                                        </div>

                                    </b-col>

                                </b-row> -->
                            <!-- </b-card-header> -->

                            <!-- Content Body -->
                            <!-- <b-card-body> -->

                                <div v-if="isLoaded" >
                                    <div class="d-flex flex-column pt-4 px-3 pb-3 rounded bg-white">
                                        <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4" style="gap:.5rem">
                                            <!-- <div class="d-flex mb-3 mb-sm-0 align-items-center" style="gap:.5rem"> -->
                                            <b-col cols="12" sm="8" md="7" lg="6" class="d-flex mb-2 mb-lg-0 align-items-center" style="gap:.5rem">
                                                <img v-if="moduleDetail?.author?.photo" :src="moduleDetail?.author?.photo" alt="Profile Mentor" class="user-prof">
                                                <h5 v-else class="user-prof" v-html="moduleDetail?.author?.name.charAt(0)" />
                                                <div class="d-flex flex-column">
                                                    <h4 class="h4" v-html="moduleDetail?.author?.name" />
                                                    <h5 class="h5 text-secondary" style="line-height: 2px;" v-html="`Penyusun Modul`"/>
                                                </div>
                                            </b-col>
                                            <!-- </div> -->
                                            <!-- <div v-if="listMentor != 0"  class="d-flex flex-sm-row flex-column align-items-start align-items-sm-center" style="gap:.5rem"> -->
                                            <b-col cols="6" v-if="listMentor != 0" class="d-flex flex-sm-row flex-column align-items-start align-items-sm-center " style="gap:.5rem; width: max-content">
                                                <div class="d-flex">
                                                    <div v-for="(data, index) in listMentor" :key="index">
                                                        <div v-if="index < 5">
                                                            <div v-if="data?.photo" class="user-prof mr--4 mr-sm-0 ml-0 ml-sm--4">
                                                                <img :src="data?.photo" alt="Profile Mentor">
                                                            </div>
                                                            <h5 v-else class="user-prof mr--4 mr-sm-0 ml-0 ml-sm--4">{{ data?.name.charAt(0) }}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-column align-items-start">
                                                    <div class="d-flex" style="gap:4px">
                                                        <h4 
                                                            v-if="listMentor.length > 5" 
                                                            class="text-capitalize h4 m-0" 
                                                        >
                                                            {{ `${firstNameMentor(listMentor[listMentor.length -1]?.name)} & ${listMentor.length -1} Lainnya` }}
                                                        </h4>
                                                        <template v-else>
                                                            <h4 
                                                                v-for="(data, index) in listMentor" 
                                                                :key="index" 
                                                                class="text-capitalize h4 m-0"
                                                            >
                                                                {{ firstNameMentor(data?.name) }}
                                                            </h4>
                                                        </template>
                                                    </div>
                                                    <h5 class="h5 text-secondary m-0">Mentor</h5>
                                                </div>
                                            </b-col>
                                            <!-- </div> -->
                                        </div>
                                        <div v-if="isFiles?.data?.kind === 'video' && validURL(isFiles?.data?.file)" class="mb-3" >
                                            <b-embed
                                                @contextmenu="disableRightClick($event)"
                                                :type="isVideoAlkademi(isFiles?.data?.file, isFiles?.data?.kind)"
                                                allowfullscreen
                                                frameborder="0"
                                                controls 
                                                controlslist="nodownload"
                                                :src="generateVideoEmbed(isFiles?.data?.file, isFiles?.data?.kind)"
                                            ></b-embed>
                                        </div>
                                        <h5 class="font-weight-500" style="font-size:16px" v-if="isFiles?.data?.kind === 'video' && isFiles?.data?.file" v-html="moduleDetail.title"/>
                                        <h5 class="font-weight-500" style="font-size:16px" v-if="!isModuleVideo" v-html="moduleDetail.title"/>
                                            <!-- <div class="" style="">
                                                <a href="#"><i class="ri-share-line mx-1"></i></a>
                                                <a href="#"><i class="ri-chat-4-line mx-1"></i></a>
                                            </div> -->
                                            <!-- <b-card-text class="mb-3" v-html="moduleDetail.description"></b-card-text> -->
                                        <p style="font-size:12px; margin-top: 25px; margin-bottom: 12px" class="font-weight-400" v-if="isFiles?.data?.kind === 'video' && isFiles?.data?.file" v-html="moduleDetail.description"></p>
                                        <p style="font-size:12px; margin-top: 25px; margin-bottom: 12px" class="font-weight-400" v-if="!isModuleVideo" v-html="moduleDetail.description"></p>
                                        <div v-if="isFiles?.data?.kind !== 'video' && validURL(isFiles?.data?.file)" class="mb-3">
                                            <b-embed
                                                @contextmenu="disableRightClick($event)"
                                                type="iframe"
                                                :aspect="isFiles?.data?.kind === 'document' ? '1by1' : '16by9'"
                                                allowfullscreen
                                                frameborder="0"
                                                :src="generateLinkEmbed(isFiles?.data?.file, isFiles?.data?.kind)" 
                                                height="1000"    
                                            />
                                        </div>
                                        <!-- <div v-else class="text-center">
                                            <p class="lead mt-0 mb-3">Modul ini tidak memberikan materi dalam bentuk file</p>
                                        </div> -->
                                        <div v-if="prevTopic.action || nextTopic.action" :class="`border rounded d-flex align-items-center ${nextTopic.action && prevTopic.action ? 'justify-content-between' : nextTopic.action ? 'justify-content-end' : 'justify-content-start'} px-2 py-3 mb-4`">
                                            <button v-if="prevTopic.action" @click="onSwitchModule(prevTopic)" class="move-module d-flex border-0 align-items-center">
                                                <i class="ri-arrow-left-line"/>
                                                <h5 class="font-weight-500" style="font-size:14px" v-html="prevTopic.title"/>
                                            </button>
                                            <button v-if="nextTopic.action" @click="onSwitchModule(nextTopic)" class="move-module d-flex border-0 align-items-center">
                                                <h5 class="font-weight-500" style="font-size:14px" v-html="nextTopic.title"/>
                                                <i class="ri-arrow-right-line"/>
                                            </button>
                                        </div>
                                        <!-- <div :class="`d-flex ${nextTopic.action && prevTopic.action ? 'justify-content-between' : nextTopic.action ? 'justify-content-end' : 'justify-content-start'}`">
                                            <button v-if="prevTopic.action" @click="onSwitchModule(prevTopic.topicId)" class="bg-transparent border-0"><i class="ri-arrow-left-line" style="font-size:30px"></i></button>
                                            <button v-if="nextTopic.action" @click="onSwitchModule(nextTopic.topicId)" class="bg-transparent border-0"><i class="ri-arrow-right-line" style="font-size:30px"></i></button>
                                        </div> -->
                                    </div>
                                </div>
                                
                                <!-- Loading State -->
                                <div v-else>
                                    <b-skeleton width="100%" class="mb-3"></b-skeleton>
                                    <b-skeleton width="50%"></b-skeleton>
                                    <b-skeleton width="80%"></b-skeleton>
                                    <b-skeleton width="40%"></b-skeleton>
                                </div>

                            <!-- </b-card-body> -->

                        <!-- </b-card> -->
                    </b-col>

                    <!-- Content Right for Student -->
                    <b-col v-if="userKind == 'student' && isAssignment" lg="4">
                        <StudentAssignmentCard
                            :classroomId="classId"
                            :topicId="topicId"
                            :autoStartAssignment="autoStartAssignment"
                            :openAssignment="openAssignment"
                            :assignment="assignmentStudent"
                            :assignmentDetail="assignmentDetail"
                            :moduleDetail="moduleDetail"
                            :isBusy="isBusy"
                            @loadModule="fetchModule"
                            @assignmentSubmitted="assignmentSubmitted = true"
                            @processAutoStart="processAutoStart = true"
                            @stopOpenAssignment="openAssignment = false"
                        />

                        <b-card no-body v-if="!isBusy && assignmentStudent.scored">
                            <b-card-body>
                                <b-row align-v="center">
                                    <b-col cols="12" md="8" lg="12" class="mb-4">
                                        <b-card-title class="mb-2">Hasil</b-card-title>
                                    </b-col>
                                    <b-col cols=12 md=4 lg=12 class="d-flex align-items-center justify-content-end">
                                        <b-button pill variant="danger" @click="isResultModalOpen = true">Lihat Hasil</b-button>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                    </b-col>

                </b-row>
                
            </b-col>
        </b-col>

        <!-- List Student Task for Mentor -->
        <b-col v-if="isLoaded && userKind != 'student' && title != 'courses' && isAssignment" cols="12">
            <b-row>
                <StudentTaskTable
                    :classroomId="classId"
                    :topicId="topicId"
                    :isBusy="isBusy"
                    :fields="fields"
                    :items="assignments"
                    :pagination="pagination"
                    @fetchData="pageChange"
                    @isLoading="busyToggler"
                    @updateData="fetchAssignments"
                />
            </b-row>
        </b-col>

        <!-- Modal Section -->
        <b-modal
            v-if="assignmentStudent"
            size="sm"
            body-class="container"
            v-model="isResultModalOpen"
            centered
            hide-footer
            hide-header
            @hide="isResultModalOpen = false"
        >
            <b-row>
                <b-col cols="12">
                    <strong class="text-left mb-0">
                        Nilai yang kamu dapatkan
                    </strong>
                    <h1 class="text-left h1 d-flex align-items-center">
                        <strong class="text-primary">{{ assignmentStudent.score }}</strong>
                        <small class="h3 mb-0 ml-1"> &bull; {{ assignmentStudent.score > 90 ? 'Sangat Memuaskan' : assignmentStudent.score > 80 ? 'Memuaskan' : assignmentStudent.score > 70 ? 'Baik' : assignmentStudent.score > 50 ? 'Kurang' : 'Sangat Kurang' }}</small>   
                    </h1>
                </b-col>
                <b-col cols="12" v-show="assignmentStudent.mentorNotes != ''">
                    <strong class="text-left mb-0">
                        Catatan dari mentor
                    </strong>
                    <h5 class="text-left h3" v-html="assignmentStudent.mentorNotes"></h5>
                </b-col>
            </b-row>
        </b-modal>
        
    </b-row>
</template>

<script>
import StudentTaskTable from '@/components/template/micro/table/StudentTaskTable.vue';
import StudentAssignmentCard from '~/components/classrooms/StudentAssignmentCard.vue';
import QuizTable from '@/components/template/micro/table/QuizTable.vue';
import QuizRespondentTable from '@/components/template/micro/table/QuizRespondentTable.vue';
import TaskForm from '@/components/template/micro/form/TaskForm.vue';
import BackButton from '~/components/classrooms/micro/BackButton.vue';

import { mapActions, mapState } from 'vuex';
import moment from 'moment';

import { toEncrypt } from '~/commons/utils';

export default {
    components: {
        StudentTaskTable,
        StudentAssignmentCard,
        TaskForm,
        QuizTable,
        QuizRespondentTable,
        BackButton,
    },
    props: {
        classroom: {
            type: String,
            default: ""
        },
        course:{
            type: String,
            default: ""
        },
        topic:{
            type: String,
            default: ""
        },
        topicId: {
            type: Number,
            default: -1
        },
        moduleId: {
            type: Number,
            default: -1
        },
        moduleSlug: {
            type: String,
            default: ""
        },
    },

    data(){
        return {
            userKind: localStorage.getItem('user_kind'),
            userId: JSON.parse(localStorage.getItem('user')).id,

            action: '',
            title: '',
            nameMentor: '',

            isLoaded: false,
            isResultModalOpen: false,
            moduleDetail: null,
            nextModule: null,
            listFile: [],
            isFiles: null,

            classId: null,

            // Assignments
            isBusy: true,
            isAssignment: true,
            assignmentSubmitted: false,
            autoStartAssignment: false,
            processAutoStart: false,
            openAssignment: false,
            assignments: [],
            assignmentCounter: null,
            assignmentStudent: null,
            assignmentDetail: null,

            // Alert Event
            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            // Pagination
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },

            // mentor
            listMentor: [],
            lastUserMentor: null,
            maxUserMentor: null,
            
            // topics
            listTopics: [],
            indexTopic: null,
            prevTopic: {active: null, topicId: null, title: null},
            nextTopic: {active: null, topicId: null, title: null},

            userState: null,
            
            // Field Table
            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'userName',
                    label: 'Nama',
                },
                {
                    key: 'task',
                    label: 'Tugas',
                },
                {
                    key: 'submitted_at',
                    label: 'Tanggal Pengumpulan',
                },
                {
                    key: 'score',
                    label: 'Nilai',
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                }
            ],

            isModuleVideo: false,
        }
    },

    filters: {

        // Capitalize Char 1 on a Text
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },

        // [Date Format] Remove Second
        date: function (value) {
            if (!value) return ''
            return moment(value, 'YYYY-MM-DD HH:mm:ss').format('dddd, DD MMM YYYY HH:mm')
        },
    },

    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        }),
    },

    created() {
        this.getCredentials();
    },
    methods: {
        ...mapActions({
          setActiveTab: 'Layouts/setActiveTab',
        }),
        disableRightClick(e) {
            e.preventDefault();
        },
        getFiles(value){
            this.isFiles = value
        },
        onOpenAssignment() {
            this.processAutoStart = false
            this.openAssignment = true
        },
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.title = res[1].toLowerCase()
            this.action = res[4]

            this.fetchClassroomDetail()
        },

        async fetchClassroomDetail(){
            this.isLoaded = false

            let params = this.classroom
            let dispatch = "classroomOverview"

            await this.$store.dispatch(`Services/${dispatch}`, params)

            if(!this.servicesState.status){
                console.error("Failed to get classroom detail :", this.servicesState.message)
                this.setEvent(this.servicesState.message)
                this.$router.go(-1)
            } else{
                this.userState = this.servicesState.classroomDetail.userState
                this.classId = this.servicesState.classroomDetail.id
                
                this.fetchModule()
            }
        },

        async fetchModule() {
            this.isLoaded = false;

            let params = this.topicId
            let dispatch = 'topicDetail'
            
            if (this.title != 'courses') {
                dispatch = 'classroomTopicDetail'
                params = {
                    moduleId: this.moduleId,
                    classroomId: this.classId,
                    topicId: this.topicId,
                }
            }

            await this.$store.dispatch(`Services/${dispatch}`, params)

            if(!this.servicesState.status) {

                console.error('Failed get topic on classroom: ', this.servicesState.message)
                this.setEvent(this.servicesState.message)

            } else {
                this.moduleDetail = this.servicesState.topicDetail

                this.isFiles = {
                    data: this.moduleDetail.files[0],
                    id: 0,
                }

                if (this.isFiles?.data?.kind === 'video') {
                    this.isModuleVideo = true
                }

                if (this.moduleDetail.kind != 'assignment') this.isAssignment = false
                if (this.title != 'coufetchModulerses') this.fetchAssignments()
                
                this.$emit('moduleDetail', this.moduleDetail)
                
                this.fetchMentor()
                this.fetchListTopics()

                this.isLoaded = true
            }
        },
        async fetchListTopics(){
            this.isLoaded = false
            const params = {
                classroomSlug: this.classroom,
                moduleSlug: this.moduleSlug
            }

            await this.$store.dispatch('Services/classroomTopics', params)
            if(!this.servicesState.status){
                console.error('failed fetch classroom topics', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
            } else{
                this.listTopics = this.servicesState?.topics

                if(this.listTopics === null){
                    const nil = { action:false, topicId: null, title:false }
                    this.prevTopic = nil
                    this.nextTopic = nil

                    return 
                }

                const indexTopic = this.listTopics.findIndex(item => item.id === this.topicId)

                if(indexTopic == this.listTopics.length -1){
                    this.prevTopic = {action: true, topicId: this.listTopics[indexTopic-1].id, title: this.listTopics[indexTopic-1].title}
                    this.nextTopic = {action: false, topicId: null}
                }
                else if(indexTopic == 0){
                    this.prevTopic = {action: false, topicId: null, title: null}
                    this.nextTopic = {action: true, topicId: this.listTopics[indexTopic+1].id, title: this.listTopics[indexTopic+1].title}
                }
                else if(indexTopic < this.listTopics.length -1){
                    this.prevTopic = {action: true, topicId: this.listTopics[indexTopic-1].id,title: this.listTopics[indexTopic-1].title}
                    this.nextTopic = {action: true, topicId: this.listTopics[indexTopic+1].id, title: this.listTopics[indexTopic+1].title}
                }
            }
        },
        async fetchMentor(){
            this.isLoaded = false

            const params = {
                classroomSlug: this.classroom,
                joined: true
            }

            await this.$store.dispatch('Services/classroomMentors', params);

            if(!this.servicesState.status){
                console.error('Failed get mentor on classroom: ', this.servicesState.message)
                this.setEvent(this.servicesState.message)
            } else{
                this.listMentor = this.servicesState?.data ?? []
                this.lastUserMentor = this.listMentor[this.listMentor.length -1]
            }
        },

        firstNameMentor(value){
            let val = value.split(' ')
            let last = this.lastUserMentor.name.split(" ")
            const filterName = val[0].toLowerCase()

            if(filterName == "muhamad" || filterName == "muhammad" || filterName == "mochamad" || filterName == "mochammad" || filterName == "mohammad" || filterName == "ahmad" || filterName == "achmad" || filterName == "akhmad" || val[0] == ""){
                if(val[1] == last[1]) return `${val[1]}`
                return `${val[1]},`
            }

            if(val[0] == last[0]) return `${val[0]}`
            return `${val[0]},`
        },

        async fetchAssignments(){
            this.isBusy = true
            const params = {
                page: this.pagination.page,
                classroomId: this.classId,
                topicId: this.topicId,
            }

            await this.$store.dispatch('Services/classroomAssignments', params)

            if(!this.servicesState.status) {

                console.error('Failed fetch assignments: ', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = false;

            } else {

                this.assignments = this.servicesState.assignments;
                this.assignmentCounter = this.servicesState.assignmentCounter

                if (this.userKind == 'student') {

                    this.assignmentStudent = this.assignments?.[0];
                    this.assignmentDetail = this.assignmentStudent?.externalData

                    if (this.title == 'tes') this.autoStartAssignment = true

                }

                this.pagination = this.servicesState.pagination
                this.isBusy = false;

            }
        },

        setEvent(message, status) {

            window.scrollTo(0,0)

            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status ? 'success' : 'warning'
            this.onEvent.alertCounter = 5

        },
        
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },

        onAssignment(){
          this.setActiveTab('assignments')
          this.$router.push(`/dashboard/classroom/${this.classroom}`)
        },

        generateBadge(kind) {
            return kind == 'assignment' ? 'danger' : 'warning'
        },

        busyToggler(data) {
            this.isBusy = data
        },

        customizeDescriptionText(text) {
            return `<p>${text}</p>`
        },

        generateLinkEmbed(link, type){
            let generatedLink;
            let splitUrl = link.split("/")

            if (type === 'document') {
                generatedLink = link += '#toolbar=0'
            }

            if(splitUrl[3] == "presentation") return link.replace(splitUrl[6], "embed?start=false&delayms=8000&slide=id.p#")
            generatedLink =  link.replace(splitUrl[6], "preview")
            
            return generatedLink
        },

        generateVideoEmbed(link, type) {
            if (type === 'video') {
                let generatedLink;
                let splitUrl = link.split('/')

                generatedLink = link

                if (splitUrl?.[2] === 'drive.alkademi.id') return link

                return generatedLink.replace("/view", "/preview")
            }
        },

        
        isVideoAlkademi(link, type) {
            if (type === 'video') {

                let splitUrl = link?.split('/')

                if (splitUrl?.[2] === 'drive.alkademi.id') return 'video'

                return 'iframe'   
            }  
        },

        validURL(url) {

            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

            return !!pattern.test(url);
        },

        backButton() {
            this.$router.go(-1)
        },

        pageChange (e) {
            this.pagination.page = e;
            this.fetchAssignments()
        },

        filterIcons(value){
            if(value == "document") return "ri-file-text-line doc-color"
            else if(value == "video") return "ri-play-circle-line vid-color"
            else if(value == "image") return "ri-image-fill img-color"
            else if(value == "suara") return "ri-volume-up-line voi-color"
            else if(value == "slide") return "ri-file-ppt-line ppt-color"
        },
        onBackClick() {
            this.$router.go(-1)
        },
        onSwitchModule(value){
            localStorage.setItem('moduleId', toEncrypt(value?.topicId))
            this.$router.replace({
                path:`/dashboard/classroom/${this.classroom}/course/${this.course}/module/${value.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`,
            })
        },
    } 
}
</script>

<style lang="scss">
.move-module{
    gap:.5rem;
    background:white;
    &:hover{
        background:white;
    }
}
.doc-color{
    color: #2F00E9
}
.vid-color{
    color: #47BDFF
}
.ppt-color{
    color: #DD6611
}
.img-color{
    color:#41644A
}
.voi-color{
    color: #47BDFF
}

.ri-icon {
    font-weight: 500; 
    font-size: 18px; 
    min-width: inherit; 
    margin-right: 12px;
}
.card-text iframe {
    width: 100% !important;
    min-height: 300px;
}
.user-prof{
    width: 32px;
    height: 32px;
    border: 1px solid #212A3E;
    background-color: #ccc;
    border-radius: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: white;
    }
}

.list-files:hover{
    background: #2096C4;
    color: white;
    border-radius: 6px;
    transition: all;
    transition-duration: 200ms;
    p, i{
        color: white;
    }
}

.assignment{
    background: white;
    &:hover{
        background: #DBDFEA;
        transition: all .2s;
    }
}

.pract-style{
    background: white;
    padding:12px;
    &:hover{
        background: #2096C4 !important;
        color:white !important;
        border-color: #2096C4 !important;
        transition: all .2s;
    }
}
</style>
