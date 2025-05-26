<template>
    <div class="container-fluid">
        <div class="d-flex align-items-center justify-content-end justify-content-sm-between flex-wrap gap-2">
            <FilterSearchAndSort />
            <NuxtLink to="/dashboard/courses/bundle" class="btn btn-primary d-flex align-items-center gap-2">
                <i class="ri-add-line text-md"></i>
                <span>Materi</span>
            </NuxtLink>
        </div>
        <div>
            <div class="row row-gap-3 mt-4">
                <div class="col-12 col-md-6 col-lg-4">
                    <CardCourse />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <CardCourse />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <CardCourse />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <CardCourse />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <CardCourse />
                </div>
            </div>
            <!-- <p class="text-xl text-center my-10">Bundle Belum Tersedia</p> -->
        </div>
    </div>
</template>

<script setup>
import CardCourse from "@/components/cards/CardCourse.vue";
import FilterSearchAndSort from "@/components/partials/FilterSearchAndSort";

</script>

<style lang="scss" scoped>

</style>