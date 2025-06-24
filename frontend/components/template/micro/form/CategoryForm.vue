<template>
    <div class="col-lg-8 card-wrapper" >
        <div class="card">
            <!--<div class="card-header">
                <div class="row">
                    <div class="col d-flex align-items-center">
                        <CircleBackButton class="d-inline-block" />
                        <h3 class="d-inline-block mb-0">{{ action | capitalize }} Category</h3>
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
                <b-form @submit="onSubmitForm">
                    <b-row>
                        <b-col v-for="(input, index) in inputForm" :key="index" cols="12">
                            <b-form-group
                                v-if="input.type != 'select' && input.type != 'textarea'"
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
import { mapState } from 'vuex'
import { toDecrypt } from '~/commons/utils'

export default {
    layout: 'dashboard',
    computed: {
        ...mapState({
            formState: (state) => state.Forms
        })
    },
    data() {
        return {
            action: '',
            title: '',
            categoryId: null,

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
            this.categoryId = toDecrypt(localStorage.getItem('formCategoryId')) || res[4]

            this.fetchForm()

        },
        fetchForm() {
            this.inputForm = fieldForm.inputCategories
            
            if(this.action == 'edit' && this.categoryId != null) {
                this.onResetForm()
                this.fetchDataCourse()
            } else {
                this.onResetForm()
                this.isLoaded = true
            }
        },
        async fetchDataCourse() {
            await this.$store.dispatch('Forms/detailCategories', this.categoryId)

            if(!this.formState.status) {
                console.error('Failed fetch category', this.formState.message)
                this.setEvent(this.formState.message, stateCourse.status)
                this.isLoaded = true
            } else {
                // console.log('Success fetch courses', this.formState.courses)
                var categories = this.formState.data
                this.inputForm.map((item, index) => {
                    if(item.name == 'name') {
                        this.inputForm[index].value = categories.name
                    }
                    if(item.name == 'score') {
                        this.inputForm[index].value = categories.score
                    }
                })
                this.isLoaded = true
            }
        },
        async fetchPostData(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')
            var dispatch = 'Forms/createCategories'
            var payload = params

            if (this.action == 'edit') {
                dispatch = 'Forms/editCategories'
                payload = {
                    id: this.categoryId,
                    params: params,
                }
            }

            await this.$store.dispatch(dispatch, payload)
            
            if(!this.formState.status) {
                console.error(`Failed ${this.action == 'edit' ? 'edit' : 'create'} category`, this.formState.message)
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
                        this.$router.go(-1)
                    }, 1000);
                    
                }, 500);
            }
        },
        onSubmitForm(event) {
            event.preventDefault()

            var output = {}
            this.inputForm.forEach(item => {
                if (item.name == 'score') output[item.name] = parseInt(item.value)
                else output[item.name] = item.value
            })

            this.fetchPostData(output)
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.name == 'type') item.value = this.$route.query.type ?? 'module'
                else item.value = '';
            });
        }
    }
    
}
</script>

<style>

</style>