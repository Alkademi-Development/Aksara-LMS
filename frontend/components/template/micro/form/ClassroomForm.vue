<template>
    <div class="card-wrapper" >
        <div class="card">
            <div class="card-body" v-if="isLoaded">
                <b-alert 
                    v-model="onEvent.show"
                    :variant="onEvent.variant"
                    dismissible
                >
                    {{ onEvent.message }}
                </b-alert>
                <b-form @submit="onSubmitForm">
                    <div v-for="(input, index) in inputForm" :key="index" >
                        <b-form-group
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

                    <div v-if="!submitted" class="d-flex align-items-center justify-content-start justify-content-md-end">
                        <b-button v-if="action == 'edit'" :disabled="submitted" variant="danger" @click="$emit('editClassroom', 'cancel')">Batal</b-button>
                        <b-button type="submit" :disabled="submitted" variant="primary">Submit</b-button>
                    </div>
                    <div v-else class="d-flex align-items-center justify-content-end">
                        <b-spinner small class="mr-2"></b-spinner>Loading...
                    </div>
                </b-form>
            </div>
            <div class="text-center card-body" v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>
    </div>
</template>

<script>
import fieldForm from '@/store/global/classroom';
import { mapState } from 'vuex';

export default {
    layout: 'dashboard',
    computed: {
        ...mapState({
            classroomState: (state) => state.Classrooms,
            servicesSate: (state) => state.Services,
        })
    },
    data() {
        return {
            classroomId: null,

            submitted: false,
            isLoaded: false,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            inputForm: [],
            output: [],
        }
    },
    created() {
        this.getCredentials()
        this.fetchProgram()
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

            this.classroomId = res[2];
        },
        fetchProgram() {
            if (this.action == 'meet') this.inputForm = fieldForm.inputFormMeet;
            else this.inputForm = this.isTestCase ? fieldForm.inputFormTes : fieldForm.inputForm;

            if (this.action == 'edit') {
                this.inputForm.map((item, index) => {
                    if (item.name == 'groupLink') {
                        this.inputForm[index].value = this.item.groupLink
                    }
                });
                this.isLoaded = true;
            } else {
                this.isLoaded = true;
            }
        },
        onSubmitForm(event) {
            event.preventDefault()
            this.inputForm.map((item) => {
                this.output[item.name] = item.value;
            });

            const params = {}

            // const params = new FormData();

            // if (this.action == 'meet') {
            //     params.append('schedule', this.output['schedule']);
            //     params.append('customLink', this.output['customLink']);
            //     params.append('moduleId', this.item.moduleId);
            //     params.append('courseId', this.item.courseId);
            // } else {
                // params.name = this.item.name;
                // params.programId = this.item.programId;
                params.groupLink = this.output['groupLink'];
            // }

            this.fetchPost(params);

            this.output = [];
        },
        async fetchPost(params) {
            this.submitted = true;

            let dispatch;

            if (this.action == 'meet') dispatch = 'Classrooms/startClassroom';
            else dispatch = 'Services/editClassroom';

            try {
                await this.$store.dispatch(dispatch, {
                    classroomId: this.classroomId,
                    params: params
                });

                if (!this.servicesSate.status) {
                    this.submitted = false;
                    this.setEvent(this.servicesSate.message, false)
                } else {
                    this.submitted = false;
                    if (this.action == 'meet') {
                        this.$emit('startClassroom');
                    } else {
                        this.$emit('editClassroom');
                    }
                }
            } catch (error) {
                let message;
                if (this.action == 'meet') message = 'failed to start classroom: ';
                else message = 'failed to edit classroom: ';
                console.error(message, error);
            }
        }
    },
    props: {
        name: String,
        action: String,
        item: Object,
        isTestCase: {
            type: Boolean,
            default: false
        }
    },
}
</script>