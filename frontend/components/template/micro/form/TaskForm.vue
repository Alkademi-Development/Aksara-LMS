<template>
    <b-card no-body class="bg-transparent mb-0">
        <b-card-body v-if="isLoaded">
            <b-alert 
                v-model="onEvent.show"
                :variant="onEvent.variant"
                dismissible
            >
                {{ onEvent.message }}
            </b-alert>
            <b-row no-gutters align-v="center" class="mb-2" v-if="action == 'assign'">
                <b-col>
                    <b-card-title class="mb-0 mr-3">Tugas Modul</b-card-title>
                </b-col>
                <b-col class="text-right">
                    <b-card-text><strong>{{ inputForm[0].value && inputForm[1].value ? '2' : !inputForm[0].value && !inputForm[1].value ? '0' : '1'}}</strong> / {{ inputForm.length }}</b-card-text>
                </b-col>
            </b-row>
            <b-form @submit="onSubmitForm">
                <div v-for="(input, index) in inputForm" :key="index" >
                    <b-form-group
                        v-if="input.type != 'file' && input.type != 'textarea'"
                        :label="input.label"
                        :label-for="input.label"
                        :description="input.description"
                    >
                        <b-form-input
                            v-model="input.value"
                            :id="input.label"
                            :value="input.value"
                            :type="input.type"
                            :placeholder="input.placeholder"
                            :required='input.required'
                            min="0"
                            max="100"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        v-if="input.type == 'textarea'"
                        :label="input.label"
                        :label-for="input.label"
                        :description="input.description"
                    >
                        <text-markdown :value="input.value" :placeholder="input.placeholder" @onChange="input.value = $event"/>
                    </b-form-group>

                    <b-form-group
                        v-if="input.type == 'file'"
                        :label="input.label"
                        :label-for="input.label"
                        :description="input.description"
                    >   
                        <b-form-file
                            v-model="input.value"
                            :id="input.label"
                            :state="Boolean(input.value)"
                            placeholder="Pilih file atau letakkan di sini..."
                            drop-placeholder="Letakkan file di sini"
                            :required="action == 'edit' ? false : input.required"
                            :accept="input.accept"
                        >
                        </b-form-file>
                    </b-form-group>

                </div>

                <div v-if="taskFile" class="d-flex justify-content-between mb-3">
                    <p>{{fileName(taskFile)}}</p>
                    <a :href="taskFile" target="_blank"><i class="far fa-arrow-alt-circle-down"></i></a>
                </div>

                <b-row v-if="!submitted">

                    <b-col cols="6" class="mb-3 mb-lg-0">
                        <b-button
                            :pill="action == 'assign'"
                            type="submit"
                            variant="danger"
                        >
                            {{ buttonText }}
                        </b-button>
                    </b-col>

                    <b-col cols="6" class="text-right" >
                        <b-button
                            v-if="action == 'assign' && score != 0"
                            pill
                            variant="danger"
                            @click="openResult"
                        >
                            Lihat Hasil
                        </b-button>
                    </b-col>
                </b-row>
                <div v-else class="text-center">
                    <b-spinner label="Spinning"></b-spinner>
                </div>
            </b-form>
        </b-card-body>
        <b-card-body class="text-center" v-else>
            <b-spinner label="Spinning"></b-spinner>
        </b-card-body>
        <b-modal
            size="sm"
            body-class="container"
            v-model="isResultModalOpen"
            v-if="score != 0"
            centered
            hide-footer
            hide-header
            @hide="closeResult"
        >
            <b-row>
                <b-col cols="12">
                    <p class="text-left mb-0">
                        Nilai yang kamu dapatkan
                    </p>
                    <h1 class="text-left h1">
                        <strong class="text-primary">{{ score }}</strong>
                        <small class="h3"> · {{ score > 90 ? 'Sangat Memuaskan' : score > 80 ? 'Memuaskan' : score > 70 ? 'Baik' : score > 50 ? 'Kurang' : 'Sangat Kurang' }}</small>   
                    </h1>
                </b-col>
                <b-col cols="12" v-show="mentorNotes != ''">
                    <p class="text-left mb-0">
                        Catatan dari mentor
                    </p>
                    <h5 class="text-left h3" v-html="mentorNotes"></h5>
                </b-col>
            </b-row>
        </b-modal>
        <b-modal
            hide-footer
            hide-header
            v-if="submitted && action == 'assign'"
            v-model="submitted"
            centered
            size="sm"
            body-class="container"
        >
            <b-row>
                <b-col>
                    <p class="text-center">
                        Loading ...
                    </p>
                </b-col>
            </b-row>
        </b-modal>
    </b-card>
</template>

<script>
import fieldForm from '@/store/global/classroom';
import Editor from "@tinymce/tinymce-vue";

import { mapState } from 'vuex';

export default {
    layout: 'dashboard',
    components: {
        Editor,
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            classroomState: (state) => state.Classrooms,
            roundState: (state) => state.Rounds,
        })
    },
    data() {
        return {
            submitted: false,
            isLoaded: false,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            inputForm: [],
            output: [],
            buttonText: '',
            isResultModalOpen: false,
            taskFile: '',
        }
    },
    created() {
        this.fetchForm()
    },
    methods: {
        fileName(name) {
            var _filename = name.split('/')
            _filename.shift()
            return 'FILENAME: ', _filename[_filename.length - 1]
        },
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
        openResult() {
            this.isResultModalOpen = true;
            this.$bvModal.show('result-modal');
        },
        closeResult() {
            this.isResultModalOpen = false;
            this.$bvModal.hide('result-modal');
        },
        fetchForm() {
            fieldForm.inputFormAssignTask.map((item, index) => {
                fieldForm.inputFormAssignTask[index].value = ''
            })
            if (this.action == 'assign') {
                this.inputForm = fieldForm.inputFormAssignTask;

                this.inputForm[0].value = this.repository;
                // this.inputForm[1].value = this.fileTask;

                this.taskFile = this.fileTask

                this.isLoaded = true;
                if (this.repository) {
                    this.buttonText = 'Submit Ulang'
                } else {
                    this.buttonText = 'Submit'
                }
                // console.log('assign', this.inputForm)
            } else {

                fieldForm.inputFormVerifyTask.map((item, index) => {
                    fieldForm.inputFormVerifyTask[index].value = ''
                });

                this.inputForm = fieldForm.inputFormVerifyTask;

                this.buttonText = 'Submit';

                // if (this.verified == 1) {
                    if (this.score != undefined) {
                        this.inputForm.map((item, index) => {
                            if (item.name == 'score') {
                                this.inputForm[index].value = this.score;
                            }

                            if (item.name == 'mentorNotes') {
                                this.inputForm[index].value = this.mentorNotes;
                            }
                        });
                        this.isLoaded = true;
                    } else {
                        this.fetchTaskDetail();
                    }
                // } else {
                //     this.isLoaded = true;
                // }
            }
        },
        async fetchTaskDetail () {
            try {
                await this.$store.dispatch('Classrooms/getTaskDetail', {
                    classroom_id: this.classroomId,
                    module_id: this.topicId,
                    student_id: this.studentId
                });

                if (!this.classroomState.status) {

                    this.setEvent(this.classroomState.message, false);
                    this.isLoaded = true;

                } else {

                    this.inputForm.map((item, index) => {
                        if (item.name == 'score') {
                            this.inputForm[index].value = this.classroomState.task.score;
                        }

                        if (item.name == 'mentorNotes') {
                            this.inputForm[index].value = this.classroomState.task.mentorNotes;
                        }
                    });

                    this.isLoaded = true;
                }
            } catch (error) {
                this.isLoaded = true;
                console.error('Failed get task detail: ', error);
            }
        },
        onSubmitForm(event) {
            event.preventDefault();

            this.inputForm.map((item) => {
                this.output[item.name] = item.value;
            });

            // const params = new FormData();
            const params = {}

            if (this.action == 'assign') {
                // params.append('studentNotes', this.output['studentNotes']);
                // params.append('files', this.output['files']);
                // params.append('repository', this.output['repository'])
                params.repository = this.output['repository']

                if(this.output['files'] != null && this.output['files'] != '') {
                    if(this.output['files'].size > (2048 * 1000)) {
                        return this.setEvent("Ukuran file terlalu besar", false);
                    } else {
                        // params.append('files', this.output['files'])
                        params.files = this.output['files']
                    }
                }

                // for(var pair of params.entries()) {
                //     console.log('PAYLOAD: ', pair[0]+ ': '+ pair[1]);
                // }
            } else {
                // params.append('mentorNotes', this.output['mentorNotes']);
                params.mentorNotes = this.output['mentorNotes']
                // params.append('score', this.output['score']);
                params.score = this.output['score']
            }

            // console.log(params, "PARAMS")
            this.fetchPost(params);

            this.output = [];
        },
        async fetchPost(param) {
            this.submitted = true;

            let dispatch;

            let params = {
                params: param
            }

            if (this.classroomId && this.topicId) {
                params.classroom_id = this.classroomId;
                params.module_id = this.topicId;

                if (this.action == 'assign') {
                    dispatch = 'Classrooms/assignTask';
                } else {
                    // dispatch = 'Classrooms/verifyTask';
                    dispatch = 'Services/classroomAssignScore';
                    // params.student_id = this.studentId;
                    // console.log(param, "CEK")
                    params = {
                        "classroomId": this.classroomId,
                        "topicId": this.topicId,
                        "userId": this.studentId,
                        "score": parseInt(param.score),
                        "mentorNotes": param.mentorNotes
                    }
                }
            } else {
                dispatch = 'Rounds/postScore';
                params.round_id = this.roundId;
                params.student_id = this.studentId;
            }
            // return console.log(dispatch, params)
            try {
                await this.$store.dispatch(dispatch, params);

                if (this.classroomId && this.topicId) {
                    if (!this.servicesState.status) {
                        this.submitted = false;
                        this.setEvent(this.servicesState.message, false);
                    } else {
                        this.submitted = false;
                        if (this.action == 'assign') {
                            this.$emit('assignTask');
                        } else {
                            this.$emit('verifyTask');
                        }
                    }
                } else {
                    if (!this.roundState.status) {
                        this.submitted = false;
                        this.setEvent(this.roundState.message, false);
                    } else {
                        this.submitted = false;
                        this.$emit('verifyTask');
                    }
                }
            } catch (error) {
                let message;
                if (this.classroomId && this.topicId) {
                    if (this.action == 'assign') message = 'failed to assign task: ';
                    else message = 'failed to verify task: ';
                } else {
                    message = 'failed post score: ';
                }
                console.error(message, error);
            }
        }
    },
    props: {
        action: String,
        classroomId: Number,
        topicId: Number,
        roundId: Number,
        verified: Number,
        studentId: Number,
        score: Number,
        repository: String,
        fileTask: String,
        mentorNotes: String,
    },
}
</script>