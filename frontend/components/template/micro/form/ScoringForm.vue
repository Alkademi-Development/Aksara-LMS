<template>
    <div class="col-lg-8 card-wrapper" >
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div v-if="isLoaded" class="col d-flex align-items-center">
                        <CircleBackButton class="d-inline-block" />
                        <h3 class="d-inline-block mb-0">{{ userDetail.name }}</h3>
                    </div>
                    <div v-else class="col d-flex align-items-center">
                        <b-skeleton type="avatar" class="mr-3"></b-skeleton>
                        <b-skeleton width="80%"></b-skeleton>
                    </div>
                </div>
            </div>
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
                                <text-markdown :value="input.value" :placeholder="input.placeholder" @onChange="input.value = $event"/>
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
import fieldForm from '@/store/global/classroom';
import { mapState } from 'vuex'

export default {
    layout: 'dashboard',
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    data() {
        return {
            action: '',
            title: '',

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
            userDetail: null,
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

            this.getUserDetail()

        },
        async getUserDetail() {
            await this.$store.dispatch('Services/userDetail', this.userId)

            if(!this.servicesState.status) {
                console.error('Failed fetch user detail', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
            } else {
                this.userDetail = this.servicesState.data
                this.fetchForm()
            }
        },
        fetchForm() {
            this.inputForm = fieldForm.inputFormVerifyTask
            
            this.onResetForm()
            // this.isLoaded = true
            this.fetchDataCourse()
        },
        async fetchDataCourse() {
            const params = {
                classId: this.classroomId,
                topicId: this.topicId,
                userId: this.userId,
            }

            await this.$store.dispatch('Services/studentAssignmentDetail', params)

            if(!this.servicesState.status) {
                console.error('Failed request: ', this.servicesState.message)
                this.setEvent(this.servicesState.message, stateCourse.status)
                this.isLoaded = true
            } else {
                // console.log('Success fetch courses', this.servicesState.courses)
                var data = this.servicesState.data
                this.inputForm.map((item, index) => {
                    if(item.name == 'score') {
                        this.inputForm[index].value = data.score
                    }
                    if(item.name == 'mentorNotes') {
                        this.inputForm[index].value = data.mentorNotes
                    }
                })
                this.isLoaded = true
            }
        },
        onSubmitForm(event) {
            event.preventDefault()
            var output = {}
            this.inputForm.forEach(item => {
                if (item.name == 'score') output[item.name] = parseInt(item.value)
                else output[item.name] = item.value
            })

            // console.log(output, "PARAMS")
            this.fetchPostCourse(output)
        },
        async fetchPostCourse(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')
            const dispatch = 'Services/classroomAssignScore';
            const payload = {
                "classroomId": this.classroomId,
                "topicId": this.topicId,
                "userId": this.userId,
                "score": params.score,
                "mentorNotes": params.mentorNotes
            }

            await this.$store.dispatch(dispatch, payload)

            if(!this.servicesState.status) {
                console.error(`Failed to scoring: `, this.servicesState.message)
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.setEvent(this.servicesState.message, this.servicesState.status)
                }, 500);
            } else {
                // console.log('Success post course', this.servicesState.courses)
                var message = `Berhasil menilai peserta.`
                this.isSubmit = false
                if(this.action != 'edit') this.onResetForm()
                this.$bvModal.hide('modalLoading')

                setTimeout(() => {
                    this.setEvent(message, this.servicesState.status)
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 1000);
                }, 500);
            }
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.name == 'type') item.value = this.$route.query.type ?? 'module'
                else item.value = '';
            });
        }
    },
    props: {
        classroomId: {
            type: Number,
            default: 0,
        },
        moduleId: {
            type: Number,
            default: 0,
        },
        topicId: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Number,
            default: 0,
        },
    }
    
}
</script>

<style>

</style>