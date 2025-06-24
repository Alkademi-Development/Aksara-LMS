<template>
    <div v-if="!isPageError" class="min-height-100vh bg-white p-4">
        
        <RequirementsClassForm
            :classroomSlug="classroomSlug"
            @permissionDenied="isPageError = true"/>

    </div>
    <ErrorPage v-else :page404="true" />
</template>

<script>
import { mapState } from 'vuex'

import RequirementsClassForm from "~/components/template/micro/form/RequirementsClassForm.vue"

export default {
    layout: 'dashboard',
    async asyncData ({ params }) {
        const classroomSlug = params.code;
        return { classroomSlug };
    },
    components: { RequirementsClassForm },
    data() {
        return {
            isPageError: false,
        }
    },
    computed: {
        ...mapState({
            sassState: (state) => state.Sass
        })
    }
}
</script>