<template>
  <div>
    <Header
      :isBusy="isLoadingState"
      :editor="editor"
      :moduleDetail="moduleDetail"
      @onClickSave="saveModule"
      :featureAction="featureAction"
      @onCreateExercise="handleCreateExercise"
      :startAutoSave="startAutoSave"
      :stateOfAutoSave="stateOfAutoSave"
      :isFromClass="isFromClass"
      @callbackImport="handleCallbackImport"
      @importing="handleOnTyping"
    />
    <!-- <HeaderOptions
      :isBusy="isBusy"
      :editor="editor"
      :moduleDetail="moduleDetail"
    /> -->
    <div class="container pb-8 pt-3">
      <div v-if="!isLoadingState">
        <div v-if="content">
          <client-only>
            <tiptap-editor
              :editable="true"
              @editorAction="setEditor($event)"
              :content="content"
              :featureAction="featureAction"
              @shortcutSave="handleShortcutSave"
              @autoSave="handleAutoSave"
              @onTyping="handleOnTyping"
            />
          </client-only>
        </div>
        <div v-else>
          <client-only>
            <tiptap-editor
              :editable="true"
              @editorAction="setEditor($event)"
              :content="'<h1></h1>'"
              :featureAction="featureAction"
              @shortcutSave="handleShortcutSave"
              @autoSave="handleAutoSave"
              @onTyping="handleOnTyping"
            />
          </client-only>
        </div>
      </div>
      <div v-else class="mb-5 mt-5">
        <div class="d-flex justify-content-center align-items-center mb-5">
          <b-skeleton animation="wave" width="30%"></b-skeleton>
        </div>
        <div class="d-flex justify-content-center align-items-center w-100 mb-5">
          <b-skeleton-img no-aspect width="60%" height="300px"></b-skeleton-img>
        </div>
        <div class="d-flex flex-column" style="gap: 7px;">
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" width="80%"></b-skeleton>
        </div>
      </div>
    </div>
    <b-modal 
        id="modalLoading" 
        size="md" 
        centered 
        hide-header 
        hide-footer 
        no-close-on-backdrop 
        no-close-on-esc
    >
        <div class="d-flex align-items-center justify-content-center">
            <b-spinner label="Spinning" class="mr-3"></b-spinner><span>Loading...</span>
        </div>
    </b-modal>
    <b-modal 
        id="modalAlert" 
        size="sm" 
        centered 
        hide-header 
        hide-footer
    >
        <div class="d-flex" style="gap: 15px">
          <div :class="`wrapper-check bg-${onEvent.variant}`">
            <i v-if="onEvent.status" class="ri-check-line"></i>
            <i v-else class="ri-close-line"></i>
          </div>
          <div class="d-flex flex-column">
            <h3 class="modal-title mb-2">{{ onEvent.message.title }}</h3>
            <p class="mb-0 modal-description">{{ onEvent.message.description }}</p>
          </div>
        </div>
    </b-modal>
    <b-modal id="modalPublish" v-model="isModalPublishModule" size="sm" centered hide-header hide-footer body-class="p-0">
        <ModalConfirmation
          :title="modalConfirmData?.title"
          :description="modalConfirmData?.description"
          :btnYesVariant="modalConfirmData?.btnYesVariant"
          :btnYesTitle="modalConfirmData?.btnYesTitle"
          :btnNoHide="isModalConfirmProcess"
          :btnYesDisabled="isModalConfirmProcess"
          @actionYes="publishModule"
          @actionNo="isModalPublishModule = false"
        />
    </b-modal>
    <b-modal v-model="isModalExerciseShow" size="md" centered hide-header hide-footer no-close-on-backdrop body-class="p-0">
      <div class="p-4">
        <h5 class="mb-3">Buat Latihan</h5>
        <div class="wrapper-form">
          <div v-for="(input, index) in inputStudio" :key="index">
            <b-form-group
              :label="input.label"
              :label-for="input.label"
              :description="input.description"
            >
  
              <SearchSelect
                class="w-100"
                :items="input?.options ?? []"
                :text="selectedStudio?.label"
                :placeholder="input?.placeholder"
                @onChange="selectedStudio = $event"
                :id="`select-${ input?.name }`"/>
            </b-form-group>
          </div>
        </div>
        <div class="wrapper-action w-100 d-flex align-items-center justify-content-end">
          <b-button variant="light" @click="isModalExerciseShow = false">Cancel</b-button>
          <b-button variant="primary">Submit</b-button>
        </div>
      </div>
    </b-modal>

    <ToastInformationError
      :title="onToast?.title"
      :description="onToast?.description"
      v-model="onToast.isShow"
    />
  </div>
</template>

<script>
import TiptapEditor from '@/components/editor/micro/TiptapEditor.vue'
import Header from '@/components/editor/template/Header.vue'
// import HeaderOptions from '@/components/editor/template/HeaderOptions.vue'
import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue"
import SearchSelect from '@/components/template/micro/inputs/SearchSelect.vue';
import { mapState, mapActions } from 'vuex';
import { toDecrypt, toEncrypt } from '~/commons/utils'
import ToastInformationError from '~/components/template/micro/toast/ToastInformationError.vue';

export default {
  props: {
    featureAction:{
      type: String,
      default: "",
    },
    isFromClass: {
      type: Boolean,
      default: false
    },
  },
  components: {
    TiptapEditor,
    Header,
    ModalConfirmation,
    SearchSelect,
    // HeaderOptions,
    ToastInformationError
  },
  layout: 'blank',
  computed: {
      ...mapState({
          editorState: (state) => state.Editor,
          servicesState: (state) => state.Services,
          classroomsState: (state) => state.Classrooms,
          getActiveTab: (state) => state?.Layouts?.activeTab,
          importDocumentState: (state) => state.Courses.importDocument,
      }),
      isLoadingState(){
        return this.isBusy || this.importDocumentState.isLoading;
      }
  },
  watch: {
    isModalPublishModule(state){
      if(!state) this.isAgreeToPublishModule = false;
    }
  },
  mounted(){
    this.initEditor();
  },
  data(){
    return{
      isBusy: false,
      onEvent: {
          message: {
            title: "",
            description: "",
          },
          status: true,
          show: false,
          variant: ''
      },
      editor: null,
      moduleDetail: null,

      isAgreeToPublishModule: false,
      modalConfirmData: {
          title: "",
          description: "",
          btnYesTitle: "Ya, Saya Yakin",
          btnYesVariant: "primary",
      },
      isModalPublishModule: false,
      isModalConfirmProcess: false,
      topicUUID: null,
      topicId: null,
      classroomId: null,
      topicDetail: null,
      isModalExerciseShow: false,
      inputStudio: [
        { name: 'studio', label: 'Studio', type: 'select', value: '', placeholder: 'Pilih Studio untuk dijadikan latihan', required: false,
          options: [
            {label: "Studio 1", value: "studio-1"},
            {label: "Studio 2", value: "studio-2"},
            {label: "Studio 3", value: "studio-3"},
          ] 
        },
        // { name: 'materi', label: 'Materi', type: 'select', value: '', placeholder: 'Pilih Materi untuk dijadikan latihan', required: false,
        //   options: [
        //     {label: "Studio 1", value: "studio-1"},
        //     {label: "Studio 2", value: "studio-2"},
        //     {label: "Studio 3", value: "studio-3"},
        //   ] 
        // },
      ],
      selectedStudio: null,
      listCourses: null,
      classroomDetail: null,
      courseDetail: null,
      moduleId: null,

      // Slug
      topicSlug: "",
      classroomSlug: "",
      courseSlug: "",

      // Data that relate with autosave
      startAutoSave: false,
      stateOfAutoSave: {
        icon: "",
        label: "",
        customStyleIcon: "",
        customStyleText: "",
      },
      onToast: {
        title: "",
        description: "",
        isShow: false,
      },
      content: "",
    }
  },
  methods:{
    ...mapActions({
        getDetailTopic: `Classrooms/getDetailTopic`,
    }),
    async initEditor(){
      const isCreatePage = this.featureAction != "edit";
      this.courseSlug = this.isFromClass ? this.$route?.params?.course : this.$route?.params?.courseId;
      this.classroomSlug = this.$route?.params?.classroom;
      this.moduleId = localStorage.getItem("courseId");
      this.moduleId = this.moduleId && this.moduleId != 'undefined' ? toDecrypt(this.moduleId) : "";

      // Check module / course id is exist in local storage or not
      if(!this.moduleId) this.isFromClass ? this.getListCoursesClassroom() : this.fetchDetailCourse();

      if(this.isFromClass){
        // Get Data
        this.topicId = toDecrypt(localStorage.getItem("topicId"));
        this.classroomId = toDecrypt(localStorage.getItem("classroomId"));
        this.topicUUID = toDecrypt(localStorage.getItem("topicUUID"));

        // Check classroom id is exist in local storage or not
        if(!this.classroomId) this.getClassroomDetail();

        // Fetch Detail Module
        if(this.classroomSlug && this.topicUUID) this.fetchDetailModuleClass();
      }else{
        this.topicSlug = isCreatePage ? localStorage.getItem("topicSlug") : this.$route?.params?.edit;
        if(this.topicSlug) this.fetchDetailModule();
      }
    },
    setEditor(editor){
      this.editor = editor;
    },
    setEvent(message, status){
        this.onEvent.message = message
        this.onEvent.status = status
        this.onEvent.variant = status == true ? 'success' : 'failed'
        this.onEvent.show = true
    },
    publishModule(){
      this.isAgreeToPublishModule = true;
      this.saveModule("release", true);
    },
    async saveModule(state, isPublish = false){
      if(isPublish && !this.isAgreeToPublishModule){
        this.isModalPublishModule = true;
        this.togglePublishModule();
      }else{
        const payload = this.setPayloadToFetch(state);
        const isThereErrorValidation = this.validationContent(payload);

        if(isThereErrorValidation?.length > 0){
          if(isThereErrorValidation[0]?.content === 'title'){
            this.onToast = {
              title: isThereErrorValidation[0]?.title,
              description: isThereErrorValidation[0]?.description,
              isShow: true,
            }
          }
        }else{
          await this.fetchPostModule(payload, isPublish);
        }
      }
    },
    async fetchPostModule(payload, isPublish = false) {

        if(isPublish) this.isModalConfirmProcess = true;
        else this.$bvModal.show('modalLoading')

        const { dispatch, params } = this.setEndpointToFetch(payload)

        await this.$store.dispatch(dispatch, params)

        if(!this.servicesState.status) {
            console.error(`Failed ${this.featureAction === 'edit' ? 'edit' : 'create'} module`, this.servicesState.message)

            if(isPublish) this.isModalConfirmProcess = false, this.isModalPublishModule = false;
            else this.$bvModal.hide('modalLoading')

            setTimeout(() => {
                const message = {
                  title: `Module gagal ditambahkan ${payload.state == "draft" ? 'sebagai draft' : ''}`,
                  description: this.servicesState.message,
                }

                if(this.featureAction === "edit"){
                  message.title = "Module gagal diedit"
                }

                this.setEvent(message, this.servicesState.status)
                this.$bvModal.show('modalAlert')
            }, 500);
        } else {
            this.topicDetail = this.servicesState?.topicDetail;

            let message = {
              title: `Module berhasil ditambahkan ${payload.state == "draft" ? 'sebagai draft' : ''}`,
              description: `Modul baru telah berhasil ditambahkan dengan sukses ${payload.state == "draft" ? 'sebagai draft' : ''}`
            }

            if(this.featureAction === "edit"){
              message.title = `Module berhasil diedit ${isPublish ? 'dan diterbitkan' : ''}`
              message.description = `Modul baru telah berhasil diedit dengan sukses ${isPublish ? 'dan diterbitkan' : ''}`
            }

            if(isPublish) this.isModalConfirmProcess = false, this.isModalPublishModule = false;
            else this.$bvModal.hide('modalLoading')

            setTimeout(() => {
                this.setEvent(message, this.servicesState.status)
                this.$bvModal.show('modalAlert')
                // this.initEditor();
            }, 500);

            setTimeout(() => {
              if(this.topicDetail && this.topicDetail?.slug){
                if(this.isFromClass){
                  const classroomSlug = this.$route?.params?.classroom;
                  const courseSlug = this.$route?.params?.course;
  
                  const topics = { slug: this.topicDetail?.slug, uuid: this.topicDetail?.uuid };
                  localStorage.setItem("topic", toEncrypt(JSON.stringify(topics)));
  
                  this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${courseSlug}/module/${this.topicDetail?.slug}`);
                }else{
                  const courseSlug = this.$route?.params?.courseId;
                  if(this.getActiveTab === 'draft') this.$router.push(`/dashboard/courses/draft/modules/${courseSlug}/topic/${this.topicDetail?.slug}`);
                  else this.$router.push(`/dashboard/courses/modules/${courseSlug}/topic/${this.topicDetail?.slug}`);
                }
              }else{
                this.$router.go(-1);
              }
            }, 1300);
        }
    },
    async fetchDetailModule(){
      this.isBusy = true;

      const params = {
        slug: this.topicSlug,
      }

      await this.$store.dispatch(`Services/detailTopicV2`, params)

      if(!this.servicesState.status) {

          console.error('Failed get topic on classroom: ', this.servicesState.message)

      } else {
          this.moduleDetail = this.servicesState.topicDetail
          this.content = this.moduleDetail?.content;
          this.isBusy = false;
      }
    },
    async fetchDetailModuleClass(){
      this.isBusy = true;

      const params = {
        classroomSlug: this.classroomSlug,
        topicUUID: this.topicUUID,
      }

      await this.getDetailTopic(params);

      if(!this.classroomsState.status){
        console.error('failed fetch topics detail', this.classroomsState.message);
      }else{
        this.moduleDetail = this.classroomsState?.detailTopic;
        this.content = this.moduleDetail?.content;
        this.isBusy = false;
      }
    },
    togglePublishModule() {
        if (this.isModalPublishModule) {
            this.modalConfirmData.title = "Terbitkan Module!"
            this.modalConfirmData.btnYesVariant = 'primary'
            this.modalConfirmData.description = `Anda Yakin Akan menerbitkan Module <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.moduleDetail?.title }</span> ini ?`
        } else {
            this.modalConfirmData.description = ``
        }
    },
    handleCreateExercise(){
      this.isModalExerciseShow = true;
    },
    handleShortcutSave(){
      if(this.featureAction == "edit") this.saveModule(this.moduleDetail?.state, false);
      else this.saveModule("draft", false);
    },

    /**
     * To set state of start and loading for auto save
     */
    handleOnTyping(){
      // Set state for auto save
      this.stateOfAutoSave = {
        icon: "ri-refresh-line",
        label: "Menyimpan",
        customStyleIcon: "animate-load",
        customStyleText: "",
        isLoadingAutoSave: true,
      }
      this.startAutoSave = true;
    },

    /**
     * To run the function when autosave occurs
     */
    handleAutoSave(){
      if(this.featureAction == "edit") this.fetchModuleAutoSave(this.moduleDetail?.state);
      else this.fetchModuleAutoSave("draft");
    },
    async fetchModuleAutoSave(state){
      const payload = this.setPayloadToFetch(state);
      const isThereErrorValidation = this.validationContent(payload);
      
      if(isThereErrorValidation?.length > 0){
        if(isThereErrorValidation[0]?.content === 'title'){
          this.onToast = {
            title: isThereErrorValidation[0]?.title,
            description: isThereErrorValidation[0]?.description,
            isShow: true,
          }
        }

        this.stateOfAutoSave = {
          icon: "ri-error-warning-line",
          label: "Gagal menyimpan",
          customStyleIcon: "text-danger",
          customStyleText: "text-danger",
          isLoadingAutoSave: false,
        }
      }else{
        const { dispatch, params } = this.setEndpointToFetch(payload);
  
        await this.$store.dispatch(dispatch, params);
  
        if(!this.servicesState.status) {
            console.error(`Failed ${this.featureAction === 'edit' ? 'edit' : 'create'} module`, this.servicesState.message)
            this.stateOfAutoSave = {
              icon: "ri-error-warning-line",
              label: "Gagal menyimpan",
              customStyleIcon: "text-danger",
              customStyleText: "text-danger",
              isLoadingAutoSave: false,
            }
        } else {
            this.topicDetail = this.servicesState?.topicDetail;
            this.moduleDetail = this.topicDetail;
  
            if(this.featureAction != "edit"){
              if(this.isFromClass){
                localStorage.setItem("topicId", toEncrypt(this.topicDetail?.id));
                localStorage.setItem("topicUUID", toEncrypt(this.topicDetail?.uuid));
              }else localStorage.setItem("topicSlug", this.topicDetail?.slug);
            }else{
              if(this.isFromClass){
                this.classroomSlug = this.$route?.params?.classroom;
                this.courseSlug = this.$route?.params?.course;
                this.topicSlug = this.topicDetail?.slug;
                const newPath = `/dashboard/classroom/${this.classroomSlug}/course/${this.courseSlug}/module/${this.topicSlug}/edit`;
                if(this.$route.path != newPath) this.$router.replace(newPath);
              }else{
                this.courseSlug = this.$route?.params?.courseId;
                this.topicSlug = this.topicDetail?.slug;
                const activeTab = localStorage.getItem("active_tab");
                let newPath = `/dashboard/courses/modules/${this.courseSlug}/edit/${this.topicSlug}`;
                if(activeTab == 'draft') newPath = `/dashboard/courses/draft/modules/${this.courseSlug}/edit/${this.topicSlug}`;
                if(this.$route.path != newPath) this.$router.replace(newPath);
              }
            }
  
            this.stateOfAutoSave = {
              icon: "ri-checkbox-circle-line",
              label: "Disimpan",
              customStyleIcon: "text-success",
              customStyleText: "",
              isLoadingAutoSave: false,
            }
        }
      }
    },
    setPayloadToFetch(state){
      this.moduleId = toDecrypt(localStorage.getItem("courseId"));
      const resultJson = this.editor?.getJSON();
      let title = {};
      let description = "";
      let descriptionEditor = null;

      if(resultJson.content.length > 0){
        title = resultJson.content.find((item, index) => {
          if(item.type === "heading"){
            if(item.content){
              return item?.content[0]?.text
            }
          }
        })

        descriptionEditor = resultJson?.content?.find((item, index) => {
          if(item.type === 'paragraph'){
            if(item.content){
              return item?.content[0]?.text
            }
          }
        })

      } else {
        title = `Module tanpa judul`
      }

      if(!title) title = `Module tanpa judul`

      descriptionEditor?.content?.map((item) => {
        description += item?.text;
      })

      let splitDescription = description ? description?.split(" ") : null;
      if(splitDescription){
        description = splitDescription?.length > 50 ? splitDescription.slice(0, 50) : splitDescription;
        description = description.join(" ");
      }

      const payload = {
        state: state,
        content: this.editor.getHTML(),
        description,
        type: "editor",
        title: title.content ? title?.content[0]?.text : title,
        moduleId: parseInt(this.moduleId)
      }

      if(this.isFromClass){
        const classroomId = parseInt(toDecrypt(localStorage.getItem("classroomId")));
        payload.classroomId = classroomId;
      }

      return payload;
    },
    setEndpointToFetch(params){
      let dispatch = this.isFromClass ? 'Services/classroomCreateTopic' : 'Services/createTopic'
      let payload = params

      // Check when still in create page and after create the module, endpoint change from create to edit
      const isCreatePage = this.featureAction != "edit";
      if(isCreatePage){
        if(this.isFromClass) this.topicId = toDecrypt(localStorage.getItem("topicId"));
        else this.topicSlug = localStorage.getItem("topicSlug");
      }else{
        if(!this.isFromClass) this.topicSlug = this.$route?.params?.edit;
      }

      if(this.featureAction == 'edit' || (isCreatePage && ((this.topicId && this.classroomId) || this.topicSlug))) {
        if(this.isFromClass){
          dispatch = 'Services/classroomEditTopic'
          payload = {
              topicId: parseInt(this.topicId),
              classroomId: parseInt(this.classroomId),
              params: params
          }
        }else{
          dispatch = 'Services/editTopicV2'
          payload = {
              topicSlug: this.topicSlug,
              params: params
          }
        }
      }

      return { dispatch, params: payload };
    },
    async getListCoursesClassroom(){
      
      await this.$store?.dispatch("Classrooms/getListModules", {classroomSlug: this.classroomSlug});

      if(!this.classroomsState?.status){
        console.error("Failed to fetch list courses : " + this.classroomsState?.message);
      }else{
        this.listCourses = this.classroomsState?.listModules;

        const courseDetail = this.listCourses.find(course => course?.slug == this.courseSlug);
        this.moduleId = courseDetail?.id;

        localStorage.setItem("courseId", toEncrypt(this.moduleId));
      }
    },
    async getClassroomDetail () {
      
      await this.$store?.dispatch("Services/classroomOverview", this.classroomSlug);

      if(!this.servicesState?.status){
        console.error("Failed Fetch classroom detail : " + this.servicesState?.message);
      }else{
        this.classroomDetail = this.servicesState?.classroomDetail;

        this.classroomId = this.classroomDetail?.id;
        localStorage.setItem("classroomId", toEncrypt(this.classroomId));
      }
    },
    async fetchDetailCourse(){
      await this.$store?.dispatch("Services/detailModuleV2", { slug: this.courseSlug });

      if(!this.servicesState.status) {
          console.error('Failed get module', this.servicesState.message)
      } else {
          this.courseDetail = this.servicesState.moduleDetail;
          this.moduleId = this.courseDetail?.id;

          localStorage.setItem("courseId", toEncrypt(this.moduleId));
      }
    },

    /**
     * @param {Objecy} payload - payload that will be send to server, it's gonna to check first the validation
     * @returns {Array} - consisting of content in which an error occurred in the form of an array of objects
     */
    validationContent(payload){
      let errorContent = [];

      /**
       * Validation for the title
       * title must be less than 120 character
       */
      if(payload?.title?.length > 120){
        errorContent.push({
          content: "title",
          title: "Judul Terlalu Panjang",
          description: "Judul Anda melebihi batas maksimum 120 karakter. Silakan ringkas judul agar lebih jelas dan informatif."
        })
      }

      return errorContent
    },

    /**
     * Handle after fetch api import topic
     * 
     * @param {Object} responseImport - response of fetch import data
     * @param {Boolean} responseImport.status - status of fetch, whether success or not
     * @param {Object} responseImport.data - if status is true, data will filled string html, if it's false, data will filled toast data
     */
    handleCallbackImport(responseImport){
      if(responseImport?.status) this.content = responseImport?.data, this.handleAutoSave();
      else {
        this.stateOfAutoSave = {
          icon: "ri-error-warning-line",
          label: "Gagal menyimpan",
          customStyleIcon: "text-danger",
          customStyleText: "text-danger",
          isLoadingAutoSave: false,
        }
        this.onToast = { ...responseImport?.data };
      }
    }
  },
  beforeDestroy(){
    localStorage.removeItem("topicSlug");
  }
}
</script>

<style scoped lang="scss">
.modal-title {
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 150%;
    color: #000000;
}

.modal-description{
  font-family: var(--bs-font-paragraph);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: rgb(121, 121, 121);
}

.wrapper-check{
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  i{
    font-size: 24px;
    font-weight: bold;
    color: white;
  }
}

.bg-success{
  background: #28C56C;
}

.bg-failed{
  background: #F5254E;
}
</style>