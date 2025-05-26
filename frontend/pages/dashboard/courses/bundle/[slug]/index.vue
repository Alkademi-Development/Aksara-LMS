<template>
    <div class="container-fluid">
        <div class="border px-3 py-5 rounded">
            <h1>Bundle Test</h1>
            <p class="my-4">Test</p>
            <div class="mt-2">
                <ul>
                    <li class="d-flex align-items-center gap-2">
                        <i class="ri-account-circle-line text-primary text-lg"></i>
                        <p>Dibuat oleh <span class="text-primary">Alkademi</span></p>
                    </li>
                    <li class="d-flex align-items-center gap-2">
                        <i class="ri-history-line text-primary text-lg"></i>
                        <p>Terakhir diupdate 22/4/2025 </p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="border rounded mt-4">
            <ul>
                <li class="p-3 d-flex align-items-center gap-4">
                    <figure class="rounded overflow-hidden" style="max-width: 64px; height: 64px;">
                        <img src="https://drive.alkademi.id/v1/upload/announcement/1746437470691.jpg" alt="Thumbnail" class="w-100 h-100 object-fit-cover">
                    </figure>
                    <NuxtLink to="/dashboard/courses/bundle/bundle-test/modules/alkademi-for-kidz-belajar-algoritma-dengan-minecraft"><h5 class="text-base text-limit limit-2">IoT Fundamental dengan ESP 32</h5></NuxtLink>
                </li>
                <li class="p-3 d-flex align-items-center gap-4">
                    <figure class="rounded overflow-hidden" style="max-width: 64px; height: 64px;">
                        <img src="https://drive.alkademi.id/v1/upload/announcement/1745447252880.png" alt="Thumbnail" class="w-100 h-100 object-fit-cover">
                    </figure>
                    <NuxtLink to="/dashboard/courses/bundle/bundle-test/modules/alkademi-for-kidz-belajar-algoritma-dengan-minecraft"><h5 class="text-base text-limit limit-2">Alkademi for Kidz - Belajar Algoritma dengan Minecraft</h5></NuxtLink>
                </li>
            </ul>
        </div>
        <div class="mt-5">
            <div class="d-flex align-items-center justify-content-between">
                <h4>Paket Lainnya</h4>
                <NuxtLink to="/dashboard/courses/bundle" class="fw-medium text-lg">Lihat Semua</NuxtLink>
            </div>
            <div class="border rounded mt-4">
                <ul>
                    <li class="p-3 d-flex align-items-center gap-4">
                        <figure class="rounded overflow-hidden" style="max-width: 64px; height: 64px;">
                            <img src="https://drive.alkademi.id/v1/upload/announcement/1746437470691.jpg" alt="Thumbnail" class="w-100 h-100 object-fit-cover">
                        </figure>
                        <div class="d-flex flex-column gap-1">
                            <NuxtLink to="/dashboard/courses/bundle/bundle-test/modules/alkademi-for-kidz-belajar-algoritma-dengan-minecraft"><h5 class="text-base text-limit limit-2">Bundle Test</h5></NuxtLink>
                            <span>2 Materi</span>
                        </div>
                    </li>
                    <li class="p-3 d-flex align-items-center gap-4">
                        <figure class="rounded overflow-hidden" style="max-width: 64px; height: 64px;">
                            <img src="https://drive.alkademi.id/v1/upload/announcement/1745447252880.png" alt="Thumbnail" class="w-100 h-100 object-fit-cover">
                        </figure>
                        <div class="d-flex flex-column gap-1">
                            <NuxtLink to="/dashboard/courses/bundle/bundle-test/modules/alkademi-for-kidz-belajar-algoritma-dengan-minecraft"><h5 class="text-base text-limit limit-2">Bundle Test</h5></NuxtLink>
                            <span>2 Materi</span>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- <div class="border rounded mt-3">
                <div class="d-flex flex-column align-items-center justify-content-center p-4">
                    <i class="ri-book-3-fill text-5xl text-grey2"></i>
                    <h5 class="fw-medium text-grey2">Paket Belum Tersedia</h5>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>