<template>
    <div>

        <ContentHeader title="Tes" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <DetailClassroom
                :id="paramId"
            />

            <!-- <DetailModule
                v-else
                :currentBatch="currentBatch"
            /> -->

            <!-- Footer -->
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import DetailClassroom from "@/components/classrooms/Student"
import Footer from "@/components/template/dashboard/Footer"

import DetailModule from "@/components/classrooms/DetailModule"

export default {
    async asyncData ({ params }) {
        const paramId = parseInt(params.classroom);
        return { paramId };
    },
    layout: 'dashboard',
    components: {
        ContentHeader,
        Footer,
        DetailClassroom,
        DetailModule
    },
    data () {
        return {
            isStudent: localStorage.getItem('user_kind') == 'student',
        }
    },
}
</script>