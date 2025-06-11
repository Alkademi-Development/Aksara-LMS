<template>
    <div class="course-container bg-white p-4">        
        <MeetsForm 
            action="create"
            customClass="pb-4" 
            hideHeader 
            isFromClass
            @callbackSubmit="handleCallbackSubmit"
            @callbackCancel="handleCallbackCancel"
            :isCard="false"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';

import MeetsForm from '~/components/template/micro/form/MeetsForm.vue';

export default {
    async asyncData ({ params }) {
        // const classId = parseInt(params.classroom);
        // return { classId };
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
    },
    mounted() {
        // console.log(this.classId)
    }
}
</script>

<style scoped>
    .course-container {
        min-height: calc( 100vh - 115px);
    }
</style>