<template>
    <div class="course-container bg-white p-4">        
        <MeetsForm 
            action="edit"
            customClass="pb-4" 
            hideHeader 
            isFromClass
            @callbackSubmit="handleCallbackSubmit"
            @callbackCancel="handleCallbackCancel"
            :classroomId="null"
            :eventSlug="postSlug"
            :isCard="false"
            isAnnouncement
        />
    </div>
</template>

<script>
import MeetsForm from '~/components/template/micro/form/MeetsForm.vue';

export default {
    async asyncData ({ params }) {
        const postSlug = params?.id;
        return { postSlug };
    },
    layout: "dashboard",
    components: { 
        MeetsForm
    },
    methods: {
        handleCallbackSubmit() {
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