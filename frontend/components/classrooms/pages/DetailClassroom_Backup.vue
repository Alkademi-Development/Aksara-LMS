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
        @topicLockedAction="topicLockedAction"
        @onClickCreateModule="goToCreateModule"
        @onClickStatistic="showContent = $event"
        @onClickDelete="toggleConfirm($event, 'topic', 'delete')"
        @onClickEdit="goToEditModule($event)"
      />
      <div id="wrapper-content" class="content-module px-md-0 w-100">
        <HeaderStartStudy
          v-if="showContent == 'overview' && role === 'student'"
          :isShow="isHeaderShow"
          :isFromClass="true"
          fromPositionTop="25px"
          topPositionTop="119px"
          @startLearning="startLearning"
        />
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
          <template v-if="isLoadedContent">
            <div ref="contentOfModule">
              <SectionStatisticModule
                v-if="showContent === 'statistic'"
              />
              <DetailCourse
                v-if="showContent === 'overview'"
                :slug="moduleSlug"
                :isFromClass="true"
                :totalTopics="moduleCounter?.totalTopics"
                @startLearning="startLearning"
                @callbackLoaded="checkContentOverflow"
              />
              <template v-if="showContent === 'course'">
                <template v-if="topicDetail">
                  <div v-if="topicDetail?.type === 'editor'" class="bg-white border rounded px-5 py-2 mb-4">
                    <CardContentModule
                      :isLoaded="isLoadedContent"
                      :topicDetail="topicDetail"
                      @callbackLoaded="checkContentOverflow"
                    />
                  </div>
                  <template v-else>
                    <CardContentOldModule
                      :isLoaded="isLoadedContent"
                      :topicDetail="topicDetail"
                      :isFromClass="true"
                      @callbackLoaded="checkContentOverflow"
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
            <FooterActionModule
              :isLoaded="isLoadedContent"
              :prevTopic="statusListTopics?.prevTopic"
              :nextTopic="statusListTopics?.nextTopic"
              :isFromClass="true"
              @onActionModuleLocked="handleNextModuleLocked($event)"
              @onActionModuleDone="handleNextModuleLocked($event)"
              @nextCourse="handleNextCourse"
              :isShowButtonScroll="isContentOverflow"
            />
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

import { mapActions, mapState } from 'vuex';
import { toDecrypt, toEncrypt } from '~/commons/utils';
import ModalLockTopic from '@/components/template/micro/modal/ModalLockTopic.vue';
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import AlertModule from '~/components/template/micro/alert/AlertModule.vue';

export default {
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
    AlertModule
  },
  computed: {
      ...mapState({
          servicesState: (state) => state.Services,
          classroomDetailState: (state) => state?.Services?.classroomDetail,
          coursesState: (state) => state.Courses,
          classroomsState: (state) => state.Classrooms,
          detailModuleState: (state) => state?.Classrooms?.detailModule,
      }),
  },

  data() {
      return {
          isLoaded: true,
          isLoadedContent: true,
          listTopics: [],
          
          moduleSlug: "",
          classroomSlug: "",
          topicDetail: null,
          showContent: "",
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

          timerIntervalTopic: null,
          timerTopic: 0,
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
      }
  },
  watch: {
    showContent(newValue){
      if(newValue === 'overview') window.addEventListener('scroll', this.handleShowHeader), this.checkingPrevNextModule();
    },
    timerTopic(timer){
      if(timer === 60) this.stopTimerTopic();
      else if(timer > 60) this.stopTimerTopic(), localStorage.setItem("timerTopic", toEncrypt("60"));
      // else if(timer > 60) this.stopTimerTopic(), localStorage.removeItem("timerTopic");
    },
    isModalConfirm(newValue){
      if(this.typeOfModal == 'module') this.$store.commit("Courses/SET_ISDELETECOURSE", newValue);
    },
    coursesState: {
      handler(newValue){
        if(newValue?.isDeleteCourse){
          const detailModule = this.classroomsState.detailModule;
          this.toggleConfirm(detailModule, "module", 'delete');
        }
        this.isModalConfirm = newValue.isDeleteCourse;
      },
      deep: true,
    },
    isLoadedContent(isLoaded){
      if(isLoaded){
        this.checkContentOverflow();
      }
    }
  },
  created() {
    this.getCredentials();
  },
  mounted(){
    window.addEventListener('scroll', this.handleShowHeader);
  },
  methods: {
    ...mapActions({
        getListTopics: 'Classrooms/getListTopics',
        getDetailTopic: `Classrooms/getDetailTopic`,
        getUnlockTopic: 'Classrooms/getUnlockTopic',
    }),
    setEvent(title = "", message, status) {
      this.onEvent.title = title;
      this.onEvent.message = message;
      this.onEvent.isShow = status;
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
    // async getCredentials() {
    //   this.moduleSlug = this.$route?.params?.course;
    //   this.classroomSlug = this.$route?.params?.classroom;
    //   this.topicSlug = this.$route?.params?.module;
    //   this.user = JSON.parse(localStorage.getItem("user"));
    //   this.role = localStorage.getItem("user_kind");
    //   this.topicFromLocalStorage = localStorage.getItem("topic");
    //   this.topicFromLocalStorage = this.topicFromLocalStorage ? JSON.parse(toDecrypt(this.topicFromLocalStorage)) : this.topicFromLocalStorage;
    //   this.showContent = this.topicSlug && this.topicFromLocalStorage ? "course" : "overview";
    //   this.moduleCounter = this.classroomsState?.moduleCounter;
    //   this.listTopics = this.classroomsState?.listTopics;

    //   if(this.showContent === "course"){
    //     if(!this.topicSlug && !this.topicFromLocalStorage) this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}`);
    //     else{
    //       if(this.topicFromLocalStorage?.slug === this.topicSlug){
    //           this.fetchAllContentDetailModule();
    //       }else{
    //         const getTopic = this.listTopics?.find((topic) => topic?.slug == this.topicSlug);
    //         if(getTopic){
    //           const topics = { slug: getTopic?.slug, uuid: getTopic?.uuid };
    //           this.topicFromLocalStorage = topics;
    //           localStorage.setItem("topic", toEncrypt(JSON.stringify(topics)));
    //           this.fetchAllContentDetailModule();
    //         }else{
    //           this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}`);
    //         }
    //       }
    //     }
    //   }else if(this.showContent === 'overview'){
    //       this.fetchAllContentDetailOverview();
    //   }
    // },
    async getCredentials(){
        this.moduleSlug = this.$route?.params?.course;
        this.classroomSlug = this.$route?.params?.classroom;
        this.topicSlug = this.$route?.params?.module;
        this.user = JSON.parse(localStorage.getItem("user"));
        this.role = localStorage.getItem("user_kind");
        this.showContent = this.topicSlug ? "course" : "overview";
        this.moduleCounter = this.classroomsState?.moduleCounter;
        this.listTopics = this.classroomsState?.listTopics;

        this.listCourses = this.classroomsState?.listModules;
        if(!this.listCourses) await this.getListCoursesClassroom();
        this.detailCourse = this.listCourses.find(course => course?.slug === this.moduleSlug);

        if(!this.classroomDetailState) this.getClassroomDetail();
        if(!this.detailModuleState) this.fetchClassroomDetailModule();

        if(this.showContent === 'overview'){
          this.fetchAllContentDetailOverview();
        }else if(this.showContent === 'course'){
          if(!this.coursesState?.isMoveModule) this.isLoaded = false
          this.isLoadedContent = false;
          await this.fetchListTopics();
          this.topicDetail = this.listTopics?.find(topic => topic?.slug === this.topicSlug);
          if(this.topicDetail){
            await this.fetchModuleCounter();
            await this.getDetailModule();
          }else{
            this.listTopics = null;
            this.moduleCounter = null;
            this.topicDetail = null;
          }
          this.isLoadedContent = true;
          if(!this.coursesState?.isMoveModule) this.isLoaded = true
        }
    },
    async getListCoursesClassroom(){
      
      await this.$store?.dispatch("Classrooms/getListModules", {classroomSlug: this.classroomSlug});

      if(!this.classroomsState?.status){
        console.error("Failed to fetch list courses : " + this.classroomsState?.message);
      }else{
        this.listCourses = this.classroomsState?.listModules;
      }
    },
    async fetchListTopics(topicId = null){
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
            // this.setEvent("", this.classroomsState.message, true);
            this.setAlert(itemAlert);
        } else{
            this.listTopics = this.classroomsState?.listTopics;
            // if(this.listTopics) this.checkingPrevNextModule(topicId);
            this.checkingPrevNextModule(topicId);
        }
    },
    handleActionModalConfirm(){
      if(this.typeOfModal === 'topic'){
        if(this.actionOfModal === 'publish') this.publishTopic();
        else this.deleteTopic();
      }else if(this.typeOfModal === 'module') this.deleteModule();
    },
    toggleConfirm(data, type = null, action = null) {
      this.isModalConfirm = !this.isModalConfirm
      this.typeOfModal = type;
      this.actionOfModal = action;
      if (this.isModalConfirm) {
          if(this.typeOfModal === 'module') this.moduleSelected = data;
          else if (this.typeOfModal === 'topic') this.topicSelected = data;
          if(this.actionOfModal === 'publish'){
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan ${ this.typeOfModal === "topic" ? "Modul" : "Materi" } <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.typeOfModal === "topic" ? this.topicSelected?.title : this.moduleSelected?.title }</span> ini?<h5>`
            this.modalConfirmData.btnYesVariant = 'success'
          }else{
            this.modalConfirmData.btnYesVariant = 'danger'
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus ${ this.typeOfModal === "topic" ? "Modul" : "Materi" } <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.typeOfModal === "topic" ? this.topicSelected?.title : this.moduleSelected?.title }</span> ini?<h5>`
          }
      } else {
          if(this.typeOfModal  === 'module') this.moduleSelected = null;
          else if (this.typeOfModal  === 'topic') this.topicSelected = null;
          this.modalConfirmData.description = ``;
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`;
      }
    },
    async fetchAllContentDetailModule(){
      if(!this.coursesState?.isMoveModule) this.isLoaded = false
      this.isLoadedContent = false;
      if(!this.classroomDetailState) this.getClassroomDetail();
      if(!this.detailModuleState) this.fetchClassroomDetailModule();
      await this.fetchListTopics()
      // await this.checkingUnlockFirstTopic();
      await this.fetchModuleCounter();
      await this.getDetailModule();
      this.isLoadedContent = true;
      if(!this.coursesState?.isMoveModule) this.isLoaded = true
    },
    async fetchAllContentDetailOverview(){
      if(!this.coursesState?.isMoveModule) this.isLoaded = false
      this.isLoadedContent = false;
      if(!this.classroomDetailState) this.getClassroomDetail();
      await this.fetchListTopics()
      await this.fetchModuleCounter();
      // await this.checkingUnlockFirstTopic();
      this.isLoadedContent = true;
      if(!this.coursesState?.isMoveModule) this.isLoaded = true
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
      const classroomId = parseInt(toDecrypt(localStorage.getItem("classroomId")));

      this.isModalConfirmProcess = true
      this.modalConfirmData.btnYesTitle = `Loading...`
      this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Modul <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.topicSelected?.title }</span> ini?<h5>`

      const params = {
        topicId: this.topicSelected?.id,
        classroomId: classroomId
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
          this.fetchAllContentDetailOverview();
        }else{
          this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}/module/${currentTopic?.slug}`);
          this.fetchAllContentDetailModule();
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
            this.getDetailModule(prevTopicUnlock);
          } else this.setEvent("", this.classroomsState?.message, true);
        }else{
          this.topicDetail = this.classroomsState?.detailTopic;
          
          const nextTopicExist = this.checkingNextTopic(this.topicDetail);
          this.listCourses = this.classroomsState?.listModules;
          if(!nextTopicExist && !this.listCourses){
            await this.getListCourse();
          }
          
          this.checkingPrevNextModule(this.topicDetail?.id);

          if(this.role === 'student'){
            // const { totalCompletion, totalTopics } = this.moduleCounter;
            // const nextTopic = this.checkingNextTopic(this.topicDetail);
            // const nextCourse = this.statusListTopics?.nextTopic?.course;
            // const nextState = this.statusListTopics?.nextTopic;
            // if(nextTopic?.locked) this.setTimerTopic();
            // // else if(!nextTopic?.locked) this.stopTimerTopic();
            // else if(nextState?.isCourse && (totalCompletion < totalTopics)) this.setTimerTopic();
            // // else if(nextCourse && (totalCompletion < totalTopics)) this.setTimerTopic();
            // // else if(nextCourse?.locked && (totalCompletion < totalTopics)) this.setTimerTopic();
            // // else if(!nextCourse && totalCompletion < totalTopics) this.setTimerTopic();
            // else this.stopTimerTopic();

            const { totalCompletion, totalTopics } = this.moduleCounter;
            const nextTopic = this.checkingNextTopic(this.topicDetail);
            const nextCourse = this.statusListTopics?.nextTopic?.course;
            if(nextTopic?.locked) this.setTimerTopic();
            else if(nextCourse?.locked && (totalCompletion < totalTopics)) this.setTimerTopic();
            else if(!nextCourse && totalCompletion < totalTopics) this.setTimerTopic();
            else this.stopTimerTopic();
          }
          if(this.topicDetail?.state === 'draft'){
            const itemAlert = {
              isShow: true,
              textAlert: "Modul ini masih dalam status draft",
              iconAlert: "",
              isShowAction: true,
              variant: "primary",
              textAction: "Terbitkan",
            }
            this.setAlert(itemAlert);
          }
          this.isLoadedContent = true;
        }
    },
    checkingNextTopic(currentTopic){
      const indexCurrentTopic = this.listTopics.findIndex(item => item?.id === currentTopic?.id);
      const nextTopic = this.listTopics[indexCurrentTopic + 1];
      return nextTopic;
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

      localStorage.setItem('courseId', toEncrypt(courseDetail?.id));
      this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${courseSlug}/module/create`)
    },
    checkingPrevNextModule(topicId = null){
      if(this.showContent === 'overview'){
        this.statusListTopics.prevTopic = { active: false, topic: null, isOverview: false };
        if(this.listTopics?.length === 0 || !this.listTopics) this.statusListTopics.nextTopic = { active: false, topic: null, isOverview: false };
        else this.statusListTopics.nextTopic = { active: true, topic: this.listTopics?.length === 0 || !this.listTopics ? null : this.listTopics[0], isOverview: false };
        this.statusListTopics.currentTopic = { active: true, topic: null, isOverview: true };
      }else{
        const indexTopic = this.listTopics.findIndex(item => item.id === topicId)
        if(indexTopic == 0 && this.listTopics?.length == 1){
          const courseId = localStorage.getItem("courseId");
          const nextCourse = this.checkingNextCourse(courseId ? parseInt(toDecrypt(courseId)) : null);
          const { totalCompletion, totalTopics } = this.moduleCounter;
          this.statusListTopics.prevTopic = { active: true, topic: null, isOverview: true, isCourse: false };
          if(!!nextCourse) this.statusListTopics.nextTopic = { active: true, topic: null, isOverview: false, isCourse: true, course: nextCourse };
          else if(!(!!nextCourse) && totalCompletion < totalTopics) this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false, course: null, isModuleDone: true, text: "Modul Selesai" };
          else this.statusListTopics.nextTopic = { active: false, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false, course: null, isModuleDone: false };
          this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false };
        }
        else if(indexTopic == this.listTopics?.length - 1){
          const courseId = localStorage.getItem("courseId");
          const nextCourse = this.checkingNextCourse(courseId ? parseInt(toDecrypt(courseId)) : null);
          const { totalCompletion, totalTopics } = this.moduleCounter;
          this.statusListTopics.prevTopic = { active: true, topic: this.listTopics[indexTopic - 1], isOverview: false, isCourse: false };
          if(!!nextCourse) this.statusListTopics.nextTopic = { active: true, topic: null, isOverview: false, isCourse: true, course: nextCourse };
          else if(!(!!nextCourse) && totalCompletion < totalTopics) this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false, course: null, isModuleDone: true, text: "Modul Selesai" };
          else this.statusListTopics.nextTopic = { active: false, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false, course: null, isModuleDone: false };
          // this.statusListTopics.nextTopic = { active: !!nextCourse, topic: null, isOverview: false, isCourse: true, course: nextCourse };
          this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false };
        }
        else if(indexTopic == 0){
          this.statusListTopics.prevTopic = { active: true, topic: null, isOverview: true, isCourse: false };
          this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexTopic + 1], isOverview: false, isCourse: false };
          this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false };
        }
        else if(indexTopic < this.listTopics?.length - 1){
          this.statusListTopics.prevTopic = { active: true, topic: this.listTopics[indexTopic - 1], isOverview: false, isCourse: false };
          this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexTopic + 1], isOverview: false, isCourse: false };
          this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, isCourse: false };
        }
      }
    },
    startLearning(){
      const topic = this.listTopics[0];
      if(topic?.locked){
        this.setEvent("Modul terkunci", "Selesaikan materi sebelumnya terlebih dahulu!", true);
      }else{
        const classroomSlug = this.$route?.params?.classroom;
        const moduleSlug = this.$route?.params?.course;
        const topics = { slug: topic?.slug, uuid: topic?.uuid };
        localStorage.setItem("topic", toEncrypt(JSON.stringify(topics)));
        this.$store.commit("Courses/SET_IS_MOVE_MODULE", true);
        this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/module/${topic?.slug}`);
        // this.getDetailModule(module);
      }
    },
    async handleNextModuleLocked(item){
      const topic = item?.topic;
      const timerTopic = toDecrypt(localStorage.getItem("timerTopic"));
      let isDoneTimerTopic = timerTopic && parseInt(timerTopic) === 60;

      if(isDoneTimerTopic) {
        this.isLoadedContent = false;
        if(item?.isModuleDone) await this.fetchModuleDone(topic);
        else await this.fetchUnlockTopic(topic);
        this.isLoadedContent = true;
        this.scrollToTop();
      }else{
        this.setEvent("Modul terkunci", "Selesaikan modul ini terlebih dahulu!", true);
      }
    },
    async fetchUnlockTopic(topic, isUnlockFirstTopic = false){
      const params = {
        classroomSlug: this.classroomSlug,
        topicUUID: topic?.uuid,
      }

      await this.getUnlockTopic(params);

      if(!this.classroomsState?.status){
        console.error(`Failed to unlock the topic : ${this.classroomsState?.message}`)
        const messageTopicUnlock = "Anda belum menyelesaikan module sebelumnya!";
        if(this.classroomsState?.message.toLowerCase() === messageTopicUnlock.toLowerCase()){
          this.setEvent("Modul terkunci", "Selesaikan modul ini terlebih dahulu!", true);
        } else this.setEvent("", this.classroomsState?.message, true);
      }else{
        if(!isUnlockFirstTopic){
          const topics = { slug: topic?.slug, uuid: topic?.uuid };
          localStorage.setItem("topic", toEncrypt(JSON.stringify(topics)));
          this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${this.moduleSlug}/module/${topic?.slug}`);
          // this.topicDetail = this.classroomsState?.unlockTopic;
          // this.fetchListTopics(this.topicDetail?.id);
          // this.fetchModuleCounter();
          await localStorage.removeItem("timerTopic");
          this.setTimerTopic();
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
        } else this.setEvent("", this.classroomsState?.message, true);
      }else{
        const topics = { slug: topic?.slug, uuid: topic?.uuid };
        localStorage.setItem("topic", toEncrypt(JSON.stringify(topics)));
        await this.fetchListTopics(topic?.id);
        await this.fetchModuleCounter();
        await this.getDetailModule(topic);
        await localStorage.removeItem("timerTopic");
      }
    },
    scrollToTop(){
      window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
    },
    setTimerTopic(){
      const timerTopic = toDecrypt(localStorage.getItem('timerTopic'));
      if(timerTopic){
        if(parseInt(timerTopic) && parseInt(timerTopic) > 60){
          this.stopTimerTopic();
          localStorage.setItem("timerTopic", toEncrypt("60"));
        }else this.timerTopic = parseInt(timerTopic);
      } else this.timerTopic = 0;

      if(!this.timerIntervalTopic){
        this.timerIntervalTopic = setInterval(() => {
          this.timerTopic++;
          localStorage.setItem("timerTopic", toEncrypt(this.timerTopic));
        }, 1000);
      }
    },
    stopTimerTopic(){
      clearInterval(this.timerIntervalTopic);
      this.timerIntervalTopic = null;
    },
    goToEditModule(topic){
      const classroomSlug = this.$route?.params?.classroom;
      const courseSlug = this.$route?.params?.course;
      const courseDetail = this.classroomsState.detailModule;

      localStorage.setItem("topicId", toEncrypt(topic?.id));
      localStorage.setItem("topicUUID", toEncrypt(topic?.uuid));
      localStorage.setItem('courseId', toEncrypt(courseDetail?.id));

      this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${courseSlug}/module/${topic?.slug}/edit`);
    },
    async publishTopic(){
      const classroomId = parseInt(toDecrypt(localStorage.getItem("classroomId")));

      this.isModalConfirmProcess = true
      this.modalConfirmData.btnYesTitle = `Loading...`
      this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Modul <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.topicSelected?.title }</span> ini?<h5>`

      const params = {
        topicId: this.topicSelected?.id,
        classroomId: classroomId
      }

      await this.$store.dispatch("Services/classroomPublishTopic", params)

      if (!this.servicesState?.status) {
          console.error("Failed to Delete the topic : " + this.servicesState?.message);
          this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
          this.isModalConfirmProcess = false
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
      } else {
        await this.fetchListTopics(this.topicSelected?.id);
        await this.fetchModuleCounter();
        await this.getDetailModule(this.topicSelected);
        this.resetAlert();
        this.isModalConfirmProcess = false
        this.toggleConfirm(null, this.typeOfModal, 'delete');
      }
    },
    topicLockedAction(){
      if(this.listTopics[0]?.locked && this.moduleCounter?.totalCompletion == 0) this.setEvent("Modul terkunci", "Selesaikan materi sebelumnya terlebih dahulu!", true);
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
    checkingNextCourse(courseId){
      if(courseId && this.listCourses){
        const indexCurrentCourse = this.listCourses?.findIndex(item => item?.id === courseId);
        const nextTopic = this.listCourses[indexCurrentCourse + 1];
        return nextTopic;
      }else{
        return null;
      }
    },
    async handleNextCourse(){
      const timerTopic = toDecrypt(localStorage.getItem("timerTopic"));
      let isDoneTimerTopic = timerTopic && parseInt(timerTopic) === 60;
      const { totalCompletion, totalTopics } = this.moduleCounter;
      if(isDoneTimerTopic || (!(!!timerTopic) && totalCompletion == totalTopics)){
        this.isLoaded = false;
        this.isLoadedContent = false;
        await this.fetchUnlockCourse();
        // this.navigateToNextCourse();
        this.isLoadedContent = true;
        this.isLoaded = true;
      }else{
        this.setEvent("Modul Terkunci", "Selesaikan modul ini terlebih dahulu!", true);
      }
      // this.isLoaded = false;
      // this.isLoadedContent = false;
      // await this.fetchUnlockCourse();
      // this.isLoadedContent = true;
      // this.isLoaded = true;
    },
    async fetchUnlockCourse(){
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
        const detailNextModule = this.classroomsState?.detailModule;
        this.$store.commit("Courses/SET_IS_MOVE_MODULE", false);

        localStorage.setItem('courseId', toEncrypt(detailNextModule.id))
        localStorage.setItem('courseUUID', toEncrypt(detailNextModule?.uuid))

        localStorage.removeItem("timerTopic");
        this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${detailNextModule?.slug}`);
      }
    },
    checkContentOverflow(){
      this.$nextTick(() => {
        const heightOfViewport = window.innerHeight;
        const positionOfContent = this.$refs?.contentOfModule?.getBoundingClientRect()?.bottom;
        this.isContentOverflow = positionOfContent > heightOfViewport;
      });
    },
    async checkingUnlockFirstTopic(){
      const isUnlockFirstTopic = localStorage.getItem("isUnlockFirstTopic");
      if(JSON.parse(isUnlockFirstTopic) && this.listTopics[0]?.locked){
        await this.fetchUnlockTopic(this.listTopics[0], true);
        await this.fetchListTopics();
        localStorage.removeItem("isUnlockFirstTopic");
      }
      else localStorage.removeItem("isUnlockFirstTopic");
    },
    navigateToNextCourse(){
      const course = this.statusListTopics?.nextTopic?.course;
      
      localStorage.setItem("isUnlockFirstTopic", true);
      localStorage.setItem('courseId', toEncrypt(course.id))
      localStorage.setItem('courseUUID', toEncrypt(course?.uuid))
      localStorage.removeItem("timerTopic");

      this.$store.commit("Courses/SET_IS_MOVE_MODULE", false);
      this.$router.push(`/dashboard/classroom/${this.classroomSlug}/course/${course?.slug}`);
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
        const moduleUUID = toDecrypt(localStorage.getItem("courseUUID"));

        await this.$store?.dispatch("Classrooms/getDetailModule", { moduleUUID, classroomSlug })

        if(!this.classroomsState.status) {
            console.error('Failed get topics by module', this.classroomsState.message)
        } else {
            this.moduleDetail = this.classroomsState.detailModule;
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
