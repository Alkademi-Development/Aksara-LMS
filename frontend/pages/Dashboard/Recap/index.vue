<template>
    <section id="review-assignments" class="container-fluid min-height-100vh bg-white pt-3">
        <SectionRecap />
    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import SectionRecap from "@/components/template/micro/section/SectionRecap.vue";

export default {
    layout: 'dashboard',
    components: { 
        SectionRecap
    },
    computed: {
        ...mapState({
            listClassrooms: (state) => state?.Services?.classrooms
        })
    },
    data() {
        return {
            isLoaded: false
        }
    },
    created() {
        // this.initializeRecap()
    },
    methods: {
        ...mapActions({
            setFilters: 'Layouts/setFilters',
            getClassrooms: "Services/classrooms",
        }),
        // initializeRecap() {
        //     let filterOptions = []

        //     const params = {
        //         state: ''
        //     }

        //     this.getClassrooms(params).then(() => {

        //         if (this.listClassrooms?.length != 0) {

        //             this.listClassrooms.map((item) => {
        //                 const object = {
        //                     label: item?.name,
        //                     slug: item?.slug,
        //                     value: item?.id
        //                 }
        //                 filterOptions.push(object)
        //             })

        //             this.isLoaded = true

        //         } else {
        //             this.isLoaded = true
        //             filterOptions.push({label:"Belum ada kelas!",value:-1})
        //         }

        //         this.setFilters(filterOptions)
        //     })
        // }
    }
}
</script>

<style lang="scss">
@import "@/assets/scss/components/review/review-assignments.scss";

.min-height-100vh {
    min-height: calc( 100vh - 140px) !important;
}
</style>