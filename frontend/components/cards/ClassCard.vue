<template>
    <div class="card-class d-flex flex-column bg-white rounded border px-3 py-4 min-h-xs overflow-hidden">
        <div class="card-header">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                    <span class="badge badge-green text-sm fw-medium">Pendaftaran</span>
                    <span class="badge badge-primary text-sm fw-medium">Berlangsung</span>
                </div>
                <button type="button" class="px-2 py-1 rounded border">
                    <i class="ri-more-line fs-1"></i>
                </button>
            </div>
            <img src="https://drive.alkademi.id/v1/upload/class/1746534916220.png" alt="Thumbnail" class="img-cover max-w-xs mt-4 mb-5" style="max-height: 45px;">
        </div>
        <div class="card-body flex-grow-1">
            <NuxtLink to="/dashboard/classroom/fullstack-programming">
                <h4 class="text-base fw-bolder text-sm text-limit limit-2">AlkademiTalk #6: Mastering Coding Assessments: Strategies from a Competitive Programming Enthusiast</h4>
            </NuxtLink>
            <p class="mt-3 mb-5 text-sm text-limit limit-2">
                Coding Your Way to Global Opportunities invites us to explore how programming skills can open doors to international career paths. This session dives deep into strategies for conquering coding assessments, shared by a competitive programming enthusiast who now works at one of the world’s leading tech companies.This is an online event, open to the public, providing a valuable opportunity to learn directly from I Gede Arya Raditya P (Software Development Engineer @ Amazon UK), who will share effective tips and insights on mastering coding challenges.NB: (Dapatkan Link Google Meet di Menu "Kegiatan")
            </p>
        </div>
        <div class="card-footer mt-auto pt-3 border-top">
            <span class="text-sm d-flex align-items-center gap-2">
                <i class="ri-calendar-check-fill text-lg"></i>
                15 May 12:00 PM - 15 May 02:00 PM
            </span>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
</style>