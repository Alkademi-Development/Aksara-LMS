<template>
    <div class="min-vh-100 h-100 d-flex flex-column">
        <div class="py-3 px-5">
            <div>
                <div class="mb-4 text-center">
                    <a href="#">
                        <img src="@/assets/images/logo-alkademi.png" class="w-100" alt="Logo Alkademi" style="max-width: 230px;">
                    </a>
                </div>
                <button type="button" class="w-100 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-start gap-2">
                        <img src="https://drive.alkademi.id/v1/upload/profile/1739443896728.png" alt="Photo Profile" width="40" class="mt-1">
                        <div>
                            <h4 class="fw-normal">Alkademi</h4>
                            <p class="fs-6 text-secondary">Super Admin</p>
                        </div>
                    </div>
                    <i class="ri-arrow-right-s-line text-lg"></i>
                </button>
            </div>
        </div>

        <nav class="d-flex flex-column flex-grow-1">
            <NuxtLink to="/dashboard/classroom" class="py-3 px-5 d-flex align-items-center gap-3">
                <i :class="`${route.path === '/dashboard/classroom/' ? 'text-primary' : 'text-secondary'} ri-stack-fill fs-5`"></i>
                <span :class="`${route.path === '/dashboard/classroom/' ? 'text-black' : 'text-secondary'} fs-6 fw-bolder`">Kelas</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/reviews" class="py-3 px-5 d-flex align-items-center gap-3">
                <i :class="`${route.path === '/dashboard/reviews/' ? 'text-primary' : 'text-secondary'} ri-file-search-line text-secondary fs-5`"></i>
                <span :class="`${route.path === '/dashboard/reviews/' ? 'text-black' : 'text-secondary'} fs-6 fw-normal`">Review Tugas</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/schedules" class="py-3 px-5 d-flex align-items-center gap-3">
                <i :class="`${route.path === '/dashboard/schedules/' ? 'text-primary' : 'text-secondary'} ri-calendar-event-fill text-secondary fs-5`"></i>
                <span :class="`${route.path === '/dashboard/schedules/' ? 'text-black' : 'text-secondary'} fs-6 fw-normal`">Jadwal Kegiatan</span>
            </NuxtLink>
            <hr>
            <NuxtLink to="/dashboard/studio" class="py-3 px-5 d-flex align-items-center gap-3">
                <i :class="`${route.path === '/dashboard/studio/' ? 'text-primary' : 'text-secondary'} ri-code-box-line text-secondary fs-5`"></i>
                <span :class="`${route.path === '/dashboard/studio/' ? 'text-black' : 'text-secondary'} fs-6 fw-normal`">Studio</span>
            </NuxtLink>
        </nav>

        <footer class="text-wrap py-3 px-5 m-0" style="max-width: 300px;">
            <p class="text-secondary">
                © 2025 Alkademi - Accelerate Your Global Digital Career with Artificial Intelligence 
            </p>
            <a href="#"><b>Powered by Alkademi</b></a>
        </footer>

    </div>
</template>

<script setup>
const route = useRoute()

</script>

<style scoped>

</style>