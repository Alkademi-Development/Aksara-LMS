<template>
    <div>

            <!-- Header -->
            <ContentHeader :title="`Soal Pretest Registrasi`" />

            <!-- Page content -->
            <div class="pretest container-fluid mt--6">

                <div class="row" v-if="isBusy">
                    <div class="col">
                        <b-card no-body class="overflow-hidden">
                            <b-card-body class="text-center">
                                <div class="col">
                                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                                    <br>
                                    Loading
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>
                </div>

                <div class="row" v-else>
                    <div class="col" v-if="isVerified">
                        <b-alert
                            :show="onEvent.alertCounter"
                            :variant="onEvent.variant"
                            @dismissed="onEvent.alertCounter=0"
                            @dismiss-count-down="countDownChanged"
                            >
                            {{ onEvent.message }}
                        </b-alert>
                        <!-- <b-card no-body class="overflow-hidden">
                            <b-card-body>
                                <b-row no-gutters align-v="center">
                                    <b-col>
                                        <b-card-title class="mb-0">Pre Test {{ programName }}</b-card-title>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card> -->

                        <div class="card-header">
                            <h6 class="surtitle">selesaikan pretest</h6>
                            <h5 class="mb-0 h3">Pre Test {{ programName }}</h5>
                        </div>

                        <b-card no-body v-if="newData != null && metronomData != null">
                            <b-card-body>
                                <b-row align-v="center">
                                    <b-col md="6">
                                        <b-card-sub-title class="mb-2">Studio - {{newTitle}}</b-card-sub-title>
                                        <b-card-title class="mb-0">{{moduleDetail.title}}</b-card-title>
                                    </b-col>
                                    <b-col md="6">
                                        <div v-if="metronomData.submit == 1" class="text-right">
                                            <b-button variant="success" disabled>Sudah Dikerjakan</b-button>
                                        </div>
                                        <div v-else class="text-right">
                                            <b-button v-if="!isOpeningEditor" variant="primary" @click="goToEditor">Kerjakan</b-button>
                                            <b-button v-else variant="primary" disabled class="d-flex align-items-center ml-auto"><b-spinner label="Spinning" class="mr-2"></b-spinner> Loading...</b-button>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>

                        <!-- <b-card no-body v-if="newData != null && forms.length != 0">
                            <b-card-body>
                                <b-row align-v="center">
                                    <b-col md="6">
                                        <b-card-sub-title class="mb-2">Quiz - {{newTitle}}</b-card-sub-title>
                                        <b-card-title class="mb-0">{{forms[0].title}}</b-card-title>
                                        <b-card-text class="mb-0">{{forms[0].questions}} Soal {{forms[0].timer != null ? `&bull; Menit ${forms[0].timer}` : ``}}</b-card-text>
                                    </b-col>
                                    <b-col md="6">
                                        <div v-if="forms[0].submitted == 1" class="text-right">
                                            <b-button variant="success" disabled>Sudah Dikerjakan</b-button>
                                        </div>
                                        <div v-else class="text-right">
                                            <b-button v-if="!isLoadQuiz" variant="primary" @click="startFormAnswer">Kerjakan</b-button>
                                            <b-button v-else variant="primary" disabled class="d-flex align-items-center ml-auto"><b-spinner label="Spinning" class="mr-2"></b-spinner> Loading...</b-button>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card> -->

                        <b-form @submit="onSubmitAnswer" >

                            <b-card no-body class="overflow-hidden" v-for="(pretest, index) in pretestQuestion.pretests" :key="index">
                                <b-card-body>
                                    <b-row no-gutters align-v="center">
                                        <b-col>
                                            <div class="mb-4">
                                                <b-card-sub-title class="mb-2">{{ newData != null ? newTitle : pretest.title }}</b-card-sub-title>
                                                <b-card-title class="mb-0" v-html="pretest.question"></b-card-title>
                                            </div>

                                            <b-card-sub-title>Jawabanmu</b-card-sub-title>

                                            <div v-if="pretestQuestion.answered">
                                                <b>Anda sudah mengisi pretest</b>
                                            </div>
                                            <div v-else>

                                                <b-form-input type="text" :v-model="answers[index].pretestId" hidden></b-form-input>

                                                <text-markdown :value="answer[index].answer" placeholder="Tulis disini..." @onChange="answer[index].answer = $event"/>

                                            </div>
                                        </b-col>
                                    </b-row>
                                </b-card-body>
                            </b-card>
                            <b-card no-body v-if="!pretestQuestion.answered">
                                <b-card-body>
                                    <b-row align-v="center">
                                        <b-col md="6">
                                            <b-card-sub-title>Total Soal: {{ pretestQuestion.pretests.length }}</b-card-sub-title>
                                        </b-col>
                                        <b-col md="6">
                                            <div class="text-right">
                                                <b-button variant="primary" type="submit">Kirim Jawaban</b-button>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </b-card-body>
                            </b-card>
                        </b-form>
                    </div>
                    <div class="col" v-else>
                        <b-card no-body>
                            <b-card-body>
                                <b-row align-v="center">
                                    <b-col>
                                        <!-- <b-card-title class="mb-0">Verifikasi Email Anda Sebelum Mengisi Pretest</b-card-title> -->
                                        <b-card-title class="mb-0">{{ onEvent.message }}</b-card-title>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                    </div>
                </div>

                <Footer />

            </div>

        </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Editor from '@tinymce/tinymce-vue'
import Footer from "@/components/template/dashboard/Footer"

import { mapState } from "vuex";

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Editor,
        Footer,
    },
    computed: {
        ...mapState({
            courseState: (state) => state.Courses,
            authState: (state) => state.Auth,
            classroomState: (state) => state.Classrooms
        })
    },
    data() {
        return {

            isBusy: false,
            isLoadQuiz: false,
            isOpeningEditor: false,

            userKind: localStorage.getItem('user_kind'),
            userId: JSON.parse(localStorage.getItem('user')).id,

            pretestQuestion: {},
            answers: [],
            programId: null,
            programName: '',
            newData: null,
            newTitle: "",
            newModuleId: null,
            moduleDetail: null,
            forms: [],
            metronomData: null,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            isVerified: false,
        }
    },
    created() {
        this.fetchPretestQuestion()
    },
    methods: {
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        async fetchPretestQuestion() {
            this.isBusy = true

            var fullPath = this.$route.fullPath
            var urlSplit = fullPath.split('/')
            urlSplit.shift()
            const currentProgram = urlSplit[2]

            this.programId = currentProgram.split('?')[0]

            var payload = {
                program_id: this.programId
            }

            await this.$store.dispatch('Pretests/fetchPretestQuestion', payload)
                .then(() => {
                    var pretestState = this.$store.state.Pretests

                    if (!pretestState.status) {
                        this.isVerified = false
                        console.error("Failed to fetch question pretest: ", pretestState.message);
                        this.setEvent('Gagal mengambil pertanyaan: ' + pretestState.message, false);

                        this.isBusy= false
                    } else {
                        this.fetchPrograms()
                    }
                })
        },
        async fetchModule() {
            var params = {
                module_id: this.newModuleId
            }

            await this.$store.dispatch('Courses/getModulesByIdPretest', params)
            // const params = {
            //     module_id: this.newModuleId,
            //     user_id: this.userId,
            //     classroom_id: 0
            // };

            // await this.$store.dispatch('Courses/getModulesById', params)

            if (this.courseState.status) {
                this.moduleDetail = this.courseState.modules
                this.forms = this.moduleDetail.forms

                if (this.moduleDetail.metronomId != '' && this.moduleDetail.metronomId != null) this.fetchMetronom()
                else this.isBusy = false
                // console.log(this.courseState.modules, "modules")

            } else {
                console.error(this.courseState.message)
            }

        },
        async fetchMetronom() {

            await this.$store.dispatch('Pretests/fetchPretestMetronom', this.newModuleId)

            var pretestsState = this.$store.state.Pretests

            if (!pretestsState.status) {
                console.error("Failed to Fetch Pretest Metronom");

                this.isBusy = false
            } else {
                this.metronomData = pretestsState.data
                this.isBusy = false
            }

        },
        async onSubmitAnswer(event) {
            event.preventDefault()
            this.isBusy = true

            let isReady = true;

            if (this.newData != null ) {
                if (this.forms.length != 0) {
                    if (this.forms[0].submitted == 0) {
                        isReady = false;
                        this.isBusy = false
                        window.scrollTo(0,0)
                        return this.setEvent('Kerjakan quiz terlebih dahulu', false);
                    }
                }

                if (this.metronomData != null) {
                    if (this.metronomData.submit == 0) {
                        isReady = false;
                        this.isBusy = false
                        window.scrollTo(0,0)
                        return this.setEvent('Kerjakan soal studio terlebih dahulu', false);
                    }
                }
            }

            this.answers.map((item) => {
                if (!item.answer) {
                    isReady = false;
                    this.isBusy = false
                    window.scrollTo(0,0)
                    return this.setEvent('Isi jawaban esai terlebih dahulu', false);
                }
            });

            if (isReady) {
                var payload = {
                answers: this.answers
            }

            await this.$store.dispatch('Pretests/storePretestAnswer', payload)
                .then(() => {
                    var pretestState = this.$store.state.Pretests

                    if (!pretestState.status) {
                        console.error("Failed to store answer pretest: ", pretestState.message);

                        this.setEvent(pretestState.message == 'Email belum diverifikasi' ? 'Email kamu belum diverifikasi. Verifikasi email untuk melanjutkan proses pretest.' : pretestState.message, false)

                        this.isBusy = false
                    } else {
                        this.isBusy = false

                        this.setEvent("Pretest Berhasil di Submit", true)

                        setTimeout(() => {
                            this.$router.push('/dashboard')
                        }, 3000)
                    }
                })
            }
        },
        async fetchPrograms(){

            await this.$store.dispatch('Programs/getProgramById', this.programId)
            .then(() => {
                var statePrograms = this.$store.state.Programs

                if(!statePrograms.status) {

                    console.error('Failed fetch programs', statePrograms.message)

                } else {

                    this.programName = statePrograms.programs.name

                    setTimeout(() => {

                        var pretestState = this.$store.state.Pretests

                        this.isVerified = true
                        this.pretestQuestion = pretestState.questionPretest

                        this.pretestQuestion.pretests.forEach(pretest => {
                            this.answers.push({ pretestId: pretest.pretestId, answer: pretest.answer })
                        });

                        try {
                            var pretest = this.pretestQuestion.pretests[0]

                            this.newData = JSON.parse(pretest.title)
                            this.newTitle = this.newData.title
                            this.newModuleId = this.newData.moduleId
                            // console.log("New")
                        } catch (error) {
                            console.error("Old", error)
                        }

                        // if (statePrograms.programs.onRegistration == 0 || this.pretestQuestion.answered) return this.$router.push('/dashboard')

                        if (this.newData != null) this.fetchModule()
                        else this.isBusy = false
                    }, 400)

                }
            })

        },
        async startFormAnswer() {
            return this.quizClick()
            this.isLoadQuiz = true
            if (!this.moduleDetail.formResponseId) {
                const params = {
                    classroomId: 0,
                    moduleId: this.newModuleId
                }
                // console.log(this.moduleDetail, "PARAMS")
                await this.$store.dispatch('Classrooms/startFormAnswer', params)

                if (!this.classroomState.status) {
                    console.error('Gagal memulai form', this.classroomState.status)
                    this.isLoadQuiz = false
                } else {
                    this.quizClick()
                    // this.isCreateQuiz = true
                }
            } else {
                // console.log(this.moduleDetail, "QUIZOBJECt")
                this.quizClick()
            }

        },
        async quizClick() {
            this.isLoadQuiz = true
            const formId = "&formId=" + this.forms[0].formId
            const redirectTarget = "&redirectTo=" + window.location.href

            const urlForm = process.env.formURL + "/fill?" + formId + redirectTarget

            const baseUrl = process.env.alkademiAuth;
            // const appToken = "appToken=" + this.authState.appToken;
            const redirect = "&redirectTo=" + urlForm;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

            // const url = `${baseUrl}/check?${appToken}${redirect}${lmsId}`;
            const url = `${baseUrl}/check?${redirect}${lmsId}`;

            window.open(url, '_blank');
            this.isLoadQuiz = false
        },
        async goToEditor(){
            this.isOpeningEditor = true

            const appToken = `&appToken=${localStorage.getItem('access_token')}`
            const redirectLms = "&redirectTo=" + window.location.href

            const urlStudio = process.env.editorURL + `compiler?&metronomId=${this.metronomData.id}` + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlStudio;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

            const url = `${baseUrl}/check?${redirect}${lmsId}${appToken}`;

            setTimeout(() => {
                window.open(url, '_blank')
                this.isOpeningEditor =  false
            }, 500);

        },
        setEvent (message, status) {
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status ? 'success' : 'info';
            this.onEvent.alertCounter = 10
        }
    }
}
</script>

<style>

</style>