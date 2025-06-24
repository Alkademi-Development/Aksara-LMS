<template>
    <div class="assignment-container bg-white p-4">        
        <ModuleForm
            title="Edit Pretest"
            action="edit"
            customClass="pb-4 col-12"
            isFromClass
            isAssignment
            isPretest
            :moduleId="topicId"
            :classroomId="classId"
            :isCard="false"
            @callbackSubmit="$router.go(-1)"
            @callbackCancel="$router.go(-1)"
        />
    </div>
</template>

<script>
import { toDecrypt } from '~/commons/utils'
import ModuleForm from '~/components/template/micro/form/ModuleForm.vue'

export default {
    async asyncData ({ params, query }) {
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')));
        const topicId = parseInt(toDecrypt(localStorage.getItem('assignmentId')));
        const isFromOverview = query?.fromOverview === 'true' ? true : false
        return { classId, topicId, isFromOverview };
    },
    layout: "dashboard",
    components: { 
        ModuleForm 
    },
    methods: {
        callbackSubmit() {
            console.log(this.isFromOverview, "SUBMIT CALLBACK")
        }
    },
}
</script>

<style scoped>
    .assignment-container {
        min-height: calc( 100vh - 115px);
    }
</style>