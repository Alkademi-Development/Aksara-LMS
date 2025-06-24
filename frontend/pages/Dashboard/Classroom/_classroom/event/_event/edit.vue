<template>
    <div class="course-container bg-white p-4">        
        <MeetsForm 
            action="edit"
            customClass="pb-4" 
            hideHeader 
            isFromClass
            @callbackSubmit="handleCallbackSubmit"
            @callbackCancel="handleCallbackCancel"
            :classroomId="classId"
            :eventSlug="eventSlug"
            :isCard="false"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';

import MeetsForm from '~/components/template/micro/form/MeetsForm.vue';

export default {
    async asyncData ({ params }) {
        const classId = parseInt(params.classroom);
        const eventSlug = params.event;

        return { classId, eventSlug };
    },
    layout: "dashboard",
    components: { 
        MeetsForm
    },
    methods: {
        ...mapActions({ 
            setActiveTab: 'Layouts/setActiveTab',
        }),
        handleCallbackSubmit() {
            this.setActiveTab('events')
            // this.$router.push(`/dashboard/classroom/${this.classSlug}`);
            this.$router.go(-1);
        },
        handleCallbackCancel() {
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
    .course-container {
        min-height: calc( 100vh - 115px);
    }
</style>