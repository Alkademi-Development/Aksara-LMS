<template>
    <div class="h-100 d-flex flex-column overflow-hidden">
        <div class="py-3 px-4">
            <div>
                <div class="mb-4 text-center">
                    <a href="#">
                        <img src="@/assets/images/logo-alkademi.png" class="w-100" alt="Logo Alkademi" style="max-width: 250px;">
                    </a>
                </div>
                <ProfileMenu />
            </div>
        </div>

        <nav class="d-flex flex-column flex-grow-1 overflow-auto">
            <NuxtLink to="/dashboard/classroom" class="py-3 px-4 d-flex align-items-center gap-3">
                <i :class="`${route.path.includes('/dashboard/classroom') ? 'text-primary' : 'text-black'} ri-stack-fill text-md`"></i>
                <span :class="`${route.path.includes('/dashboard/classroom') ? 'text-black' : 'text-black'} text-sm fw-normal`">Kelas</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/reviews" class="py-3 px-4 d-flex align-items-center gap-3">
                <i :class="`${route.path.includes('/dashboard/reviews') ? 'text-primary' : 'text-black'} ri-file-search-line text-md`"></i>
                <span :class="`${route.path.includes('/dashboard/reviews') ? 'text-black' : 'text-black'} text-sm fw-normal`">Review Tugas</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/schedules" class="py-3 px-4 d-flex align-items-center gap-3">
                <i :class="`${route.path.includes('/dashboard/schedules') ? 'text-primary' : 'text-black'} ri-calendar-event-fill text-md`"></i>
                <span :class="`${route.path.includes('/dashboard/schedules') ? 'text-black' : 'text-black'} text-sm fw-normal`">Jadwal Kegiatan</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/courses" class="py-3 px-4 d-flex align-items-center gap-3">
                <i :class="`${route.path.includes('/dashboard/courses') ? 'text-primary' : 'text-black'} ri-book-line text-md`"></i>
                <span :class="`${route.path.includes('/dashboard/courses') ? 'text-black' : 'text-black'} text-sm fw-normal`">Pustaka</span>
            </NuxtLink>
            <hr>
            <NuxtLink to="/dashboard/studio" class="py-3 px-4 d-flex align-items-center gap-3">
                <i :class="`${route.path.includes('/dashboard/studio') ? 'text-primary' : 'text-black'} ri-code-box-line text-md`"></i>
                <span :class="`${route.path.includes('/dashboard/studio') ? 'text-black' : 'text-black'} text-sm fw-normal`">Studio</span>
            </NuxtLink>
        </nav>

        <footer class="text-wrap py-3 px-4 m-0" style="max-width: 300px;">
            <p class="text-sm text-black">
                © 2025 Alkademi - Accelerate Your Global Digital Career with Artificial Intelligence 
            </p>
            <a href="#" class="text-black"><b>Powered by Alkademi</b></a>
        </footer>

    </div>
</template>

<script setup>
import ProfileMenu from './ProfileMenu.vue';

const route = useRoute()

</script>

<style scoped>

</style>