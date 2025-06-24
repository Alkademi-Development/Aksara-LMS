<template>
    <div class="col-lg-8 card-wrapper" >
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-6 d-flex align-items-center">
                        <CircleBackButton class="d-inline-block" />
                        <h3 class="d-inline-block mb-0">{{ action | capitalize }} {{ title | capitalize }}</h3>
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
                    <div v-for="(input, index) in inputForm" :key="index" >
                        <b-form-group
                            v-if="input.type != 'select' && input.type != 'textarea' && input.type != 'role' && input.type != 'radio' && input.type != 'file'"
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
                                :required="input.required"
                                min="0"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            v-if="input.type == 'file' && input.name == 'cover'"
                            :label="input.label"
                            :label-for="input.label"
                        >
                            <b-form-file
                            v-model="eventCover"
                            :state="Boolean(eventCover)"
                            placeholder="Pilih file atau letakkan di sini..."
                            drop-placeholder="Letakkan di sini..."
                            ></b-form-file>
                        </b-form-group>

                        <b-form-group
                            v-if="input.type == 'file' && input.name == 'file'"
                            :label="input.label"
                            :label-for="input.label"
                        >
                            <b-form-file
                            v-model="eventFile"
                            :state="Boolean(eventFile)"
                            placeholder="Pilih file atau letakkan di sini..."
                            drop-placeholder="Letakkan di sini..."
                            ></b-form-file>
                        </b-form-group>
                    </div>

                    <div v-if="!isSubmit">
                        <b-button type="submit" variant="primary">Submit</b-button>
                        <b-button v-if="action != 'edit'" variant="danger" @click="onResetForm">Reset</b-button>
                    </div>
                    <div v-else class="card-body text-center">
                        <b-spinner label="Spinning"></b-spinner>
                    </div>
                </b-form>
            </div>
            <div class="card-body text-center" v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>
    </div>
</template>

<script>
import fieldForm from '@/store/global/event'
import moment from 'moment'

export default {
    layout: 'dashboard',
    data() {
        return {
            action: '',
            title: '',
            eventId: null,

            isSubmit: false,
            isLoaded: false,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            eventCover: null,
            eventFile: null,

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
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.title = res[1]
            this.action = res[2]
            this.eventId = res[3]

            this.fetchEvent()

        },
        fetchEvent() {
            this.inputForm = fieldForm.inputForm

            if(this.action == 'edit') {
                
                this.onResetForm()
                this.getEventDetail()

            } else {

                this.onResetForm()
                this.isLoaded = true

            }
        },
        async getEventDetail(){

            await this.$store.dispatch('Events/getEventDetail', this.eventId)
            .then(() => {
                var eventState = this.$store.state.Events

                if(!eventState.status) {

                    console.log('Failed get events', eventState.message)
                    this.isLoaded = true

                } else {

                    const event = eventState.events

                    this.inputForm.map((item, index) => {
                        if(item.name == 'title') {
                            this.inputForm[index].value = event.title
                        }
                        if(item.name == 'start') {
                            this.inputForm[index].value = moment(event.start).format('YYYY-MM-DDTHH:mm:ss')
                        }
                        if(item.name == 'end') {
                            this.inputForm[index].value = moment(event.end).format('YYYY-MM-DDTHH:mm:ss')
                        }
                        if(item.name == 'link') {
                            this.inputForm[index].value = event.link
                        }
                    })

                    this.isLoaded = true

                }
            })

        },
        async postEvent(params){
            this.isSubmit = true

            var dispatch = ''

            if(this.action == 'edit') dispatch = 'Events/editEvent'
            else dispatch = 'Events/createEvent'

            await this.$store.dispatch(dispatch, {
                id: this.eventId,
                params: params
            }).then(() => {
                var eventState = this.$store.state.Events

                if(!eventState.status) {
                    console.log('Failed post event', eventState.message)
                    this.isSubmit = false
                    this.setEvent(eventState.message, false)
                } else {
                    // console.log('Success post event', eventState.event)
                    this.isSubmit = false
                    var message = `Berhasil ${this.action != 'edit' ? 'Menambahkan' : 'Mengubah'} Data.`
                    this.setEvent(message, true)
                    if(this.action != 'edit') this.onResetForm()
                }
            })

        },
        onSubmitForm(event) {

            event.preventDefault()

            const params = new FormData()
            var output = []

            this.inputForm.map((item) => {
                if(item.type != 'select') {
                    output[item.name] = item.value
                }
            })

            params.append('title', output['title'])
            params.append('start', output['start'])
            params.append('end', output['end'])
            params.append('cover', this.eventCover ?? '')
            params.append('file', this.eventFile ?? '')
            params.append('link', output['link'])

            this.postEvent(params)
            // for(var pair of params.entries()) {
            //     console.log(pair[0]+ ': '+ pair[1]);
            // }

        },
        onResetForm() {

            this.inputForm.forEach(item => {
                item.value = '';
            });

            this.eventCover = null
            this.eventFile = null

        }
    }
    
}
</script>

<style>

</style>