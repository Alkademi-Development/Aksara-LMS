<template>
  <section>
    <CardAssignmentModule
      :isLoading="isLoadingFetch"
      :assignmentDetail="assignmentDetail"
      :assignmentContents="assignmentContents"
      :statusConditionAssignment="statusConditionAssignment"
      :assignmentEnded="assignmentEnded"
      :isTimeOver="timeLeft == 0"
      :minutes="minutes"
      :seconds="seconds"
      @onClickAssignment="startAssignment"
    />
    <CardAssignmentInput
      v-if="isOpenInput"
      :assignmentDetail="assignmentDetail"
      :classroomDetail="classroomDetail"
      @submitted="initiateData"
    />
    <SectionListStudentModule
      v-if="userRole !== 'student'"
      title="Siswa"
      :pagination="pagination"
      :fieldTable="fieldsListStudent"
      :itemsTable="itemsListStudent"
      :isLoading="isLoadingTable"
      :sortBy="sortBy"
      :showSorting="true"
      :showSearching="true"
      textEmptyData="Belum ada data siswa yang tersedia"
      :isDividerRow="false"
      @changeLoadingState="isBusy = $event"
      @setFilter="setFilter"
      @onPageChange="setPagination"
      @onSortByChange="setSortBy"
    />
    <SectionListStudentModule
      v-if="userRole === 'student'"
      title="Riwayat"
      :pagination="pagination"
      :fieldTable="fieldsHistory"
      :itemsTable="itemHistories"
      :isLoading="isLoadingTable"
      :sortBy="sortBy"
      textEmptyData="Belum ada tugas yang dikumpulkan"
      @changeLoadingState="isBusy = $event"
      @setFilter="setFilter"
      @onPageChange="setPagination"
      @onSortByChange="setSortBy"
    />
    <b-modal v-model="isModalAssignTaskOpen" size="md" centered hide-header hide-footer body-class="p-0">
        <ModalConfirmation
          title="Kerjakan Tugas?"
          description="<b>Timer akan berjalan</b> ketika menekan tombol dibawah dan <b>timer akan terus berjalan</b> walaupun browser ditutup"
          btnYesVariant="primary"
          btnNoHide
          :isLoading="isAssigning"
          :onAlert="onAlert"
          @actionYes="assignTask"
        />
    </b-modal>
  </section>
</template>

<script>
// Components
import CardAssignmentModule from '@/components/template/micro/card/CardAssignmentModule.vue';
import SectionListStudentModule from '~/components/template/micro/section/SectionListStudentModule.vue';
import CardAssignmentInput from '@/components/template/micro/card/CardAssignmentInput.vue';
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";

import appToken from "~/api/app-token";
import { mapState } from 'vuex';
import { toDate, toDateTimes } from "@/commons/utils/.";

export default {
  components: {
    CardAssignmentModule,
    SectionListStudentModule,
    CardAssignmentInput,
    ModalConfirmation,
  },
  props: {
    isLoadedContent: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState({
        classroomsState: (state) => state.Classrooms,
        assignmentState: (state) => state?.Assignments,
        servicesState: (state) => state.Services,
    }),
    isLoadingFetch(){
      return this.isLoading || !this.isLoadedContent;
    },
    isLoadingTable(){
      return !this.isLoadedContent || this.isBusy;
    },
    minutes() {
        return (Math.floor(this.timeLeft / 60)).toString().padStart(2, "0");
    },
    seconds() {
        return (this.timeLeft % 60).toString().padStart(2, '0');
    }
  },
  watch: {
    isLoadedContent(state){
      if(state) this.initiateData();
    },
  },
  data(){
    return{
      // Filters
      pagination: {
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
      keyword: "",

      // Tables
      // Role Student
      fieldsHistory: [
        { key: 'date', label: "Tanggal"},
        { key: 'score', label: "Nilai"},
        { key: 'status', label: "Status"},
        { key: 'action', label: "Aksi"},
        { key: 'comment', label: "Komentar"},
      ],
      itemHistories: [],

      // Role Admin
      fieldsListStudent: [
        { key: 'name', label: "Nama Siswa", sort: ['name.asc', 'name.desc'], sortKey: "name" },
        { key: 'highest_score', label: "Nilai Tertinggi", sort: ['score.asc', 'score.desc'], sortKey: "score" },
        { key: 'submitted_at', label: "Last Submit", sort: ['submit.asc', 'submit.desc'], sortKey: "submit" },
      ],
      itemsListStudent: [],
      sortBy: "score.desc",

      // Students
      students: null,
      studentHistories: null,

      // Classroom
      classroomDetail: null,

      // User
      userRole: localStorage.getItem("user_kind"),
      user: JSON.parse(localStorage.getItem("user")),

      // assignment
      assignmentInTopic: null,
      assignmentDetail: null,
      assignmentContents: null,
      assignmentEnded: false,
      statusConditionAssignment: "",
      allowedResubmitAfterInterval: false,
      targetTime: null,
      countdownInterval: 0,
      timeLeft: 0,
      linkAssignment: "",
      onAlert: {
        isShow: false,
        variant: "danger",
        message: "",
      },

      // State
      isLoading: false,
      isOpenInput: false,
      isBusy: false,
      isModalAssignTaskOpen: false,
      isAssigning: false,
      isSubmit: false,

      // Slug
      assignmentSlug: "",
    }
  },
  mounted(){
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  methods: {
    initiateData(){
      this.assignmentSlug = this.$route?.params?.assignment;
      this.classroomDetail = this.servicesState?.classroomDetail;
      const listTopics = this.classroomsState?.listTopics;
      this.assignmentInTopic = listTopics.find((topic) => topic?.slug == this.assignmentSlug);
      this.isOpenInput = false;

      this.fetchAssignmentDetail();
      if(this.userRole != "student") this.getStudents();
      else this.getStudentHistories();
    },
    async fetchAssignmentDetail(){
      this.isLoading = true;

      let params = {};

      if (this.userRole !== 'student') {

          params = {
              topicId: this.assignmentInTopic?.id,
          }

          await this.$store.dispatch("Assignments/detail", params)

          if (!this.assignmentState.status) {
              console.error('failed fetch assignments: ', this.assignmentState.message);
              this.isLoading = false;
          } else {
              this.assignmentDetail = this.assignmentState.data;
              this.assignmentContents = this.assignmentDetail.content ? this.assignmentDetail.content.split("|") : [];
              this.isLoading = false;
          }
      } else {
          params = { 
              classId: this.classroomDetail?.id,
              topicId: this.assignmentInTopic?.id,
              userId: this.user?.id,
          }

          await this.$store.dispatch('Services/studentAssignmentDetail', params)

          if (!this.servicesState.status) {
              console.error('failed fetch assignments: ', this.servicesState.message);
              this.isLoading = false;
          } else {
              this.assignmentDetail = this.servicesState.data;
              this.assignmentContents = this.assignmentDetail.content ? this.assignmentDetail.content.split("|") : [];

              // Remove Field action if the assignment is form
              if(this.assignmentDetail?.type == 'form') this.fieldsHistory = this.fieldsHistory.filter(field => field?.key !== "action");

              this.setAllowedResubmitAfterInterval();
              this.startCountdown();
              this.setConditionAssignment();

              this.isLoading = false;
          }
      }
    },
    startAssignment(typeOfAssignment){
      if(typeOfAssignment === "link" || typeOfAssignment == 'file') this.isOpenInput = true;
      else if(typeOfAssignment == "form" || typeOfAssignment == "studio"){
        if(this.statusConditionAssignment === "not_submitted"){
          if(this.assignmentDetail?.externalId) this.openTask(this.assignmentDetail?.externalId);
          else this.isModalAssignTaskOpen = true;
        }else if(this.statusConditionAssignment === "submitted.scored.not_passed") this.isModalAssignTaskOpen = true;
      }
    },
    async getStudents(){
      this.isBusy = true;

      const params = {
        topicId: this.assignmentInTopic?.id,
        // state: "scored",
        page: this.pagination?.page,
        perPage: this.pagination?.perPage,
        isNotStoreToData: true,
        search: this.keyword,
        order: this.sortBy
      }

      await this.$store.dispatch("Assignments/students", params);

      if(!this.assignmentState?.status){
        console.error("Failed to fetch students : " + this.assignmentState?.message);
        this.isBusy = false;
      }else{
        this.students = this.assignmentState?.students;
        const pagination = this.assignmentState?.pagination;
        const tempItemTable = [];

        // Set Data Student that will show to the table
        if(this.students){
          this.students?.map((student) => {
            const { userName, submitted_at, ...restData } = student;
            tempItemTable.push({
              name: userName,
              highest_score: student?.score,
              submitted_at: toDate(submitted_at, null, { country: "id-ID", type: "long" }),
              ...restData,
            });
          });
        }

        this.itemsListStudent = tempItemTable;

        // Set Pagination
        this.pagination.page = pagination?.page ?? this.pagination?.page;
        this.pagination.perPage = pagination?.perPage ?? this.pagination.perPage;
        this.pagination.totalItems = pagination?.totalItems ?? this.pagination.totalItems;
        this.pagination.totalPages = pagination?.totalPages ?? this.pagination.totalPages;

        this.isBusy = false;
      }
    },
    setFilter({ keyword, page }){
      this.keyword = keyword;
      this.pagination.page = page;

      if(this.userRole == "student") this.getStudentHistories();
      else this.getStudents();
    },
    setPagination(page){
      this.pagination.page = page;

      if(this.userRole == "student") this.getStudentHistories();
      else this.getStudents();
    },
    setSortBy(sortBy){
      this.pagination.page = 1;
      this.sortBy = sortBy;

      if(this.userRole == "student") this.getStudentHistories();
      else this.getStudents();
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
    startCountdown() {
      // We define it first as setInterval because if we wait for the timeleft data time in that function. it needs to wait a while due to the async function, which causes the page to be rendered before the data is ready, and the impact is that the conditions are not as required as in the CardAssignmentModule.vue js file
      const currentTime = new Date().getTime();
      this.timeLeft = Math.max(Math.floor((this.targetTime - currentTime) / 1000), 0);

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
    async assignTask(){
      this.isAssigning = true;

      this.onAlert = { isShow: false, variant: "danger", message: "" };
      
      const params = {
          classId: this.classroomDetail?.id,
          topicId: this.assignmentInTopic?.id,
      }

      await this.$store.dispatch('Services/classroomAssignTask', params)

      if(!this.servicesState?.status) {
          console.error('Failed start assign task: ', this.servicesState?.message);
          this.onAlert = { isShow: true, variant: "danger", message: this.servicesState?.message };
          this.isAssigning = false
      } else {
          setTimeout(async () => {
              await this.openTask(this.servicesState?.data?.externalId)
              this.isAssigning = false
              this.isModalAssignTaskOpen = false;
          }, 500);
      }
    },
    /**
     * @param id = external Id
     */
    async openTask(id) {
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

      this.initiateData();
      window.open(url, '_blank')
    },
    async getStudentHistories(){
      this.isBusy = true;


      const params = {
        classroomId: this.classroomDetail?.id,
        topicId: this.assignmentInTopic?.id,
        page: this.pagination?.page,
        pageSize: this.pagination?.perPage,
      }

      await this.$store.dispatch("Assignments/getStudentHistories", params);

      if(!this.assignmentState?.status){
        console.error("Failed to fetch student histories : " + this.assignmentState?.message);
        this.isBusy = false;
      }else{
        this.studentHistories = this.assignmentState?.studentHistories;
        const pagination = this.assignmentState?.pagination;
        const tempItemTable = [];

        if(this.studentHistories){
          this.studentHistories?.map((student) => {
            tempItemTable.push({
              date: toDateTimes(student?.submitted_at, null, { country: "id-ID", type: "long" }) ?? "-",
              score: student?.scored == 1 ? student?.score : "-",
              status: student?.passed ? 'passed' : student?.scored == 1 ? 'not_passed' : "on_review",
              action: student?.type == "link" || student?.type == "file" ?  student?.link : student?.externalId,
              comment: student?.mentorNotes,
              typeOfAssignment: student?.type,
            })
          })
        }

        this.itemHistories = tempItemTable;

        // Set Pagination
        this.pagination.page = pagination?.page ?? this.pagination?.page;
        this.pagination.perPage = pagination?.perPage ?? this.pagination.perPage;
        this.pagination.totalItems = pagination?.totalItems ?? this.pagination.totalItems;
        this.pagination.totalPages = pagination?.totalPages ?? this.pagination.totalPages;

        this.isBusy = false;
      }
    },
    handleVisibilityChange() {
        if (['studio', 'form'].includes(this.assignmentDetail.type) && !document.hidden) {
            this.initiateData();
            this.$emit("fetchListTopics");
        }
    },
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    clearInterval(this.countdownInterval);
  },
}
</script>
