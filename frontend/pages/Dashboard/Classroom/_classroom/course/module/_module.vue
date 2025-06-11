<template>
    <div>
        <ContentHeader title="Kelas" />

        <div class="container-fluid mt--6">

            <DetailModule
                :classroomId="classroomId"
                :courseId="courseId"
                :topicId="topicId"
            />

            <Footer />
        </div>
    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"
import DetailModule from "@/components/classrooms/DetailModule.vue"

export default {
    asyncData({params}) {
        const classroomId = params.classroom;
        const courseId = params.course;
        const topicId = params.module;

        return { classroomId, courseId, topicId };
    },
    components: {
        ContentHeader,
        Footer,
        DetailModule
    },
    layout: 'dashboard',
}
</script>