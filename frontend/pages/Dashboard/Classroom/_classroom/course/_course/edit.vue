<template>
    <div class="course-container bg-white p-4">
        <!-- <BackButton /> -->
        
        <CourseForm 
            action="edit"
            customClass="py-4" 
            :isFromClass="true"
            :courseId="courseId"
            :classroomId="classroomId"
            :isCard="false"
            @callbackSubmit="handleCallbackSubmit"
            @callbackCancel="handleCallbackSubmit"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';

// import BackButton from '~/components/classrooms/micro/BackButton.vue';
import CourseForm from '~/components/template/micro/form/CourseForm.vue';

import { toDecrypt } from '~/commons/utils';

export default {
    async asyncData ({ params, query }) {
        const classSlug = params.classroom
        const courseId = parseInt(toDecrypt(localStorage.getItem('courseId')));
        const classroomId = parseInt(toDecrypt(localStorage.getItem('classroomId')))

        return { classSlug, courseId, classroomId };
    },
    layout: "dashboard",
    components: { CourseForm },
    methods: {
        ...mapActions({ 
            setActiveTab: 'Layouts/setActiveTab',
        }),
        handleCallbackSubmit() {
            // localStorage.removeItem('courseId')
            this.setActiveTab('courses')
            // this.$router.push(`/dashboard/classroom/${this.classSlug}`);

            this.$router.go(-1);
        },
        handleCallbackCancel() {
            // localStorage.removeItem('courseId')
            
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
    .course-container {
        min-height: calc( 100vh - 115px);
    }
</style>