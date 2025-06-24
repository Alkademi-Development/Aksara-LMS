<template>
    <div class="container-fluid mt-4">
        <div class="row">
            <div class="col-12 card-wrapper">
                <div class="attendance-container bg-white p-4">
                    <AttendanceForm
                        action="edit"
                        customClass="pb-4 col-12" 
                        :classroomId="classId"
                        isFromClass
                        hideHeader
                        :isCard="false"
                        :attendanceId="attendanceId"
                        :attendanceMode="attendanceMode"
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
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')))
        const attendanceId = parseInt(toDecrypt(localStorage.getItem('attendanceId')))
        const attendanceMode = toDecrypt(localStorage.getItem('attendanceMode'))

        return { classId, attendanceId, attendanceMode }
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
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
    .attendance-container {
        min-height: calc( 100vh - 115px);
    }
</style>