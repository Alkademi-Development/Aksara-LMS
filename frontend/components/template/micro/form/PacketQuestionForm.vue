<template>
    <div class="col-lg-8 card-wrapper" >
        <div class="card">
            <!--<div class="card-header">
                <div class="row">
                    <div class="col d-flex align-items-center">
                        <CircleBackButton class="d-inline-block" />
                        <h3 class="d-inline-block mb-0">{{ action | capitalize }} Pertanyaan</h3>
                    </div>
                </div>
            </div>-->
            <div class="card-body" v-if="isLoaded">
                <b-alert 
                    v-model="onEvent.show"
                    :variant="onEvent.variant"
                    dismissible
                >
                    {{ onEvent.message }}
                </b-alert>
                <b-form @submit="onSubmitForm" @reset="onResetForm">
                    <b-row>
                        <b-col v-for="(input, index) in inputForm" :key="index" cols="12">
                            <b-form-group
                                v-if="input.type != 'select' && input.type != 'textarea' && input.type != 'choices' && input.type != 'image'"
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
                                    max="100"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group
                                v-if="input.type == 'textarea' && input.name == 'question'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <DescriptionEditor
                                    v-model="input.value"
                                    :placeholder="input.placeholder"
                                />
                            </b-form-group>

                            <!-- Image -->
                            <div
                                v-if="input.type == 'image'"
                                class="form-group"
                            >
                                <Dropzone :dropzoneId="input.name" :label="input.label" :disabled="input.disabled" filedir="forms/question" acceptedFiles="image/*" :value="input.value" v-model="input.value" @remove="input.value = null"/>
                            </div>

                            <!-- Choiches -->
                            <b-form-group
                                v-if="input.name == 'choices' && (choicesOptions.includes(selectedQuestionType) || selectedFormType == ' quiz') ">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <div>
                                        <label for="" class="d-block mb-0 mr-2">{{ input.label }}</label>
                                        <p class="text-muted text-sm mb-2">Centang pilihan yang benar</p>
                                    </div>
                                    <b-button class="btn-add-choices text-primary" @click="manageChoices('add')">Tambah Pilihan</b-button>
                                </div>
                                <div v-for="(choice, choicesIndex) in listChoices" :key="choicesIndex" class="d-flex align-items-center justify-content-between mb-4">
                                    <b-form-input
                                        v-model="listChoices[choicesIndex].value"
                                        :id="`choices-${choicesIndex}`"
                                        :value="listChoices[choicesIndex].value"
                                        type="text"
                                        :placeholder="`Tulis pilihan ke ${choicesIndex + 1}`"
                                        required
                                    ></b-form-input>
                                    <b-button :variant="choice.correct ? 'success' : 'transparent'" size="sm" class="ml-4" @click="manageChoices('correct', choicesIndex)">
                                        <i class="fas fa-check"></i>
                                    </b-button>
                                    <b-button v-if="listChoices.length > 2" variant="danger" size="sm" class="ml-4" @click="manageChoices('delete', choicesIndex)">
                                        <i class="fas fa-trash"></i>
                                    </b-button>
                                </div>
                            </b-form-group>

                            <!-- Select Options -->
                            <b-form-group
                                v-if="input.name == 'type' && selectedFormType == 'basic'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <b-form-select
                                    v-model="selectedQuestionType"
                                    :id="input.label"
                                    :value="input.value"
                                    :options="input.options"
                                    :required='input.required'
                                ></b-form-select>
                            </b-form-group>

                            <b-form-group
                                v-if="input.name == 'category'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <v-select
                                    class="select-city form-control mb-3"
                                    :placeholder="`Pilih salah satu`"
                                    :options="listCategory"
                                    label="name"
                                    id="selectedType"
                                    v-model="selectedCategory"
                                >
                                    <template v-slot:no-options="{ search, searching }">
                                        <template v-if="searching">
                                        Tidak ada hasil untuk <em>{{ search }}</em>.
                                        </template>
                                        <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                    </template>
                                </v-select>
                            </b-form-group>

                        </b-col>
                    </b-row>

                    <div class="row">
                        <div class="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                                <b-button type="reset" :disabled="isSubmit" variant="danger">Reset</b-button>
                                <b-button type="submit" :disabled="isSubmit" variant="primary">Submit</b-button>
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
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue"
import fieldForm from '@/store/global/form'
import { mapState } from 'vuex'

export default {
    layout: 'dashboard',
    components: {
        DescriptionEditor
    },
    props: {
        paketId: String,
        questionId: String
    },
    computed: {
        ...mapState({
            formState: (state) => state.Forms
        })
    },
    data() {
        return {
            action: '',
            title: '',
            formId: null,

            submitted: false,
            isLoaded: false,
            isSubmit: false,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            inputForm: [],
            course: [],
            listChoices: [{ correct: false, type: "text", value: "" }, { correct: false, type: "text", value: "" }],
            listCategory: [],
            selectedCategory: null,

            selectedFormType: 'basic',
            selectedQuestionType: 'short_text',

            choicesOptions: ['choice', 'multiple_choice', 'dropdown']
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
    },
    created() {
        this.getCredentials()
    },
    methods: {
        manageChoices(action, index = -1) {
            if (action == 'add') {
                const object = {
                    correct: false,
                    type: "text",
                    value: ""
                }
                this.listChoices.push(object)
            }
            if (action == 'correct' && index != -1) {
                this.listChoices.map((item, ii) => {
                    if (index == ii) {
                        this.listChoices[ii].correct = true
                    } else {
                        this.listChoices[ii].correct = false
                    }
                })
            }
            if (action == 'delete' && index != -1) this.listChoices.splice(index, 1)
        },
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

            // this.title = res[2]
            this.formId = this.paketId || res[3]
            this.action = res[4].includes("?") ? res[4].replace(/\?.*/, "") : res[4]
            this.questionId = this.questionId || res[5]

            this.getCategory()

        },
        async getCategory() {
            this.isLoaded = false

            await this.$store.dispatch('Forms/categories')
            .then(() => {
                var formsState = this.$store.state.Forms

                if(!formsState.status) {
                    console.error('Failed get categories', formsState.message)
                    this.setEvent(this.formState.message, stateCourse.status)
                    this.isLoaded = true
                } else {
                    this.listCategory = formsState.categories
                    this.fetchForm()
                }
            })
        },
        fetchForm() {
            this.inputForm = fieldForm.inputFormPacketQuestion
            
            if(this.action == 'edit' && this.formId != null) {
                this.onResetForm()
                this.fetchDetailForm().then(() => {
                    this.fetchDataDetail()
                })
            } else {
                this.onResetForm()
                this.fetchDetailForm()
                this.isLoaded = true
            }
        },
        async fetchDetailForm() {
            await this.$store.dispatch('Forms/formDetail', this.formId)

            if(!this.formState.status) {
                console.error('Failed fetch form', this.formState.message)
                this.setEvent(this.formState.message, stateCourse.status)
            } else {
                const form = this.formState.data
                this.selectedFormType = form.formType
                this.selectedQuestionType = form.formType == 'basic' ? 'short_text' : 'choice'
            }
        },
        async fetchDataDetail() {
            const params = {
                formId: this.formId,
                questionId: this.questionId.replace(/\?.*/, "")
            }
            await this.$store.dispatch('Forms/formDetailQuestion', params)

            if(!this.formState.status) {
                console.error('Failed fetch module', this.formState.message)
                this.setEvent(this.formState.message, stateCourse.status)
                this.isLoaded = true
            } else {
                // console.log('Success fetch courses', this.formState.courses)
                var form = this.formState.data
                this.inputForm.map((item, index) => {
                    if(item.name == 'image') {
                        this.inputForm[index].value = form.image
                    }
                    if(item.name == 'question') {
                        this.inputForm[index].value = form.question
                    }
                    if(item.name == 'category') {
                        const category = form.category
                        this.selectedCategory = {
                            id: category._id,
                            name: category.name,
                            score: category.score
                        }
                    }
                    if(item.name == 'choices') {
                        if(form.choices) this.listChoices = form.choices
                    }
                    if(item.name == 'type') {
                        this.selectedQuestionType = form.type
                    }
                })
                this.isLoaded = true
            }
        },
        async fetchPostData(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')
            var dispatch = 'Forms/formAddQuestion'
            var payload = {
                formId: this.formId,
                params: params
            }

            if (this.action == 'edit') {
                dispatch = 'Forms/formEditQuestion'
                payload = {
                    formId: this.formId,
                    questionId: this.questionId.replace(/\?.*/, ""),
                    params: params,
                }
            }

            await this.$store.dispatch(dispatch, payload)
            
            if(!this.formState.status) {
                console.error(`Failed ${this.action == 'edit' ? 'edit' : 'create'} module`, this.formState.message)
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.setEvent(this.formState.message, this.formState.status)
                }, 500);
            } else {
                // console.log('Success post course', this.formState.courses)
                var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                this.isSubmit = false
                if(this.action != 'edit') this.onResetForm()
                this.$bvModal.hide('modalLoading')

                setTimeout(() => {
                    this.setEvent(message, this.formState.status)
                    this.$router.go(-1)
                }, 500);
            }
        },
        onSubmitForm(event) {
            event.preventDefault()

            let output = {}
            let isFillMarkdown = true

            this.inputForm.forEach(item => {
                let object = item.value

                if (item.name == 'question' && object == '') isFillMarkdown = false
                else if (item.name == 'category') object = this.selectedCategory
                else if (item.name == 'choices') object = this.listChoices
                else object = item.value


                output[item.name] = object
            })

            if (!isFillMarkdown) return this.setEvent('Isi pertanyaan terlebih dahulu', false)

            if (this.selectedCategory == null) {
                this.setEvent('Pilih kategori soal terlebih dahulu', false)
                return
            }
            if (!!this.listChoices || this.listChoices?.length > 0) {
                let isCorrect = false
                this.listChoices.map((item) => {
                    if (item.correct) isCorrect = true
                })

                if (!isCorrect && (this.choicesOptions.includes(this.selectedQuestionType) || this.selectedFormType == 'quiz')) return this.setEvent('Centang pilihan yang benar terlebih dahulu', false)
            }

            // output.type = 'choice'
            output.type = this.selectedFormType == 'quiz' ? 'choice' : this.selectedQuestionType
            if (!this.choicesOptions.includes(this.selectedQuestionType)) output.choices = null
            output.required = true

            // console.log(output, "PARAMS")
            this.fetchPostData(output)
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.type == 'image') item.value = null
                else item.value = '';
            });

            this.selectedCategory = null
            this.listChoices = [{ correct: false, type: "text", value: "" }, { correct: false, type: "text", value: "" }]
        }
    },
    mounted() {
        // console.log(this.paketId)
    }
}
</script>

<style scoped>
.btn-add-choices {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
}
</style>