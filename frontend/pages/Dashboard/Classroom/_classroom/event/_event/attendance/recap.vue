<template>
    <div class="container-fluid mt-4">
        
        <RecapAttendance
            attendanceType="meet"
            :classroomId="eventId"
            :attendanceId="attendanceId"
        />

    </div>
</template>

<script>
import RecapAttendance from '@/components/attendance/RecapAttendance.vue'
import { toDecrypt } from '~/commons/utils'

export default {
    async asyncData() {
        const eventId = parseInt(toDecrypt(localStorage.getItem('eventId')))
        const attendanceId = parseInt(toDecrypt(localStorage.getItem('attendanceId')))

        return { eventId, attendanceId }
    },
    layout: 'dashboard',
    components: {
        RecapAttendance,
    }
}
</script>
