<template>
    <b-form id="module-forms" @submit="onSubmitForm" @reset="onResetForm" class="row">
        <div :class="customClass" >
            <div :class="isCard ? 'card' : ''">
                <div v-if="!hideHeader" :class="isCard ? 'card-header' : ''">
                    <h5 class="mb-3">{{ courseId == null ? isAssignment ? isPretest ? title : isTestCase ? 'Tes' : 'Tugas' : 'Modul' : course?.title  }}</h5>
                </div>
                <div :class="isCard ? 'card-body' : ''" v-if="isLoaded">
                    <b-alert
                        v-model="onEvent.show"
                        :variant="onEvent.variant"
                        dismissible
                    >
                        {{ onEvent.message }}
                    </b-alert>
                    <div v-for="(input, index) in inputForm" :key="index" >

                        <b-form-group
                            v-if="input.type != 'checkbox' && input.type !== 'select' && input.type !== 'textarea' && input.type !== 'datetime-local' && input.name !== 'attachments'"
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

                        <b-form-group
                            v-if="input.name == 'description' && input.type == 'textarea'"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <description-editor
                                v-if="showMarkdown"
                                v-model="input.value"
                                :placeholder="input.placeholder"
                            />
                        </b-form-group>

                        <b-form-group
                            v-if="input.type === 'checkbox'"
                            :label="input.label"
                            :label-for="input.name"
                            :description="input.description"
                        >
                            <b-form-checkbox
                                v-model="input.value"
                                switch
                                size="lg"
                                :id="input.name"
                                :name="input.name"
                                :required="input.required"
                                :checked="input.value"
                                class="d-flex align-items-center gap-2"
                            >
                                <p class="mt-1 mb-0" v-if="input.name === 'reassignable'">{{ input.value ? 'Iya' : 'Tidak' }}</p>
                                <p class="mt-1 mb-0" v-else>{{ input.value ? 'Active' : 'Disable' }}</p>
                            </b-form-checkbox>

                        </b-form-group>

                        <b-form-group
                            v-if="input.name !== 'description' && input.type == 'textarea'"
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

                        <MultiSelectTextForm
                            v-if="input.name === 'attachments' && !isPretest"
                            :attachments="attachments"
                            :input="input"
                            @onUpdateAttachments="onUpdateAttachment"
                        />

                        <b-form-group
                            v-if="input.name === 'course' && !isPretest"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <small v-if="errorCourseMessage" class="text-danger">{{ errorCourseMessage }}</small>
                            <v-select
                                class="select-city form-control mb-3"
                                :placeholder="`Pilih salah satu materi`"
                                :options="listCourse"
                                label="title"
                                id="selectedCourse"
                                v-model="selectedCourse"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                        Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                </template>
                            </v-select>
                        </b-form-group>

                        <b-form-group
                            v-if="input.name === 'type' && selectedKind !== 'course'"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <b-form-select
                                v-model="selectedType"
                                :disabled="selectedKind === 'course'"
                                :id="input.label"
                                :value="selectedType"
                                :options="optionType"
                                :required='input.required'
                            ></b-form-select>

                            <div v-if="input.name === 'type' && selectedType !== 'disabled' && selectedType !== 'link' && selectedType !== 'file' && !isLoadAttachment" class="my-2">
                                <label v-if="errorTypeMessage" for="selectedType" class="text-danger">{{ errorTypeMessage }}</label>
                                <v-select
                                    class="select-city form-control"
                                    :placeholder="`Pilih salah satu ${selectedType == 'studio' ? 'editor' : 'formulir'}`"
                                    :options="selectedType == 'form' ? listForms : listStudio"
                                    :label="selectedType == 'form' ? 'title' : 'name'"
                                    id="selectedType"
                                    v-model="selectedAttachment"
                                >
                                    <template v-slot:no-options="{ search, searching }">
                                        <template v-if="searching">
                                        Tidak ada hasil untuk <em>{{ search }}</em>.
                                        </template>
                                        <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                    </template>
                                </v-select>
                            </div>
                            <div v-if="selectedType !== 'link' && selectedType !== 'file' && isLoadAttachment" class="w-100 text-center mt-3">
                                <span class="text-muted">Sedang memuat...</span>
                            </div>

                        </b-form-group>

                        <b-form-group
                            v-if="input.type == 'datetime-local' && isAssignment"
                            :label="isPretest ? `${ input.label } Pretest` : input.label"
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
                            ></b-form-input>
                        </b-form-group>

                    </div>

                </div>
                <div class="text-center card-body" v-else>
                    <b-spinner label="Spinning"></b-spinner>
                </div>
            </div>
        </div>

        <div v-if="isLoaded" class="col-lg-12 card-wrapper">
            <div :class="isCard ? 'card' : ''">
                <div :class="isCard ? 'card-body' : ''">
                    <div class="row">
                        <div class="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                                <b-button
                                    class="px-4"
                                    type="submit"
                                    :disabled="isSubmit"
                                    variant="primary"
                                >
                                    Submit
                                </b-button>
                                <b-button
                                    v-if="isFromClass"
                                    class="px-4"
                                    :disabled="isSubmit"
                                    variant="danger"
                                    @click="onClickCancel()"
                                >
                                    Batal
                                </b-button>
                                <b-button
                                    v-else
                                    type="reset"
                                    class="px-4"
                                    :disabled="isSubmit"
                                    variant="danger"
                                >
                                    Reset
                                </b-button>
                            </div>
                        </div>
                    </div>
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
    </b-form>
</template>

<script>
import { mapState } from 'vuex';

import fieldForm from '@/store/global/course'
import MultiSelectTextForm from './ModuleForms/MultiSelectTextForm.vue';
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue"

export default {
    layout: 'dashboard',
    components: {
        MultiSelectTextForm,
        DescriptionEditor
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        action: {
            type: String,
            default: 'create',
        },
        customClass: {
            type: String,
            default: 'col-lg-8 card-wrapper',
        },
        moduleId: {
            type: Number,
            default: null
        },
        courseId: {
            type: Number,
            default: null,
        },
        courseName: {
            type: String,
            default: null,
        },
        classroomId: {
            type: Number,
            default: null,
        },
        isTestCase: {
            type: Boolean,
            default: false,
        },
        isAssignment: {
            type: Boolean,
            default: false,
        },
        isFromClass: {
            type: Boolean,
            default: false,
        },
        isPretest: {
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
        courseParam: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            showMarkdown: false,

            submitted: false,
            isLoaded: false,
            isSubmit: false,
            isBusy: true,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            inputForm: [],
            course: null,
            optionKind: [],
            selectedKind: null,
            optionType: [],
            selectedType: null,

            isLoadAttachment: false,
            errorTypeMessage: null,
            selectedAttachment: null,
            externalData: null,

            listForms: [],
            selectedForms: null,

            listStudio: [],
            selectedStudio: null,

            errorCourseMessage: "",
            listCourse: [],
            courses: [],
            role: 'module',
            selectedCourse: null,

            attachments: [],

            classroomSlug: this.$route?.params?.classroom ?? '',
        }
    },
    filters: {
        capitalize: function (value) {

            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)

        },
    },
    watch: {
        selectedKind() {
            if (this.selectedKind == 'assignment'){
                this.optionType = [
                    { value: 'disabled', text: 'Pilih salah satu', disabled: true },
                    { value: 'link', text: 'Link'},
                    { value: 'file', text: 'File'},
                    { value: 'form', text: 'Formulir'},
                    { value: 'studio', text: 'Editor'}
                ]
            } else {
                this.selectedType = 'disabled'
                this.optionType = [
                    { value: 'disabled', text: 'Pilih salah satu', disabled: true },
                ]
            }
        },
        selectedType() {
            if (this.selectedType == 'form') {
                this.fetchListForm()
                this.selectedStudio = null
                this.selectedAttachment = null
                if (this.selectedForms == null) this.selectedAttachment = null
                // else if (this.selectedAttachment !== null) this.selectedAttachment = null
            } else if (this.selectedType == 'studio') {
                this.fetchListStudio()
                this.selectedForms = null
                // this.selectedAttachment = null
                if (this.selectedStudio == null) this.selectedAttachment = null
                // else if (this.selectedAttachment !== null) this.selectedAttachment = null
            } else {
                this.selectedForms = null
                this.selectedStudio = null
                this.selectedAttachment = null
            }
        },
        selectedAttachment() {
            if (this.selectedType == 'form') this.selectedForms = this.selectedAttachment
            else this.selectedStudio = this.selectedAttachment
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            assignmentsState: (state) => state.Assignments,
            classroomModules: (state) => state.Services?.modules
        })
    },
    created() {
        this.getCredentials();
    },
    mounted() {
        setTimeout(() => {
            this.showMarkdown = true
        }, 500);
    },
    methods: {
        onClickCancel() {
            this.$emit('callbackCancel')
        },
        onUpdateAttachment(attachments) {
            this.attachments = attachments
        },
        dateFilter(value) {
            if (value) {
                const splitDot = value.split('.')
                const splitZ = value.split('Z')

                if (splitDot.length > 1) value = splitDot[0]
                else if (splitZ.length > 1) value = splitZ[0]
            }

            return value
        },
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
        getCredentials() {
            const url = this.$router.currentRoute.fullPath

            var res = url.split('/')
            res.shift()

            // this.title = res[2].toLowerCase()
            // this.courseId = res[3]
            // this.action = res[4].toLowerCase()
            // this.moduleId = res[5]
            if (this.courseId) this.detailCourse()
            else {
                if (this.isAssignment || this.isFromClass) {
                    this.fetchListCourse()
                }
                else {
                    this.fetchForm()
                }
            }

        },
        async detailCourse() {
            await this.$store.dispatch('Services/moduleDetail', this.courseId)

            if(!this.servicesState.status) {
                console.error('Failed fetch module', this.servicesState.message)
                this.setEvent(this.servicesState.message, this.servicesState.status)
            } else {
                this.course = this.servicesState.moduleDetail
                if (this.isAssignment || this.isFromClass) this.fetchListCourse()
                else {
                    this.listCourse.push(this.course);
                    this.fetchForm()
                }
            }
        },
        async fetchListCourse() {
            if (this.isAssignment) { // this.isFromClass
                let params = { slug: this.classroomSlug, state: 'visible' }

                await this.$store.dispatch('Services/classroomModules', params)

                if (!this.servicesState.status) {
                    console.error('failed fetch classroom modules: ', this.servicesState.message);
                    this.setEvent(this.servicesState.message, false)
                } else {
                    this.listCourse = this.servicesState.modules ?? []
                    this.fetchForm()
                }
            } else {
                this.listCourse = this.classroomModules ?? []
                this.fetchForm()
            }
        },
        fetchForm() {
            this.inputForm = fieldForm.inputFormModule
            if(this.action == 'edit') {

                this.onResetForm()
                this.setInitialCourse()
                setTimeout(() => {
                    if (this.isAssignment) this.fetchAssignment()
                    else this.fetchModule()
                }, 500);

            } else {
                this.onResetForm()

                this.setInitialCourse()
                this.isLoaded = true

            }
        },
        async fetchModule() {
            await this.$store.dispatch('Services/topicDetail', this.moduleId)

            if(!this.servicesState.status) {
                console.error('Failed get topic by module: ', this.servicesState?.message)
                this.setEvent(this.servicesState?.message, false)
                this.isLoaded = true
            } else {
                const dataModule = this.servicesState.topicDetail
                this.setForm(dataModule)

                this.isLoaded = true
            }
        },
        async fetchAssignment() {
            const params = {
                topicId: this.moduleId
            }
            await this.$store.dispatch('Assignments/detail', params)

            if(!this.assignmentsState?.status) {

                console.error('Failed get topic by detail: ', this.assignmentsState?.message)
                this.setEvent(this.assignmentsState, false)
                this.isLoaded = true

            } else {

                const dataModule = this.assignmentsState?.data
                this.setForm(dataModule)

                this.isLoaded = true

            }
        },
        setForm(dataModule) {
            this.inputForm.map((item, index) => {

                if(item.name == 'title') this.inputForm[index].value = dataModule?.title

                if(item.name == 'description') this.inputForm[index].value = dataModule?.description

                if(item.name == 'content') this.inputForm[index].value = dataModule?.content

                if(item.name == 'kind') this.selectedKind = dataModule?.kind;

                if(item.name === 'attachments' && !this.isPretest) this.attachments = dataModule?.attachments;

                if(item.name == 'deadline') this.inputForm[index].value = this.dateFilter(dataModule?.deadline) ;

                if(item.name == 'startDate') this.inputForm[index].value = this.dateFilter(dataModule?.startDate) ;

                if(item.name == 'reassignable') this.inputForm[index].value = dataModule.reassignable;

                if(item.name == 'type') {

                    this.selectedType = dataModule?.type;

                    if (this.selectedType == 'studio') this.selectedStudio = dataModule?.externalData
                    if (this.selectedType == 'form') this.selectedForms = dataModule?.externalData

                }
                if(this.isAssignment || item.name == 'course' && !this.isPretest) {
                    const found = this.listCourse?.find((item) => item.id == dataModule?.moduleId)
                    if (found) this.selectedCourse = found
                }

            })
        },
        setInitialCourse() {
            if (this.courseParam > 0) {
                const found = this.listCourse?.find((item) => item.id === this.courseParam)
                if (found) this.selectedCourse = found
            }
        },
        async fetchListForm() {
            if (this.listForms.length == 0) {
                this.isLoadAttachment = true
                await this.$store.dispatch('Forms/getAllForms')
                .then(() => {
                    var formsState = this.$store.state.Forms

                    if(!formsState.status) {
                        console.error('Failed get forms', formsState.message)
                        this.isLoadAttachment = false
                    } else {
                        this.listForms = formsState.forms ?? []
                        this.isLoadAttachment = false
                        // if (this.externalData !== null) {
                        //     this.selectedAttachment == this.externalData
                        //     // this.externalData = null
                        // }
                        if(this.selectedForms !== null) this.selectedAttachment = this.selectedForms
                    }
                })
            }
        },
        async fetchListStudio() {
            if (this.listStudio.length == 0) {
                this.isLoadAttachment = true
                await this.$store.dispatch('Studio/all')
                .then(() => {
                    var studioState = this.$store.state.Studio

                    if(!studioState.status) {
                        console.error('Failed get studio', studioState.message)
                        this.isLoadAttachment = false
                    } else {
                        this.listStudio = studioState.studio ?? []
                        this.isLoadAttachment = false
                        // if (this.externalData !== null) {
                        //     this.selectedAttachment == this.externalData
                            // this.externalData = null
                        // }
                        if(this.selectedStudio !== null) this.selectedAttachment = this.selectedStudio
                    }
                })
            }
        },
        onSubmitForm(event) {
            event.preventDefault()

            if ((this.isAssignment || this.isFromClass) && !this.selectedCourse && !this.isPretest) return this.setEvent(`Pilih Materi Terlebih Dahulu`, false)

            if (this.selectedKind == 'assignment') {
                if (this.selectedType == 'disabled') return this.setEvent(`Pilih Tipe Tugas Terlebih Dahulu`, false)
                else if (this.selectedType == 'form' && !this.selectedForms) return this.setEvent(`Pilih Formulir Terlebih Dahulu`, false)
                else if (this.selectedType == 'studio' && !this.selectedStudio) return this.setEvent(`Pilih Editor Terlebih Dahulu`, false)
            }

            this.onEvent.show = false

            var output = {}
            this.inputForm.forEach(item => {
                if (item.type == 'datetime-local') {

                    if (item.value) {

                        let split = item.value.split(':')
                        output[item.name] = split.length == 2 ? `${item.value}:00` : item.value

                    } else output[item.name] = null

                } else output[item.name] = item.value
            })
            output.kind = this.selectedKind
            output.type = this.selectedType

            if (!this.isPretest) output['attachments'] = this.attachments
            else delete output.attachments

            if(output.attachments != undefined || output.attachments != null) {
                if(output.attachments.length > 0) {
                    const files = output.attachments.map(obj => obj.file);
                    output['content'] = files.join('|');
                }
            }

            if (this.isAssignment || this.isFromClass) {

                output.classroomId = parseInt(this.classroomId)

                if (!this.isPretest) output.moduleId = parseInt(this.selectedCourse.id)
                else {
                    output.moduleId = -1
                    delete output.course
                }

            } else output.moduleId = parseInt(this.courseId)

            if (this.selectedKind == 'assignment' && this.selectedType !== 'link' && this.selectedType !== 'file') output.externalId = this.selectedType == 'form' ? this.selectedForms._id : this.selectedStudio.id

            if(this.isAssignment) this.fetchPostAssignments(output)
            else this.fetchPostModule(output)
        },

        async fetchPostModule(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')

            var dispatch = 'Services/createTopic'
            var payload = params

            if(this.action == 'edit') {
                dispatch = 'Services/editTopic'
                payload = {
                    id: this.moduleId,
                    params: params
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
                var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    if (this.isFromClass) {
                        this.$emit('submitted', this.servicesState.data.moduleId)
                        this.setEvent(message, this.servicesState.status)

                        setTimeout(() => {
                            this.$emit('callbackSubmit')
                        }, 1000);
                    }
                    else {
                        if(this.action !== 'edit') this.onResetForm()
                        this.setEvent(message, this.servicesState.status)
                        setTimeout(() => {
                            this.$router.go(-1)
                        }, 1000);
                    }
                }, 500);
            }
        },
        async fetchPostAssignments(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')

            var dispatch = 'Assignments/create'
            var payload = {
                params: params
            }

            if (this.action == 'edit') {
                dispatch = 'Assignments/edit'
                payload = {
                    params: params,
                    topicId: this.moduleId
                }
            }

            await this.$store.dispatch(dispatch, payload)

            if(!this.assignmentsState.status) {

                console.error(`Failed ${this.action == 'edit' ? 'edit' : 'create'} module`, this.assignmentsState.message)
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.setEvent(this.assignmentsState.message, this.assignmentsState.status)
                }, 500);

            } else {

                var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.onResetForm()
                    this.setEvent(message, this.assignmentsState.status)
                    setTimeout(() => {
                        if (this.isPretest) this.$emit('callbackSubmit')
                        else this.$router.go(-1)
                    }, 1000);
                }, 500);

            }
        },
        onResetForm() {
            this.selectedAttachment = null
            this.selectedKind = null
            this.selectedType = null
            this.selectedForms = null
            this.selectedStudio = null
            this.selectedCourse = null

            this.inputForm.forEach(item => {
                if(item.name == 'kind') {
                    this.selectedKind = this.isAssignment ? 'assignment' : 'course';
                    this.optionKind = item.options
                } else if(item.name == 'type') {
                    this.selectedType = 'disabled';
                    this.optionType = item.options
                } else item.value = '';
            });
        },
    },

}
</script>