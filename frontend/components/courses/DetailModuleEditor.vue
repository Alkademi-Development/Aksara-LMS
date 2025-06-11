<template>
  <div>
    <div class="d-flex">
      <SidebarModule
        :isLoaded="isLoaded"
        :listItem="listTopics"
        :statusListTopics="statusListTopics"
        :showContent="showContent"
        :isShowButtonCreateModule="isShowButtonCreateModule"
        @onClickCreateModule="goToCreateModule"
        @onClickStatistic="showContent = $event"
        @onClickEdit="goToEditTopic($event)"
        @onClickDelete="toggleConfirm($event, 'topic', 'delete')"
        @topicLockedAction="topicLockedAction"
      />
      <div class="content-module px-md-0">
        <HeaderStartStudy
          v-if="showContent === 'overview' && role === 'student'"
          :isShow="isHeaderShow"
          topPositionTop="119px"
          fromPositionTop="25px"
        />
        <!-- ALERT IF THE MODULE IS DRAFT -->
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
          <div style="max-width: 960px; margin: 0 auto; overflow: hidden;">
            <template v-if="isLoadedContent">
              <div ref="contentOfModule">
                <SectionStatisticModule
                  v-if="showContent === 'statistic'"
                />
                <DetailCourse
                  v-if="showContent === 'overview'"
                  :slug="moduleSlug"
                  :totalTopics="listTopics?.length"
                  @passModuleAdded="passModuleAdded"
                  @courseNotFound="setAlert($event)"
                  @callbackLoaded="checkContentOverflow"
                />
                <template v-if="showContent === 'course'">
                  <template v-if="topicDetail">
                    <div v-if="topicDetail?.type === 'editor'" class="bg-white border rounded px-3 px-md-4 px-lg-5 py-2 mb-4">
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
              <template v-if="detailModuleState?.owned">
                <FooterActionModule
                  v-if="showContent !== 'statistic' || topicDetail"
                  :isLoaded="isLoadedContent"
                  :prevTopic="statusListTopics?.prevTopic"
                  :nextTopic="statusListTopics?.nextTopic"
                  :isShowButtonScroll="isContentOverflow"
                />
              </template>
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
      </div>
    </div>
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
      v-model="onEvent.isShow"
      size="sm" 
      centered 
      hide-header 
      hide-footer
    >
      <ModalAlert
        :title="onEvent?.title"
        :description="onEvent?.description"
        :icon="onEvent?.icon"
        :typeOfAlert="onEvent?.typeOfAlert"
      />
    </b-modal>
  </div>
</template>

<script>
import TiptapEditor from '@/components/editor/micro/TiptapEditor.vue'
import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue";
import FooterActionModule from '@/components/courses/micro/FooterActionModule.vue';
import SidebarModule from '@/components/template/micro/sidebar/SidebarModule.vue';
import DetailCourse from '@/components/courses/DetailCourse.vue';
import CardContentModule from '@/components/template/micro/card/CardContentModule.vue'
import HeaderStartStudy from '@/components/template/micro/header/HeaderStartStudy.vue';
import SectionStatisticModule from '@/components/template/micro/section/SectionStatisticModule.vue'
import CardContentOldModule from '@/components/template/micro/card/CardContentOldModule.vue';
import ModalAlert from '@/components/template/micro/modal/ModalAlert.vue';
import AlertModule from '~/components/template/micro/alert/AlertModule.vue';

import { FIELDS_FILTER_USERS } from '~/commons/constants/forms';

import { mapActions, mapState } from 'vuex';

import { toDecrypt, toEncrypt } from '~/commons/utils';

export default {
  components: {
    TiptapEditor,
    ModalConfirmation,
    FooterActionModule,
    SidebarModule,
    DetailCourse,
    CardContentModule,
    HeaderStartStudy,
    SectionStatisticModule,
    CardContentOldModule,
    ModalAlert,
    AlertModule
  },
  computed: {
      ...mapState({
          servicesState: (state) => state.Services,
          coursesState: (state) => state.Courses,
          getActiveTab: (state) => state?.Layouts?.activeTab,
          detailModuleState: (state) => state?.Services?.moduleDetail,
          isPublishMateriDraftState: (state) => state?.Courses?.isPublishMateriDraft,
          isDeleteCourseState: (state) => state?.Courses?.isDeleteCourse,
      }),
      isShowButtonCreateModule(){
        return this.role === 'superadmin';
        // return this.role === 'superadmin' && this.getActiveTab === 'library';
        // return this.role === 'superadmin' && this.getActiveTab === 'library';
      }
  },

  props: {
      topicId: {
          type: Number,
          default: -1
      },
      moduleId: {
          type: Number,
          default: -1
      },
      isFromLibrary: {
        type: Boolean,
        default: false,
      }
  },

  watch: {
    screenWidth() {
        if (this.screenWidth < 576 || (this.screenWidth > 576 && this.screenWidth < 768)){
            this.isMobile = true
        } else {
            this.isMobile = false
        }
    },
    isModalConfirm(newValue){
      if (this.isPublishMateriDraft) this.$store.dispatch("Courses/setIsPublishMateriDraft", newValue);
      else if(this.typeOfModal == 'module') this.$store.commit("Courses/SET_ISDELETECOURSE", newValue);
    },
    isDeleteCourseState(status){
      if(status){
        const detailModule = this.servicesState.moduleDetail;
        this.toggleConfirm(detailModule, "module", 'delete');
      }
      if(this.actionOfModal === 'delete') this.isModalConfirm = status;
    },
    // coursesState: {
    //   handler(newValue){
    //     if(newValue?.isDeleteCourse){
    //       const detailModule = this.servicesState.moduleDetail;
    //       this.toggleConfirm(detailModule, "module", 'delete');
    //     }
    //     if(this.actionOfModal === 'delete') this.isModalConfirm = newValue.isDeleteCourse;
    //     // this.isModalPublishModule = newValue.isPublishModuleDraft
    //   },
    //   deep: true,
    // },
    // isModalPublishModule(newValue){
    //   if(newValue){
    //     this.togglePublishModule();
    //   }
    //   this.$store.commit("Courses/SET_ISPUBLISHMODULEDRAFT", newValue);
    // },
    showContent(newValue){
      if(newValue === 'overview') window.addEventListener('scroll', this.handleShowHeader), this.checkingPrevNextModule();
    },
    isLoadedContent(isLoaded){
      if(isLoaded){
        this.checkContentOverflow();
      }
    },
    isPublishMateriDraftState(status){
      this.isPublishMateriDraft = status;
      const detailModule = this.servicesState.moduleDetail;
      if(status) this.toggleConfirm(detailModule, "module", 'publish');
    }
  },

  data() {
      return {
          isLoaded: true,
          moduleDetail: null,
          listFile: [],
          isFiles: null,
          detailModule: null,

          isBusy: true,

          // Pagination
          pagination: {
              page: 1,
              perPage: 10,
              totalItems: 0,
              totalPages: 0,
          },

          screenWidth: 0,
          isMobile: false,
          
          // topics
          listTopics: [],

          filterActionButtons: [
              {
                  class: 'btn btn-primary',
                  isAction: true,
                  text: 'User',
                  to: 'onClickModalInvite',
                  type: 'button',
                  iconClass: 'ri-add-fill mr-1'
              }
          ],
          sortStudents: null,
          filterFields: FIELDS_FILTER_USERS,

          modalConfirmData: {
              title: "",
              description: "",
              btnYesTitle: "Ya, Saya Yakin",
              btnYesVariant: "primary",
          },
          // isModalPublishModule: false,
          isModalConfirm: false,
          isModalConfirmProcess: false,

          prevTopic: {active: null, topic: null, topicTitle: null},
          nextTopic: {active: null, topic: null, topicTitle: null},
          timeRead: 0,
          timer: null,
          timerIsDone: true,
          isModalWarningLock: false,

          moduleSlug: "",
          courseDetail: null,
          showContent: "",
          isLoadedContent: true,
          topicDetail: null,
          isHeaderShow: false,
          statusListTopics: {
            prevTopic: null,
            nextTopic: null,
            currentTopic: null,
          },
          moduleSelected: null,
          topicSelected: null,
          role: localStorage.getItem("user_kind"),
          topicSlug: null,
          onEvent: {
            title: "",
            description: "",
            icon: "",
            typeOfAlert: "", // danger, success, warning, ....
            isShow: false,
          },
          onAlert: {
            isShow: false,
            textAlert: "",
            iconAlert: "",
            isShowAction: false,
            variant: "", // danger, success, warning, .....
            textAction: "",
          },
          isContentOverflow: false,
          isPublishMateriDraft: false,
      }
  },
  created() {
      this.getCredentials();
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener('scroll', this.handleShowHeader);
    this.handleResize();
  },
  methods: {
      ...mapActions({
        setActiveTab: 'Layouts/setActiveTab',
      }),
      handleResize() {
          this.screenWidth = window.innerWidth;
      },
      setEventAlert(title, description, icon, typeOfAlert, isShow){
        this.onEvent = {
          title,
          description,
          icon,
          typeOfAlert,
          isShow,
        }
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
      async fetchListTopics(topicId = null){
        const params = {
            moduleSlug: this.moduleSlug,
        }

        await this.$store.dispatch('Services/topics', params)

        if(!this.servicesState.status){
            console.error('failed fetch all topics', this.servicesState.message);
            this.$store.dispatch("Services/setListTopics", null);
            this.listTopics = this.servicesState?.topics;
        } else{
            this.listTopics = this.servicesState?.topics ?? [];
            this.courseDetail = this.servicesState.moduleDetail;
            this.pagination = this.servicesState.pagination
            this.checkingPrevNextModule(topicId);
        }
      },
      toggleConfirm(data, type = null, action = null) {
        this.isModalConfirm = !this.isModalConfirm
        this.typeOfModal = type;
        this.actionOfModal = action;
        if (this.isModalConfirm) {
            if(this.typeOfModal === 'module') this.moduleSelected = data;
            else if (this.typeOfModal === 'topic') this.topicSelected = data;
            if(this.actionOfModal === 'publish'){
              this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan ${ this.typeOfModal === "topic" ? "Modul" : "Materi" } <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.typeOfModal === "topic" ? this.topicSelected?.title : this.moduleSelected?.title }</span> ini?<h5>`;
              this.modalConfirmData.btnYesVariant = 'success';
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
      handleActionModalConfirm(){
        if(this.typeOfModal === 'topic'){
          if(this.actionOfModal === 'publish') this.publishTopic();
          else this.deleteTopic();
        } else if(this.typeOfModal === 'module'){
          if(this.actionOfModal === 'publish') this.publishMateri();
          else this.deleteModule();
        }
      },
      async deleteModule(){
        this.isModalConfirmProcess = true
        this.modalConfirmData.btnYesTitle = `Loading...`
        this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Materi <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.moduleSelected?.title }</span> ini?<h5>`

        await this.$store.dispatch("Services/deleteModule", this.moduleSelected?.id);

        if (!this.servicesState?.status) {
            console.error("Failed to Delete the Materi : " + this.servicesState?.message);
            this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
            this.isModalConfirmProcess = false
            this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        } else {
          this.modalConfirmData.description += `</br><p class='text-success font-weight-bold'>Berhasil Menghapus Materi ini</p>`
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
          this.isModalConfirmProcess = false

          setTimeout(() => {
            this.$router.push("/dashboard/courses");
            this.toggleConfirm(null, this.typeOfModal, 'delete');
          }, 1000);
        }
      },
      async deleteTopic() {
        this.isModalConfirmProcess = true
        this.modalConfirmData.btnYesTitle = `Loading...`
        this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Modul <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.topicSelected?.title }</span> ini?<h5>`

        const params = {
          topicSlug: this.topicSelected?.slug,
        }

        await this.$store.dispatch("Services/deleteTopicV2", params)

        if (!this.servicesState?.status) {
            console.error("Failed to Delete the topic : " + this.servicesState?.message);
            this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
            this.isModalConfirmProcess = false
            this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        } else {
          const currentTopic = this.statusListTopics?.currentTopic?.topic;
          if(this.statusListTopics?.currentTopic?.isOverview || currentTopic?.id == this.topicSelected?.id){
            if(this.getActiveTab === 'draft') this.$router.push(`/dashboard/courses/draft/modules/${this.courseDetail?.slug}`)
            else this.$router.push(`/dashboard/courses/modules/${this.courseDetail?.slug}`)
            this.fetchAllContentDetailOverview();
          }else{
            if(this.getActiveTab === 'draft') this.$router.push(`/dashboard/courses/draft/modules/${this.courseDetail?.slug}/topic/${currentTopic?.slug}`);
            else this.$router.push(`/dashboard/courses/modules/${this.courseDetail?.slug}/topic/${currentTopic?.slug}`);
            this.fetchAllContentDetailModule();
          }
          this.isModalConfirmProcess = false
          this.toggleConfirm(null, this.typeOfModal, 'delete');
        }
      },
      goToEditTopic(topic){
        const moduleSlug = this.$route?.params?.courseId;
        const topicSlug = topic?.slug;
        const courseId = topic?.moduleId;

        localStorage.setItem('courseId', toEncrypt(courseId));

        if(this.getActiveTab === 'library') this.$router.push(`/dashboard/courses/modules/${moduleSlug}/edit/${topicSlug}`);
        else if (this.getActiveTab === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/modules/${moduleSlug}/edit/${topicSlug}`);
        else if (this.getActiveTab === 'draft') this.$router.push(`/dashboard/courses/draft/modules/${moduleSlug}/edit/${topicSlug}`);
      },
      async getDetailModule(){
        this.isLoadedContent = false;

        const params = {
          slug: this.topicSlug
        }

        await this.$store.dispatch("Services/detailTopicV2", params);

        if(!this.servicesState?.status){
          console.error('failed fetch detail topic', this.servicesState.message);
        }else{
          this.topicDetail = this.servicesState?.topicDetail;
          this.checkingPrevNextModule(this.topicDetail?.id);
          if(this.topicDetail?.state === 'draft' && this.role === "superadmin"){
            const itemAlert = {
              isShow: true,
              textAlert: "Module ini masih dalam status draft",
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
      async getCredentials() {
          this.moduleSlug = this.$route?.params?.courseId;
          this.topicSlug = this.$route?.params?.topicSlug;  
          this.listTopics = this.servicesState?.topics;
          this.detailModule = this.servicesState.moduleDetail;
          this.showContent = this.topicSlug ? "course" : 'overview';

          if(this.showContent === 'course'){
            if(!this.detailModule) this.fetchDetailModule();
            this.fetchAllContentDetailModule();
          }else if(this.showContent === 'overview'){
            this.fetchAllContentDetailOverview();
          }
      },
      async fetchAllContentDetailOverview(){
        if(!this.coursesState?.isMoveModule) this.isLoaded = false
        this.isLoadedContent = false;
        await this.fetchListTopics()
        this.isLoadedContent = true;
        if(!this.coursesState?.isMoveModule) this.isLoaded = true
      },
      async fetchAllContentDetailModule(){
        if(!this.coursesState?.isMoveModule) this.isLoaded = false
        this.isLoadedContent = false;
        await this.fetchListTopics()
        await this.getDetailModule()
        this.isLoadedContent = true;
        if(!this.coursesState?.isMoveModule) this.isLoaded = true
      },
      goToCreateModule(){
        localStorage.setItem('courseId', toEncrypt(this.courseDetail?.id));
        if(this.getActiveTab === 'library') this.$router.push(`/dashboard/courses/modules/${this.courseDetail?.slug}/create`);
        else if (this.getActiveTab === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/modules/${this.courseDetail?.slug}/create`);
        else if (this.getActiveTab === 'draft') this.$router.push(`/dashboard/courses/draft/modules/${this.courseDetail?.slug}/create`);
      },
      checkingPrevNextModule(topicId = null){
        if(this.showContent === 'overview'){
          this.statusListTopics.prevTopic = { active: false, topic: null, isOverview: false, typeOfList: null, data: null };
          if(!this.listTopics || this.listTopics?.length === 0) this.statusListTopics.nextTopic = { active: false, topic: null, isOverview: false, typeOfList: null, data: null };
          else this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[0], isOverview: false, typeOfList: this.listTopics[0]?.kind, data: this.listTopics[0] };
          this.statusListTopics.currentTopic = { active: true, topic: null, isOverview: true, typeOfList: 'overview', data: null };
        }else{
          const indexTopic = this.listTopics.findIndex(item => item.id === topicId)

          if(indexTopic == 0 && this.listTopics?.length == 1){
            this.statusListTopics.prevTopic = { active: true, topic: null, isOverview: true, typeOfList: 'overview', data: null };
            this.statusListTopics.nextTopic = { active: false, topic: null, isOverview: false, typeOfList: null, data: null };
            this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, typeOfList: this.listTopics[indexTopic]?.kind, data: this.listTopics[indexTopic] };
          }
          else if(indexTopic == this.listTopics?.length - 1){
            this.statusListTopics.prevTopic = { active: true, topic: this.listTopics[indexTopic - 1], isOverview: false, typeOfList: this.listTopics[indexTopic - 1]?.kind, data: this.listTopics[indexTopic - 1] };
            this.statusListTopics.nextTopic = { active: false, topic: null, isOverview: false, typeOfList: null, data: null };
            this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, typeOfList: this.listTopics[indexTopic]?.kind, data: this.listTopics[indexTopic] };
          }
          else if(indexTopic == 0){
            this.statusListTopics.prevTopic = { active: true, topic: null, isOverview: true, typeOfList: "overview", data: null };
            this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexTopic + 1], isOverview: false, typeOfList: this.listTopics[indexTopic + 1]?.kind, data: this.listTopics[indexTopic + 1] };
            this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, typeOfList: this.listTopics[indexTopic]?.kind, data: this.listTopics[indexTopic] };
          }
          else if(indexTopic < this.listTopics?.length - 1){
            this.statusListTopics.prevTopic = { active: true, topic: this.listTopics[indexTopic - 1], isOverview: false, typeOfList: this.listTopics[indexTopic - 1]?.kind, data: this.listTopics[indexTopic - 1] };
            this.statusListTopics.nextTopic = { active: true, topic: this.listTopics[indexTopic + 1], isOverview: false, typeOfList: this.listTopics[indexTopic + 1]?.kind, data: this.listTopics[indexTopic + 1] };
            this.statusListTopics.currentTopic = { active: true, topic: this.listTopics[indexTopic], isOverview: false, typeOfList: this.listTopics[indexTopic]?.kind, data: this.listTopics[indexTopic] };
          }
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

      setEvent(message, status) {

          window.scrollTo(0,0)

          this.onEvent.message = message
          this.onEvent.status = status
          this.onEvent.variant = status ? 'success' : 'warning'
          this.onEvent.alertCounter = 5

      },
      async publishTopic(){
        this.isModalConfirmProcess = true
        this.modalConfirmData.btnYesTitle = `Loading...`
        this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Modul <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.topicSelected?.title }</span> ini?<h5>`

        await this.$store.dispatch("Courses/publishModule", this.topicSelected?.id)

        if (!this.coursesState?.status) {
            console.error("Failed to Delete the topic : " + this.coursesState?.message);
            this.modalConfirmData.description += `</br><p class='text-danger'>${this.coursesState.message}</p>`
            this.isModalConfirmProcess = false
            this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        } else {
          this.isLoaded = false
          await this.fetchListTopics(this.topicSelected?.id);
          await this.getDetailModule(this.topicSelected);
          this.resetAlert();
          this.isLoaded = true;
          this.isModalConfirmProcess = false
          this.toggleConfirm(null, this.typeOfModal, 'publish');
        }
      },
      async passModuleAdded(){
        await this.getCredentials();
        this.setEventAlert("Materi berhasil ditambahkan", "Materi telah berhasil ditambahkan ke dalam LMS. Sekarang, materi tersebut sudah dapat di akses!", "ri-checkbox-circle-fill", "success", true);
      },
      checkContentOverflow(){
        this.$nextTick(() => {
          const heightOfViewport = window.innerHeight;
          const positionOfContent = this.$refs?.contentOfModule?.getBoundingClientRect()?.bottom;
          this.isContentOverflow = positionOfContent > heightOfViewport;
        });
      },
      topicLockedAction(){
        this.setEventAlert("Modul terkunci", "Materi ini belum ditambahkan ke LMS!", "ri-error-warning-fill", "warning", true);
      },
      async fetchDetailModule(){
        await this.$store?.dispatch("Services/detailModuleV2", { slug: this.moduleSlug });

        if(!this.servicesState.status) {
            console.error('Failed get module', this.servicesState.message)
        } else {
            this.detailModule = this.servicesState.moduleDetail;
        }
      },
      async publishMateri(){
        this.isModalConfirmProcess = true
        this.modalConfirmData.btnYesTitle = `Loading...`
        this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan Materi <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.moduleSelected?.title }</span> ini?<h5>`;

        await this.$store.dispatch("Services/publishMateri", this.moduleSelected?.id)

        if (!this.servicesState?.status) {
          console.error("Failed to Delete the topic : " + this.servicesState?.message);
          this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
          this.isModalConfirmProcess = false
          this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        } else {
          const courseSlug = this.$route?.params?.courseId;
          const topicSlug = this.$route?.params?.topicSlug;
          this.isModalConfirmProcess = false
          this.toggleConfirm(null, this.typeOfModal, 'publish');
          if(this.showContent === 'overview') this.$router.push(`/dashboard/courses/my-courses/modules/${courseSlug}`)
          else this.$router.push(`/dashboard/courses/my-courses/modules/${courseSlug}/topic/${topicSlug}`)
        }
      },
  },
  destroyed(){
    this.$store.dispatch("Layouts/setActiveBadge", null);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/courses/detail-module.scss";
</style>
