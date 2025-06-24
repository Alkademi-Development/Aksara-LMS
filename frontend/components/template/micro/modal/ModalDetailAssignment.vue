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
        body-class="pt-0"
    >

        <h5 class="subtitle">Nilai Tugas</h5>
        <div class="assignment">
            <div class="border border-primary px-2 py-3" v-for="(course, idx) in classroomModules" :key="idx">
                <div class="d-flex flex-row align-items-center justify-content-between">
                    <div class="d-flex flex-column">
                        <div class="assingment-title">{{ course?.title }}</div>
                        <div :class="course?.type">{{ course?.type }}</div>
                    </div>
                    <span class="score">{{ course?.score }}</span>
                </div>
            </div>
        </div>

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

<style lang="scss" scoped>
@import '@/assets/scss/components/micro/modal/modalDetailAssignment.scss';
</style>