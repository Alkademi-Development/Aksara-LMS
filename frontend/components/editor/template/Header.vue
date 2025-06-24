<template>
  <section class="header-editor">
    <div class="header-editor-content position-relative">
      <div class="d-flex align-items-center wrapper-brand">
        <i class="ri-arrow-left-line back" @click="back"></i>
        <nuxt-link to="/dashboard/classroom" class="d-lg-inline"> 
          <img v-if="logo?.primary" :src="logo?.primary" :class="`navbar-brand-img d-none d-lg-flex ${isSizeImageNotDefault ? 'navbar-brand-img--md' : ''}`" alt="Primary Logo">
          <img v-if="logo?.short" :src="logo?.short" :class="`navbar-brand-img d-lg-none ${isSizeImageNotDefault ? 'navbar-brand-img--md' : ''}`" alt="Short Logo">
        </nuxt-link>
      </div>
      <div class="d-flex wrapper-content">
        <div v-if="startAutoSave" class="wrapper-state__autosave d-flex align-items-center gap-2">
          <p :class="['mb-0', stateOfAutoSave?.customStyleText]">{{ stateOfAutoSave?.label }}</p>
          <i :class="[stateOfAutoSave?.icon, stateOfAutoSave?.customStyleIcon]"></i>
        </div>
        <div class="d-none d-lg-flex gap-4">

          <div class="d-lg-flex gap-4 wrapper-export-import">
            <!-- Import Button -->
            <b-button variant="primary" class="mr-0 d-flex align-items-center gap-2" @click="openFileExplorer" :disabled="isDisableButtonAction">
              <b-spinner v-if="importDocumentState?.isLoading" style="width: 1rem; height: 1rem;"></b-spinner>
              <span style="font-size: 12px;">Import Document</span>
              <input type="file" class="d-none" ref="fieldImport" @change="handleFileSelected" />
            </b-button>
  
            <!-- Export Button -->
            <b-button v-if="moduleDetail?.canDownload" variant="primary" class="mr-0 d-flex align-items-center gap-2" @click="exportTopic" :disabled="isDisableButtonAction">
              <b-spinner v-if="isLoadingExport" style="width: 1rem; height: 1rem;"></b-spinner>
              <span style="font-size: 12px;">Export as PDF</span>
            </b-button>
          </div>

          <!-- Save Button Topic -->
          <b-button v-if="moduleDetail?.state === 'draft'" variant="outline-primary" class="mr-0" @click="saveModule('release', true)" :disabled="isDisableButtonAction">Simpan dan Terbitkan Module</b-button>
          <b-button v-else class="mr-0" variant="outline-primary" @click="saveModule('draft')" :disabled="isDisableButtonAction">Simpan Sebagai Draft</b-button>
          <b-button variant="primary" @click="saveModule(moduleDetail?.state === 'draft' ? 'draft' : 'release')" :disabled="isDisableButtonAction">{{ moduleDetail ? 'Simpan Modul' : 'Terbitkan' }}</b-button>
        </div>
        <div class="d-lg-none position-relative wrapper-action">
          <div v-b-toggle.collapse-1 class="action-save border">
            <i class="ri-save-line"></i>
          </div>
          <b-collapse id="collapse-1" class="wrapper-collapse border position-absolute bg-white">
            <div class="wrapper-list">
              <div class="list-item" @click="moduleDetail?.state === 'draft' ? saveModule('release', true) : saveModule('draft')">{{ moduleDetail?.state === 'draft' ? 'Simpan dan Terbitkan Module' : 'Simpan Sebagai Draft'}}</div>
              <div class="list-item" @click="saveModule(moduleDetail?.state === 'draft' ? 'draft' : 'release')">{{ moduleDetail ? 'Simpan Modul' : 'Terbitkan' }}</div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import IMAGES_BRAND from "~/commons/constants/images";

// Mixins
import useImportDocument from "~/mixins/useImportDocument";

export default {
  mixins: [useImportDocument],
  props: {
      isBusy: {
        type: Boolean,
        default: false,
      },
      editor: {
        type: Object,
        default: {},
      },
      moduleDetail: {
        type: Object,
        default: {}
      },
      featureAction: {
        type: String,
        default: "",
      },
      startAutoSave: {
        type: Boolean,
        default: false,
      },
      stateOfAutoSave: {
        type: Object,
        default: () => {}
      },
      isFromClass: {
        type: Boolean,
        default: false,
      }
  },
  data() {
      return {
          setting: null,
          title: document.location.hostname,
          logo: {
            primary: null,
            short: null,
          },
          isLoadingExport: false,
          userRole: null,

          // Import
          fileImport: null,
      }
  },
  computed: {
      ...mapState({
          authState: (state) => state.Auth,
          sassState: (state) => state.Sass,
          downloadTopicState: (state) => state.Courses.downloadTopic,
          importDocumentState: (state) => state.Courses.importDocument,
      }),
      isSizeImageNotDefault(){
        return this.setting?.layout === 'sekolahbeta' || this.setting?.layout === 'alkademi';
      },
      isDisableButtonAction(){
        return this.importDocumentState?.isLoading || this.stateOfAutoSave?.isLoadingAutoSave || this.isLoadingExport || this.isBusy;
      }
  },
  watch: {
    'sassState.settings': {
      handler(state){
        if(state) this.setLogo();
      },
      deep: true,
    },
  },
  created() {
      this.initiateComponent();
  },
  methods: {
    /**
     * Initialization data or fetch api that needed in this component
     */
    initiateComponent(){
      this.initiateData();
      this.setLogo();
    },

    /**
     * Initializatio data that needed in this component
     */
    initiateData(){
      this.setting = this.sassState.settings;
      this.title = this.setting?.title ?? document.location.hostname;
      this.userRole = localStorage.getItem("user_kind");
    },
    setLogo(){
      this.logo.primary = this.setting?.logo_dark;
      if(this.setting?.layout === 'sekolahbeta') this.logo.short = this.setting?.logo_dark;
      else this.logo.short = IMAGES_BRAND?.[this.setting?.layout]?.short;
    },
    back(){
      /**
       * I make logic back like this instead using this.$router.back(-1) because the problem is when user edit the title of module and then click back, it's will show message module not found
       */
      if(this.isFromClass){
        const classroomSlug = this.$route?.params?.classroom;
        const moduleSlug = this.$route?.params?.course;
        const topicSlug = this.featureAction == 'edit' ? this.$route?.params?.module : this.moduleDetail?.slug;

        if(topicSlug) this.$router?.replace(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/module/${topicSlug}`);
        else this.$router?.replace(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}`);
      }else{
        const activeTab = localStorage.getItem("active_tab");
        const moduleSlug = this.$route?.params?.courseId;
        const topicSlug = this.featureAction == 'edit' ? this.$route?.params?.edit : localStorage.getItem("topicSlug");

        switch(activeTab){
          case "draft":
            if(topicSlug) this.$router.replace(`/dashboard/courses/draft/modules/${moduleSlug}/topic/${topicSlug}`);
            else this.$router.replace(`/dashboard/courses/draft/modules/${moduleSlug}`);
            break;
          case "library":
            if(topicSlug) this.$router.replace(`/dashboard/courses/modules/${moduleSlug}/topic/${topicSlug}`);
            else this.$router.replace(`/dashboard/courses/modules/${moduleSlug}`);
            break;
          case "myCourses":
            if(topicSlug) this.$router.replace(`/dashboard/courses/my-courses/modules/${moduleSlug}/topic/${topicSlug}`);
            else this.$router.replace(`/dashboard/courses/my-courses/modules/${moduleSlug}`);
            break;
        }
      }
    },
    saveModule(state, isPublish = false){
      this.$emit("onClickSave", state, isPublish);
    },
    async exportTopic(){
      this.isLoadingExport = true;

      const params = {
        slug: this.moduleDetail?.slug,
      }

      await this.$store.dispatch("Courses/fetchDownloadTopic", params);

      if(!this.downloadTopicState.status){
        console.error("failed to export as pdf");
        this.isLoadingExport = false;
      }else{
        const blob = new Blob([this.downloadTopicState?.data?.blob], { type: this.downloadTopicState?.data?.["content-type"] });

        // create URL Object
        const url = window.URL.createObjectURL(blob);
        
        // create element <a> for download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this.downloadTopicState?.data?.filename);
        
        // Append to body and trigger click
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        link.remove(); // clean up elemen <a>
        window.URL.revokeObjectURL(url);

        this.isLoadingExport = false;
      }
    },

    /**
     * Open File Explorer when clicked import button
     */
    openFileExplorer() {
      this.$refs.fieldImport.click();
    },

    /**
     * logic when user selected the file
     * 
     * @param {Object} event - Object event that represent from a DOM event
     */
    async handleFileSelected(event) {
      this.fileImport = event.target.files[0];
      if(this.fileImport) this.importTopic();

      // Reset file input to to can select the same file
      this.$refs.fieldImport.value = null;
    },

    /**
     * To Import Document
     */
    async importTopic(){
      // Set Loading
      this.$store.dispatch("Courses/setLoadingImportDocument", true);
      this.$emit("importing");

      try{
        const response = await this.importDocument(this.fileImport);

        if(!response.status){
          console.error("Failed to import : " + response?.message.title);
          let onToast = {
            title: response?.message.title,
            description: response?.message.description,
            isShow: true,
          }

          this.$emit("callbackImport", {
            status: false,
            data: onToast,
          });
          this.$store.dispatch("Courses/setLoadingImportDocument", false);
        }else{
          const content = this.removeParagraphWrapper(response.data);
          this.$emit("callbackImport", {
            status: true,
            data: content,
          });
          this.$store.dispatch("Courses/setLoadingImportDocument", false)
        }
      }catch(error){
        console.error(error);
        this.$store.dispatch("Courses/setLoadingImportDocument", false);
      }
    },

    removeParagraphWrapper(html) {
      // Ganti <p><img></p> menjadi <img>
      return html.replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, '$1');
    }
  }
}
</script>

<style scoped lang="scss">
.header-editor{
  background-color: white;
  padding: 15px 30px;
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 999;
  height: max-content;
  border-bottom: 1px solid rgba(0, 0, 0, .08);

  @media (min-width: 992px) {
    padding: 15px 50px;
  }

  .wrapper-brand{
    gap: 15px;
  }

  .wrapper-action{

    .btn-undo, .btn-redo{
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover,
      &.is-active{
        background: rgb(227, 227, 227);
      }

      i{
        color: rgb(107, 107, 107);
        font-size: 24px;
      }
    }

    span{
      font-size: 24px;
      color: rgb(107, 107, 107);
    }
  }

  .back{
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }

  .wrapper-content{
    gap: 15px;
  }

  .character-count{
    display: flex;
    flex-direction: column;
    align-items: end;
    border-right: 1px solid #cbcbcb;
    padding-right: 15px;


    p{
      font-family: var(--bs-font-paragraph), sans-serif;
      font-size: 14px;
      line-height: 150%;
      margin: 0;
      color: #313131;
    }
  }

  .header-editor-content{
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navbar-brand-img{
      max-width: 200px;
      max-height: 40px;
      object-fit: contain;

      @media (min-width: 992px) {
        &.navbar-brand-img--md{
          max-width: 200px;
          max-height: 48px;
        }
      }
    }
  }

  .wrapper-btn{
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .wrapper-state__autosave{
    p{
      font-weight: 400;
    }

    i{

      &.animate-load{
        animation-name: animateRotate;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }

      font-size: 18px;
      line-height: 0;
      columns: black;
    }
  }

  @keyframes animateRotate {
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
}

.wrapper-action{
  .action-save{
    // border: 1px solid var(--bs-light);
    line-height: 0px;
    padding: 10px;
    border-radius: 6px;

    i{
      font-size: 18px;
    }
  }

  .wrapper-collapse{
    width: max-content;
    top: 100%;
    right: 0;
    margin-top: 6px;
    // box-shadow: 0 2px 5px rgba(0, 0, 0, .15);
    border-radius: 6px;

    .wrapper-list{
      .list-item{
        padding: 12px;
        cursor: pointer;

        &:hover{
          background-color: rgb(237, 237, 237);
        }
      }
    }

  }
}

.wrapper-export-import{
  border-right: 2px solid rgb(190, 190, 190);
  padding-right: 16px;
}
</style>