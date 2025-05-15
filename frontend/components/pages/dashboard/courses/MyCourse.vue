<template>
    <div>
        <div class="d-flex align-items-center justify-content-between">
            <h3>Materi Saya</h3>
            <NuxtLink to="/dashboard/courses/my-course" class="fw-medium text-lg">Lihat Semua</NuxtLink>
        </div>
        <FilterSearchAndSort class="mt-6" />
        <div class="mt-3">
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
            </div>
            <div class="d-flex align-items-center justify-content-center mt-4">
                <NuxtLink to="/dashboard/courses/my-course" class="btn btn-outline-primary px-8 py-2 rounded text-md">Lihat Semua</NuxtLink>
            </div>
            <!-- <p class="text-xl text-center my-10">Materi Belum Tersedia</p> -->
        </div>
    </div>
</template>

<script setup>
import FilterSearchAndSort from "@/components/partials/FilterSearchAndSort";
import CardCourse from "@/components/cards/CardCourse.vue";

</script>

<style lang="scss" scoped>

</style>