<template>
  <div>
    <div class="d-flex">
      <SidebarModule
        :listItem="listTopics"
        :isLoaded="isLoaded"
        :moduleCounter="moduleCounter"
        :statusListTopics="statusListTopics"
        :showContent="showContent"
        :isFromClass="true"
        :isShowButtonCreateModule="true"
        :timerTopic="timerTopic"
        :isStopTimerTopic="isStopTimerTopic"
        :detailModule="detailCourse"
        :classroomDetail="classroomDetail"
        :isFetchStatistic="isFetchStatistic"
        :topicLocked="topicLocked"
        @topicLockedAction="topicLockedAction"
        @onClickCreateModule="goToCreateModule"
        @onClickDelete="toggleConfirm($event, $event?.kind === 'assignment' ? 'assignment' : 'topic', 'delete')"
        @onClickEdit="goToEditModule($event)"
      />
      <div id="wrapper-content" class="content-module px-md-0">
        <template v-if="listTopics?.length > 0">
          <HeaderStartStudy
            v-if="showContent == 'overview' && role === 'student'"
            :isShow="isHeaderShow"
            :isFromClass="true"
            fromPositionTop="25px"
            topPositionTop="119px"
            @startLearning="startLearning"
          />
        </template>
        <!-- ALERT IF THE MODULE IS DRAFT || ALERT IF WHILE FETCHING DATA THERE IS AN ERROR -->
        <AlertModule 
          v-if="onAlert?.isShow"
          :textAlert="onAlert?.textAlert"
          :iconAlert="onAlert?.iconAlert"
          :isShowAction="onAlert?.isShowAction"
          :variant="onAlert?.variant"
          :textAction="onAlert?.textAction"
          @onClickAction="toggleConfirm(topicDetail, 'topic', 'publish')"
        />


        <div :class="`p-3 px-md-4 pb-md-3 ${onAlert?.isShow ? 'pt-md-7' : 'pt-md-4'}`">
          <SectionStatisticModule
            v-if="showContent === 'statistic'"
            :isLoadedContent="isLoadedContent"
            :detailModule="detailCourse"
            :classroomDetail="classroomDetail"
            :isFetchStatistic="isFetchStatistic"
          />
          <SectionAssignmentModule
            v-else-if="showContent === 'assignment'"
            :isLoadedContent="isLoadedContent"
            @fetchListTopics="fetchListTopics"
          />
          <template v-else-if="showContent === 'overview' || showContent === 'course'">
            <div style="max-width: 960px; margin: 0 auto; overflow: hidden;">
              <template v-if="isLoadedContent || showContent === 'overview'">
                <div ref="contentOfModule">
                  <DetailCourse
                    v-if="showContent === 'overview'"
                    :slug="moduleSlug"
                    :isFromClass="true"
                    :totalTopics="moduleCounter?.totalTopics"
                    @startLearning="startLearning"
                    @callbackLoaded="callbackComponentLoaded"
                  />
                  <template v-if="showContent === 'course'">
                    <template v-if="topicDetail">
                      <div v-if="topicDetail?.type === 'editor'" class="bg-white border rounded px-3 px-md-4 px-lg-5 py-2 mb-4">
                        <CardContentModule
                          :isLoaded="isLoadedContent"
                          :topicDetail="topicDetail"
                          @callbackLoaded="callbackComponentLoaded"
                        />
                      </div>
                      <template v-else>
                        <CardContentOldModule
                          :isLoaded="isLoadedContent"
                          :topicDetail="topicDetail"
                          :isFromClass="true"
                          @callbackLoaded="callbackComponentLoaded"
                        />
                      </template>
                    </template>
                    <template v-else>
                      <div class="w-100 d-flex justify-content-center align-items-center bg-white border rounded px-5 py-2 mb-4" style="height: 70vh">
                        <div class="d-flex flex-column align-items-center" style="gap: 20px;">
                          <img src="~/assets/img/icons/empty/no-content.png" width="150px" />
                          <h4 style="color: #A2A2A2; text-align: center">Belum ada content pada modul ini</h4>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
              <template v-else>
                <div class="bg-white border rounded px-5 py-5 mb-4">
                  <div class="d-flex justify-content-center align-items-center mb-5">
                    <b-skeleton animation="wave" width="30%"></b-skeleton>
                  </div>
                  <div class="d-flex justify-content-center align-items-center w-100 mb-5">
                    <b-skeleton-img no-aspect width="60%" height="300px"></b-skeleton-img>
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <b-skeleton v-for="index in 3" :key="index" animation="wave" width="100%"></b-skeleton>
                    <b-skeleton animation="wave" width="80%"></b-skeleton>
                  </div>
                </div>
              </template>
            </div>
          </template>

          <FooterActionModule
            v-if="showContent !== 'statistic'"
            :isLoaded="isLoadedContent"
            :prevTopic="statusListTopics?.prevTopic"
            :nextTopic="statusListTopics?.nextTopic"
            :currentTopic="statusListTopics?.currentTopic"
            :isFromClass="true"
            @onActionModuleLocked="handleNextModuleLocked($event)"
            @onActionModuleDone="handleNextModuleLocked($event)"
            @nextCourse="handleNextCourse"
            :isShowButtonScroll="isContentOverflow"
            :timerTopic="timerTopic"
            :isScrollReachedBottom="isScrollReachedBottom"
            :topicLocked="topicLocked"
          />
        </div>
      </div>
      <b-modal
        v-model="onEvent.isShow"
        size="md" 
        centered 
        hide-header 
        hide-footer
      >
        <ModalLockTopic
          :title="onEvent?.title"
          :description="onEvent?.message"
        />
      </b-modal>
      <b-modal v-model="isModalConfirm" size="sm" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc body-class="p-0">
        <ModalConfirmation
            :title="modalConfirmData?.title"
            :description="modalConfirmData?.description"
            :btnYesVariant="modalConfirmData?.btnYesVariant"
            :btnYesTitle="modalConfirmData?.btnYesTitle"
            :centered="true"
            :btnNoHide="isModalConfirmProcess"
            :btnYesDisabled="isModalConfirmProcess"
            @actionYes="handleActionModalConfirm"
            @actionNo="toggleConfirm(null, typeOfModal, 'delete')"/>
      </b-modal>
      <b-modal
        v-model="onModalPassed.isShow"
        size="md" 
        centered 
        hide-header 
        hide-footer
      >
        <ModalPassed
          :title="onModalPassed?.title"
          :description="onModalPassed?.description"
          :image="onModalPassed?.image"
        />
      </b-modal>
    </div>
  </div>
</template>

<script>
// import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue";
import FooterActionModule from '@/components/courses/micro/FooterActionModule.vue';
import SidebarModule from '@/components/template/micro/sidebar/SidebarModule.vue';
import DetailCourse from '@/components/courses/DetailCourse.vue';
import CardContentModule from '@/components/template/micro/card/CardContentModule.vue';
import HeaderStartStudy from '@/components/template/micro/header/HeaderStartStudy.vue';
import CardContentOldModule from '@/components/template/micro/card/CardContentOldModule.vue';
import SectionStatisticModule from '@/components/template/micro/section/SectionStatisticModule.vue'
import SectionAssignmentModule from '@/components/template/micro/section/SectionAssignmentModule.vue';

import { mapActions, mapState } from 'vuex';
import { toDecrypt, toEncrypt } from '~/commons/utils';
import ModalLockTopic from '@/components/template/micro/modal/ModalLockTopic.vue';
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import AlertModule from '~/components/template/micro/alert/AlertModule.vue';
import ModalPassed from '~/components/template/micro/modal/ModalPassed.vue';

export default {
  props: {
    showContent: {
      type: String,
      default: "",
    }
  },
  components: {
    ModalConfirmation,
    FooterActionModule,
    SidebarModule,
    DetailCourse,
    CardContentModule,
    HeaderStartStudy,
    ModalLockTopic,
    CardContentOldModule,
    SectionStatisticModule,
    AlertModule,
    ModalPassed,
    SectionAssignmentModule
  },
  computed: {
      ...mapState({
          servicesState: (state) => state.Services,
          classroomDetailState: (state) => state?.Services?.classroomDetail,
          coursesState: (state) => state.Courses,
          classroomsState: (state) => state.Classrooms,
          detailModuleState: (state) => state?.Classrooms?.detailModule,
          isPublishMateriDraftState: (state) => state?.Courses?.isPublishMateriDraft,
          isDeleteCourseState: (state) => state?.Courses?.isDeleteCourse,
          assignmentsState: (state) => state.Assignments,
      }),
  },

  data() {
      return {
          isLoaded: true,
          isLoadedContent: true,
          listTopics: [],
          
          topicDetail: null,
          isHeaderShow: false,
          user: null,
          role: null,
          moduleCounter: null,
          onEvent: {
              title: "",
              message: '',
              isShow: false,
          },
          statusListTopics: {
            prevTopic: null,
            nextTopic: null,
            currentTopic: null,
          },

          isStopTimerTopic: true,
          timerIntervalTopic: null,
          timerTopic: 15,
          defaultTime: 15,
          defaultTimeOver: 0,

          isModalConfirm: false,
          modalConfirmData: {
            title: "",
            description: "",
            btnYesTitle: "Ya, Saya Yakin",
            btnYesVariant: "danger",
            type: "delete"
          },
          topicSelected: null,
          moduleSelected: null,
          typeOfModal: "",
          actionOfModal: "",
          isModalConfirmProcess: false,
          topicSlug: null,
          topicFromLocalStorage: null,
          onAlert: {
            isShow: false,
            textAlert: "",
            iconAlert: "",
            isShowAction: false,
            variant: "", // danger, success, warning, .....
            textAction: "",
          },
          listCourses: null,
          isContentOverflow: false,
          classroomDetail: null,
          moduleDetail: null,
          detailCourse: null,
          onModalPassed: {
            title: "",
            description: "",
            image: "",
            isShow: false,
          },
          isScrollReachedBottom: false,
          isComponentLoaded: false,
          isPublishMateriDraft: false,

          // State Statistic
          isFetchStatistic: false,

          moduleCounterList: null,

          // Slug
          assignmentSlug: "",
          moduleSlug: "",
          classroomSlug: "",
          assignmentSelected: null,

          topicLocked: {},
      }
  },
  watch: {
    showContent(newValue){
      if(newValue === 'overview') window.addEventListener('scroll', this.handleShowHeader), this.checkingPrevNextModule();
    },
    timerTopic(timer){
      if(timer === this.defaultTimeOver){
        this.stopTimerTopic();
        if(this.isComponentLoaded) this.checkAutomaticallyUnlock();
      }else if(timer < this.defaultTimeOver){
        this.stopTimerTopic();
        localStorage.setItem("timerTopic", toEncrypt(`${this.defaultTimeOver}`));
        if(this.isComponentLoaded) this.checkAutomaticallyUnlock();
      }
    },
    isModalConfirm(newValue){
      if (this.isPublishMateriDraft) this.$store.dispatch("Courses/setIsPublishMateriDraft", newValue);
      else if(this.typeOfModal == 'module') this.$store.commit("Courses/SET_ISDELETECOURSE", newValue);
    },
    isDeleteCourseState(status){
      if(status){
        const detailModule = this.classroomsState.detailModule;
        this.toggleConfirm(detailModule, "module", 'delete');
      }
      if(this.actionOfModal === 'delete') this.isModalConfirm = status;
    },
    isPublishMateriDraftState(status){
      this.isPublishMateriDraft = status;
      const detailModule = this.classroomsState.detailModule;
      if(status) this.toggleConfirm(detailModule, "module", 'publish');
    },
    // isLoadedContent(isLoaded){
    //   if(isLoaded){
    //     this.checkContentOverflow();
    //     this.checkScrollReachedBottom();
    //   }
    // },
    isScrollReachedBottom(state){
      if(state && this.timerTopic == this.defaultTimeOver){
        this.checkAutomaticallyUnlock();
      }
    },
    isComponentLoaded(state){
      if(state) this.checkAutomaticallyUnlock();
    },
  },
  created() {
    this.getCredentials();
  },
  mounted(){
    window.addEventListener('scroll', this.handleShowHeader);
    window.addEventListener('scroll', this.checkScrollReachedBottom);
  },
  methods: {
    ...mapActions({
        getListTopics: 'Classrooms/getListTopics',
        getDetailTopic: `Classrooms/getDetailTopic`,
        getUnlockTopic: 'Classrooms/getUnlockTopic',
        getModuleCounterList: 'Classrooms/getModuleCounterList',
    }),
    setEvent(title = "", message, status) {
      this.onEvent.title = title;
      this.onEvent.message = message;
      this.onEvent.isShow = status;
    },
    setModalPassed(title, description, image, isShow){
      this.onModalPassed.title = title;
      this.onModalPassed.description = description;
      this.onModalPassed.image = image;
      this.onModalPassed.isShow = isShow;
    },
    setAlert({ ...value }){
      this.onAlert = value;
    },
    resetAlert(){
      this.onAlert = {
        isShow: false,
        textAlert: "",
        iconAlert: "",
        isShowAction: false,
        variant: "",
        textAction: "",
      }
    },
    async getCredentials(){
        if(!this.coursesState?.isMoveModule) this.isLoaded = false
        this.isLoadedContent = false;
        this.isFetchStatistic = false;

        this.initiateData();

        await this.fetchAllResourcePageNeeded();

        // Assign detail course from result of fetch api list classroom course
        this.detailCourse = this.listCourses?.find(course => course?.slug === this.moduleSlug);

        // Fetch Detail Module if not in overview page and there is not data of detail module
        if(!this.moduleDetail && this.showContent !== 'overview') await this.fetchClassroomDetailModule();

        // Fetch Invoice to check whether class free or not and whether data class payment invoice is exist or not, if not exist the data it will fetch data
        if(this.classroomDetail?.price > 0 && !this.classPaymentInvoiceState) this.fetchClassPaymentInvoice();

        if(this.showContent === 'overview'){
          await this.fetchAllResourceSidebarData();
          this.isLoadedContent = true;
          this.isLoaded = true;
        }else if(this.showContent === 'course'){
          await this.fetchAllResourceSidebarData();
          this.topicDetail = this.listTopics?.find(topic => topic?.slug === this.topicSlug);
          if(this.topicDetail){
            await this.getDetailModule();
            this.isLoadedContent = true;
            this.isLoaded = true;
          }else{
            this.$router.replace({ path: `/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}` });
          }
        }else if(this.showContent === "statistic"){
          setTimeout(() => {
            this.isFetchStatistic = true;
            this.isLoaded = true;
            this.isLoadedContent = true;
          }, 50);
        }else if(this.showContent == "assignment"){
          await this.fetchAllResourceSidebarData();
          this.topicDetail = this.listTopics?.find(topic => topic?.slug === this.topicSlug);
          this.isLoaded = true;
          this.isLoadedContent = true;
        }
    },

    /**
     * Initialization data that needed in this page
     */
    initiateData(){
      // Set Slug
      this.moduleSlug = this.$route?.params?.course;
      this.classroomSlug = this.$route?.params?.classroom;
      this.topicSlug = this.$route?.params?.module;
      this.assignmentSlug = this.$route?.params?.assignment;

      // Set Information User
      this.user = JSON.parse(localStorage.getItem("user"));
      this.role = localStorage.getItem("user_kind");

      // Get Data that related in this page, if the data not exist, it's will fetch to server
      this.moduleCounter = this.classroomsState?.moduleCounter;
      this.listTopics = this.classroomsState?.listTopics;
      this.classroomDetail = this.classroomDetailState;
      this.moduleDetail = this.detailModuleState;
      this.listCourses = this.classroomsState?.listModules;
    },

    /**
     * Fetch All Resource that needed in this page before fetch main data
     */
    async fetchAllResourcePageNeeded(){
      try{
        await Promise.all([
          // Set Timer
          this.setVariableOfTimerTopic(),

          // Fetch All Resource
          ...(!this.listCourses ? [this.getListCoursesClassroom()] : []),
          ...(!this.classroomDetail ? [this.getClassroomDetail()] : []),
        ])
      }catch(error){
        console.error(error);
      }
    },

    /**
     * Fetch All Resource that needed in sidebar, like list topic and topic counter
     */
    async fetchAllResourceSidebarData(){
      try{
        await Promise.all([
          // Fetch All Resource
          this.fetchListTopics(),
          ...(this.role === 'student' ? [this.fetchModuleCounter()] : []),
        ])
      }catch(error){
        console.error(error);
      }
    },

    /**
     * Fetch All Module / Materi which assigned in that classroom
     */
    async getListCoursesClassroom(){
      
      await this.$store?.dispatch("Classrooms/getListModules", {classroomSlug: this.classroomSlug});

      if(!this.classroomsState?.status){
        console.error("Failed to fetch list courses : " + this.classroomsState?.message);
      }else{
        this.listCourses = this.classroomsState?.listModules;
      }
    },

    /**
     * Fetch List Topic
     */
    async fetchListTopics(){
        const params = {
            classroomSlug: this.classroomSlug,
            moduleUUID: this.detailCourse?.uuid,
        }

        await this.getListTopics(params);

        if(!this.classroomsState.status){
            console.error('failed fetch all topics', this.classroomsState.message);
            this.$store.commit("Classrooms/SET_LIST_TOPICS", null);
            this.listTopics = this.classroomsState?.listTopics;
            const itemAlert = {
              isShow: true,
              textAlert: this.classroomsState?.message,
              iconAlert: "ri-error-warning-line",
              isShowAction: false,
              variant: "warning",
              textAction: "",
            }
            this.setAlert(itemAlert);
        } else{
            this.listTopics = this.classroomsState?.listTopics;
            this.checkingPrevNextModule();
        }
    },
    handleActionModalConfirm(){
      if(this.typeOfModal === 'topic'){
        if(this.actionOfModal === 'publish') this.publishTopic();
        else this.deleteTopic();
      }else if(this.typeOfModal === 'module'){
        if(this.actionOfModal === 'publish') this.publishModule();
        else this.deleteModule();
      }else if(this.typeOfModal === 'assignment'){
        if(this.actionOfModal === 'delete') this.deleteAssignment();
      }
    },
    toggleConfirm(data, type = null, action = null) {
      this.isModalConfirm = !this.isModalConfirm
      this.typeOfModal = type;
      this.actionOfModal = action;
      if (this.isModalConfirm) {
          if(this.typeOfModal === 'module') this.moduleSelected = data;
          else if (this.typeOfModal === 'topic') this.topicSelected = data;
          else if(this.typeOfModal === 'assignment') this.assignmentSelected = data;
          
          if(this.actionOfModal === 'publish'){
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan ${ this.typeOfModal === "topic" ? "Modul" : "Materi" } <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.typeOfModal === "topic" ? this.topicSelected?.title : this.moduleSelected?.title }</span> ini?<h5>`
            this.modalConfirmData.btnYesVariant = 'success'
          }else{
            this.modalConfirmData.btnYesVariant = 'danger'
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus ${ this.typeOfModal === "topic" ? "Modul" : this.typeOfModal === 'assignment' ? "Tugas" : "Materi" } <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.typeOfModal === "topic" ? this.topicSelected?.title : this.typeOfModal === 'assignment' ? this.assignmentSelected?.title :this.moduleSelected?.title }</span> ini?<h5>`
          }
      } else {
          if(this.typeOfModal  === 'module') this.moduleSelected = null;
          else if (this.typeOfModal  === 'topic') this.topicSelected = null;
          else if(this.typeOfModal === 'assignment') this.assignmentSelected = null;

          this.modalConfirmData.description = ``;
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`;
      }
    },
    async deleteModule(){
      this.isModalConfirmProcess = true
      this.modalConfirmData.btnYesTitle = `Loading...`
      this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Materi <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.moduleSelected?.title }</span> ini?<h5>`

      const classroomSlug = this.$route?.params?.classroom;
      const moduleUUID = this.moduleSelected?.uuid;

      const params = {
        classroomSlug,
        moduleUUID
      }

      await this.$store.dispatch("Classrooms/removeModuleV3", params);

      if (!this.classroomsState?.status) {
          console.error("Failed to Remove the Materi : " + this.classroomsState?.message);
          this.modalConfirmData.description += `</br><p class='text-danger'>${this.classroomsState.message}</p>`
          this.isModalConfirmProcess = false
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
      } else {
        this.modalConfirmData.description += `</br><p class='text-success font-weight-bold'>Berhasil Menghapus Materi ini</p>`
        this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        this.isModalConfirmProcess = false

        setTimeout(() => {
          const classroomSlug = this.$route?.params?.classroom
          this.$router.push(`/dashboard/classroom/${classroomSlug}`);
          this.toggleConfirm(null, this.typeOfModal, 'delete');
        }, 1000);
      }
    },
    async deleteTopic() {
      this.isModalConfirmProcess = true
      this.modalConfirmData.btnYesTitle = `Loading...`
      this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Modul <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.topicSelected?.title }</span> ini?<h5>`

      const params = {
        topicId: this.topicSelected?.id,
        classroomId: this.classroomDetail?.id,
      }

      await this.$store.dispatch("Services/classroomRemoveTopic", params)

      if (!this.servicesState?.status) {
          console.error("Failed to Delete the topic : " + this.servicesState?.message);
          this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
          this.isModalConfirmProcess = false
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
      } else {
        const currentTopic = this.statusListTopics?.currentTopic?.topic;
        if(this.statusListTopics?.currentTopic?.isOverview || currentTopic?.id == this.topicSelected?.id){
          this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}`);
          this.getCredentials();
        }else{
          this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}/module/${currentTopic?.slug}`);
          this.getCredentials();
        }
        this.isModalConfirmProcess = false
        this.toggleConfirm(null, this.typeOfModal, 'delete');
      }
    },
    async getDetailModule(){
        this.isLoadedContent = false;

        const params = {
          classroomSlug: this.classroomSlug,
          topicUUID: this.topicDetail?.uuid,
        }

        await this.getDetailTopic(params);

        if(!this.classroomsState.status){
          console.error('failed fetch topics detail', this.classroomsState.message);
          const messageTopicUnlock = "Anda belum menyelesaikan module sebelumnya!";
          if(this.classroomsState?.message.toLowerCase() === messageTopicUnlock.toLowerCase()){
            this.setEvent("Module Terkunci", "Selesaikan modul ini terlebih dahulu!", true);
            const prevTopicUnlock = this.checkingPrevTopicUnlock();
            this.$router?.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}/module/${prevTopicUnlock?.slug}`);
          } else this.setEvent("Terjadi kesalahan", this.classroomsState?.message, true);
        }else{
          this.topicDetail = this.classroomsState?.detailTopic;
          
          const nextTopic = this.checkingNextTopic();
          this.listCourses = this.classroomsState?.listModules;
          const currentTopic = this.getCurrentTopicFromList();

          if(!nextTopic && !this.listCourses){
            await this.getListCourse();
          }
          
          this.checkingPrevNextModule();

          if(this.role === 'student'){
            if((nextTopic?.kind === 'course' || currentTopic?.kind === 'course') && ((nextTopic && nextTopic?.locked) || (nextTopic && !nextTopic?.locked && !currentTopic?.readed) || (!nextTopic && !currentTopic?.readed))){
              this.setTimerTopic();
              this.topicLocked.data = nextTopic && nextTopic?.locked ? nextTopic : currentTopic;
              this.topicLocked.showTimerIn = nextTopic && nextTopic?.locked ? "sidebar" : "footer";
            }else this.stopTimerTopic();
          }

          // If the currect topic is draft, it's will show alert
          if(this.topicDetail?.state === 'draft'){
            const itemAlert = {
              isShow: true,
              textAlert: "Modul ini masih dalam status draft",
              iconAlert: "",
              isShowAction: this.topicDetail?.editable,
              variant: "primary",
              textAction: "Terbitkan",
            }
            this.setAlert(itemAlert);
          }

          this.isLoadedContent = true;
        }
    },
    checkingNextTopic(){
      const indexCurrentTopic = this.listTopics.findIndex(item => item?.slug === this.topicSlug);
      const nextTopic = this.listTopics[indexCurrentTopic + 1];
      return nextTopic;
    },
    getCurrentTopicFromList(){
      return this.listTopics.find(topic => topic?.slug === this.topicSlug);
    },
    checkingPrevTopicUnlock(){
      const indexLockedTopic = this.listTopics.findIndex(item => item.locked === true);
      const prevTopicUnlock = this.listTopics[indexLockedTopic - 1];
      return prevTopicUnlock;
    },
    async fetchModuleCounter(){
      const params = {
        classroomSlug: this.classroomSlug,
        moduleSlug: this.moduleSlug,
        userId: this.user?.id
      }

      await this.$store.dispatch("Classrooms/getModuleCounter", params);

      if(!this.classroomsState.status){
        console.error('failed fetch module counter', this.classroomsState.message);
      }else{
        this.moduleCounter = this.classroomsState?.moduleCounter;
      }
    },
    handleShowHeader(){
      if(this.showContent === 'overview'){
        const buttonStartStudy = document.getElementById("start-study");
        if(buttonStartStudy){
          const buttonRect = buttonStartStudy.getBoundingClientRect();
          if(buttonRect?.top < 75) this.isHeaderShow = true
          else this.isHeaderShow = false
        }
      }
    },
    goToCreateModule(){
      const courseDetail = this.classroomsState.detailModule;
      const classroomSlug = this.$route?.params?.classroom;
      const courseSlug = this.$route?.params?.course

      localStorage.removeItem("topicId");
      localStorage.removeItem("topicUUID");

      localStorage.setItem('courseId', toEncrypt(courseDetail?.id));
      this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${courseSlug}/module/create`)
    },
    async checkingPrevNextModule(){
      if(this.showContent === 'overview'){
        this.statusListTopics.prevTopic = { active: false, topic: null, isOverview: false, data: null, typeOfList: null };

        if(this.listTopics?.length === 0 || !this.listTopics) this.statusListTopics.nextTopic = { active: false, topic: null, isOverview: false, data: null, typeOfList: null };
        else {
          const dataOfList = this.listTopics?.length === 0 || !this.listTopics ? null : this.listTopics[0]
          this.statusListTopics.nextTopic = { active: true, topic: dataOfList, isOverview: false, data: dataOfList, typeOfList: dataOfList?.kind };
        }

        this.statusListTopics.currentTopic = { active: true, topic: null, isOverview: true, typeOfList: "overview", data: null };
      }else{
        let indexList = 0;

        if(this.showContent == "assignment") indexList = this.listTopics.findIndex(item => item.slug === this.assignmentSlug);
        else indexList = this.listTopics.findIndex(item => item.slug === this.topicSlug);

        // If the current topic is at the first and the module is only one
        if(indexList == 0 && this.listTopics?.length == 1){
          const nextCourse = this.checkingNextCourse();
          const isThereNotCompletedModule = await this.checkAllModuleCompleted();

          // the button previous will set to overview
          this.statusListTopics.prevTopic = { active: true, topic: null, isOverview: true, isCourse: false, data: null, typeOfList: "overview" };

          // the button next will set to next module
          if(!!nextCourse) this.statusListTopics.nextTopic = { active: true, topic: null, isOverview: false, isCourse: true, course: nextCourse, isLastTopic: this.listTopics[indexList]?.kind === 'course', data: nextCourse, typeOfList: this.listTopics[indexList]?.kind, isModuleDone: !isThereNotCompletedModule };

          // If there is no the module, The button will set to completed topic
          else if(!(!!nextCourse) && this.moduleCounter?.totalCompletion < this.moduleCounter?.totalTopics && this.role == 'student' && this.listTopics[indexList]?.kind === 'course') this.statusListTopics.nextTopic = { active: !isThereNotCompletedModule, topic: this.listTopics[indexList], typeOfList: this.listTopics[indexList]?.kind, isOverview: false, isCourse: false, course: null, isModuleDone: !isThereNotCompletedModule, text: isThereNotCompletedModule ? '' : 'Modul Selesai', isLastTopic: true };

          // the button next will set to next topic
          else this.statusListTopics.nextTopic = { active: false, topic: this.listTopics[indexList], typeOfList: this.listTopics[indexList]?.kind, isOverview: false, isCourse: false, course: null, isModuleDone: false, isLastTopic: this.listTopics[indexList]?.kind === 'course' };


          this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexList], isOverview: false, isCourse: false, data: this.listTopics[indexList], typeOfList: this.listTopics[indexList]?.kind };

        // if the current topic is at the end
        }else if(indexList == this.listTopics?.length - 1){
          const nextCourse = this.checkingNextCourse();
          const isThereNotCompletedModule = await this.checkAllModuleCompleted();

          // the button previous will set to overview
          this.statusListTopics.prevTopic = { active: true, topic: this.listTopics[indexList - 1], isOverview: false, isCourse: false, data: this.listTopics[indexList - 1], typeOfList: this.listTopics[indexList - 1]?.kind };

          // the button next will set to next module
          if(!!nextCourse) this.statusListTopics.nextTopic = { active: true, topic: null, isOverview: false, isCourse: true, course: nextCourse, isLastTopic: this.listTopics[indexList]?.kind === 'course', data: nextCourse, typeOfList: "module", isModuleDone: !isThereNotCompletedModule };

          // If there is no the next module, The button will set to completed topic if all module is already completed but button not active when still module that not completed yet
          else if(!(!!nextCourse) && this.moduleCounter?.totalCompletion < this.moduleCounter?.totalTopics && this.role == 'student' && this.listTopics[indexList]?.kind === 'course') this.statusListTopics.nextTopic = { active: !isThereNotCompletedModule, topic: this.listTopics[indexList], isOverview: false, isCourse: false, course: null, isModuleDone: !isThereNotCompletedModule, text: isThereNotCompletedModule ? '' : 'Modul Selesai', isLastTopic: true, data: null, typeOfList: this.listTopics[indexList]?.kind };

          // the button next will set to next topic
          else this.statusListTopics.nextTopic = { active: false, topic: this.listTopics[indexList], isOverview: false, isCourse: false, course: null, isModuleDone: false, isLastTopic: this.listTopics[indexList]?.kind === 'course', data: null, typeOfList: this.listTopics[indexList]?.kind };

          this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexList], isOverview: false, isCourse: false, data: this.listTopics[indexList], typeOfList: this.listTopics[indexList]?.kind };

        // If the current topic is at the first
        }else if(indexList == 0){
          const isThereNotCompletedModule = await this.checkAllModuleCompleted();

          // the button will set to overview
          this.statusListTopics.prevTopic = { active: true, topic: null, isOverview: true, isCourse: false, data: null, typeOfList: "overview" };

          // the button will set to next topic
          this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexList + 1], isOverview: false, isCourse: false, data: this.listTopics[indexList + 1], typeOfList: this.listTopics[indexList + 1]?.kind };

          // data will set to current topic
          if(this.listTopics[indexList + 1]?.kind == 'assignment') this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexList], isOverview: false, isCourse: false, typeOfList: this.listTopics[indexList]?.kind, data: this.listTopics[indexList], isLastTopic: this.listTopics[indexList]?.kind === 'course', isModuleDone: !isThereNotCompletedModule };
          else this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexList], isOverview: false, isCourse: false, typeOfList: this.listTopics[indexList]?.kind, data: this.listTopics[indexList] };

        // if the current topic is at the between first to end
        }else if(indexList < this.listTopics?.length - 1){
          const isThereNotCompletedModule = await this.checkAllModuleCompleted();

          // The button will set to previous topic
          this.statusListTopics.prevTopic = { active: true, topic: this.listTopics[indexList - 1], isOverview: false, isCourse: false, typeOfList: this.listTopics[indexList - 1]?.kind, data: this.listTopics[indexList - 1] };

          // The button will set to next topic
          this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexList + 1], isOverview: false, isCourse: false, typeOfList: this.listTopics[indexList + 1]?.kind, data: this.listTopics[indexList + 1] };

          // data will set to current topic
          if(this.listTopics[indexList + 1]?.kind == 'assignment') this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexList], isOverview: false, isCourse: false, typeOfList: this.listTopics[indexList]?.kind, data: this.listTopics[indexList], isLastTopic: this.listTopics[indexList]?.kind === 'course', isModuleDone: !isThereNotCompletedModule };
          else if(this.listTopics[indexList + 1]?.readed) this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexList], isOverview: false, isCourse: false, typeOfList: this.listTopics[indexList]?.kind, data: this.listTopics[indexList], isLastTopic: true };
          else this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexList], isOverview: false, isCourse: false, typeOfList: this.listTopics[indexList]?.kind, data: this.listTopics[indexList] };
        }

        const nextTopic = this.checkingNextTopic();
        const currentTopic = this.getCurrentTopicFromList();

        this.statusListTopics.currentTopic.completed = (nextTopic?.kind === 'course' || currentTopic?.kind === 'course') && (nextTopic && !nextTopic?.locked && !currentTopic?.readed) || (!nextTopic && !currentTopic?.readed);
      }
    },
    startLearning(){
      const topic = this.listTopics[0];
      if(!this.classroomDetail?.registered){
        this.setEvent("Modul terkunci", "Anda belum terdaftar di kelas ini!", true);
      }else if(topic?.locked){
        this.setEvent("Modul terkunci", "Selesaikan materi sebelumnya terlebih dahulu!", true);
      }else{
        const classroomSlug = this.$route?.params?.classroom;
        const moduleSlug = this.$route?.params?.course;
        this.$store.commit("Courses/SET_IS_MOVE_MODULE", true);
        this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/module/${topic?.slug}`);
      }
    },
    async handleNextModuleLocked(item){
      const topic = item?.topic;
      const timerTopic = toDecrypt(localStorage.getItem("timerTopic"));
      let isDoneTimerTopic = timerTopic && parseInt(timerTopic) === this.defaultTimeOver;

      if(isDoneTimerTopic) {
        this.isLoadedContent = false;
        await this.fetchUnlockTopic(topic, "automatic", item?.completed);
        this.isLoadedContent = true;
        this.scrollToTop();
      }else{
        this.setEvent("Modul terkunci", this.statusListTopics?.currentTopic?.typeOfList === 'assignment' ? "Selesaikan modul sebelumnya terlebih dahulu!" : "Selesaikan modul ini terlebih dahulu!", true);
      }
    },
    /**
     * topic = object topic
     * typeUnlock = (navigate, automatic)
     */
    async fetchUnlockTopic(topic, typeUnlock = 'navigate', isCompleted = false){

      const params = {
        classroomSlug: this.classroomSlug,
        topicUUID: topic?.uuid,
      }

      if(isCompleted) params.completed = isCompleted;

      await this.getUnlockTopic(params);

      if(!this.classroomsState?.status){
        console.error(`Failed to unlock the topic : ${this.classroomsState?.message}`)
        const messageTopicUnlock = "Anda belum menyelesaikan module sebelumnya!";
        if(this.classroomsState?.message.toLowerCase() === messageTopicUnlock.toLowerCase()){
          this.setEvent("Modul terkunci", "Selesaikan modul ini terlebih dahulu!", true);
        } else this.setEvent("Terjadi kesalahan", this.classroomsState?.message, true);
      }else{
        if(typeUnlock == 'navigate'){
          this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}/module/${topic?.slug}`);
          await localStorage.removeItem("timerTopic");
          this.setTimerTopic();
        }else if(typeUnlock == 'automatic'){
          const currentTopic = this.statusListTopics?.currentTopic?.topic;
          const isThereNotCompletedModule = await this.checkAllModuleCompleted();
          
          if(!isThereNotCompletedModule && isCompleted) this.setModalPassed("Selamat !", "Anda telah berhasil menyelesaikan semua modul", '/dashboard/assets/image/icon/common/checklist.webp', true);

          await localStorage.removeItem("timerTopic");
          await this.fetchModuleCounter();
          await this.fetchListTopics(currentTopic?.id);
        }
      }
    },
    async fetchModuleDone(topic){
      const params = {
        classroomSlug: this.classroomSlug,
        completed: true,
      }

      await this.getUnlockTopic(params);

      if(!this.classroomsState?.status){
        console.error(`Failed to unlock the topic : ${this.classroomsState?.message}`)
        const messageTopicUnlock = "Anda belum menyelesaikan module sebelumnya!";
        if(this.classroomsState?.message.toLowerCase() === messageTopicUnlock.toLowerCase()){
          this.setEvent("Modul terkunci", "Selesaikan modul ini terlebih dahulu!", true);
        } else this.setEvent("Terjadi kesalahan", this.classroomsState?.message, true);
      }else{
        this.setModalPassed("Selamat !", "Anda telah berhasil menyelesaikan semua modul", '/dashboard/assets/image/icon/common/checklist.webp', true);
        await this.fetchListTopics(topic?.id);
        await this.fetchModuleCounter();
        await this.getDetailModule();
        localStorage.removeItem("timerTopic");
      }
    },
    scrollToTop(){
      window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
    },
    setVariableOfTimerTopic(){
      let timerTopic = localStorage.getItem('timerTopic');
      if(timerTopic) this.timerTopic = parseInt(toDecrypt(timerTopic));
    },
    setTimerTopic(){
      let timerTopic = localStorage.getItem('timerTopic');
      if(timerTopic){
        timerTopic = toDecrypt(timerTopic);
        if(parseInt(timerTopic) && parseInt(timerTopic) < this.defaultTimeOver){
          this.stopTimerTopic();
          localStorage.setItem("timerTopic", toEncrypt(`${this.defaultTimeOver}`));
        }else this.timerTopic = parseInt(timerTopic);
      } else this.timerTopic = this.defaultTime;

      if(!this.timerIntervalTopic && this.timerTopic > this.defaultTimeOver){
        this.timerIntervalTopic = setInterval(() => {
          this.timerTopic--;
          localStorage.setItem("timerTopic", toEncrypt(`${this.timerTopic}`));
          this.isStopTimerTopic = false;
        }, 1000);
      }
    },
    stopTimerTopic(){
      clearInterval(this.timerIntervalTopic);
      this.timerIntervalTopic = null;
      this.isStopTimerTopic = true;
    },
    goToEditModule(topic){
      if(topic?.kind == 'assignment'){
        localStorage.setItem('classId', toEncrypt(this.classroomDetail?.id))
        localStorage.setItem('assignmentId', toEncrypt(topic?.id))

        this.$router.push({path: `/dashboard/classroom/${this.classroomSlug}/assignment/${topic?.slug}/edit`});
      }else{
        const classroomSlug = this.$route?.params?.classroom;
        const courseSlug = this.$route?.params?.course;
        const courseDetail = this.classroomsState.detailModule;
  
        localStorage.setItem("topicId", toEncrypt(topic?.id));
        localStorage.setItem("topicUUID", toEncrypt(topic?.uuid));
        localStorage.setItem('courseId', toEncrypt(courseDetail?.id));
  
        this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${courseSlug}/module/${topic?.slug}/edit`);
      }
    },
    async publishTopic(){
      // const classroomId = parseInt(toDecrypt(localStorage.getItem("classroomId")));

      this.isModalConfirmProcess = true
      this.modalConfirmData.btnYesTitle = `Loading...`
      this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Modul <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.topicSelected?.title }</span> ini?<h5>`

      const params = {
        topicId: this.topicSelected?.id,
        classroomId: this.classroomDetail?.id
        // classroomId: classroomId
      }

      await this.$store.dispatch("Services/classroomPublishTopic", params)

      if (!this.servicesState?.status) {
          console.error("Failed to Delete the topic : " + this.servicesState?.message);
          this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
          this.isModalConfirmProcess = false
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
      } else {
        await this.fetchListTopics(this.topicSelected?.id);
        if(this.role === 'student') await this.fetchModuleCounter();
        await this.getDetailModule();
        this.resetAlert();
        this.isModalConfirmProcess = false
        this.toggleConfirm(null, this.typeOfModal, 'delete');
      }
    },
    topicLockedAction(){
      if(!this.classroomDetail?.registered) this.setEvent("Modul terkunci", "Anda belum terdaftar di kelas ini!", true);
      else if(this.listTopics[0]?.locked && this.moduleCounter?.totalCompletion == 0) this.setEvent("Modul terkunci", "Selesaikan materi sebelumnya terlebih dahulu!", true);
      else this.setEvent("Modul terkunci", "Selesaikan modul ini terlebih dahulu!", true);
    },
    async getListCourse(){
      const params = {
        classroomSlug: this.classroomSlug,
      }

      await this.$store.dispatch("Classrooms/getListModules", params);

      if(!this.classroomsState?.status){
        console.error("Failed to fetch List Course : " + this.classroomsState?.message);
      }else{
        this.listCourses = this.classroomsState?.listModules;
      }
    },
    checkingNextCourse(){
      if(this.listCourses){
        const indexCurrentCourse = this.listCourses?.findIndex(item => item?.slug === this.moduleSlug);
        const nextTopic = this.listCourses[indexCurrentCourse + 1];
        return nextTopic;
      }else{
        return null;
      }
    },
    async handleNextCourse(){
      const timerTopic = toDecrypt(localStorage.getItem("timerTopic"));
      let isDoneTimerTopic = timerTopic && parseInt(timerTopic) === this.defaultTimeOver;
      if(isDoneTimerTopic || (!(!!timerTopic) && this.moduleCounter?.totalCompletion == this.moduleCounter?.totalTopics)){
        this.isLoaded = false;
        this.isLoadedContent = false;
        await this.fetchUnlockCourse();
        // this.navigateToNextCourse();
        this.isLoadedContent = true;
        this.isLoaded = true;
      }else{
        this.setEvent("Modul Terkunci", "Selesaikan modul ini terlebih dahulu!", true);
      }
    },
    /**
     * typeUnlock = (navigate, automatic)
     */
    async fetchUnlockCourse(typeUnlock = 'navigate'){
      const course = this.statusListTopics?.nextTopic?.course;

      const params = {
        classroomSlug: this.classroomSlug,
        moduleUUID: course?.uuid,
      }

      await this.$store?.dispatch("Classrooms/getUnlockModule", params);

      if(!this.classroomsState?.status){
        console.error(`Failed to Unlock the module : ${this.classroomsState?.message}`);
        const itemAlert = {
          isShow: true,
          textAlert: this.classroomsState?.message,
          iconAlert: "ri-error-warning-line",
          isShowAction: false,
          variant: "warning",
          textAction: "",
        }

        this.setAlert(itemAlert);
      }else{
        if(typeUnlock === 'navigate'){
          const detailNextModule = this.classroomsState?.detailModule;
          this.$store.commit("Courses/SET_IS_MOVE_MODULE", false);

          localStorage.setItem('courseId', toEncrypt(detailNextModule.id))
          localStorage.setItem('courseUUID', toEncrypt(detailNextModule?.uuid))

          localStorage.removeItem("timerTopic");
          this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${detailNextModule?.slug}`);
        }else if(typeUnlock === 'automatic'){
          const currentTopic = this.statusListTopics?.currentTopic?.topic;
          await localStorage.removeItem("timerTopic");
          await this.getListCoursesClassroom();
          await this.fetchListTopics(currentTopic?.id);
          await this.fetchModuleCounter();
        }
      }
    },
    checkContentOverflow(){
      this.$nextTick(() => {
        const heightOfViewport = window.innerHeight;
        const positionOfContent = this.$refs?.contentOfModule?.getBoundingClientRect()?.bottom;
        this.isContentOverflow = positionOfContent > heightOfViewport;
      });
    },
    checkScrollReachedBottom(){
      this.$nextTick(() => {
        const docElement = document.documentElement;
        const scrollableHeight = docElement.scrollHeight - window.innerHeight - 140;
        const scrolled = window.scrollY;
        if (Math.ceil(scrolled) >= scrollableHeight) this.isScrollReachedBottom = true;
        // else this.isScrollReachedBottom = false;
      })
    },
    async getClassroomDetail () {
      
      await this.$store?.dispatch("Services/classroomOverview", this.classroomSlug);

      if(!this.servicesState?.status){
        console.error("Failed Fetch classroom detail : " + this.servicesState?.message);
      }else{
        this.classroomDetail = this.servicesState?.classroomDetail;
      }
    },
    async fetchClassroomDetailModule(){
        const classroomSlug = this.$route?.params?.classroom;
        const moduleUUID = this.detailCourse?.uuid;

        await this.$store?.dispatch("Classrooms/getDetailModule", { moduleUUID, classroomSlug })

        if(!this.classroomsState.status) {
            console.error('Failed get topics by module', this.classroomsState.message)
        } else {
            this.moduleDetail = this.classroomsState.detailModule;
        }
    },
    async callbackComponentLoaded(){
      await this.checkContentOverflow();
      await this.checkScrollReachedBottom();
      this.isComponentLoaded = true;
    },
    checkAutomaticallyUnlock(){
      this.$nextTick(async () => {
        if(this.showContent == 'course' && this.role === 'student'){
          const isNextTopic = !!this.statusListTopics?.nextTopic?.topic;
          let nextTopic = this.statusListTopics?.nextTopic?.topic;
          let nextCourse = this.statusListTopics?.nextTopic?.course;
          const isModuleDone = this.statusListTopics?.nextTopic?.isModuleDone;
          const currentTopic = this.statusListTopics?.currentTopic;
          const isLastTopic = this.statusListTopics?.nextTopic?.isLastTopic || this.statusListTopics?.currentTopic?.isLastTopic;

          const nextTopicLock = this.timerTopic === this.defaultTimeOver && isNextTopic && nextTopic?.locked;
          const checkCurrentTopicCompleted = this.timerTopic === this.defaultTimeOver && (isNextTopic && !nextTopic?.locked && !currentTopic?.topic?.readed) || (!isNextTopic && !currentTopic?.topic?.readed);
          const checkModuleDone = this.timerTopic === this.defaultTimeOver && isNextTopic && isModuleDone;
          const checkTopicLock = this.timerTopic === this.defaultTimeOver && isNextTopic && nextTopic?.locked;
          const isLastTopicNotComplete = this.timerTopic === this.defaultTimeOver && isLastTopic && (this.moduleCounter?.totalCompletion < this.moduleCounter?.totalTopics);
          const checkCourseLock = this.timerTopic === this.defaultTimeOver && !isNextTopic && (nextCourse?.locked || (!nextCourse?.locked && this.moduleCounter?.totalCompletion < this.moduleCounter?.totalTopics));

          const handleAfterUnlock = (type) => {
            const updatedTopicOrCourse = this.statusListTopics?.nextTopic?.[type];
              if(updatedTopicOrCourse?.locked){
                this.setTimerTopic();
              }else{
                this.stopTimerTopic();
                this.timerTopic = this.defaultTime;
              }
          }

          if(this.isContentOverflow){
            if(this.isScrollReachedBottom && nextTopicLock){
              await this.fetchUnlockTopic(nextTopic, "automatic");
              handleAfterUnlock('topic');
            }else if (this.isScrollReachedBottom && checkCurrentTopicCompleted) {
              await this.fetchUnlockTopic(currentTopic?.topic, "automatic", currentTopic?.completed);
              handleAfterUnlock("topic");
            }
            // if(this.isScrollReachedBottom && checkModuleDone){
            //   await this.fetchUnlockTopic(currentTopic, "automatic", true);
            //   handleAfterUnlock('topic');
            // }else if (this.isScrollReachedBottom && checkTopicLock) {
            //   await this.fetchUnlockTopic(nextTopic, "automatic");
            //   handleAfterUnlock("topic");
            // }else if(this.isScrollReachedBottom && isLastTopicNotComplete){
            //   await this.fetchUnlockTopic(currentTopic, "automatic", true);
            //   handleAfterUnlock("topic");
            // }else if(this.isScrollReachedBottom && checkCourseLock){
            //   await this.fetchUnlockCourse("automatic");
            //   handleAfterUnlock("course");
            // }
          }else if(!this.isContentOverflow){
            if(nextTopicLock){
              await this.fetchUnlockTopic(nextTopic, "automatic");
              handleAfterUnlock("topic");
            }else if(checkCurrentTopicCompleted){
              await this.fetchUnlockTopic(currentTopic?.topic, "automatic", currentTopic?.completed);
              handleAfterUnlock("topic");
            }
            // if(checkModuleDone){
            //   await this.fetchUnlockTopic(currentTopic, "automatic", true);
            //   handleAfterUnlock("topic");
            // }else if(checkTopicLock){
            //   await this.fetchUnlockTopic(nextTopic, "automatic");
            //   handleAfterUnlock("topic");
            // }else if(this.isScrollReachedBottom && isLastTopicNotComplete){
            //   await this.fetchUnlockTopic(currentTopic, "automatic", true);
            //   handleAfterUnlock("topic");
            // }else if(checkCourseLock){
            //   await this.fetchUnlockCourse("automatic");
            //   handleAfterUnlock("course");
            // }
          }
        }
      })
    },
    async checkAllModuleCompleted(){
      this.moduleCounterList = this.classroomsState?.moduleCounterList;

      // If there is not data counter list, it's will to fetch
      if(!this.moduleCounterList) await this.fetchModuleCounterList();

      // Get another counter module without the active counter module
      const otherModuleCounter = this.moduleCounterList.filter((module) => module?.id != this.detailCourse?.id);

      // Checking is there the module that still not completed yet
      const isThereNotCompletedModule = otherModuleCounter.find(module => module?.totalCompletion != module?.totalTopics);
      
      // This will return boolean if there is module that still not completed yet
      return !!isThereNotCompletedModule;
    },
    async fetchModuleCounterList(){
      const params = {
        classroomSlug: this.classroomSlug,
        userId: this.user?.id,
      }

      await this.getModuleCounterList(params);

      if(!this.classroomsState?.status){
        console.error("Failed to fetch module counter list" + this.classroomsState?.message);
      }else{
        this.moduleCounterList = this.classroomsState?.moduleCounterList;
      }
    },
    async publishModule(){
      this.isModalConfirmProcess = true
      this.modalConfirmData.btnYesTitle = `Loading...`
      this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan Materi <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.moduleSelected?.title }</span> ini?<h5>`;

      const params = {
        moduleId: this.moduleSelected?.id,
        classroomId: this.classroomDetail?.id,
      }

      await this.$store.dispatch("Services/classroomPublishModule", params);

      if (!this.servicesState?.status) {
        console.error("Failed to Delete the topic : " + this.servicesState?.message);
        this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
        this.isModalConfirmProcess = false
        this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
      } else {
        const isOverview = this.statusListTopics?.currentTopic?.isOverview;
        const topicSelected = this.statusListTopics?.currentTopic?.topic;

        this.isLoaded = false;
        this.isLoadedContent = false;

        try{
          if(isOverview){
            await Promise.all([
              this.fetchClassroomDetailModule(),
              this.fetchListTopics()
            ])
          }else{
            await Promise.all([
              this.getDetailModule(),
              this.fetchListTopics(topicSelected?.id)
            ])
          }

          this.isLoaded = true;
          this.isLoadedContent = true;
        }catch(error){
          this.isLoaded = true;
          this.isLoadedContent = true;
          console.error(error);
        }

        this.isModalConfirmProcess = false
        this.toggleConfirm(null, this.typeOfModal, 'publish');
      }
    },
    async deleteAssignment() {
      this.isModalConfirmProcess = true
      this.modalConfirmData.btnYesTitle = `Loading...`
      this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Tugas <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.assignmentSelected?.title }</span> ini?<h5>`

      const params = {
          classroomId: this.classroomDetail?.id,
          topicId: this.assignmentSelected?.id
      }

      await this.$store.dispatch("Assignments/delete", params);

      if(!this.assignmentsState?.status){
        console.error("Failed to Remove the Materi : " + this.assignmentsState?.message);
        this.modalConfirmData.description += `</br><p class='text-danger'>${this.assignmentsState.message}</p>`
        this.isModalConfirmProcess = false
        this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
      }else{
        this.modalConfirmData.description += `</br><p class='text-success font-weight-bold'>Berhasil Menghapus Materi ini</p>`
        this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        this.isModalConfirmProcess = false

        if(this.assignmentSlug === this.assignmentSelected?.slug){
          this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}`);
        }else{
          this.getCredentials();
        }

        this.toggleConfirm(null, this.typeOfModal, 'delete');
      }
    },
  },
  beforeDestroy(){
    this.stopTimerTopic();
  },
  destroyed(){
    this.$store.dispatch("Layouts/setActiveBadge", null);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/courses/detail-module.scss";
</style>