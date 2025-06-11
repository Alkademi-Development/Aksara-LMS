<template>
    <b-form id="attendance-forms" @submit="onSubmitForm" @reset="onResetForm" class="row">
        <div :class="customClass" >
            <div :class="isCard ? 'card' : ''">
                <div v-if="!hideHeader" :class="isCard ? 'card-header' : ''">
                    <h5 class="mb-3 text-capitalize">{{ title }}</h5>
                </div>
                <div :class="isCard ? 'card-body' : ''" v-if="isLoaded">
                    <b-alert 
                        v-model="onEvent.show"
                        :variant="onEvent.variant"
                        dismissible
                    >
                        {{ onEvent.message }}
                    </b-alert>
                    <b-row>
                        <b-col
                            v-for="(input, index) in inputForm"
                            :key="index"
                            :cols="input.name == 'startDate' || input.name == 'endDate' || input.name == 'openTime' || input.name == 'closeTime' ? 6 : 12"
                        >

                            <b-form-group
                                v-if="input.name == 'recurse'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <SelectAttendanceDays
                                    :tempDays="detailAttendance?.recurse?.days"
                                    :onResetClick="isReset"
                                    @setDays="setDays"
                                />
                            </b-form-group>

                            <template v-if="attendanceMode == 'offline'">
                                <b-form-group
                                    v-if="input.name == 'radius'"
                                    :label="input.label"
                                    :label-for="input.label"
                                    :description="input.description"
                                >
                                    <SelectAttendanceRadius
                                        :tempRadius="detailAttendance?.radius"
                                        :onResetClick="isReset"
                                        @setRadius="setRadius"
                                    />
                                </b-form-group>

                                <b-form-group
                                    v-if="input.name == 'latitude'"
                                    :description="input.description"
                                >
                                    <MapsAttendance
                                        :tempLat="detailAttendance?.latitude"
                                        :tempLng="detailAttendance?.longitude"
                                        @onMapsClick="onMapsClick"
                                    />
                                </b-form-group>
                            </template>


                            <b-form-group
                                v-if="input.type !== 'select' && input.type !== 'date' && input.type !== 'time' && input.name !== 'recurse' && input.name !== 'radius' && input.name !== 'type' && input.name !== 'latitude' && input.name !== 'longitude'"
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
                                    :disabled="input.disabled"
                                    min="0"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group
                                v-if="input.type == 'date' || input.type == 'time'"
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
                                    :style="!input.label ? 'margin-top: 28px' : ''"
                                    :required="input.required"
                                    :disabled="input.disabled"
                                ></b-form-input>
                            </b-form-group>

                        </b-col>
                    </b-row>

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
                                    v-if="action === 'edit'"
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
                                <b-button 
                                    class="px-4"
                                    type="submit" 
                                    :disabled="isSubmit" 
                                    variant="primary"
                                >
                                    Simpan
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
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

import fieldForm from '@/store/global/attendance'
import { toDecrypt } from '~/commons/utils'
import SelectAttendanceDays from '@/components/template/micro/inputs/SelectAttendanceDays.vue'
import SelectAttendanceRadius from '@/components/template/micro/inputs/SelectAttendanceRadius.vue'
import MapsAttendance from '@/components/template/micro/inputs/MapsAttendance.vue'

export default {
    components: {
        SelectAttendanceDays,
        SelectAttendanceRadius,
        MapsAttendance,
    },
    props: {
        title: {
            type: String,
            default: 'Buat Absensi',
        },
        action: {
            type: String,
            default: 'create',
        },
        customClass: {
            type: String,
            default: 'col-lg-8 card-wrapper',
        },
        classroomId: {
            type: Number,
            default: null,
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
        attendanceId: {
            type: Number,
            default: null
        },
        attendanceType: {
            type: String,
            default: 'class'
        },
        attendanceMode: {
            type: String,
            default: 'offline'
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
            detailAttendance: {},

            isReset: false,
        }
    },
    filters: {
    },
    watch: {
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },
    created() {
        this.getCredentials()
    },
    mounted() {
        setTimeout(() => {
            this.showMarkdown = true
        }, 500);
    },
    methods: {
        ...mapActions({
            getDetailAttendance: 'Services/getDetailAttendance'
        }),
        capitalize(value) {

            if (!value) return ''
            value = value.toString().split(' ')
            const result = value.map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            return result.join(' ')

        },
        onClickCancel() {
            this.$emit('callbackCancel')
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
            this.fetchForm()

        },
        fetchForm() {
            if (this.isFromClass) this.inputForm = fieldForm.inputFormAttendance
            else this.inputForm = fieldForm.inputFormAttendanceEvent

            this.onResetForm()

            if (this.action == 'edit' && this.attendanceId != null) {
                this.fetchDetailAttendance()
            } else {
                this.setForm()    
                this.isLoaded = true
            }

        },
        async fetchDetailAttendance() {
            await this.getDetailAttendance(this.attendanceId)

            if (!this.servicesState.status) {
                console.error('Failed get detail attendance: ', this.servicesState?.message)
                this.setEvent(this.servicesState?.message, false)
            } else {
                this.detailAttendance = this.servicesState?.data
                this.setForm()
                this.isLoaded = true
            }
        },
        setForm() {
            moment.locale('id')
            this.inputForm.map((item, idx) => {

                const title = this.isFromClass ? this.$route.params?.classroom : this.$route.params?.event ? this.$route.params?.event : this.$route.params?.id
                const startDate = this.detailAttendance?.startDate || toDecrypt(localStorage.getItem('startDate'))
                const endDate = this.detailAttendance?.endDate || toDecrypt(localStorage.getItem('endDate'))
                const openTime = moment(this.detailAttendance?.openTime, 'HH:mm:ss').format('HH:mm') || moment(startDate?.replace('Z', '')).format('HH:mm')
                const closeTime = moment(this.detailAttendance?.closeTime, 'HH:mm:ss').format('HH:mm') || moment(endDate?.replace('Z', '')).format('HH:mm')

                if (item.name == 'title') this.inputForm[idx].value = this.capitalize(title?.replace(/[^a-zA-Z0-9]/g, ' '))
                
                // if (item.name == 'type') this.inputForm[idx].value = 'RECURSE'

                if (item.name == 'startDate') this.inputForm[idx].value = moment(startDate?.replace('Z', '')).format('YYYY-MM-DD')

                if (item.name == 'endDate') this.inputForm[idx].value = moment(endDate?.replace('Z', '')).format('YYYY-MM-DD')

                if (item.name == 'openTime') this.inputForm[idx].value = !this.isFromClass || this.action === 'edit' ? openTime : null

                if (item.name == 'closeTime') this.inputForm[idx].value = !this.isFromClass || this.action === 'edit' ? closeTime : null

                if (item.name == 'recurse') this.inputForm[idx].value = this.detailAttendance?.recurse

                if (item.name == 'radius') this.inputForm[idx].value = this.detailAttendance?.radius

            })
        },
        onSubmitForm(event) {
            event.preventDefault()

            this.onEvent.show = false

            var output = {}
            this.inputForm.forEach(item => {
                if (item.type == 'time') {

                    if (item.value) {

                        let split = item.value.split(':')
                        output[item.name] = split.length == 2 ? `${item.value}:00` : item.value

                    } else output[item.name] = null

                } else if (item.type == 'date' || item.name == 'title') {
                } else output[item.name] = item.value
            })

            if (this.attendanceMode != 'offline') {
                delete output['latitude']
                delete output['longitude']
                output['radius'] = -1
            }

            // output['latitude'] = -6.870855
            // output['longitude'] = 107.608247

            const payload = {
                id: this.classroomId,
                params: output
            }

            if (this.action == 'edit') this.fetchEditAttendance(payload)
            else this.fetchCreateAttendance(payload)

        },

        async fetchCreateAttendance(params) {

            if (this.attendanceType === 'class') await this.$store.dispatch('Services/createClassAttendance', params)
            if (this.attendanceType === 'post') await this.$store.dispatch('Services/createPostAttendance', params)
            // if (this.attendanceType === 'meet') await this.$store.dispatch('Services/createMeetAttendance', params)

            if (!this.servicesState.status) {
                console.error('Failed create attendance: ', this.servicesState?.message)
                this.setEvent(this.servicesState?.message, false)
            } else {
                const message = 'Berhasil Menambah Absen'
                this.setEvent(this.servicesState?.message, this.servicesState?.status)
                setTimeout(() => {
                    this.$emit("callbackSubmit");
                }, 1000);
            }
        },

        async fetchEditAttendance(params) {
            if (this.attendanceType === 'class') await this.$store.dispatch('Services/editClassAttendance', params)
            if (this.attendanceType === 'post') await this.$store.dispatch('Services/editPostAttendance', params)
            if (this.attendanceType === 'meet') await this.$store.dispatch('Services/editMeetAttendance', params)

            if (!this.servicesState.status) {
                console.error('Failed update attendance: ', this.servicesState?.message)
                this.setEvent(this.servicesState?.message, false)
            } else {
                const message = 'Berhasil Mengedit Absen'
                this.setEvent(this.servicesState?.message, this.servicesState?.status)
                setTimeout(() => {
                    this.$emit("callbackSubmit")
                }, 1000);
            }
        },

        onResetForm(evt) {
            evt?.preventDefault()

            this.inputForm.forEach(item => {
                item.value = ''
            })

            if (this.action === 'create') this.isReset = !this.isReset

            this.setForm()
        },

        setDays(val) {
            this.inputForm.map((item, idx) => {
                if (item.name == 'recurse') this.inputForm[idx].value = val
            })
        },
        setRadius(val) {
            this.inputForm.map((item, idx) => {
                if (item.name == 'radius') this.inputForm[idx].value = val
            })
        },
        onMapsClick(latlng) {
            this.inputForm.map((item, idx) => {
                if (item.name == 'latitude') this.inputForm[idx].value = latlng?.lat
                if (item.name == 'longitude') this.inputForm[idx].value = latlng?.lng
            })
        },
    },
    
}
</script>