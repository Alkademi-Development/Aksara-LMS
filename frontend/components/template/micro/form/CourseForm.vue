<template>
    <div :class="customClass" >
        <div :class="isCard ? 'card' : ''">
            <div :class="isCard ? 'card-body' : ''" v-if="isLoaded">
                <b-alert 
                    v-model="onEvent.show"
                    :variant="onEvent.variant"
                    dismissible
                >
                    {{ onEvent.message }}
                </b-alert>
                <b-form @submit="onSubmitForm" @reset="onResetForm">
                    <b-row>
                        <b-col v-for="(input, index) in inputForm" :key="index" cols="12" :md="'12'">
                            <b-form-group
                                v-if="input.type != 'select' && input.type != 'textarea' && input.name != 'color' && input.name != 'cover' && input.type != 'wysiwyg' && input?.name != 'price'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <b-form-input
                                    v-model="input.value"
                                    :id="input.label"
                                    :value="input.value"
                                    :type="input.type"
                                    :placeholder="input.placeholder"
                                    :required='input.required'
                                    min="0"
                                    :max="'100'"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group
                                v-if="input?.name == 'price' && !isFromClass"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <b-form-input
                                    v-model="input.value"
                                    :id="input.label"
                                    :value="input.value"
                                    :type="input.type"
                                    :placeholder="input.placeholder"
                                    :required='input.required'
                                    min="0"
                                ></b-form-input>
                            </b-form-group>

                            <!-- <b-form-group
                                v-if="input.name == 'type'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <b-form-select
                                    v-model="input.value"
                                    :id="input.label"
                                    :value="input.value"
                                    :options="input.options"
                                    :required='input.required'
                                ></b-form-select>
                            </b-form-group> -->
                            <b-form-group
                                v-if="input.type == 'wysiwyg'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <!-- <text-markdown :value="input.value" :placeholder="input.placeholder" @onChange="input.value = $event"/> -->
                                <description-editor
                                    v-model="input.value"
                                    :placeholder="input.placeholder"
                                />
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

                            <div v-if="input.type == 'image'" class="form-group">
                                <Dropzone 
                                    :dropzoneId="input.name" 
                                    :label="input.label" 
                                    :disabled="input.disabled" 
                                    filedir="announcement" 
                                    acceptedFiles="image/*" 
                                    :value="input.value" 
                                    v-model="input.value"
                                    :withRemove="true"
                                    @isUploading="setUploadingStatus"
                                    @input="contentImage = $event"
                                    @remove="input.value = null, contentImage = null"/>
                            </div>

                            <b-form-group
                                v-if="input.type == 'color'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >

                                <SelectColor 
                                    :options="colorTemplate"
                                    :value="selectedColor"
                                    :contentImage="!!contentImage"
                                    @setColor="selectedColor = $event"
                                />

                            </b-form-group>
                        </b-col>
                    </b-row>

                    <div v-if="!isStepProcess" class="row">
                        <div class="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                                <b-button v-if="isFromClass" :disabled="isSubmit || isUploading" variant="danger" @click="$emit('callbackCancel')">Batal</b-button>
                                <b-button v-else type="reset" :disabled="isSubmit || isUploading" variant="danger">Reset</b-button>
                                <b-button type="submit" :disabled="isSubmit || isUploading" variant="primary">Submit</b-button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="row mt-4">
                        <div class="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                                <b-button type="reset" :disabled="isSubmit || isUploading" variant="danger">Reset</b-button>
                                <b-button type="button" :disabled="isSubmit || isUploading" variant="secondary" @click="$emit('onChangePage', 'list')">Kembali</b-button>
                                <b-button type="submit" :disabled="isSubmit || isUploading" variant="primary">Lanjutkan</b-button>
                            </div>
                        </div>
                    </div>
                </b-form>
            </div>
            <div class="card-body text-center" v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>
        <b-modal id="modalLoading" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center">
                <b-spinner label="Spinning" class="mr-3"></b-spinner><span>Loading...</span>
            </div>
        </b-modal>
    </div>
</template>

<script>
import fieldForm from '@/store/global/course'
import { mapState } from 'vuex'

import { toDecrypt, toEncrypt } from '~/commons/utils'

import SelectColor from "@/components/template/micro/inputs/SelectColor.vue";
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue"

export default {
    layout: 'dashboard',
    components: {
        SelectColor,
        DescriptionEditor
    },
    props: {
        title: {
            type: String,
            default: 'Create Materi',
        },
        action: {
            type: String,
            default: 'create',
        },
        customClass: {
            type: String,
            default: 'col-lg-8 card-wrapper',
        },

        courseId: {
            type: Number,
            default: -1,
        },
        classroomId: {
            type: Number,
            default: -1,
        },

        isFromClass: {
            type: Boolean,
            default: false,
        },
        hideHeader: {
            type: Boolean,
            default: false,
        },
        isCard: {
            type: Boolean,
            default: true,
        },
        isStepProcess: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // action: '',
            // title: '',
            // courseId: null,

            submitted: false,
            isLoaded: false,
            isSubmit: false,

            // From Class
            // isFromClass: false,
            // classroomId: -1,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            inputForm: [],
            course: [],
            colorTemplate: [],
            contentImage: null,
            selectedColor: null,
            moduleDetail: null,
            isUploading: false,
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            classroomDetailState: (state) => state.Services.classroomDetail,
            getActiveTab: (state) => state?.Layouts?.activeTab,
        })
    },
    watch: {
        contentImage(newValue, oldValue){
            if(newValue) this.selectedColor = "";
            if(!newValue) this.selectedColor = this.colorTemplate[0].color;
        }
    },
    created() {
        this.getCredentials();
    },
    methods: {
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            // this.title = res[1]
            // this.action = res[2].split('?')[0]
            // this.courseId = res[3]

            // if (this.$route?.query?.fromClass == 'true') this.isFromClass = true
            // if (this.$route?.query?.classroomId) this.classroomId = parseInt(this.$route?.query?.classroomId)

            this.fetchForm()

        },
        fetchForm() {
            this.inputForm = fieldForm.inputFormCourse
            this.colorTemplate = fieldForm.colorTemplate
            this.selectedColor = this.colorTemplate[0].color;
            if(this.action == 'edit' && this.courseId != null) {
                this.onResetForm()
                if(this.isFromClass) this.fetchClassroomDetailModule();
                else this.fetchDataCourse()
            } else {
                this.onResetForm()
                this.inputForm.map((input) => {
                    if(input.name === 'price') input.value = 0;
                });
                this.isLoaded = true
            }
        },
        async fetchDataCourse() {
            await this.$store.dispatch('Services/moduleDetail', this.courseId)

            if(!this.servicesState.status) {
                console.error('Failed fetch module', this.servicesState.message)
                this.setEvent(this.servicesState.message, stateCourse.status)
                this.isLoaded = true
            } else {
                // console.log('Success fetch courses', this.servicesState.courses)
                var moduleDetail = this.servicesState.moduleDetail
                const isCoverImageUrl = this.isCoverImageUrl(moduleDetail?.cover);

                this.inputForm.map((item, index) => {
                    if(item.name === 'cover' && isCoverImageUrl){
                        item.value = moduleDetail?.cover;
                        this.contentImage = moduleDetail?.cover;
                        this.selectedColor = "";
                    }else if(item.name === "color" && !isCoverImageUrl){
                        // Set value of field cover image to be null
                        const findIndexImage = this.inputForm.findIndex((item) => item.name === "cover");
                        this.inputForm[findIndexImage].value = "";

                        const founded = this.colorTemplate.find(item => item.color == moduleDetail.cover);
                        this.contentImage = null;
                        if(founded) this.selectedColor = founded?.color;
                        else this.selectedColor = this.colorTemplate[0].color;
                    }else{
                        this.inputForm[index].value = moduleDetail[item.name];
                    }
                })
                this.isLoaded = true
            }
        },
        async fetchClassroomDetailModule(){
            const params = {
                moduleId: this.courseId,
                classroomId: this.classroomId
            }
            await this.$store.dispatch('Services/classroomModuleDetail', params);

            if(!this.servicesState.status) {
                console.error('Failed fetch module', this.servicesState.message)
                this.setEvent(this.servicesState.message, stateCourse.status)
                this.isLoaded = true;
            } else {
                this.moduleDetail = this.servicesState.moduleDetail;
                const isCoverImageUrl = this.isCoverImageUrl(this.moduleDetail?.cover);

                this.inputForm.map((item, index) => {
                    if(item.name === 'cover' && isCoverImageUrl){
                        item.value = this.moduleDetail?.cover;
                        this.contentImage = this.moduleDetail?.cover;
                        this.selectedColor = "";
                    }else if(item.name === "color" && !isCoverImageUrl){
                        // Set value of field cover image to be null
                        const findIndexImage = this.inputForm.findIndex((item) => item.name === "cover");
                        this.inputForm[findIndexImage].value = "";

                        const founded = this.colorTemplate.find(item => item.color == this.moduleDetail.cover);
                        this.contentImage = null;
                        if(founded) this.selectedColor = founded?.color;
                        else this.selectedColor = this.colorTemplate[0].color;
                    }else{
                        this.inputForm[index].value = this.moduleDetail[item.name];
                    }
                })
                this.isLoaded = true
            }

        },
        async fetchPostCourse(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')
            var dispatch = this.isFromClass ? 'Services/classroomCreateModule' : 'Services/createModule';
            var payload = params

            if (this.isFromClass) {
                payload.classroomId = this.classroomId;
                // payload = {...params, classroomId: this.classroomDetailState?.id}
            }

            if (this.isStepProcess) {
                payload = {...params, classroomId: toDecrypt(localStorage.getItem('classroomId'))}
            }

            if (this.action == 'edit') {
                if(this.isFromClass){
                    dispatch = 'Services/classroomEditModule'

                    payload = {
                        moduleId: this.courseId,
                        params: payload,
                    }
                }else{
                    dispatch = 'Services/editModule'
    
                    payload = {
                        id: this.courseId,
                        params: params,
                    }
                }

            }

            await this.$store.dispatch(dispatch, payload)
            
            if(!this.servicesState.status) {
                console.error(`Failed ${this.action == 'edit' ? 'edit' : 'create'} module`, this.servicesState.message)
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.setEvent(this.servicesState.message, this.servicesState.status)
                }, 500);
            } else {
                // console.log('Success post course', this.servicesState.courses)
                var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                this.isSubmit = false
                if(this.action != 'edit') this.onResetForm()
                if(!this.isFromClass) this.$bvModal.hide('modalLoading')

                setTimeout(() => {
                    
                    if (this.isFromClass) {
                        // this.addToClass(this.servicesState.data, message)
                        this.$bvModal.hide('modalLoading')
                        this.setEvent(message, this.servicesState.status)
                        this.$emit('submitted', this.servicesState.data.id)

                        setTimeout(() => {
                            this.$emit('callbackSubmit') 
                        }, 1000);
                    }
                    else {
                        this.setEvent(message, this.servicesState.status)
                        setTimeout(() => {
                            localStorage.setItem('courseId', toEncrypt(this.servicesState.data.id))
                            if(this.getActiveTab === 'library') this.$router.replace({path: `/dashboard/courses/draft/modules/${this.servicesState.data?.slug}`})
                            else if(this.getActiveTab === 'myCourses') this.$router.replace({path: `/dashboard/courses/my-courses/modules/${this.servicesState.data?.slug}`})
                            else if(this.getActiveTab === 'draft') this.$router.replace({path: `/dashboard/courses/draft/modules/${this.servicesState.data?.slug}`})
                        }, 1000);
                    }

                }, 500);
            }
        },
        onSubmitForm(event) {
            event.preventDefault()
            var output = {}
            this.inputForm.forEach(item => {
                if (item.name == 'minScore' || item?.name == 'price') output[item.name] = parseInt(item.value)
                else if(item.name === "cover" || item.name === "color") output.cover = this.contentImage ? this.contentImage : this.selectedColor;
                else output[item.name] = item.value
            })

            // const params = new FormData();

            // params.append('name', output['name'])
            // params.append('description', output['description'])
            // params.append('minScore', output['minScore'])
            // params.append('method', output['method'])
            // params.append('totalMeeting', output['totalMeeting'])
            // if(this.action == 'edit') params.append('id', this.courseId)

            // for(var pair of params.entries()) {
            //     console.log(pair[0]+ ': '+ pair[1]);
            // }
            // console.log(output, "PARAMS")
            this.fetchPostCourse(output)
        },
        async addToClass(data, successMessage) {
            await this.$store.dispatch('Services/classroomAssignModule', { classroomId: this.classroomId, moduleId: data.id })

            if(!this.servicesState.status) {

                console.error(`Failed add to class: ${ this.servicesState.message }`, this.servicesState.message)
                this.setEvent(this.servicesState.message, this.servicesState.status)
                this.$bvModal.hide('modalLoading')

            } else {
                
                this.$bvModal.hide('modalLoading')
                this.setEvent(successMessage, this.servicesState.status)
                this.$emit('submitted', data.id)

                setTimeout(() => {
                    this.$emit('callbackSubmit') 
                }, 1000);
            }
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.name == 'type') item.value = this.$route.query.type ?? 'module'
                else item.value = '';
            });
        },
        isCoverImageUrl(url) {
            if (url) {
            const imageExtensionRegex =
                /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
            return imageExtensionRegex.test(url);
            }
        },
        setUploadingStatus(status) {
            this.isUploading = status
        },
    },
    
}
</script>

<style>

</style>