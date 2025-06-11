<template>
    <div class="container-fluid py-4">

        <DetailEvent
            :classroomId="classroomId"
            :eventSlug="eventSlug"
        />

    </div>
</template>
<script>
import { toDecrypt } from '~/commons/utils'
import DetailEvent from '~/components/classrooms/DetailEvent.vue'

export default {
    layout: 'dashboard',
    asyncData({ params }) {
        const classroomId = parseInt(toDecrypt(localStorage.getItem('classId')))
        const eventSlug = params.event;

        return { classroomId, eventSlug }
    },
    components: {
        DetailEvent,
    },
}
</script>
