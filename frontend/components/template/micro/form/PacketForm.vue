<template>
    <div class="col-lg-8 card-wrapper" >
        <div class="card">
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
                                v-if="input.type != 'select' && input.type != 'textarea'"
                            >
                                <label :for="input.name" class="d-block mb-0 mr-2">{{ input.label }}</label>
                                <p v-if="input.name == 'timer'" class="text-muted text-sm mb-2">{{ input.description }}</p>

                                <b-form-input
                                    v-model="input.value"
                                    :id="input.name"
                                    :value="input.value"
                                    :type="input.type"
                                    :placeholder="input.placeholder"
                                    :required='input.required'
                                    min="0"
                                ></b-form-input>
                            </b-form-group>

                            <!-- Select Options -->
                            <b-form-group
                                v-if="input.name == 'formType'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <b-form-select
                                    v-model="selectedFormType"
                                    :id="input.label"
                                    :value="input.value"
                                    :options="input.options"
                                    :required='input.required'
                                ></b-form-select>
                            </b-form-group>

                            <b-form-group
                                v-if="input.type == 'textarea'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <DescriptionEditor
                                    v-model="input.value"
                                    :placeholder="input.placeholder"
                                />
                            </b-form-group>

                            <b-form-group
                                v-if="input.name == 'randomize'">
                                <div class="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <label for="" class="d-block mb-0 mr-2">{{ input.label }}</label>
                                        <!-- <span class="text-muted text-sm">Centang pilihan yang benar</span> -->
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <b-button v-if="isRandomize" class="btn-no-styles text-primary" variant="transparent" @click="manageCategory('add')">Tambah Kategori</b-button>
                                        <b-button v-if="!isRandomize" class="btn-no-styles text-primary" variant="transparent" @click="toggleRandomize">Acak Soal</b-button>
                                        <b-button v-if="isRandomize" class="btn-no-styles text-danger" variant="transparent" @click="toggleRandomize">Batal</b-button>
                                    </div>
                                </div>
                                <div v-for="(item, itemIndex) in listRandomize" :key="itemIndex" class="d-flex align-items-center justify-content-between mb-4">
                                    <div class="d-flex align-items-center w-100">
                                        <v-select
                                            class="select-city form-control"
                                            :placeholder="isCategoriesLoaded ? `Pilih salah satu` : `Sedang memuat...`"
                                            :options="listCategory"
                                            label="name"
                                            id="selectedKategory"
                                            v-model="listRandomize[itemIndex].category"
                                        >
                                            <template v-slot:no-options="{ search, searching }">
                                                <template v-if="searching">
                                                Tidak ada hasil untuk <em>{{ search }}</em>.
                                                </template>
                                                <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                            </template>
                                        </v-select>
                                        <b-form-input
                                            v-model="listRandomize[itemIndex].count"
                                            :id="`count-${itemIndex}`"
                                            :value="listRandomize[itemIndex].count"
                                            type="number"
                                            placeholder="Jumlah pertanyaan"
                                            min="0"
                                            class="ml-4"
                                            required
                                        ></b-form-input>
                                    </div>
                                    <b-button v-if="listRandomize.length > 1" variant="danger" size="sm" class="ml-4" @click="manageCategory('delete', itemIndex)">
                                        <i class="fas fa-trash"></i>
                                    </b-button>
                                </div>
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
import fieldForm from '~/store/global/form'
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue"
import { mapState } from 'vuex'


import { toDecrypt, toEncrypt } from '~/commons/utils'

export default {
    layout: 'dashboard',
    components: {
        DescriptionEditor
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
            isRandomize: false,
            isCategoriesLoaded: false,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            inputForm: [],
            listRandomize: [],
            listCategory: [],
            selectedCategory: null,

            selectedFormType: 'basic',
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

            this.title = res[2]
            this.action = res[3]
            this.formId = toDecrypt(localStorage.getItem('bankQuestionsId')) || res[4]

            this.fetchForm()

        },
        fetchForm() {
            this.inputForm = fieldForm.inputFormPacket
            
            if(this.action == 'edit' && this.formId != null) {
                this.onResetForm()
                this.fetchCategories()
            } else {
                this.onResetForm()
                this.isLoaded = true
            }
        },
        async fetchDataDetail() {
            await this.$store.dispatch('Forms/formDetail', this.formId)

            if(!this.formState.status) {
                console.error('Failed fetch form', this.formState.message)
                this.setEvent(this.formState.message, stateCourse.status)
                this.isLoaded = true
            } else {
                // console.log('Success fetch courses', this.formState.courses)
                var form = this.formState.data
                this.inputForm.map((item, index) => {
                    if(item.name == 'title') {
                        this.inputForm[index].value = form.title
                    }
                    if(item.name == 'description') {
                        this.inputForm[index].value = form.description
                    }
                    if(item.name == 'timer') {
                        this.inputForm[index].value = form.timer
                    }
                    if (item.name == 'formType') {
                        this.inputForm[index].value = form.formType
                        this.selectedFormType = form.formType
                    }
                    if(item.name == 'randomize') {
                        if (form.randomize != {} && form.randomize != null) {
                            this.isRandomize = true
                            Object.keys(form.randomize).map((field) => {
                                
                                const find = this.listCategory.find((find) => find.id == field)
                                if (find) {
                                    const object = {
                                        category: find,
                                        count: form.randomize[field]
                                    }
                                    this.listRandomize.push(object)
                                }

                            })
                        }
                    }
                })
                this.isLoaded = true
            }
        },
        async fetchCategories() {
            this.isCategoriesLoaded = false

            await this.$store.dispatch('Forms/categories')
            .then(() => {
                var formsState = this.$store.state.Forms

                if(!formsState.status) {
                    console.error('Failed get categories', formsState.message)
                    this.setEvent(this.formState.message, stateCourse.status)
                    this.isCategoriesLoaded = true
                } else {
                    this.listCategory = formsState.categories
                    this.isCategoriesLoaded = true
                    if ($nuxt.$route.path.startsWith('/dashboard/forms/banks/edit/')) this.fetchDataDetail()
                }
            })
        },
        async fetchPostData(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')
            var dispatch = 'Forms/createForm'
            var payload = params

            if (this.action == 'edit') {
                dispatch = 'Forms/editForm'
                payload = {
                    id: this.formId,
                    params: params,
                }
            }

            await this.$store.dispatch(dispatch, payload)

            if(!this.formState.status) {
                console.error(`Failed ${this.action == 'edit' ? 'edit' : 'create'} form`, this.formState.message)
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.setEvent(this.formState.message, this.formState.status)
                }, 500);
            } else {
                var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                this.isSubmit = false
                if(this.action != 'edit') this.onResetForm()
                this.$bvModal.hide('modalLoading')

                setTimeout(() => {
                    this.setEvent(message, this.formState.status)
                    setTimeout(() => {
                        // this.$router.push(`/dashboard/forms/banks/${this.formState.data._id}`)
                        localStorage.setItem('bankQuestionsId', toEncrypt(this.formState?.data?._id))
                        if (this.action == 'edit') {
                            this.$router.replace({ path: '/dashboard/forms/banks' })
                        } else {
                            this.$router.replace({
                                path: `/dashboard/forms/banks/${this.formState.data.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`
                            })
                        }
                    }, 500);
                }, 500);
            }
        },
        onSubmitForm(event) {
            event.preventDefault()
            var output = {}
            this.inputForm.forEach(item => {
                if (item.type == 'number') {
                    let value = item.value == '' ? 0 : item.value
                    value = parseInt(item.value)
                    output[item.name] = value
                } else output[item.name] = item.value
            })
            output.kind = 'bank'
            // output.formType = 'quiz'
            output.formType = this.selectedFormType
            output.randomize = null
            
            let isReadyRandomize = true
            if (this.listRandomize.length > 0) {
                output.randomize = {}
                let duplicateData = {}
                let isDuplicate = false
                this.listRandomize.map((item) => {
                    if (item.category) {
                        duplicateData[item.category.id] = (duplicateData[item.category.id] || 0) + 1
                        output.randomize[item.category.id] = parseInt(item.count)
                    }
                    else {
                        this.setEvent('Pastikan anda sudah mengisi semua form kategori!', false)
                        isReadyRandomize = false
                    }
                })
                Object.keys(duplicateData).map((field) => {
                    if (duplicateData[field] > 1) isDuplicate = true 
                })

                if (isDuplicate) return this.setEvent('Anda memilih kategori yang sama!', false)
            }

            if (!isReadyRandomize) return

            output = {
                payloads: output
            }

            // console.log(output, "PARAMS")
            this.fetchPostData(output)
        },
        toggleRandomize() {
            this.isRandomize = !this.isRandomize

            if (this.isRandomize) {
                if (this.listCategory.length == 0) this.fetchCategories()
                this.manageCategory('add')
            }
            else this.listRandomize = []
        },
        manageCategory(state, index = -1) {
            if (state == 'add') {
                const object = {
                    category: null,
                    count: ''
                }
                this.listRandomize.push(object)
            }
            if (state == 'delete' && index != -1) this.listRandomize.splice(index, 1)
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.type == 'number') item.value = 0
                else item.value = '';
            });
        }
    },
    // watch: {
    //     selectedCategory() {
    //         if (this.selectedCategory) {
    //             const index = this.listCategory.findIndex((item) => item.id == this.selectedCategory.id)
    //             // this.listRandomize[index].category = this.selectedCategory
    //             console.log(index, "INDEX")
    //         }
    //     }
    // }
    
}
</script>

<style>

</style>