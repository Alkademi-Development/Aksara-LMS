<template>
    <b-row>
        <template v-if="!isBusy">
            <b-col cols="12" v-if="assignmentDetail?.type == 'form' || assignmentDetail?.type == 'studio' || userKind !== 'student'">
                <b-card no-body>
                    <b-card-header class="px-0 mx-4 border-b">
                        <b-row>
                            <b-col cols="12" class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                                <div v-if="!isBusy" class="d-flex flex-wrap md-flex-nowrap align-items-center gap-4">
                                    <h3>
                                        <b>{{ assignmentDetail?.title }}</b>
                                    </h3>
                                    <div
                                        class="course d-flex flex-row align-items-center"
                                        @click="onClickCourse(classroomDetail?.slug)"
                                    >
                                        <i class="ri-file-list-line"></i>
                                        <span class="text">{{ assignmentDetail?.moduleName }}</span>
                                    </div>
                                </div>

                                <div v-else style="width: 100% !important; height: 100% !important;">
                                    <b-skeleton width="15%" height="100%" class="mb-3"></b-skeleton>
                                </div>

                                <template v-if="userKind !== 'student' && userKind !== 'teacher'">
                                    <div class="mt-2 mt-sm-0 " v-if="!isBusy">
                                        <button
                                            class="btn btn-outline-primary text-md rounded-pill px-3"
                                            @click="onClickReview({task: assignmentDetail})"
                                        >
                                            {{ isTestCase ? 'Periksa Tes' : 'Periksa Tugas' }}
                                        </button>
                                    </div>
                                    <template v-else>
                                        <b-skeleton width="15%" height="100%" class="mb-3"></b-skeleton>
                                    </template>
                                </template>


                                <template v-else>
                                    <div class="mt-2 mt-sm-0 " v-if="!isBusy">
                                        <template v-if="statusConditionAssignment === 'submitted.not_scored'">
                                            <button class="btn btn-outline-warning text-md rounded-pill px-3">
                                                SEDANG DIREVIEW
                                            </button>
                                        </template>

                                        <template v-if="statusConditionAssignment === 'submitted.scored.passed' || statusConditionAssignment === 'submitted.scored.not_passed'">
                                            <div class="d-flex flex-column text-right gap-3">
                                                <template v-if="statusConditionAssignment === 'submitted.scored.not_passed' && assignmentDetail?.reassignable">
                                                    <div class="d-flex flex-column gap-1">
                                                        <b>Nilai kamu belum mencukupi</b>
                                                        <small v-if="allowedResubmitAfterInterval">Silahkan kerjakan tugas dan kumpulkan kembali</small>
                                                        <small v-else>Tunggu waktu 10 menit sebelum mengumpulkan kembali</small>
                                                    </div>
                                                </template>
                                                <div class="d-flex justify-content-end">
                                                    <button
                                                        class="btn btn-outline-primary text-md rounded-pill px-3"
                                                        @click="onClickModalNilaiTugas()"
                                                    >
                                                        Lihat Nilai
                                                    </button>
                                                    <button
                                                        v-if="statusConditionAssignment === 'submitted.scored.not_passed' && assignmentDetail?.reassignable"
                                                        class="btn btn-primary text-md rounded-pill px-3"
                                                        @click="isModalAssignTaskOpen = true"
                                                        :disabled="(isAssigning ? true : false) || !allowedResubmitAfterInterval"
                                                    >
                                                        {{ isAssigning ? 'Loading...' : `Kerjakan Ulang ${timeLeft === 0 ? '' : `${minutes}:${seconds}`}` }}
                                                    </button>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <template v-if="!!assignmentDetail?.externalId">
                                                <template v-if="assignmentEnded">
                                                    <button
                                                        class="btn btn-outline-primary text-md rounded-pill px-3"
                                                        @click="onClickModalNilaiTugas()"
                                                    >
                                                        Lihat Nilai
                                                    </button>
                                                </template>
                                                <template v-else-if="statusConditionAssignment === 'not_submitted'">
                                                    <button
                                                        :class="['btn rounded-pill btn-primary text-uppercase px-3']"
                                                        @click="openTask(assignmentDetail?.externalId)"
                                                    >
                                                        Lanjut Mengerjakan
                                                    </button>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <template v-if="assignmentEnded">
                                                    <button
                                                        class="btn btn-outline-primary text-md rounded-pill px-3"
                                                        @click="onClickModalNilaiTugas()"
                                                    >
                                                        Lihat Nilai
                                                    </button>
                                                </template>
                                                <template v-else>
                                                    <button
                                                        v-if="userKind !== 'teacher'"
                                                        class="btn btn-primary text-md rounded-pill px-3"
                                                        @click="isModalAssignTaskOpen = true"
                                                        :disabled="isAssigning ? true : false"
                                                    >
                                                        {{ isAssigning ? 'Loading...' : 'Kerjakan' }}
                                                    </button>
                                                </template>
                                            </template>

                                        </template>
                                    </div>
                                    <template v-else>
                                        <b-skeleton width="15%" height="100%" class="mb-3"></b-skeleton>
                                    </template>
                                </template>
                            </b-col>
                        </b-row>
                    </b-card-header>

                    <b-card-body class="px-0 mx-4">

                        <template v-if="!isBusy">
                            <div class="text-medium" v-html="assignmentDetail?.description"></div>
                        </template>

                        <template v-else>
                            <b-skeleton width="100%" height="100%" class="mb-3"></b-skeleton>
                        </template>

                        <div v-for="(content, index) in assignmentContents" :key="index">
                            <div v-if="content != '' && content != '#' && validURL(content)" class="mt-3">
                                <div class="p-2 d-block mx-auto rounded-lg text-white" style="background: #EBEBF0;">
                                    <div>
                                        <b-embed
                                            type="iframe"
                                            aspect="16by9"
                                            allowfullscreen
                                            frameborder="0"
                                            :src="generateLinkEmbed(content)"
                                        >
                                        </b-embed>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </b-card-body>

                </b-card>
            </b-col>

            <b-col cols="12" v-else-if="assignmentDetail?.type == 'link' || assignmentDetail?.type == 'file'">
                <b-row>
                    <b-col cols="12" lg="8">

                        <b-card no-body>

                            <b-card-header class="px-0 mx-4 border-b">
                                <b-row>

                                    <b-col cols="12" class="d-flex justify-content-between align-items-center">

                                        <div v-if="!isBusy" class="d-flex flex-wrap md-flex-nowrap align-items-center gap-4">
                                            <h3>
                                                <b>{{ assignmentDetail?.title }}</b>
                                            </h3>
                                            <div
                                                class="course d-flex flex-row align-items-center"
                                                @click="onClickCourse(classroomDetail?.slug)"
                                            >
                                                <i class="ri-file-list-line"></i>
                                                <span class="text">{{ assignmentDetail?.moduleName }}</span>
                                            </div>
                                        </div>


                                        <div v-else style="width: 100% !important; height: 100% !important;">
                                            <b-skeleton width="15%" height="100%" class="mb-3"></b-skeleton>
                                        </div>

                                    </b-col>

                                </b-row>
                            </b-card-header>

                            <b-card-body class="px-0 mx-4">

                                <template v-if="!isBusy">
                                    <div v-html="assignmentDetail?.description"></div>
                                </template>

                                <template v-else>
                                    <b-skeleton width="100%" height="100%" class="mb-3"></b-skeleton>
                                </template>

                                <div v-for="(content, index) in assignmentContents" :key="index">
                                    <div v-if="content != '' && content != '#' && validURL(content)" class="mt-3">
                                        <div class="p-2 d-block mx-auto rounded-lg text-white" style="background: #EBEBF0;">
                                            <div>
                                                <b-embed
                                                    type="iframe"
                                                    aspect="16by9"
                                                    allowfullscreen
                                                    frameborder="0"
                                                    :src="generateLinkEmbed(content)"
                                                >
                                                </b-embed>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </b-card-body>

                        </b-card>

                    </b-col>
                    <b-col cols="12" lg="4">
                        <b-card no-body class="py-0">
                            <b-card-body class="border-b">
                                <h5 class="mb-2">
                                    <template v-if="assignmentEnded">
                                        <template v-if="statusConditionAssignment === 'submitted.not_scored'">
                                            {{ isTestCase ? 'Tes' : 'Tugas' }} Sedang Direview
                                        </template>
                                        <template v-else>
                                            {{ isTestCase ? 'Tes' : 'Tugas' }} Sudah Berakhir
                                        </template>
                                    </template>
                                    <template v-else>
                                        <template v-if="statusConditionAssignment === 'submitted.scored.passed'">
                                            {{ isTestCase ? 'Tes' : 'Tugas' }} Sudah Berakhir
                                        </template>

                                        <template v-if="statusConditionAssignment === 'submitted.not_scored'">
                                            {{ isTestCase ? 'Tes' : 'Tugas' }} Sedang Direview
                                        </template>

                                        <template v-if="statusConditionAssignment === 'submitted.scored.not_passed'">
                                            Nilai kamu belum mencukupi
                                            <br>
                                            <template v-if="assignmentDetail?.reassignable">
                                              <small v-if="allowedResubmitAfterInterval">Silahkan kerjakan tugas dan kumpulkan kembali</small>
                                              <small v-else>Tunggu waktu 10 menit sebelum mengumpulkan kembali</small>
                                            </template>
                                        </template>

                                        <template v-if="statusConditionAssignment === 'not_submitted'">
                                            Serahkan {{ isTestCase ? 'Tes' : 'Tugas' }}
                                        </template>

                                    </template>
                                </h5>

                                <b-form id="assignment-forms" @submit="onSubmitForm">
                                    <b-alert
                                        v-model="onEvent.show"
                                        :variant="onEvent.variant"
                                        dismissible
                                        class="text-sm"
                                    >
                                        {{ onEvent.message }}
                                    </b-alert>

                                    <template v-if="assignmentDetail?.type === 'link'">
                                        <div class="form-group mb-3 w-100">
                                            <div>
                                                <input
                                                    id="link"
                                                    :disabled="assignmentEnded ||
                                                        classroomDetail?.classState.ended ||
                                                        statusConditionAssignment === 'submitted.not_scored' || (assignmentDetail?.submitted_at && !assignmentDetail?.reassignable) ||
                                                        (assignmentDetail.scored === 1 && assignmentDetail?.passed) ||
                                                        (assignmentDetail.scored === 1 && !assignmentDetail?.passed && !allowedResubmitAfterInterval)"
                                                    :value="assignmentDetail?.link && assignmentDetail?.link"
                                                    ref="linkAssignment"
                                                    type="url"
                                                    :placeholder="!assignmentEnded && `Masukkan url ${this.isTestCase ? 'tes' : 'tugas'}`"
                                                    required="true"
                                                    aria-required="true"
                                                    class="form-control"
                                                >
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="form-group mb-3 w-100">
                                            <template v-if="!!assignmentDetail?.submitted_at">
                                                <img class="mb-2" width="150" height="auto" :src="assignmentDetail.link" alt="">
                                                <template v-if="!(!!assignmentDetail?.isDeadline) && !classroomDetail?.classState.ended && (assignmentDetail?.scored == 1 && !assignmentDetail?.passed && timeLeft === 0) && assignmentDetail?.reassignable">
                                                    <Dropzone
                                                        :dropzoneId="inputFile.name"
                                                        :label="inputFile.label"
                                                        :disabled="inputFile.disabled"
                                                        filedir="class"
                                                        acceptedFiles="image/*, application/pdf"
                                                        :value="inputFile.value"
                                                        v-model="inputFile.value"
                                                        @remove="inputFile.value = null"
                                                    />
                                                </template>
                                            </template>
                                            <template v-else-if="!assignmentEnded && !classroomDetail?.classState.ended">
                                                <Dropzone
                                                    :dropzoneId="inputFile.name"
                                                    :label="inputFile.label"
                                                    :disabled="inputFile.disabled"
                                                    filedir="class"
                                                    acceptedFiles="image/*, application/pdf"
                                                    :value="inputFile.value"
                                                    v-model="inputFile.value"
                                                    @remove="inputFile.value = null"
                                                />
                                                <p class="extension-detail mt-3">*Upload file dengan ekstensi .jpg / .png / .pdf / .webp</p>
                                            </template>
                                        </div>
                                    </template>

                                    <template v-if="!assignmentEnded">
                                        <b-button
                                            v-if="statusConditionAssignment === 'not_submitted'"
                                            class="px-4 w-100 mb-3"
                                            type="submit"
                                            :disabled="isSubmit || (assignmentDetail?.type !== 'link' && (inputFile.value?.length || 0) == 0)"
                                            variant="primary"
                                        >
                                            <template v-if="!isAssigning">
                                                {{ !(!!assignmentDetail?.submitted_at) && assignmentDetail?.scored === 0 ? 'Serahkan' : 'Serahkan Ulang' }}
                                            </template>
                                            <template v-else>
                                                <b-spinner small class="mr-2"></b-spinner>Loading...
                                            </template>
                                        </b-button>

                                        <template v-if="statusConditionAssignment === 'submitted.not_scored'">
                                            <span class="btn btn-outline-warning text-md rounded-pill px-3" style="width: 100%;">
                                                SEDANG DIREVIEW
                                            </span>
                                        </template>
                                    </template>

                                    <!-- Show if score not passed -->
                                    <button
                                        v-if="!assignmentEnded && statusConditionAssignment === 'submitted.scored.not_passed' && assignmentDetail?.reassignable"
                                        type="submit"
                                        class="d-block btn btn-primary text-md px-3 mt-2"
                                        style="width: 100%;"
                                        :disabled="!allowedResubmitAfterInterval"
                                    >
                                        <template v-if="!isAssigning">
                                          Serahkan Ulang {{ timeLeft === 0 ? '' : `${minutes}:${seconds}` }}
                                        </template>
                                        <template v-else>
                                          <b-spinner small class="mr-2"></b-spinner>Loading...
                                        </template>
                                    </button>
                                </b-form>
                                <template v-if="
                                    statusConditionAssignment === 'submitted.scored.passed' ||
                                    statusConditionAssignment === 'submitted.scored.not_passed' ||
                                    assignmentEnded ||
                                    classroomDetail?.classState.ended"
                                >
                                    <button
                                        v-if="assignmentDetail?.scored === 1 || classroomDetail?.classState.ended"
                                        class="d-block btn btn-outline-primary text-md rounded-pill px-3 mt-2"
                                        @click="onClickModalNilaiTugas()"
                                        style="width: 100%;"
                                    >
                                        Lihat Nilai
                                    </button>
                                </template>

                                <template v-if="assignmentEnded && statusConditionAssignment === 'submitted.not_scored'">
                                    <span class="btn btn-outline-warning text-md rounded-pill px-3" style="width: 100%;">
                                        SEDANG DIREVIEW
                                    </span>
                                </template>
                            </b-card-body>
                        </b-card>
                    </b-col>
                </b-row>
            </b-col>

            <b-col cols="12" v-else>
                <b-row>
                    <b-col cols="12">

                        <b-card no-body>

                            <b-card-header class="px-0 mx-4 border-b">
                                <b-row>

                                    <b-col cols="12" class="d-flex justify-content-between align-items-center">

                                        <div v-if="!isBusy" class="d-flex flex-wrap md-flex-nowrap align-items-center gap-4">
                                            <h3>
                                                <b>{{ assignmentDetail?.title }}</b>
                                            </h3>
                                            <div
                                                class="course d-flex flex-row align-items-center"
                                                @click="onClickCourse(classroomDetail?.slug)"
                                            >
                                                <i class="ri-file-list-line"></i>
                                                <span class="text">{{ assignmentDetail?.moduleName }}</span>
                                            </div>
                                        </div>


                                        <div v-else style="width: 100% !important; height: 100% !important;">
                                            <b-skeleton width="15%" height="100%" class="mb-3"></b-skeleton>
                                        </div>

                                    </b-col>

                                </b-row>
                            </b-card-header>

                            <b-card-body class="px-0 mx-4">

                                <template v-if="!isBusy">
                                    <div v-html="assignmentDetail?.description"></div>
                                </template>

                                <template v-else>
                                    <b-skeleton width="100%" height="100%" class="mb-3"></b-skeleton>
                                </template>

                                <div v-for="(content, index) in assignmentContents" :key="index">
                                    <div v-if="content != '' && content != '#' && validURL(content)" class="mt-3">
                                        <div class="p-2 d-block mx-auto rounded-lg text-white" style="background: #EBEBF0;">
                                            <div>
                                                <b-embed
                                                    type="iframe"
                                                    aspect="16by9"
                                                    allowfullscreen
                                                    frameborder="0"
                                                    :src="generateLinkEmbed(content)"
                                                >
                                                </b-embed>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </b-card-body>

                        </b-card>

                    </b-col>
                </b-row>
            </b-col>
        </template>
        <template v-else>
            <b-col cols="12">
                <b-card class="border">
                    Loading...
                </b-card>
            </b-col>
        </template>
        <ModalDetailNilaiAssignment
            v-if="assignmentDetail?.isDeadline || classroomDetail?.classState.ended || assignmentDetail?.submitted_at != null"
            :onOpenModal="onOpenModalNilaiTugas"
            :pagination="pagination"
            :assignmentDetail="assignmentDetail"
            @toggleModalNilaiTugas="toggleModalNilaiTugas"
        />
        <b-modal v-model="isModalAssignTaskOpen" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Kerjakan Tugas?"
                description="<b>Timer akan berjalan</b> ketika menekan tombol dibawah dan <b>timer akan terus berjalan</b> walaupun browser ditutup"
                btnYesVariant="primary"
                btnNoHide
                @actionYes="assignTask"/>
        </b-modal>
    </b-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ModalDetailNilaiAssignment from '../template/micro/modal/ModalDetailNilaiAssignment.vue';
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";

import appToken from "~/api/app-token";
import { toDecrypt } from '@/commons/utils/.'

export default {
  components: {
      ModalDetailNilaiAssignment,
      ModalConfirmation
  },

  props: {
    classroomId: {
        type: Number,
        default: -1
    },
    assignmentId: {
        type: Number,
        default: -1
    },
    classSlug: {
        type: String,
        default: "",
    }
  },
  computed: {
      ...mapState({
          servicesState: (state) => state.Services,
          sassState: (state) => state.Sass,
          assignmentState: (state) => state.Assignments,
          filterItems: (state) => state.Layouts?.filters,
      }),
    minutes() {
        return (Math.floor(this.timeLeft / 60)).toString().padStart(2, "0");
    },
    seconds() {
        return (this.timeLeft % 60).toString().padStart(2, "0");
    }
  },

  data() {
      return {
          userKind: localStorage.getItem('user_kind'),
          userId: JSON.parse(localStorage.getItem('user')).id,

          action: '',
          title: '',

          isLoaded: false,

          // Assignments
          isBusy: true,
          isAssigningment: true,
          isAssigning: false,
          assignmentList: [],
          assignmentContents: [],
          assignmentDetail: null,
          classroomDetail: null,

          // Form
          isSubmit: false,
          inputFile: {
            name: "fileAssignment",
            label: "File Tugas *",
            value: '',
            placeholder: '',
            required: true
          },

          onOpenModalNilaiTugas: false,

          // Pagination
          pagination: {
              page: 1,
              perPage: 10,
              totalItems: 0,
              totalPages: 0,
          },

          // Alert Event
          onEvent: {
              message: '',
              status: true,
              show: false,
              alertCounter: 0,
              variant: ''
          },


          isTestCase: false,
          isModalAssignTaskOpen: false,

          countdownInterval: 0,
          targetTime: null,
          timeLeft: 0,
          statusConditionAssignment: '',
          assignmentEnded: false,
          allowedResubmitAfterInterval: false,
      }
    },
  created() {
    this.isTestCase = this.sassState.isTestCase

    this.getCredentials();

  },

  watch: {
    timeLeft() {
        if (this.timeLeft === 0) this.getCredentials()
    }
  },

  mounted() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    clearInterval(this.countdownInterval);
  },
  methods: {
    ...mapActions({
        setActiveTab: 'Layouts/setActiveTab',
        setSelectedFilter: 'Layouts/setSelectedFilter'
    }),

    startCountdown() {
        // Set timeleft before interval started to avoid timeleft zero whereas there is still time
        const current = new Date().getTime();
        this.timeLeft = Math.max(Math.floor((this.targetTime - current) / 1000), 0);

        // Starts countdown
        this.countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            this.timeLeft = Math.max(Math.floor((this.targetTime - now) / 1000), 0);

            if (this.timeLeft === 0) {
                clearInterval(this.countdownInterval);
                this.setAllowedResubmitAfterInterval()
            }
        }, 1000);
    },

    setConditionAssignment() {
        const submitted = !!this.assignmentDetail?.submitted_at
        const scored = this.assignmentDetail?.scored == 1 ? true : false
        const passed = this.assignmentDetail?.passed
        const is_deadline = this.assignmentDetail?.isDeadline
        const class_ended = this.classroomDetail?.classState.ended

        if (is_deadline || class_ended) {
            this.assignmentEnded = true
        }

        if (submitted) {
            if (scored) {
                if (passed) {
                    this.statusConditionAssignment = 'submitted.scored.passed'
                } else {
                    this.statusConditionAssignment = 'submitted.scored.not_passed'
                }
            } else {
                this.statusConditionAssignment = 'submitted.not_scored'
            }
        } else {
            this.statusConditionAssignment = 'not_submitted'
        }
    },

    setAllowedResubmitAfterInterval() {
        if (this.assignmentDetail?.submitted_at && this.assignmentDetail?.scored === 1) {
            const interval = this.assignmentDetail?.retryInterval * 1000; // converts seconds to milliseconds
            const submitted_at = `${this.assignmentDetail.submitted_at.split('T')[0]} ${this.assignmentDetail.submitted_at.split('T')[1]}`; // formats date
            const formatted_submitted_at = new Date(submitted_at.split('Z')[0]); // formats date
            const current_time = new Date(); // gets current time

            // Adds interval to submitted time
            const submit_time_add_interval = formatted_submitted_at.getTime() + interval;

            // Set time interval before resubmit
            this.targetTime = submit_time_add_interval;

            if (current_time.getTime() > submit_time_add_interval) {
                // Allowed resubmit after interval passed
                return this.allowedResubmitAfterInterval = true;
            } else {
                // Not allowed resubmit after interval passed
                return this.allowedResubmitAfterInterval = false;
            }
        } else {
            return this.allowedResubmitAfterInterval = false;
        }
    },

    async getCredentials() {
        const url = this.$router.currentRoute.fullPath
        var res = url.split('/')
        res.shift()

        this.title = res[1].toLowerCase()
        this.action = res[4]

        await this.fetchClassroomDetail();
        await this.fetchAssignmentDetail();
    },

      async fetchAssignmentDetail(){
        this.isBusy = true

        let params = {};

        if (this.userKind !== 'student') {
            params = {
                topicId: this.assignmentId,
            }

            await this.$store.dispatch("Assignments/detail", params)
            if (!this.assignmentState.status) {
                console.error('failed fetch assignments: ', this.assignmentState.message);
                this.setEvent(this.assignmentState.message, false)
                this.isTopicsLoaded = false;
            } else {
                this.assignmentDetail = this.assignmentState.data;
                this.assignmentContents = this.assignmentDetail.content ? this.assignmentDetail.content.split("|") : [];
                this.isBusy = false;
            }
        } else {
            params = {
                classId: this.classroomId,
                topicId: this.assignmentId,
                userId: this.userId,
            }
            await this.$store.dispatch('Services/studentAssignmentDetail', params)
            if (!this.servicesState.status) {
                console.error('failed fetch assignments: ', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isTopicsLoaded = false;
            } else {
                this.assignmentDetail = this.servicesState.data;
                this.assignmentContents = this.assignmentDetail.content ? this.assignmentDetail.content.split("|") : [];
                this.inputFile.value = this.assignmentDetail.link || "";
                this.isBusy = false;
            }
        }

        await this.setAllowedResubmitAfterInterval();
        await this.startCountdown();
        await this.setConditionAssignment()
      },
      async fetchClassroomDetail(){
          this.isBusy = true

          const params = this.classroomId;

          await this.$store.dispatch('Services/classroomDetail', {id: params})

          if (!this.servicesState.status) {

              console.error('failed fetch assignments: ', this.servicesState.message);
            //   this.setEvent(this.servicesState.message, false)

              this.isTopicsLoaded = false;

          } else {

              this.classroomDetail = this.servicesState.data;

              this.isBusy = false;

          }
      },


      async assignTask(){
            this.isAssigning = true

            const params = {
                classId: this.classroomId,
                topicId: this.assignmentId,
            }

            await this.$store.dispatch('Services/classroomAssignTask', params)

            if(!this.servicesState?.status) {
                console.error('Failed start assign task: ', this.servicesState?.message)
                this.isAssigning = false
            } else {
                setTimeout(async () => {
                    await this.openTask(this.servicesState?.data?.externalId)
                    this.isAssigning = false
                }, 500);
            }
      },

      async onSubmitForm(event) {
        event.preventDefault()

        this.isSubmit = true

        this.isAssigning = true;

        if(this.assignmentDetail.type == 'link') {

            const params = {
                classroomId: this.classroomId,
                topicId: this.assignmentId,
                link: this.$refs.linkAssignment.value
            }

            await this.$store.dispatch('Services/classroomAssignLink', params)

            if(!this.servicesState.status) {
                this.setEvent(this.servicesState.message, false)
                this.isAssigning = false
            } else {
                setTimeout(() => {
                    this.isAssigning = false
                    this.fetchAssignmentDetail();
                    this.setEvent("Berhasil menyerahkan tugas", true)
                }, 1000);
            }

        } else if (this.assignmentDetail.type == 'file') {

            if((this.inputFile.value?.length || 0) == 0) {

                setTimeout(() => {
                    this.isAssigning = false
                    this.setEvent("Maaf, tolong masukkan file tugas terlebih dahulu", false);
                }, 1000);

            } else {

                const params = {
                    classroomId: this.classroomId,
                    topicId: this.assignmentId,
                    link: this.inputFile.value
                }

                await this.$store.dispatch('Services/classroomAssignLink', params)

                if(!this.servicesState.status) {
                    this.setEvent(this.servicesState?.message, false)
                    this.isAssigning = false
                } else {
                    setTimeout(() => {
                        this.isAssigning = false
                        this.fetchAssignmentDetail();
                        this.setEvent(`Berhasil menyerahkan ${this.isTestCase ? 'Tes' : 'Tugas'}`, true)
                    }, 1000);
                }

            }

        }

        this.isSubmit = false
      },

      handleChangeFileUpload() {
        document.getElementById("fileAssignment").addEventListener("change", (event) => {
            this.inputFile.value = null;
            let fileType = event.target.files[0].type;

            let validExtensions = ["image/jpg", "image/jpeg", "image/png", "image/webp", "application/pdf"];

            if(validExtensions.includes(fileType)) {
                this.$refs.uploadContainer.innerHTML = event.target.files[0].name;
            } else {
                this.$refs.uploadContainer.innerHTML = `
                                                    <h4
                                                        class="d-flex flex-column"
                                                        style="
                                                            font-family: 'Inter';
                                                            font-style: normal;
                                                            font-weight: 600;
                                                            font-size: 12px;
                                                            line-height: 15px;
                                                            text-align: center;
                                                            color: rgba(0, 0, 0, 0.5);
                                                        "
                                                        >
                                                            Tarik dan lepaskan file di sini
                                                            <span class="text-gray d-block" style="font-size: 10px !important;">atau klik untuk upload</span>
                                                    </h4>`
                this.$refs.uploadContainer.classList.remove("active");
                this.setEvent('Maaf, tolong masukkan gambar yang tepat!', false)
            }
        })
      },

      handleClickUpload() {
        document.getElementById("fileAssignment").click();
        this.handleChangeFileUpload();
      },

      handleDragOverUpload() {
        if(this.$refs.fileAssignment.length > 1) {
            this.$refs.uploadContainer.innerHTML = `
                                            <h4
                                                class="d-flex flex-column"
                                                style="
                                                    font-family: 'Inter';
                                                    font-style: normal;
                                                    font-weight: 600;
                                                    font-size: 12px;
                                                    line-height: 15px;
                                                    text-align: center;
                                                    color: rgba(0, 0, 0, 0.5);
                                                "
                                                >
                                                    Tarik dan lepaskan file di sini
                                                    <span class="text-gray d-block" style="font-size: 10px !important;">atau klik untuk upload</span>
                                            </h4>`
            this.$refs.uploadContainer.classList.remove("active");
        } else {
            this.$refs.uploadContainer.innerHTML = `<h4
                                                    class="d-flex flex-column"
                                                    style="
                                                        font-family: 'Inter';
                                                        font-style: normal;
                                                        font-weight: 600;
                                                        font-size: 12px;
                                                        line-height: 15px;
                                                        text-align: center;
                                                        color: rgba(0, 0, 0, 0.5);
                                                    "
                                                    >Proses meng-upload...</h4>`
            this.$refs.uploadContainer.classList.add("active");
        }
      },

      handleDragLeaveUpload() {
        this.$refs.uploadContainer.innerHTML = `
                                            <h4
                                            class="d-flex flex-column"
                                            style="
                                                font-family: 'Inter';
                                                font-style: normal;
                                                font-weight: 600;
                                                font-size: 12px;
                                                line-height: 15px;
                                                text-align: center;
                                                color: rgba(0, 0, 0, 0.5);
                                            "
                                            >
                                                Tarik dan lepaskan file di sini
                                                <span class="text-gray d-block" style="font-size: 10px !important;">atau klik untuk upload</span>
                                            </h4>`
        this.$refs.uploadContainer.classList.remove("active");
      },

      handleDropUpload(event) {

        this.$refs.fileAssignment = event.dataTransfer.files[0];

        let fileType = this.$refs.fileAssignment.type;

        let validExtensions = ["image/jpg", "image/jpeg", "image/png", "image/webp", "application/pdf"];

        if(validExtensions.includes(fileType)) {
            let fileReader = new FileReader();
            // fileReader.onload = () => {
            //     let fileURL = fileReader.result;
            //     let imgTag = `<img src="${fileURL}" alt="File Upload" />`;
            //     this.$refs.uploadContainer.innerHTML = imgTag;
            // }
            fileReader.readAsText(this.$refs.fileAssignment);
            this.$refs.uploadContainer.innerHTML = this.$refs.fileAssignment.name;
        } else {
            this.$refs.uploadContainer.innerHTML = `
                                                <h4
                                                style="
                                                    font-family: 'Inter';
                                                    font-style: normal;
                                                    font-weight: 600;
                                                    font-size: 12px;
                                                    line-height: 15px;
                                                    text-align: center;
                                                    color: rgba(0, 0, 0, 0.5);
                                                "
                                                >Tarik dan lepaskan file di sini</h4> \n <br/>
                                                <span class="text-gray d-block" style="font-size: 10px !important;">atau klik untuk upload</span>`
            this.$refs.uploadContainer.classList.remove("active");
            this.setEvent('Maaf, tolong masukkan gambar yang tepat!', false)
        }

      },

      async openTask(id, type) {
            const responseId = "&responseId=" + id
            const redirectLms = "&redirectTo=" + window.location.href

            var urlTarget = ''
            if (this.assignmentDetail?.type == 'studio') urlTarget = process.env.editorURL + `compiler?&metronomId=${id}` + redirectLms
            if (this.assignmentDetail?.type == 'form') urlTarget = process.env.formURL + "/fill?" + responseId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            const url = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;

            this.getCredentials();
            window.open(url, '_blank')
        },

      onClickModalNilaiTugas() {
        this.onOpenModalNilaiTugas = !this.onOpenModalNilaiTugas
      },

      toggleModalNilaiTugas() {
          this.onOpenModalNilaiTugas = !this.onOpenModalNilaiTugas
      },

      generateLinkEmbed(link) {

          if(link.includes("presentation")) {
            return link.replace(/\/edit\?/, "/embed?start=false&loop=false&delayms=3000&rm=minimal");
          } else {
            return link.replace("/view", "/preview")
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

      onClickCourse(slug) {
          this.setActiveTab('courses')
          this.$router.push(`/dashboard/classroom/${slug}#module-${this.assignmentDetail.moduleId}`)
      },

      setEvent(message, status) {

          window.scrollTo(0,0)

          this.onEvent.message = message
          this.onEvent.status = status
          this.onEvent.variant = status ? 'success' : 'warning'
          this.onEvent.show = true

      },
    handleVisibilityChange() {
        if (['studio', 'form'].includes(this.assignmentDetail.type) && !document.hidden) {
            this.fetchAssignmentDetail();
        }
    },
    onClickReview(data) {
        const className = toDecrypt(localStorage.getItem("className"));
        const findClass = this.filterItems?.find(item => item.value === this.classroomId)
        this.setSelectedFilter(findClass)
        this.$router.push({
            path: '/dashboard/reviews',
            query: {
                classroomId: this.classroomId,
                classroomSlug: this.classSlug,
                classroomName: className,
                assignmentId: data?.task?.id,
            }
        })
    }

  }
}
</script>

<style lang="scss" scoped>

.card-text iframe {
  width: 100% !important;
  min-height: 300px;
}

ul li {
  color: #000;
}

.course {
  padding: 6px;
  background-color: #EBEBF0;
  border-radius: 6px;
  cursor: pointer;

  i {
      color: #000;
      font-size: 17px;
      margin-right: 6px;
  }

  .text {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
  }
}

.btn-outline-warning {
  border: 1px solid #F2994A;
}

.dropzone {
    height: 90px !important;
}

.extension-detail {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    color: #000;
}

</style>
