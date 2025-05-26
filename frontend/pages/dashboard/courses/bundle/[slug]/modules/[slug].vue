<template>
    <div class="container-fluid">
        <div class="border px-3 py-5 rounded">
            <div class="row row-gap-3">
                <div class="col-12 col-md-4 d-block d-md-none">
                    <figure class="w-100 overflow-hidden rounded border" style="max-height: 350px;">
                        <img src="https://drive.alkademi.id/v1/upload/announcement/1746437470691.jpg" alt="Thumbnail" class="w-100 h-100 object-fit-cover">
                    </figure>
                </div>
                <div class="col-12 col-md-8">
                    <h1 class="text-primary">IoT Fundamental dengan ESP 32 </h1>
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
                <div class="col-12 col-md-4 d-none d-md-block">
                    <figure class="w-100 overflow-hidden rounded border" style="max-height: 350px; aspect-ratio: 1/1;">
                        <img src="https://drive.alkademi.id/v1/upload/announcement/1746437470691.jpg" alt="Thumbnail" class="w-100 h-100 object-fit-cover">
                    </figure>
                </div>
            </div>
        </div>
        <div class="mt-5 px-5 py-4 bg-white border rounded">
            <ul class="d-flex flex-column gap-4">
                <li 
                    v-for="(item, index) in displayedItems"
                    :key="index"
                    :class="['accordion pb-2', { 'border-bottom': index != displayedItems?.length - 1 }]"
                >
                   <div 
                        class="accordion-toggle d-flex align-items-start justify-content-between"
                        @click="toggleAccordion(index)"
                    >
                        <div>
                            <h3 class="mb-1">{{ item?.title }}</h3>
                            <span>{{ item?.module }}</span>
                        </div>
                        <i 
                            class="ri-arrow-down-s-line text-lg"
                        ></i>
                   </div>
                    <!-- Konten Accordion -->
                    <transition name="accordion">
                        <div
                            v-if="activeAccordion === index"
                            class="accordion-content mt-2"
                        >
                            <p class="text-limit limit-4">{{ item?.content }}</p>
                        </div>
                    </transition>
                </li>
            </ul>
            <div class="text-center d-flex align-items-center justify-content-center mt-4">
                <button
                v-if="accordionItems.length > maxItems"
                class="text-primary d-flex align-items-center gap-2"
                @click="toggleViewAll"
                >
                    <i :class="['text-lg', isViewAll ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line']"></i>
                    {{ isViewAll ? 'Lihat Sedikit Modul' : 'Lihat Semua Modul' }}
                </button>
            </div>
        </div>
        <div class="mt-5">
            <div class="d-flex align-items-center justify-content-between">
                <h4>Materi Lainnya</h4>
                <NuxtLink to="/dashboard/courses/bundle" class="fw-medium text-lg">Lihat Semua</NuxtLink>
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
            <!-- <div class="border rounded mt-3">
                <div class="d-flex flex-column align-items-center justify-content-center p-4">
                    <i class="ri-book-3-fill text-5xl text-grey2"></i>
                    <h5 class="fw-medium text-grey2">Materi Belum Tersedia</h5>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup>

const accordionItems = ref([
  {
    title: 'BAB 1 - Yuk Kenalan dengan Algoritma!',
    module: 'Modul 1',
    content: `Pernahkah kamu melakukan sesuatu dengan mengikuti langkah-langkah tertentu?

Misalnya: menyikat gigi, membuat susu, atau memasak mie instan.
Untuk bisa berhasil, kamu harus melakukannya dalam urutan yang benar, bukan?`,
  },
  {
    title: 'BAB 2 - Yuk Kenalan dengan Algoritma!',
    module: 'Modul 2',
    content: 'Konten dari BAB 2. Penjelasan lebih detail tentang algoritma.',
  },
  {
    title: 'BAB 3 - Yuk Kenalan dengan Algoritma!',
    module: 'Modul 3',
    content: 'Konten dari BAB 3. Studi kasus algoritma pada dunia nyata.',
  },
])

const activeAccordion = ref(null);
const isViewAll = ref(false) 
const maxItems = 2 

const toggleAccordion = (index) => {
    activeAccordion.value = activeAccordion.value === index ? null : index;
}

const toggleViewAll = () => {
  isViewAll.value = !isViewAll.value
}

const displayedItems = computed(() =>
  isViewAll.value ? accordionItems.value : accordionItems.value.slice(0, maxItems)
)

</script>

<style lang="scss" scoped>

</style>