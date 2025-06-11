<template>
  <b-card class="border">
    <h4 class="title mb-4 text-capitalize">Pengumpulan {{ assignmentDetail?.type }} Jawaban</h4>
    <b-alert 
        v-model="onEvent.show"
        :variant="onEvent.variant"
        dismissible
        class="text-sm"
    >
        {{ onEvent.message }}
    </b-alert>
    <div class="mb-4">
      <InputPrefix
        v-if="assignmentDetail?.type === 'link'"
        :placeholder="inputLink?.placeholder"
        iconPrefix="ri-link"
        :type="inputLink?.type"
        :id="inputLink?.id"
        :value="inputLink?.value"
        :disabled="inputLink?.disabled"
        @onChange="inputLink.value = $event"
      />
      <template v-if="assignmentDetail?.type === 'file'">
        <Dropzone
          :dropzoneId="inputFile?.name"
          filedir="class" 
          acceptedFiles="image/*, application/pdf" 
          :value="inputFile.value" 
          v-model="inputFile.value"
          :withRemove="true"
          style="margin-top: -0.5rem;"
          @remove="inputFile.value = null"
          @isUploading="isUploading = $event"
        />
        <p class="extension-detail mt-3"><span class="text-red">*</span>Upload file dengan ekstensi .jpg / .png / .pdf / .webp</p>
      </template>
    </div>
    <div class="w-100 d-flex justify-content-end">
      <b-button v-if="isAssignmentEntered && isShowButtonSubmit" variant="primary" @click="onSubmitForm" :disabled="isSubmit || isUploading" :class="`submit-btn ${isSubmit || isUploading ? 'submit-btn--disable' : ''}`">
        <div v-if="isSubmit" class="d-flex align-items-center gap-2 loading-state">
          <b-spinner class="align-middle"></b-spinner>
          Loading...
        </div>
        <template v-else>Submit</template>
      </b-button>
    </div>
  </b-card>
</template>

<script>
import InputPrefix from '@/components/template/micro/inputs/InputPrefix.vue';
import Dropzone from '@/components/Dropzone.vue';

import { mapState } from 'vuex';

export default {
  components: {
    InputPrefix,
    Dropzone
  },
  props: {
    assignmentDetail:{
      type: Object,
      default: () => {},
    },
    classroomDetail:{
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
        servicesState: (state) => state.Services,
    }),
    isShowButtonSubmit(){
      return !this.assignmentDetail?.passed;
    },
    isAssignmentEntered(){
      return (this.assignmentDetail?.type === 'file' && this.inputFile?.value) || (this.assignmentDetail?.type === 'link' && this.inputLink?.value);
    },
  },
  data(){
    return{
      inputFile: {
        name: "fileAssignmentModule",
        value: '',
        placeholder: '',
        required: true
      },
      inputLink: {
        placeholder: "Masukan Link Disini",
        type: "text",
        id: "link-assignment",
        value: "",
        disabled: false,
      },
      isSubmit: false,

      // Alert Event
      onEvent: {
          message: '',
          show: false,
          status: false,
          variant: ''
      },

      isUploading: false,
    }
  },
  methods: {
    setEvent(message, status) {
      this.onEvent.message = message
      this.onEvent.status = status
      this.onEvent.variant = status ? 'success' : 'warning'
      this.onEvent.show = true

    },
    async onSubmitForm() {
      this.isSubmit = true
      
      if(this.assignmentDetail.type == 'link') {

          const params = {
              classroomId: this.classroomDetail?.id,
              topicId: this.assignmentDetail?.topicId,
              link: this.inputLink?.value
          }

          await this.$store.dispatch('Services/classroomAssignLink', params)

          if(!this.servicesState.status) {
              this.setEvent(this.servicesState.message, false);
              this.isSubmit = false
          } else {
            this.setEvent("Berhasil menyerahkan tugas", true);
            this.isSubmit = false;

            setTimeout(() => {
              this.$emit("submitted");
            }, 1000);
          }

      } else if (this.assignmentDetail.type == 'file') {

        const params = {
          classroomId: this.classroomDetail?.id,
          topicId: this.assignmentDetail?.topicId,
          link: this.inputFile?.value
        }

        await this.$store.dispatch('Services/classroomAssignLink', params)

        if(!this.servicesState.status) {
            this.setEvent(this.servicesState?.message, false)
            this.isSubmit = false
        } else {
          this.setEvent("Berhasil menyerahkan tugas", true);
          this.isSubmit = false;

          setTimeout(() => {
            this.$emit("submitted");
          }, 1000);
        }

      }
    },
  }
}
</script>


<style scoped lang="scss">
.extension-detail{
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #000;
}

.title{
  font-size: 18px;
}

.submit-btn{

  &.submit-btn--disable{
    cursor: not-allowed;
  }

  .loading-state{
    span{
      width: 14px;
      height: 14px;
    }

    strong{
      color: white;
    }
  }

  span{
    font-size: 12px;
    font-weight: 500;
  }
}
</style>