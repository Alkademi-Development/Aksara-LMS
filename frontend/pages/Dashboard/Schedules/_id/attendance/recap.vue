<template>
    <div class="container-fluid mt-4">
        
        <RecapAttendance
            attendanceType="post"
            :classroomId="attendanceId"
            :attendanceId="attendanceId"
        />

    </div>
</template>

<script>
import RecapAttendance from '@/components/attendance/RecapAttendance.vue'
import { toDecrypt } from '~/commons/utils'

export default {
    async asyncData() {
        const attendanceId = parseInt(toDecrypt(localStorage.getItem('attendanceId')))

        return { attendanceId }
    },
    layout: 'dashboard',
    components: {
        RecapAttendance,
    }
}
</script>
