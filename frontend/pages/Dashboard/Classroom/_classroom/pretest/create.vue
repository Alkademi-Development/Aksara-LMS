<template>
    <div class="assignment-container bg-white p-4">        
        <ModuleForm
            title="Buat Pretest"
            action="create"
            customClass="pb-4 col-12"
            :classroomId="classId"
            isFromClass
            isAssignment
            isPretest
            :isCard="false"
            @callbackSubmit="callbackSubmit"
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
        const classroomName = params.classroom;
        const isFromOverview = query?.fromOverview === 'true' ? true : false
        return { classId, isFromOverview, classroomName };
    },
    layout: "dashboard",
    components: { 
        ModuleForm 
    },
    methods: {
        callbackSubmit() {
            if (this.isFromOverview) this.$router.replace({
                path: `/dashboard/classroom/${ this.classroomName }/pretest`,
                query: {
                    id: this.classId
                }
            })
            else this.$router?.go(-1)
        }
    },
}
</script>

<style scoped>
    .assignment-container {
        min-height: calc( 100vh - 115px);
    }
</style>