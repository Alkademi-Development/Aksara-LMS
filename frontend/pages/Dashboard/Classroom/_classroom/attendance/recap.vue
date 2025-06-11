<template>
    <div class="container-fluid mt-4">
        
        <RecapAttendance
            attendanceType="class"
            :classroomId="classId"
            :attendanceId="attendanceId"
        />

    </div>
</template>

<script>
import RecapAttendance from '@/components/attendance/RecapAttendance.vue'
import { toDecrypt } from '~/commons/utils'

export default {
    async asyncData () {
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')))
        const attendanceId = parseInt(toDecrypt(localStorage.getItem('attendanceId')))

        return { classId, attendanceId }
    },
    layout: 'dashboard',
    components: {
        RecapAttendance,
    }
}
</script>
