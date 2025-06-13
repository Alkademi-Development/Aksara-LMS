<template>
  <div>

        <!-- Header -->
        <ContentHeader title="" />

        <!-- Page content -->
        <div class="container-fluid mt--6">

            <b-alert
                :show="onEvent.alertCounter"
                :variant="onEvent.variant"
                @dismissed="onEvent.alertCounter=0"
                @dismiss-count-down="countDownChanged"
            >
                {{ onEvent.message }}
            </b-alert>

            <!-- Content Begin -->
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
                <div class="col">
                    <!-- <b-button class="mb-3 btn btn-sm btn-dark btn-round" @click="$router.go(-1)">
                        Kembali
                    </b-button> -->
                    <b-card no-body>
                        <b-card-body>
                            <b-row no-gutters align-v="center">
                                <b-col cols="12" md="4" class="d-flex align-items-center mb-3 mb-md-0">
                                    <CircleBackButton class="d-inline-block" />
                                    <div class="d-inline-block">
                                        <b-card-title class="mb-2">{{ detail_user.name }}</b-card-title>
                                        <b-card-sub-title>{{ detail_user.email }} <b-badge :variant="detail_user.verified == 1 ? 'primary' : 'danger'">{{ detail_user.verified == 1 ? 'Verified' : 'Unverified' }}</b-badge></b-card-sub-title>
                                    </div>
                                </b-col>
                                <b-col cols="12" md="8" class="d-flex justify-content-md-end">
                                    <b-button v-b-modal.modal-ktp variant="primary"><i class="mr-2 fas fa-eye"></i> KTP</b-button>
                                    <b-button v-b-modal.modal-transcript variant="primary"><i class="mr-2 fas fa-eye"></i> Rapor</b-button>
                                    <b-button v-b-modal.modal-certificate variant="primary"><i class="mr-2 fas fa-eye"></i> Ijazah</b-button>
                                    <b-button v-b-modal.modal-statementLetter variant="primary"><i class="mr-2 fas fa-eye"></i> Surat Keterangan</b-button>
                                    <b-modal id="modal-ktp" center title="KTP Peserta" size="lg" cancel-disabled hide-footer>
                                        <div class="text-center">
                                            <b-img-lazy v-if="detail_user.ktp != null" center fluid :src="detail_user.ktp" blank blank-color="#bbb"></b-img-lazy>
                                            <b-card-title v-else>Tidak ada KTP</b-card-title>
                                        </div>
                                    </b-modal>
                                    <b-modal id="modal-transcript" center title="Rapor Peserta" size="lg" cancel-disabled hide-footer>
                                        <div>
                                            <b-img-lazy v-if="detail_user.transcriptFile != null" center fluid :src="detail_user.transcriptFile" blank blank-color="#bbb"></b-img-lazy>
                                            <b-card-title v-else>Tidak ada Rapor</b-card-title>
                                        </div>
                                    </b-modal>
                                    <b-modal id="modal-certificate" center title="Ijazah Peserta" size="lg" cancel-disabled hide-footer>
                                        <div class="text-center">
                                            <b-img-lazy v-if="detail_user.certificate != null" center fluid :src="detail_user.certificate" blank blank-color="#bbb"></b-img-lazy>
                                            <b-card-title v-else>Tidak ada Ijazah</b-card-title>
                                        </div>
                                    </b-modal>
                                    <b-modal id="modal-statementLetter" center title="Surat Keterangan Peserta" size="lg" cancel-disabled hide-footer>
                                        <div>
                                            <b-img-lazy v-if="detail_user.statementLetter != null" center fluid :src="detail_user.statementLetter" blank blank-color="#bbb"></b-img-lazy>
                                            <b-card-title v-else>Tidak ada Surat Keterangan</b-card-title>
                                        </div>
                                    </b-modal>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>
                    <b-card no-body v-if="newData != null && metronomData != null">
                        <b-card-body>
                            <b-row align-v="center">
                                <b-col md="6">
                                    <b-card-sub-title class="mb-2">Studio - {{newTitle}}</b-card-sub-title>
                                    <b-card-title class="mb-0">{{moduleDetail.title}}</b-card-title>
                                </b-col>
                                <b-col md="6">
                                    <div class="text-right">
                                        <b-button v-if="!isOpeningEditor" variant="primary" @click="goToEditor">Lihat</b-button>
                                        <b-button v-else variant="primary" class="d-flex align-items-center ml-auto">Loading...</b-button>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>
                    <b-card no-body v-if="newData != null && forms.length != 0">
                        <b-card-body>
                            <b-row align-v="center">
                                <b-col md="6">
                                    <b-card-sub-title class="mb-2">Quiz - {{newTitle}}</b-card-sub-title>
                                    <b-card-title class="mb-0">{{forms[0].title}}</b-card-title>
                                    <b-card-text class="mb-0">{{forms[0].questions}} Soal {{forms[0].timer != 0 ? `&bull; Menit ${forms[0].timer}` : ``}}</b-card-text>
                                </b-col>
                                <b-col md="6">
                                    <div class="text-right">
                                        <b-button v-if="!isLoadQuiz" variant="primary" @click="quizClick">Lihat</b-button>
                                        <b-button v-else variant="primary" class="d-flex align-items-center ml-auto">Loading...</b-button>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>
                    <b-card no-body class="pretest overflow-hidden" v-for="(pretest, index) in student_pretests.pretests" :key="index" >
                        <b-card-body>
                            <b-row no-gutters align-v="center">
                                <b-col>
                                    <div class="mb-4">
                                        <b-card-sub-title class="mb-2">{{ newData != null ? newTitle : pretest.title }}</b-card-sub-title>
                                        <b-card-text class="mb-0" v-html="pretest.question"></b-card-text>
                                    </div>

                                    <b-card-sub-title>Jawaban</b-card-sub-title>
                                    <div class="answer" v-html="pretest.answer"></div>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>
                    <b-card no-body>
                        <b-card-body>
                            <b-row align-v="center">
                                <b-col>
                                    <div class="text-right">
                                        <b-button variant="danger" @click="showAgreement">Reject</b-button>
                                        <b-button variant="success" @click="onApproveRequest">Approve Request</b-button>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import { mapState } from "vuex";

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
    },
    props: {
        pretestQuestion: Object,
        answers: Object
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

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            student_id: 0,
            student_batch: {},
            student_pretests: {},
            detail_user: {},

            newData: null,
            newTitle: "",
            newModuleId: null,
            moduleDetail: null,
            forms: [],
            studentForm: null,
            metronomData: null,
        }
    },
    created() {
        this.getStudentId()
        this.fetchStudentBatch()
    },
    methods: {
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        getStudentId() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.student_id = res[8]
        },
        async fetchDetailUserById() {
            this.isBusy = true

            await this.$store.dispatch('Users/fetchDetailUserById', this.student_id)
                .then(() => {
                    var userState = this.$store.state.Users

                    if (!userState) {
                        console.error("Failed to Fetch Detail User");

                        this.isBusy = false
                    } else {
                        setTimeout(() => {
                            this.detail_user = userState.detail_user

                            if (this.newData != null) this.fetchModule()
                            else this.isBusy = false
                        }, 400);
                    }
                })
        },
        async fetchStudentBatch() {
            this.isBusy = true

            await this.$store.dispatch('Auth/fetchStudentBatchById', this.student_id)
                .then(() => {
                    var authState = this.$store.state.Auth

                    if (!authState.status) {
                        console.error("Failed to Fetch Student Batch", authState.message);

                        this.isBusy = false
                    } else {
                        setTimeout(() => {
                            this.student_batch = authState.student_batch

                            this.fetchStudentPretest()
                        }, 400);
                    }
                })
        },
        async fetchStudentPretest() {
            this.isBusy = true

            var payload = {
                batch_id: this.student_batch.id,
                program_id: this.student_batch.programId,
                student_id: this.student_id
            }

            await this.$store.dispatch('Pretests/fetchStudentPretestById', payload)
                .then(() => {
                    var pretestsState = this.$store.state.Pretests

                    if (!pretestsState.status) {
                        console.error("Failed to Fetch Student Pretest");

                        this.isBusy = false
                    } else {
                        setTimeout(() => {
                            this.student_pretests = pretestsState.studentPretest

                            try {
                                var pretest = this.student_pretests.pretests[0]

                                this.newData = JSON.parse(pretest.title)
                                this.newTitle = this.newData.title
                                this.newModuleId = this.newData.moduleId
                            } catch (error) {
                                console.error("Old", error)
                            }

                            this.fetchDetailUserById()

                        }, 400);
                    }
                })
        },
        async fetchModule() {
            // console.log(this.newData)
            var params = {
                module_id: this.newModuleId
            }

            await this.$store.dispatch('Courses/getModulesByIdPretest', params)

            if (this.courseState.status) {
                this.moduleDetail = this.courseState.modules
                this.forms = this.moduleDetail.forms
                // this.metronomData = this.moduleDetail.metronom.data

                if (this.moduleDetail.metronomId != '' && this.moduleDetail.metronomId != null) this.fetchMetronom()
                else {
                    if (this.userKind != 'student' && this.forms.length != 0) this.fetchFormDetail()
                    else this.isBusy = false
                }


            } else {
                console.error(this.courseState.message)
                this.isBusy = false
            }
        },
        async fetchMetronom() {

            const params = {
                moduleId: this.newModuleId,
                userId: this.student_id
            }

            await this.$store.dispatch('Pretests/fetchPretestMetronomRespondents', params)

            var pretestsState = this.$store.state.Pretests

            if (!pretestsState.status) {
                console.error("Failed to Fetch Pretest Metronom Respondent");

                this.isBusy = false
            } else {
                this.metronomData = pretestsState.data

                if (this.forms.length != 0) this.fetchFormDetail()
                else this.isBusy = false
            }

        },
        async goToEditor(){
            this.isOpeningEditor = true

            const appToken = `&appToken=${this.authState.appToken || localStorage.getItem('access_token')}`
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
        async fetchFormDetail() {
            try {
                await this.$store.dispatch('Classrooms/formRespondents', this.forms[0].formId);

                if (!this.classroomState.status) {
                    console.error('Failed get respondents: ', this.classroomState.message);
                    this.isBusy = false
                } else {

                    var respondents = this.classroomState.respondents

                    const find = respondents.find((item) => item.studentId == this.student_id)
                    if (find) {
                        this.studentForm = find
                    } else {
                        this.forms = []
                        console.error("Student form tidak ditemukan.")
                    }

                    this.isBusy = false

                }
            } catch (error) {
                console.error('Failed to get respondents: ', error);
            }
        },
        async quizClick() {
            this.isLoadQuiz = true

            const responseId = "&responseId=" + this.studentForm.formResponseId
            const redirectLms = "&redirectTo=" + window.location.href

            const urlForm = process.env.formURL + "/preview?" + responseId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            // const appToken = "appToken=" + this.authState.appToken;
            const redirect = "&redirectTo=" + urlForm;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

            // const url = `${baseUrl}/check?${appToken}${redirect}${lmsId}`;
            const url = `${baseUrl}/check?${redirect}${lmsId}`;

            setTimeout(() => {
                // window.open(url, '_blank');
                // console.log(url, 'URL')
                this.isLoadQuiz = false
            }, 500);
        },
        async onApproveRequest() {
            this.isBusy = true

            var payload = {
                batch_id: this.student_batch.id,
                program_id: this.student_batch.programId,
                student_id: this.student_id
            }

            await this.$store.dispatch('Requests/storeApproveStudent', payload)
                .then(() => {
                    var requestState = this.$store.state.Requests

                    if (!requestState.status) {
                        console.error("Failed to Fetch Student Pretest");
                        this.showModalMessage(requestState.message)
                        // this.onEvent.message = requestState.message
                        // this.onEvent.status = requestState.status
                        // this.onEvent.variant = 'warning'
                        // this.onEvent.alertCounter = 10

                        this.isBusy = false
                    } else {
                        this.showModalMessage('Student Request Approved')
                        // this.onEvent.message = "Student Request Approved"
                        // this.onEvent.status = requestState.status
                        // this.onEvent.variant = 'success'
                        // this.onEvent.alertCounter = 5

                        setTimeout(() => {
                            this.$router.push(`/dashboard/students/request/batchs/${this.student_batch.id}/programs/${this.student_batch.programId}`)

                            this.isBusy = false
                        }, 3000);
                    }
                })
        },
        async onRejectRequest() {
            this.isBusy = true

            var payload = {
                batch_id: this.student_batch.id,
                program_id: this.detail_user.program.id,
                student_id: this.student_id
            }

            await this.$store.dispatch('Requests/storeRejectStudent', payload)
                .then(() => {
                    var requestState = this.$store.state.Requests

                    if (!requestState.status) {
                        console.error("Failed to Fetch Student Pretest");
                        this.showModalMessage(requestState.message)
                        // this.onEvent.message = requestState.message
                        // this.onEvent.status = requestState.status
                        // this.onEvent.variant = 'warning'
                        // this.onEvent.alertCounter = 10

                        this.isBusy = false
                    } else {
                        this.showModalMessage('Student Request Rejected')
                        // this.onEvent.message = "Student Request Rejected"
                        // this.onEvent.status = requestState.status
                        // this.onEvent.variant = 'success'
                        // this.onEvent.alertCounter = 5

                        setTimeout(() => {
                            this.$router.go(-1)

                            // this.isBusy = false
                        }, 3000);
                    }
                })
        },
        showAgreement() {
            this.$bvModal.msgBoxConfirm(`Anda yakin akan me reject ${this.detail_user.name}?`, {
                okVariant: 'danger',
                okTitle: 'Benar',
                cancelVariant: 'info',
                cancelTitle: 'Batal',
                centered: true,
            })
            .then(value => {
                if(value) {
                    this.onRejectRequest()
                    // console.log('STUDENTID: ', this.student_id)
                    // console.log('STUDENTBATCH', this.student_batch)
                    // console.log('STUDENTPRETESTS', this.student_pretests)
                    // console.log('STUDENTDETAIL', this.detail_user)
                }
            })
            .catch(err => {
                // An error occurred
            })
        },
        showModalMessage(message) {
            this.$bvModal.msgBoxOk(message, {
                okVariant: 'info',
                okTitle: 'Oke',
                centered: true,
            })
            .then(value => {
                this.onUpdatePage(this.pagination.currentPage)
            })
            .catch(err => {
                // An error occurred
            })
        },
    }
}
</script>

<style>

</style>
