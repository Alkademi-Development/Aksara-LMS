<template>
    <div class="course-container bg-white p-4">        
        <CourseForm 
            action="create"
            :isFromClass="true"
            customClass="pb-4" 
            :isCard="false"
            :classroomId="classroomId"
            @callbackSubmit="handleCallbackSubmit"
            @callbackCancel="handleCallbackCancel"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';

import CourseForm from '~/components/template/micro/form/CourseForm.vue';

import { toDecrypt } from '~/commons/utils'

export default {
    async asyncData ({ params, query }) {
        const classroomId = parseInt(toDecrypt(localStorage.getItem('classroomId')));
        return { classroomId };
    },
    layout: "dashboard",
    components: { 
        CourseForm
    },
    methods: {
        ...mapActions({ 
            setActiveTab: 'Layouts/setActiveTab',
        }),
        handleCallbackSubmit() {
            // localStorage.removeItem('classId')
            this.setActiveTab('courses')
            // this.$router.push(`/dashboard/classroom/${this.classSlug}`);
            this.$router.go(-1);
        },
        handleCallbackCancel() {
            localStorage.removeItem('classId')
            this.$router.go(-1);
        }
    },
}
</script>

<style scoped>
    .course-container {
        min-height: calc( 100vh - 115px);
    }
</style>