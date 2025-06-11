<template>
    <div>

        <ContentHeader title="Tes" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <Assignments :classroomId="classroomId" />

            <!-- Footer -->
            <Footer />

        </div>

    </div>
</template>

<script>
// Import Default Page Content
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"

// Import Page Content
import Assignments from '@/components/classrooms/Assignments';

export default {
    async asyncData ({ params }) {
        const classroomId = parseInt(params.classroomId);
        return { classroomId };
    },
    layout: 'dashboard',
    components: {
        ContentHeader,
        Footer,
        Assignments
    },
}
</script>