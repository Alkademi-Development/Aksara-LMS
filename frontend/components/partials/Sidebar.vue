<template>
    <div class="min-vh-100 h-100 d-flex flex-column">
        <div class="py-3 px-5">
            <div class="mb-4 text-center">
                <a href="#">
                    <img src="@/assets/images/logo-alkademi.png" class="w-100" alt="Logo Alkademi" style="max-width: 250px;">
                </a>
            </div>
            <button type="button" class="d-flex align-items-start gap-2">
                <img src="https://drive.alkademi.id/v1/upload/profile/1739443896728.png" alt="Photo Profile" width="40" class="mt-1">
                <div>
                    <h4 class="fw-normal">Alkademi</h4>
                    <p class="fs-6 text-secondary">Super Admin</p>
                </div>
            </button>
        </div>

        <nav class="d-flex flex-column flex-grow-1">
            <NuxtLink to="/dashboard/class" class="py-3 px-5 d-flex align-items-center gap-3">
                <i class="ri-stack-fill fs-5"></i>
                <span class="text-black fs-6 fw-bolder">Kelas</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/class" class="py-3 px-5 d-flex align-items-center gap-3">
                <i class="ri-file-search-line text-secondary fs-5"></i>
                <span class="text-black fs-6 fw-normal">Review Tugas</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/class" class="py-3 px-5 d-flex align-items-center gap-3">
                <i class="ri-calendar-event-fill text-secondary fs-5"></i>
                <span class="text-black fs-6 fw-normal">Jadwal Kegiatan</span>
            </NuxtLink>
            <hr>
            <NuxtLink to="/dashboard/class" class="py-3 px-5 d-flex align-items-center gap-3">
                <i class="ri-code-box-line text-secondary fs-5"></i>
                <span class="text-black fs-6 fw-normal">Studio</span>
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

<script>
    export default {
        
    }
</script>

<style scoped>

</style>