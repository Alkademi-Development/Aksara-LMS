<template>
    <b-modal 
        v-model="dataVModel"
        :size="size"
        :title="title"
        :hide-footer="hideFooter"
        :hide-header="hideHeader"
        :centered="centered"
        no-close-on-backdrop
        no-close-on-esc
        body-class="px-2">

        <CourseForm 
            v-if="isNewCourse"
            action="create"
            :classroomId="classroomId"
            :isFromClass="isFromClass"
            :hideHeader="true"
            :isCard="false"
            customClass="col-lg-12"
            @canceled="dataVModel = false"
            @submitted="submitHandle($event)"/>

        <ClassroomAddModuleForm
            v-else
            :isAddModule="true"
            :classroomId="classroomId"
            :classroomModules="classroomModules"
            @addModuleToggler="dataVModel = false"
            @submitAddModule="submitHandle($event)"/>

    </b-modal>
</template>

<script>
import CourseForm from "@/components/template/micro/form/CourseForm.vue";
import ClassroomAddModuleForm from "@/components/template/micro/form/ClassroomAddModuleForm.vue";

export default {
    components: {
        CourseForm,
        ClassroomAddModuleForm
    },
    props: {
        classroomModules: {
            type: Array,
            default: () => []
        },
        size: {
            type: String,
            default: 'lg'
        },
        title: {
            type: String,
            default: 'Modal Title'
        },
        classroomId: {
            type: Number,
            default: -1
        },
        isNewCourse: {
            type: Boolean,
            default: false
        },
        isFromClass: {
            type: Boolean,
            default: false
        },
        vModel: {
            type: Boolean,
            default: false
        },
        hideFooter: {
            type: Boolean,
            default: false
        },
        hideHeader: {
            type: Boolean,
            default: false
        },
        centered: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            dataVModel: false,
        }
    },
    watch: {
        vModel() {
            this.dataVModel = this.vModel
            this.$emit('vModelChange', this.dataVModel)
        },
        dataVModel() {
            this.$emit('vModelChange', this.dataVModel)
        }
    },
    methods: {
        submitHandle(event = null) {
            this.dataVModel = false
            this.$emit('submitted', event)
        }
    },
}
</script>