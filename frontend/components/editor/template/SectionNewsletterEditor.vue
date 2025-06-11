<template>
  <div>
    <HeaderNewsletter
      :isBusy="isLoadingState"
      :editor="editor"
      :featureAction="featureAction"
      :startAutoSave="startAutoSave"
      :stateOfAutoSave="stateOfAutoSave"
      @onClickSave="showPublishModal"
      @selectedClass="handleSelectedClass"
      @filterChanged="handleFilterChanged"
      @onCreateExercise="handleCreateExercise"
      @callbackImport="handleCallbackImport"
      @importing="handleOnTyping"
    />
    <div class="container pb-8 pt-3">
      <div v-if="!isLoadingState">
        <div v-if="content">
          <client-only>
            <tiptap-editor
              :editable="true"
              @editorAction="setEditor($event)"
              :content="content"
              :featureAction="featureAction"
              fileHandlerType="image"
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
              fileHandlerType="image"
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
        v-model="onEvent.show"
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
          :btnNoDisabled="isModalConfirmProcess"
          :btnYesDisabled="isModalConfirmProcess"
          @actionYes="handleSave"
          @actionNo="isModalPublishModule = false"
        />
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
import HeaderNewsletter from '@/components/editor/template/HeaderNewsletter.vue'
import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue"
import SearchSelect from '@/components/template/micro/inputs/SearchSelect.vue';
import { mapState, mapActions } from 'vuex';
import { toDecrypt, toEncrypt } from '~/commons/utils'
import ToastInformationError from '~/components/template/micro/toast/ToastInformationError.vue';

export default {
  props: {
    fromPage: {
      type: String,
      default: "",
    },
    // content: {
    //   type: String,
    //   default: ""
    // }
  },
  computed: {
    ...mapState({
      editorState: (state) => state.Editor,
      servicesState: (state) => state.Services,
      getActiveTab: (state) => state?.Layouts?.activeTab,
      importDocumentState: (state) => state.Newsletters.importDocument,
      cityState: (state) => state.Cities,
    }),
    isLoadingState(){
      return this.isBusy;
    }
  },
  components: {
    TiptapEditor,
    ModalConfirmation,
    SearchSelect,
    HeaderNewsletter,
    ToastInformationError
  },
  layout: 'blank',
  watch: {
    // isModalPublishModule(state){
    //   if(!state) this.isAgreeToPublishModule = false;
    // }
  },
  created(){
    this.initiateComponent();
  },
  data() {
    return {
      isBusy: false,
      content: "",
      selectedFilter: null,
      selectedClass: null,
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
      detailNewsletter: null,

      isAgreeToPublishModule: false,
      modalConfirmData: {
          title: "",
          description: "",
          btnYesTitle: "Ya, Saya Yakin",
          btnYesVariant: "primary",
      },
      isModalPublishModule: false,
      isModalConfirmProcess: false,
      isModalExerciseShow: false,

      // Slug

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
      featureAction: 'create',
    }
  },
  methods: {
    async initiateComponent(){
      const savedDraft = localStorage.getItem("draft-newsletter");

      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);

        // Load content dan filter dari localStorage ke component
        this.content = parsedDraft.content || "<h1></h1>";
        this.selectedFilter = parsedDraft.filter || "";

        // Optional: Load title atau data lainnya
        if (this.editor) {
          this.editor.commands.setContent(this.content);
        }
      }
      // Initialization Data that needed in this component
      this.initiateData();
    },
    /**
     * Initialization data that needed in this component
     */
    initiateData(){
      this.featureAction = "edit";
    },
    clearDraftFromStorage() {
      localStorage.removeItem("draft-newsletter");
    },
    setEditor(editor){
      this.editor = editor;
    },
    setEvent(message, status, duration = 2000) {
      // Set data untuk modal alert
      this.onEvent.message.title = message?.title;
      this.onEvent.message.description = message?.description;
      this.onEvent.status = status;
      this.onEvent.variant = status ? 'success' : 'failed';
      this.onEvent.show = true;

      // Sembunyikan modal setelah durasi tertentu
      setTimeout(() => {
        this.onEvent.show = false; // Menyembunyikan modal
      }, duration);
    },
    setToast(title, description, duration = 2000) {
      this.onToast = {
        title,
        description,
        isShow: true,
      };

      if(duration) {
        setTimeout(() => {
          this.onToast.isShow = false;
        }, duration);
      }
    },
    /**
     * Show modal publish
     */
    showPublishModal() {
      this.isModalPublishModule = true;
      this.togglePublishModule();
    },
    /**
     * Cancel publish
     */
    cancelPublish() {
      this.isModalPublishModule = false;
    },
    /**
     * Close the modal publish
     */
    closePublishModal() {
      this.isModalPublishModule = false;
      this.isModalConfirmProcess = false;
    },
    /**
     * function to set payload that will send to server both create or edit the topic
     *
     * @param {string} state - state of topic both release or draft
     */
    handleFilterChanged(filter) {
      this.selectedFilter = filter; // Simpan nilai filter di data lokal
    },
    handleSelectedClass(item) {
      this.selectedClass = item;
    },
    validatePayload() {
      const errors = [];

      // Validasi title
      const hasHeading = this.editor?.getJSON()?.content?.some(
        item => item.type === 'heading' && item.content?.[0]?.text?.trim()
      );

      if (!hasHeading) {
        errors.push({
          field: "title",
          message: "Judul tidak boleh kosong. Tambahkan heading sebagai judul.",
        });
      }

      // Validasi content
      if (!this.editor?.getHTML() || this.editor.getHTML().trim() === "<p></p>") {
        errors.push({
          field: "content",
          message: "Konten tidak boleh kosong. Tambahkan konten pada editor.",
        });
      }

      // Validasi filter
      // if (this.selectedFilter === "" || this.selectedFilter == null) {
      //   errors.push({
      //     field: "filter",
      //     message: "Silakan pilih filter terlebih dahulu.",
      //   });
      // }

      // Validasi filter target by class
      // if (!this.selectedClass) {
      //   errors.push({
      //     field: "classId",
      //     message: "Silakan pilih filter kelas terlebih dahulu.",
      //   });
      // }

      // Jika ada error, kembalikan status false dan daftar error
      if (errors.length > 0) {
        return {
          isValid: false,
          errors,
        };
      }

      // Jika validasi berhasil
      return {
        isValid: true,
        errors: [],
      };
    },
    setPayloadToFetch(state){
      const resultJson = this.editor?.getJSON();
      let title = "";
      let newContent = [];

      if (resultJson?.content?.length > 0) {
        const firstHeadingIndex = resultJson.content.findIndex(
          item => item.type === 'heading' && item.content?.[0]?.text
        );

        // Ambil heading pertama sebagai title
        if (firstHeadingIndex !== -1) {
          title = resultJson.content[firstHeadingIndex].content[0].text;

          // Buang heading dari isi konten
          newContent = resultJson.content.filter((_, index) => index !== firstHeadingIndex);
        } else {
          title = "Newsletter tanpa judul";
          newContent = resultJson.content;
        }
      }

      // Set isi konten baru ke editor sementara untuk ambil HTML tanpa heading
      const originalContent = this.editor.getJSON(); // backup
      this.editor.commands.setContent({ type: "doc", content: newContent });
      const contentWithoutTitle = this.editor.getHTML();
      this.editor.commands.setContent(originalContent); // restore

      const payload = {
        type: "editor",
        title: title,
        content: contentWithoutTitle,
        state: state,
        cityId: this.selectedFilter?.cityId || 0,
        gender: this.selectedFilter?.gender,
        newsletterId: this.detailNewsletter?.id
      };

      if (this.selectedClass) payload.classId = this.selectedClass?.value;

      return payload;
    },
    async handleSave(state = "release", isPublish = true){
      this.isModalConfirmProcess = true;
      // Validasi Payload
      const validation = this.validatePayload();

      if (!validation.isValid) {
        // Tampilkan pesan error kepada pengguna
        validation.errors.forEach(error => {
          console.error(`Error di ${error.field}: ${error.message}`);
        });

        // Opsional: Berikan feedback kepada pengguna
        this.setToast("Validasi Gagal", "Periksa kembali data yang diperlukan sebelum menyimpan.");
        this.closePublishModal();
        return; // Hentikan proses jika validasi gagal
      }

      const payload = this.setPayloadToFetch(state);

      await this.$store.dispatch("Services/createNewsletter", payload);

      let message = null;
      if(!this.servicesState.status) {
        message = {
          title: "Newsletter gagal dibuat.",
          description: this.servicesState?.message || "Newsletter gagal ditambahkan dan dikirimkan ke email user.",
        };
        this.closePublishModal();
        this.setEvent(message, this.servicesState?.status);
        this.closePublishModal();
      } else {
        message = {
          title: "Newsletter berhasil dibuat.",
          description: this.servicesState?.message || "Newsletter berhasil ditambahkan dan dikirimkan ke email user.",
        };
        this.closePublishModal();
        this.setEvent(message, this.servicesState?.status)
        setTimeout(() => {
          this.$router.replace("/dashboard/newsletter")
        }, 2000)
      }

      this.isModalConfirmProcess = false;
    },
    /**
     * Set content of modal publish topic, like set title, description and the color of button
     */
    togglePublishModule() {
      if (this.isModalPublishModule) {
        this.modalConfirmData.title = "Terbitkan Newsletter!"
        this.modalConfirmData.btnYesVariant = 'primary'

        // Ambil title dari editor jika tidak ada newsletterDetail
        let title = this.newsletterDetail?.title;

        if (!title && this.editor) {
          const content = this.editor.getJSON()?.content || [];
          const heading = content.find(item => item.type === 'heading' && item.content && item.content[0]?.text);
          title = heading ? heading.content[0].text : 'Tanpa Nama';
        }

        this.modalConfirmData.description = `Anda Yakin Akan menerbitkan Newsletter
          <span class='text-primary text-limit limit-5' style='font-size: inherit; display: inline;'>${ title }</span>
          ini?`;
      } else {
        this.modalConfirmData.description = ``
      }
    },

    /**
     * @param {Object} payload - payload that will be send to server, it's gonna to check first the validation
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
      if(responseImport?.status) {
        this.content = responseImport?.data

        if (this.editor) {
          this.editor.commands.setContent(this.content);
        }
      }
      else {
        this.stateOfAutoSave = {
          icon: "ri-error-warning-line",
          label: "Gagal menyimpan",
          customStyleIcon: "text-danger",
          customStyleText: "text-danger",
          isLoadingAutoSave: false,
        }
        const data = responseImport?.data;
        this.setToast(data?.title, data?.description);
      }
    },

    /**
     * To set state of start and loading for auto save
     */
    async handleOnTyping(){
      // const payload = this.setPayloadToFetch("draft");
      // // Set state for auto save
      // this.stateOfAutoSave = {
      //   icon: "ri-refresh-line",
      //   label: "Menyimpan",
      //   customStyleIcon: "animate-load",
      //   customStyleText: "text-muted",
      // }
      // this.startAutoSave = true;

      // // Simpan ke localStorage dengan nama key unik
      // localStorage.setItem("draft-newsletter", JSON.stringify(payload));

      // // Delay supaya "Menyimpan" terlihat
      // await new Promise(resolve => setTimeout(resolve, 500));

      // this.stateOfAutoSave = {
      //   icon: "ri-checkbox-circle-line",
      //   label: "Disimpan",
      //   customStyleIcon: "text-success",
      //   customStyleText: "",
      //   isLoadingAutoSave: false,
      // }
    },
    /**
     * To run the function when autosave occurs
     */
    handleAutoSave(){

    },
    handleCreateExercise(){
      this.isModalExerciseShow = true;
    },
    handleShortcutSave(){

    },
  },
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