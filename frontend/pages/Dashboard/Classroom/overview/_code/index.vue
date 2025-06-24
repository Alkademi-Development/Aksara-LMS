<template>
    <section class="container-fluid mt-4">
        <ClassroomOverview :classCode="classCode" />
    </section>
</template>

<script>
import ClassroomOverview from "@/components/classrooms/Overview"

export default {
    async asyncData({ params }) {
        const classCode = params.code
        return { classCode }
    },
    layout: 'dashboard',
    components: {
        ClassroomOverview
    },
}
</script>

<style>

</style>