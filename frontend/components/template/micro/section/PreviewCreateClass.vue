<template>
    <b-row>
        <b-col cols="12">
            <b-alert show dismissible class="bg-secondary py-2 mb-4 border-secondary" style="color: #000">
                Pratinjau tampilan kelas.
            </b-alert>
        </b-col>

        <b-col cols="12">
            <ClassroomOverview
                :classCode="detailOverview?.slug"
                :isComponentLoaded="isClassDetailLoaded"
                :detailOverview="detailOverview"
                isStepProcess
            />
        </b-col>

        <b-col cols="12">
            <CreateClassroomForm isPreview @changeStep="$emit('changeStep', $event)" :isEditPage="isEditPage" />
        </b-col>
    </b-row>
</template>

<script>
import ClassroomOverview from "@/components/classrooms/Overview.vue"
import CreateClassroomForm from "@/components/template/micro/form/CreateClassroomForm.vue"

import fieldForm from '@/store/global/createClassroom'

export default {
    components: {
        ClassroomOverview,
        CreateClassroomForm,
    },
    props: {
        detailOverview: {
            type: Object,
            default: () => ({})
        },
        isClassDetailLoaded: {
            type: Boolean,
            default: false
        },
        isEditPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputOverview: [],
            inputForm: [],
            inputDetail: [],
            inputDate: [],
            inputOther: [],
            output: {},
        }
    },
    methods: {
        initForm() {
            this.inputForm = []
            this.inputOverview = fieldForm?.inputFormOverview
            this.inputDetail = fieldForm?.inputFormDetail
            this.inputDate = fieldForm?.inputFormDate
            this.inputOthers = fieldForm?.inputFormOthers
        }
    }
}
</script>
