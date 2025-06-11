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

        <program-form
            title="Tambah Program"
            action="create"
            :isFromModal="true"
            :hideHeader="true"
            :isCard="false"
            customClass="col-lg-12"
            @canceled="dataVModel = false"
            @submitted="submitHandle($event)"/>

    </b-modal>
</template>

<script>
import ProgramForm from "@/components/template/micro/form/ProgramForm.vue";

export default {
    components: {
        ProgramForm
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
        // String Props
        size: {
            type: String,
            default: 'lg'
        },
        title: {
            type: String,
            default: 'Modal Title'
        },
        // Boolean Props
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