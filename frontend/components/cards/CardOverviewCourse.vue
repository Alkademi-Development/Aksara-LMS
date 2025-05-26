<template>
    <section>
        <div class="px-5 py-4 bg-white border rounded">
            <img src="https://drive.alkademi.id/v1/upload/announcement/1745362066930.png" alt="Thumbnail" class="w-100 img-fluid rounded border">
            <div class="mt-4">
                <h1 class="text-primary">Alkademi for Kidz - Dasar Algoritma dengan Minecraft</h1>
                <p class="mt-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab porro alias possimus ducimus explicabo at beatae rem veritatis praesentium iure laudantium dolorem, dignissimos dolorum minima magni, obcaecati esse animi quam impedit, omnis ullam? Reprehenderit sit neque excepturi aspernatur. Itaque laboriosam possimus tenetur ex quas voluptatem, dolorem et eius illo velit!</p>
            </div>
            <div class="mt-5">
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
                <p class="my-3">Ingin mendapatkan materi ini?</p>
                <button type="button" class="px-5 py-2 btn btn-primary">
                    Hubungi Kami
                </button>
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
    </section>
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

.accordion-enter-active,
.accordion-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
}
.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
    opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
    max-height: 100px;
    opacity: 1;
}

.accordion {

    .accordion-toggle {
        cursor: pointer;
    }

    .accordion-content {
        overflow: hidden;
    }
}

</style>