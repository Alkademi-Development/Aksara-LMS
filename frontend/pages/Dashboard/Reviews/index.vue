<template>
    <section id="review-assignments" class="container-fluid min-height-100vh bg-white pt-3">
        <div class="box-title">
            <h3 class="title">Daftar Tugas</h3>
        </div>
        <SectionReviewAssignment
            :propAssignmentId="assignmentId"
        />
    </section>
</template>

<script>
import SectionReviewAssignment from "@/components/template/micro/section/SectionReviewAssignment.vue";
import { mapActions, mapState } from 'vuex';

export default {
    asyncData({query}){
        const assignmentId = parseInt(query?.assignmentId);

        return { assignmentId }
    },
    components: { SectionReviewAssignment },
    layout: 'dashboard',
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
        // let filterOptions = []

        // const params = {
        //     state: ''
        // }

        // this.getClassrooms(params).then(() => {

        //     if (this.listClassrooms?.length != 0) {

        //         this.listClassrooms.map((item) => {
        //             const object = {
        //                 label: item?.name,
        //                 slug: item?.slug,
        //                 value: item?.id
        //             }
        //             filterOptions.push(object)
        //         })

        //         this.isLoaded = true

        //     } else {
        //         this.isLoaded = true
        //         filterOptions.push({label:"Belum ada kelas!",value:-1})
        //     }
        //     console.log(filterOptions, 60);
        //     this.setFilters(filterOptions)
        // })

    },
    methods: {
        ...mapActions({
            setFilters: 'Layouts/setFilters',
            getClassrooms: "Services/classrooms",
        })
    }
}
</script>

<style lang="scss">
@import "@/assets/scss/components/review/review-assignments.scss";

.min-height-100vh {
    min-height: calc( 100vh - 140px) !important;
}
</style>