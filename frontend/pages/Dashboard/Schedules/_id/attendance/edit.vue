<template>
    <div class="container-fluid mt-4">
        <div class="row">
            <div class="col-12 card-wrapper">
                <div class="attendance-container bg-white p-4">
                    <AttendanceForm
                        action="edit"
                        customClass="pb-4 col-12" 
                        :classroomId="eventId"
                        hideHeader
                        :isCard="false"
                        attendanceType="post"
                        :attendanceId="attendanceId"
                        @callbackSubmit="handleCallbackSubmit"
                        @callbackCancel="handleCallbackCancel"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { toDecrypt } from '~/commons/utils'

import AttendanceForm from '~/components/template/micro/form/AttendanceForm.vue'

export default {
    async asyncData () {
        const eventId = parseInt(toDecrypt(localStorage.getItem('eventId')))
        const attendanceId = parseInt(toDecrypt(localStorage.getItem('attendanceId')))

        return { eventId, attendanceId }
    },
    layout: "dashboard",
    components: { 
        AttendanceForm 
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    created() {
    },
    methods: {
        ...mapActions({ 
            setActiveTab: 'Layouts/setActiveTab',
        }),
        handleCallbackCancel(){
            this.$router.go(-1);
        },
        handleCallbackSubmit() {
            this.setActiveTab('overview')
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
    .attendance-container {
        min-height: calc( 100vh - 115px);
    }
</style>
