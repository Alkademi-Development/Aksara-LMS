<template>
    <div>
        <div>
            <div class="d-flex align-items-center justify-content-between">
                <h3>Paket</h3>
                <NuxtLink to="/dashboard/courses/bundle" class="fw-medium text-lg">Lihat Semua</NuxtLink>
            </div>
            <div class="mt-3">
                <div class="d-flex align-items-center justify-content-end justify-content-sm-between flex-wrap gap-2">
                    <FilterSearchAndSort />
                    <NuxtLink to="/dashboard/courses/bundle" class="btn btn-primary d-flex align-items-center gap-2">
                        <i class="ri-add-line text-md"></i>
                        <span>Paket</span>
                    </NuxtLink>
                </div>
                <div>
                    <div class="row row-gap-3 mt-4">
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center mt-4">
                        <NuxtLink to="/dashboard/courses/bundle" class="btn btn-outline-primary px-8 py-2 rounded text-md">Lihat Semua</NuxtLink>
                    </div>
                    <!-- <p class="text-xl text-center my-10">Bundle Belum Tersedia</p> -->
                </div>
            </div>
        </div>
        <div class="mt-6">
            <div class="d-flex align-items-center justify-content-between">
                <h3>Materi</h3>
                <NuxtLink to="/dashboard/courses/materi" class="fw-medium text-lg">Lihat Semua</NuxtLink>
            </div>
            <div class="mt-3">
                <div class="d-flex align-items-center justify-content-end justify-content-sm-between flex-wrap gap-2">
                    <FilterSearchAndSort />
                    <NuxtLink to="/dashboard/courses/materi" class="btn btn-primary d-flex align-items-center gap-2">
                        <i class="ri-add-line text-md"></i>
                        <span>Materi</span>
                    </NuxtLink>
                </div>
                <div>
                    <div class="row row-gap-3 mt-4">
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <CourseCard />
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center mt-4">
                        <NuxtLink to="/dashboard/courses/materi" class="btn btn-outline-primary px-8 py-2 rounded text-md">Lihat Semua</NuxtLink>
                    </div>
                    <!-- <p class="text-xl text-center my-10">Materi Belum Tersedia</p> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CourseCard from "@/components/cards/CourseCard.vue";
import FilterSearchAndSort from "@/components/partials/FilterSearchAndSort";

</script>

<style lang="scss" scoped>
</style>