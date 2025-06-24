<template>
    <b-modal 
        v-model="dataVModel"
        :size="size"
        :title="title"
        :hide-footer="hideFooter"
        :hide-header="hideHeader"
        :centered="centered"
        no-close-on-backdrop
        no-close-on-esc>

        <module-form
            action="create"
            :classroomModules="classroomModules"
            :classroomId="classroomId"
            :isFromClass="isFromClass"
            :hideHeader="true"
            :isCard="false"
            customClass="col-lg-12"
            @canceled="dataVModel = false"
            @submitted="submitHandle($event)"/>

    </b-modal>
</template>

<script>
import ModuleForm from "@/components/template/micro/form/ModuleForm.vue";

export default {
    components: {
        ModuleForm
    },

    data() {
        return {
            dataVModel: false,
        }
    },

    methods: {
        submitHandle(event = null) {
            this.dataVModel = false
            this.$emit('submitted', event)
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

    props: {
        // Array
        classroomModules: {
            type: Array,
            default: () => []
        },
        // String Props
        size: {
            type: String,
            default: 'lg'
        },
        title: {
            type: String,
            default: 'Modal Title'
        },
        // Number
        classroomId: {
            type: Number,
            default: -1
        },
        // Boolean Props
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
    }
}
</script>