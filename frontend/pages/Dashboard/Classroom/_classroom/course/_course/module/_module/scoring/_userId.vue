<template>
    <div>
        <ContentHeader title="Penilaian" />

        <!-- Page content -->
        <div class="container-fluid mt--6">

            <ScoringForm
                :classroomId="parseInt(classroomId)"
                :topicId="parseInt(topicId)"
                :moduleId="parseInt(moduleId)"
                :userId="parseInt(userId)"
            />

            <!-- Footer -->
            <Footer />

        </div>
    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"
import ScoringForm from "@/components/template/micro/form/ScoringForm.vue"

export default {
    asyncData({params}) {
        const classroomId = params.classroom;
        const topicId = params.module;
        const moduleId = params.course;
        const userId = params.userId;

        return { classroomId, topicId, moduleId, userId };
    },
    components: {
        ContentHeader,
        Footer,
        ScoringForm
    },
    layout: 'dashboard',
}
</script>