<template>
    <div>
        <ContentHeader title="Tes" />

        <!-- Page content -->
        <div class="container-fluid mt--6">

            <DetailModule
                :classroomId="parseInt(classroomId)"
                :topicId="parseInt(topicId)"
                :moduleId="parseInt(moduleId)"
            />

            <!-- Footer -->
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
        const topicId = params.module;
        const moduleId = params.course;

        return { classroomId, topicId, moduleId };
    },
    components: {
        ContentHeader,
        Footer,
        DetailModule
    },
    layout: 'dashboard',
}
</script>