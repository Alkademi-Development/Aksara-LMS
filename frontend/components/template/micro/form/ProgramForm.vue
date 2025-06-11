<template>
    <b-form @submit="onSubmitForm" @reset="onResetForm" class="row">
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
                    <div v-for="(input, index) in inputForm" :key="index" >
                        <b-form-group
                            v-if="input.type != 'select' && input.type != 'textarea' && input.type != 'image' && input.type != 'file' && input.name != 'method' && input.name != 'totalMeeting'"
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
                            v-if="input.type == 'file' && input.name == 'logo'"
                            :label="input.label"
                            :label-for="input.label"
                        >
                            <b-form-file
                            v-model="logo"
                            :state="Boolean(logo)"
                            placeholder="Pilih file atau letakkan di sini..."
                            drop-placeholder="Letakkan di sini..."
                            accept="image/*"
                            ></b-form-file>
                        </b-form-group>

                        <!-- <b-form-group
                        v-if="input.type == 'file' && input.name == 'logo'"
                        :label="input.label"
                        :label-for="input.label"
                        >
                            <vue-dropzone 
                            ref="logoDropZone" 
                            :id="input.label" 
                            :options="dropzoneOptions">
                            </vue-dropzone>
                        </b-form-group> -->

                        <div
                            v-if="input.type == 'image'"
                            class="form-group"
                        >
                            <Dropzone
                                v-model="input.value"
                                filedir="program"
                                acceptedFiles="image/*"
                                :dropzoneId="`program-${input.name}`"
                                :label="input.label"
                                :disabled="input.disabled"
                                :value="input.value"
                                :noBodyPreview="false"
                                @remove="input.value = null"
                            />
                        </div>

                        <b-form-group
                            v-if="input.type == 'textarea' && input.name == 'summary'"
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
                        
                        <b-form-group
                            v-if="input.type == 'textarea' && input.name == 'description'"
                            :label="input.label"
                            :label-for="input.label"
                        >
                            <DescriptionEditor
                                v-if="isShowMarkdown"
                                v-model="input.value"
                                :placeholder="input.placeholder"
                            />
                        </b-form-group>
                    </div>
                </div>
                <div class="card-body text-center" v-else>
                    <b-spinner label="Spinning"></b-spinner>
                </div>
            </div>
        </div>

        <div v-if="isLoaded" :class="[isFromModal ? 'col' : 'col-lg-4', 'card-wrapper']">
            <div :class="isCard ? 'card' : ''">
                <div v-if="!hideHeader" :class="isCard ? 'card-header' : ''">
                    <h3 class="d-inline-block mb-0">Konfigurasi</h3>
                </div>
                <div :class="isCard ? 'card-body' : ''">
                    <div v-for="(input, index) in inputForm" :key="index" >
                        <b-form-group
                            v-if="input.name == 'method' || input.name == 'totalMeeting'"
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
                    </div>
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
                                <b-button v-if="isFromModal" type="reset" :disabled="isSubmit" variant="danger" @click="$emit('canceled')">Batal</b-button>
                                <b-button v-else type="reset" :disabled="isSubmit" variant="danger">Reset</b-button>
                                <b-button type="submit" :disabled="isSubmit" variant="primary">Submit</b-button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <b-modal id="modalLoading" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center">
                <b-spinner label="Spinning" class="mr-3"></b-spinner><span>Loading...</span>
            </div>
        </b-modal>

    </b-form>
</template>

<script>
import fieldForm from '@/store/global/program'
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue"
import { mapState } from 'vuex'

export default {
    components: {
        DescriptionEditor
    },
    layout: 'dashboard',
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    data() {
        return {
            // action: '',
            // title: '',
            // programId: null,

            isSubmit: false,
            isLoaded: false,
            isShowMarkdown: false,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            inputForm: [],
            logo: null,
            imageLogo: null,
            // dropzoneOptions: {
            //     url: 'https://drive.alkademi.id/v1/upload',
            //     maxFilesize: 1,
            // }
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
    mounted() {
        setTimeout(() => {
            this.isShowMarkdown = true
        }, 500);
    },
    methods: {
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

            // this.title = res[1]
            // this.action = res[2].toLowerCase()
            // this.programId = res[3]

            this.fetchProgram()
        },
        fetchProgram() {
            this.inputForm = fieldForm.inputForm

            if(this.action == 'edit' && this.programId != null) {
                this.onResetForm()
                this.fetchDataProgram()
            } else {
                this.onResetForm()
                this.isLoaded = true
            }
        },
        async fetchDataProgram() {
            await this.$store.dispatch('Services/programDetail', this.programId)

            if(!this.servicesState.status) {
                console.error('Failed fetch programs', this.servicesState.message)
                this.setEvent(this.servicesState.message, this.servicesState.status)
                this.isLoaded = true
            } else {
                // console.log('Success fetch programs', this.servicesState.programs)
                var programDetail = this.servicesState.data
                this.imageLogo = programDetail.logo

                this.inputForm.map((item, index) => {
                    if(item.name == 'name') {
                        this.inputForm[index].value = programDetail?.name
                    }
                    if(item.name == 'description') {
                        this.inputForm[index].value = programDetail?.description
                    }
                    if(item.name == 'summary') {
                        this.inputForm[index].value = programDetail?.summary
                    }
                    if(item.name == 'method') {
                        this.inputForm[index].value = programDetail?.method
                    }
                    if(item.name == 'totalMeeting') {
                        this.inputForm[index].value = programDetail?.totalMeeting
                    }
                    if(item.name == 'logo') {
                        this.inputForm[index].value = programDetail?.logo ?? null
                    }
                })
                this.isLoaded = true
            }
        },

        onSubmitForm(event) {
            event.preventDefault()
            var output = {}
            this.inputForm.forEach(item => {
                output[item.name] = item.value
                // if(item.type == 'image') {
                //     if(item.value && item.value != '') {
                //         output.logo = item.value
                //     } else {
                //         output.logo = this.imageLogo
                //     }
                // }
            })

            // const params = new FormData();

            // // const snakeCase = string => {
            // //     return string.replace(/\W+/g, " ")
            // //     .split(/ |\B(?=[A-Z])/)
            // //     .map(word => word.toLowerCase())
            // //     .join('_');
            // // };

            // var name = output['name']
            // // var slug = snakeCase(name)

            // params.append('name', name)
            // params.append('summary', output['summary'])
            // params.append('description', output['description'])
            // params.append('method', output['method'])
            // params.append('totalMeeting', output['totalMeeting'])
            // params.append('additional', output['additional'])
            // // params.append('slug', slug)
            // params.append('status', 1)

            output['status'] = 1
            output['totalMeeting'] = parseInt(output['totalMeeting'])

            if(this.action == 'edit') {

                if(output['logo'] == '' || output['logo'] == null) {

                    if(this.imageLogo) output['logo'] = this.imageLogo ?? ''

                }

                // else if(this.imageLogo) output['logo'] = this.imageLogo

            } else {

                if(this.imageLogo) output['logo'] = this.imageLogo

            }

            // for(var pair of params.entries()) {
            //     console.log(pair[0]+ ': '+ pair[1]);
            // }
            // console.log(output, "PARAMS")
            this.fetchPostProgram(output)
        },
        async fetchPostProgram(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')

            var dispatch = ''
            var parameter = params

            if(this.action == 'edit') {
                dispatch = 'Services/editProgram'
                parameter = {
                    id: this.programId,
                    params: params,
                }
            }
            else dispatch = 'Services/createProgram'
            // console.log(parameter, "PARAMS")
            await this.$store.dispatch(dispatch, parameter)

            if(!this.servicesState.status) {
                console.log('Failed create program', this.servicesState.message)
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.setEvent(this.servicesState.message, this.servicesState.status)
                }, 1000);
            } else {
                // console.log('Success post course', this.servicesState.programs)
                var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                this.isSubmit = false
                
                if(this.action != 'edit') this.onResetForm()

                this.$bvModal.hide('modalLoading')

                setTimeout(() => {
                    if (this.isFromModal) this.$emit('submitted', this.servicesState.data)
                    else {
                        this.setEvent(message, this.servicesState.status)
                        setTimeout(() => {
                            localStorage.removeItem('programId')
                            this.$router.go(-1)
                        }, 1000);
                    }
                }, 500);
            }
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.type == 'image') item.value = null;
                else item.value = '';
            });

            this.imageLogo = null
        }
    },

    props: {
        // String Props
        title: {
            type: String,
            default: 'Create Program',
        },
        action: {
            type: String,
            default: 'create',
        },
        customClass: {
            type: String,
            default: 'col-lg-8 card-wrapper',
        },

        // Number Props
        programId: {
            type: Number,
            default: -1,
        },
        // Boolean Props
        isFromModal: {
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
        }
    }
    
}
</script>

<style>

</style>