<template>
    <div class="card">
        <div class="card-header border-0 pb-0">
            <div class="row align-items-center">
                <div class="col-12">
                    <h5 class="mb-0">Edit profile</h5>
                </div>
            </div>
        </div>
        <div class="card-body">
            <b-alert
                v-model="onEvent.show"
                :variant="onEvent.variant"
                dismissible
                fade
            >
                {{ onEvent.message }}
            </b-alert>

            <b-form @submit="onSubmitForm" v-if="isLoaded">

                <div v-for="(input, index) in inputForm" :key="index" >

                    <div
                        v-if="input.type == 'image'"
                        class="form-group"
                    >
                        <Dropzone :dropzoneId="`dz-${input.name}-${index}`"
                        :multiple="false" :label="input.label" :disabled="input.disabled" acceptedFiles="image/*" filedir="profile" :value="input.value" v-model="input.value" @remove="input.value = null" @isUploading="isUploading = $event"/>
                    </div>

                    <b-form-group
                        v-if="input.type != 'select' && input.type != 'image' && input.type != 'textarea' && input.type != 'file' && input.type != 'password'"
                        :label="input.label"
                        :label-for="`${input.label}-profile`"
                        :description="input.description"
                    >
                        <b-form-input
                            v-model="input.value"
                            :id="`${input.label}-profile`"
                            :value="input.value"
                            :type="input.type"
                            :placeholder="input.placeholder"
                            :required="input.required"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        v-if="input.type == 'password'"
                        :label="inputConfirmPassword == '' ? 'Kata Sandi (Opsional)' : 'Kata Sandi *'"
                        label-for="inputProfilePassword"
                    >
                        <b-form-input
                            v-model="inputPassword"
                            id="inputProfilePassword"
                            :value="inputPassword"
                            :type="input.type"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        v-if="input.type == 'password'"
                        :label="inputPassword == '' ? 'Ulangi Kata Sandi (Opsional)' : 'Ulangi Kata Sandi *'"
                        label-for="inputConfirmPassword"
                    >
                        <b-form-input
                            v-model="inputConfirmPassword"
                            id="inputConfirmPassword"
                            :value="inputConfirmPassword"
                            :type="input.type"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        v-if="input.type == 'textarea'"
                        :label="input.label"
                        :label-for="input.label"
                        :description="input.description"
                    >
                        <b-form-textarea
                            v-model="input.value"
                            :id="input.label"
                            :value.sync="input.value"
                            :type="input.type"
                            :placeholder="input.placeholder"
                            :required='input.required'
                        ></b-form-textarea>
                    </b-form-group>
                </div>

                <!-- <div class="d-md-flex justify-content-md-end align-items-center"> -->
                    <!-- <div class="mb-2 mb-md-0">
                        <span>* Wajib Diisi</span>
                    </div> -->
                    <div v-if="!isSubmit" class="d-flex justify-content-end align-items-center">
                        <!-- <b-button variant="secondary" @click="$router.go(-1)">Kembali</b-button> -->
                        <b-button type="submit" variant="primary" :disabled="isUploading" :class="`${isUploading ? 'cursor--not-allowed' : ''}`">Simpan</b-button>
                    </div>
                    <div v-if="isSubmit" class="d-flex justify-content-end align-items-center">
                        <b-spinner label="Spinning"></b-spinner>
                    </div>
                <!-- </div> -->
                <!-- <div v-else class="text-center card-body">
                    <b-spinner label="Spinning"></b-spinner>
                </div> -->
            </b-form>
            <div class="text-center" v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>
    </div>
</template>
<script>
import Dropzone from "@/components/Dropzone.vue";
import fieldForm from '@/store/global/profile';
import { mapState } from "vuex";
import { toDateShort } from "~/commons/utils";

export default {
    components: {
        Dropzone
    },
    props: {
        user: Object,
        isUpdated: Boolean,
    },
    layout: 'dashboard',
    data() {
        return {
            isSubmit: false,
            isLoaded: false,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            userDetail: this.user,
            settings: null,

            photoProfile: null,
            inputPassword: "",
            inputConfirmPassword: "",
            inputForm: [],
            isUploading: false,
        }
    },
    computed: {
        ...mapState({
          sassState: (state) => state.Sass,
          servicesState: (state) => state.Services
        })
    },
    created() {
      this.settings = this.sassState.settings;
    },
    mounted() {
        this.fetchDataUser();
    },
    methods: {
        isEligableTierZero() {
          return !this.userDetail?.phone
          // || !this.userDetail?.itb?.nim
          // || !this.userDetail?.itb?.dptb
          && this.userDetail?.itb?.tier == 1;
        },
        isEligableForTier1() {
          const hasTierOne = !!this.userDetail?.itb?.major || !!this.userDetail?.itb?.year && this.userDetail?.itb?.tier == 1;
          return this.settings?.layout === 'belajarbersamapuja' && this.isStudent && hasTierOne
        },
        isEligableForTier2() {
          const hasTierTwo = !!this.userDetail?.itb?.work || !!this.userDetail?.itb?.experience || !!this.userDetail?.itb?.voluntary && this.userDetail?.itb?.tier == 2;
          return this.settings?.layout === 'belajarbersamapuja' && this.isStudent && hasTierTwo
        },
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
        async fetchDataUser() {
            this.userDetail = this.user
            this.inputForm = [...fieldForm.inputProfile]

            this.photoProfile = this.userDetail.photo

            this.inputForm.map((item, index) => {
                if (item.name == 'name') {
                    this.inputForm[index].value = this.userDetail.name
                }
                if (item.name == 'phone') {
                    this.inputForm[index].value = this.userDetail.phone
                }
                if (item.name == 'bio') {
                    this.inputForm[index].value = this.userDetail.bio
                }
                if (item.name == 'address') {
                    this.inputForm[index].value = this.userDetail.address
                }
                if (item.name == 'photo') {
                    this.inputForm[index].value = this.userDetail.photo ?? null
                }
                if(item?.name === 'birthDate'){
                  this.inputForm[index].value = this.userDetail?.birthDate ? toDateShort(this.userDetail?.birthDate) : '';
                }
                // if (this.settings?.layout === 'belajarbersamapuja') {
                //   if (item.name == 'nim' && this.userDetail?.itb?.nim) {
                //       this.inputForm[index].value = this.userDetail.nim ?? null
                //   }
                //   if (item.name == 'dptb' && this.userDetail?.itb?.dptb) {
                //       this.inputForm[index].value = this.userDetail.dptb ?? null
                //   }
                // }
            });

            // if (this.settings?.layout === 'belajarbersamapuja') {
            //   if (this.userDetail?.itb?.tier == 0 && this.isEligableTierZero()) {
            //     this.inputForm.push(
            //       {
            //         name: 'nim',
            //         label: 'NIM',
            //         type: 'text',
            //         value: '',
            //         placeholder: 'Masukkan NIM Anda',
            //         required: false
            //       },
            //       {
            //         name: 'dptb',
            //         label: 'Screenshot DPT',
            //         type: 'image',
            //         value: '',
            //         placeholder: '',
            //         required: false
            //       },
            //     )
            //   }
            // }

            this.isLoaded = true
        },
        async fetchPost(params) {
            this.isSubmit = true;

            await this.$store.dispatch('Services/updateProfile', params);

            if (!this.servicesState.status) {
                console.error('Failed to update profile', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isSubmit = false;
            } else {
                this.setEvent("Berhasil mengubah profile", true)
                this.$emit('updated')
                this.isSubmit = false;
            }
        },
        onSubmitForm(event) {
            event.preventDefault()

            if (this.inputPassword != "" && this.inputPassword.length < 8) {
                return this.setEvent("Kata sandi minimal 8 karakter", false)
            }
            if (this.inputConfirmPassword != "" && this.inputConfirmPassword.length < 8) {
                return this.setEvent("Kata sandi minimal 8 karakter", false)
            }
            if (this.inputPassword != "" && this.inputConfirmPassword == "") {
                return this.setEvent("Ulangi kata sandi", false)
            }
            if (this.inputConfirmPassword != "" && this.inputPassword == "") {
                return this.setEvent("Masukan kata sandi", false)
            }
            if (this.inputPassword != "" && this.inputConfirmPassword != "") {
                if (this.inputPassword != this.inputConfirmPassword) {
                    return this.setEvent("Kata sandi yang anda masukan tidak sama")
                }
            }

            var output = {}
            this.inputForm.map((item) => {
                if(item.type != 'select' && item.type != 'image') {
                    output[item.name] = item.value
                }
                if (item.type === 'image') {
                  if (Array.isArray(item.value) && item.value.length > 0) {
                    output[item.name] = item.value[0];
                  } else if (typeof item.value === 'string' && item.value !== '') {
                    output[item.name] = item.value;
                  } else {
                    output[item.name] = this[item.name];
                  }
                }
            })
            // output.photo = ''
            if (this.inputPassword != "") output.password = this.inputPassword
            else delete output.password

            // console.log(output, "PARAMS")
            this.fetchPost(output)
        },
    },

}
</script>

<style scoped>
.cursor--not-allowed{
    pointer-events: auto !important;
    cursor: not-allowed !important;
}
</style>