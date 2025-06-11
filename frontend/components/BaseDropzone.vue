<template>
  <section class="wrapper-dropzone">
    <div v-if="isLoading || urlFileUploaded" class="dropzone-actions">
      <div v-if="urlFileUploaded" class="dropzone-actions--items">
        <a :href="urlFileUploaded" class="dropzone-actions--preview" target="_blank" rel="noopener noreferrer">Preview</a>
        <span @click="deleteFile" class="dropzone-actions--delete">Delete</span>
      </div>
      <b-spinner v-if="isLoading" small></b-spinner>
    </div>
    <div
      class="base-dropzone"
      id="dropzone"
      @click="onClickDropzone"
      @drop="onDropDropzone"
      @dragover.prevent
    >
      <input
        type="file"
        id="fileInput"
        hidden
        accept="image/*,.pdf,.doc,.docx"
        class="base-dropzone--input"
        ref="fileInput"
        @change="handleSelectedFile"
        :disabled="isLoading"
      >
      <div class="base-dropzone--content">
        <i class="uil uil-cloud-upload dropzone-content--icon"></i>
        <p>Drag & drop file here, or <span class="dropzone-content--browse" @click="onClickBrowse">browse</span></p>
        <p class="dropzone--content-filename" id="fileName">{{ selectedFileName || "No file selected" }}</p>
      </div>
    </div>
    <span v-if="messageError" class="message-error--dropzone">{{ messageError }}</span>
  </section>
</template>

<script>
import { BSpinner } from 'bootstrap-vue';
import { mapState } from 'vuex';

export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    fileDir: {
      type: String,
      default: "general"
    }
  },
  components: {
    BSpinner
  },
  watch: {
    value(newValue) {
      if(newValue && newValue !== this.urlFileUploaded) this.urlFileUploaded = newValue;
      else if(!newValue) this.deleteFile();
    }
  },
  computed: {
    ...mapState({
      uploadFileState: (state) => state?.Services?.uploadFile,
    })
  },
  data(){
    return {
      isLoading: false,
      urlFileUploaded: "",
      messageError: "",
      selectedFileName: "",
      selectedFile: null,
    }
  },
  methods: {
    /**
     * When on click the wrapper of dropzone, it's gonna to open the file explorer
     */
    onClickDropzone(){
      this.openFileExplorer();
    },

    /**
     * When on click the text browse, it's gonna to open the file explorer
     */
    onClickBrowse(event){
      event.stopPropagation();
      this.openFileExplorer();
    },

    /**
     * Open File explorer to selected file
     */
    openFileExplorer(){
      if(!this.isLoading) this.$refs.fileInput.click();
    },

    /**
     * Handle the selected file from the input
     * @returns {Promise<void>}
     */
    async handleSelectedFile(){
      const file = this.$refs.fileInput?.files?.[0];
      if (!file) return;

      this.selectedFileName = file.name;

      this.isLoading = true;
      await this.fetchFileUpload(file);
      this.isLoading = false;
    },

    /**
     * Fetch the file upload to the server and emit the event with the uploaded file URL
     * @param {File} file - The file to be uploaded
     * @returns {Promise<void>}
     */
    async fetchFileUpload(file){
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", `${this.fileDir}/${Date.now().toString()}`);

      await this.$store.dispatch("Services/uploadFile", formData);

      if(!this.uploadFileState?.status){
        this.messageError = "Telah terjadi kesalahan pada saat upload file, mohon untuk dicoba kembali atau tunggu beberapa saat lagi.";
        this.selectedFileName = "";
        console.error("Error uploading file:", this.uploadFileState?.message);
      }else{
        this.urlFileUploaded = `${process.env.baseUrlDrive}v1/${this.uploadFileState?.data}`;
        this.$emit("successUploaded", this.urlFileUploaded);
      }
    },

    /**
     * Reset the dropzone state
     */
    deleteFile(){
      this.urlFileUploaded = "";
      this.selectedFileName = "";
      this.messageError = "";
      this.$emit("deletedFile");
    },

    /**
     * Handle the drop event to allow file dropping
     * @param {DragEvent} event - The drag event
     */
    async onDropDropzone(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
          const file = files[0];
          this.selectedFileName = file.name;
          this.isLoading = true;
          await this.fetchFileUpload(file);
          this.isLoading = false;
      }
    }
  }
}
</script>


<style scoped>
@import "~/assets/css/ui/inputs/base-dropzone.css";
</style>