<template>
    <div class="container-fluid">
        <div>
            <div class="d-flex align-items-center justify-content-between">
                <h2>Paket</h2>
                <NuxtLink to="/dashboard/courses/bundle" class="fw-medium text-lg">Lihat Semua</NuxtLink>
            </div>
            <div class="mt-3">
                <div class="d-flex align-items-center justify-content-end justify-content-sm-between flex-wrap gap-2">
                    <FilterSearchAndSort />
                    <NuxtLink to="/dashboard/courses/bundle/create" class="btn btn-primary d-flex align-items-center gap-2">
                        <i class="ri-add-line text-md"></i>
                        <span>Paket</span>
                    </NuxtLink>
                </div>
                <div class="mt-4">
                    <div class="position-relative">
                        <div class="embla max-w-base xs:max-w-2xl md:max-w-max" ref="emblaRef">
                            <div class="embla__container">
                                <div 
                                    v-for="(item, idx) in limitedBundles"
                                    :key="idx"
                                    class="embla__slide"
                                >
                                    <template v-if="isTheLastSlide(idx) && limitedBundles?.length > 1">
                                        <button type="button" @click="router.push('/dashboard/courses/bundle')" class="card d-flex align-items-center justify-content-center h-100 w-100">
                                            <div class="text-black text-2xl text-decoration-underline d-flex align-items-center justify-content-end gap-2">
                                                <span>Lihat Semua</span>
                                                <i class="ri-arrow-right-line"></i>
                                            </div>
                                        </button>
                                    </template>
                                    <template v-else>
                                        <CardBundle />
                                    </template>
                                </div>
                            </div>

                            <div class="embla__controls">
                                <div class="embla__buttons" v-if="totalSlides > 1">
                                    <button :disabled="!canScrollPrev" class="embla__button embla__button--prev" @click="scrollPrev"><i class="ri-arrow-left-s-line text-lg"></i></button>
                                    <button :disabled="!canScrollNext" class="embla__button embla__button--next" @click="scrollNext"><i class="ri-arrow-right-s-line text-lg"></i></button>
                                </div>
                                <div class="embla__dots">
                                    <button 
                                        v-for="idx in totalSlides"
                                        :key="idx"
                                        type="button" 
                                        class="embla__dot"
                                        :class="{ 'embla__dot-selected': idx - 1 === Math.floor(selectedIndex / itemsPerSlide) }"
                                        @click="scrollTo((idx - 1) * itemsPerSlide)"
                                        aria-label="Go to slide"
                                    >
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <p class="text-xl text-center my-10">Bundle Belum Tersedia</p> -->
                </div>
            </div>
        </div>
        <div class="mt-12">
            <div class="d-flex align-items-center justify-content-between">
                <h2>Materi</h2>
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
                        <NuxtLink to="/dashboard/courses/materi" class="btn btn-outline-primary px-8 py-2 rounded text-md">Lihat Semua</NuxtLink>
                    </div>
                    <!-- <p class="text-xl text-center my-10">Materi Belum Tersedia</p> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CardCourse from "@/components/cards/CardCourse.vue";
import CardBundle from "@/components/cards/CardBundle.vue";
import FilterSearchAndSort from "@/components/partials/FilterSearchAndSort";
import emblaCarouselVue from 'embla-carousel-vue';
import { ref, computed, onMounted } from "vue";

const isDesktop = ref(false);
// Contoh data bundle
const bundles = ref([
  // ...data bundle asli (bisa lebih dari 10)
  { title: "Bundle 1", },
  { title: "Bundle 2", },
  // dst
]);
const router = useRouter();

// Batas maksimal: 10 slide, 9 data + 1 "lihat semua"
const maxDisplay = 10;
const limitedBundles = computed(() => {
  const arr = bundles.value.slice(0, maxDisplay - 1);
  arr.push({ isSeeAll: true });
  return arr;
});

// Fungsi deteksi slide terakhir
function isTheLastSlide(idx) {
  return idx === limitedBundles.value.length - 1;
}

// Embla
const [emblaRef, emblaApi] = emblaCarouselVue({ loop: false });
const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

// Responsive items per slide
const itemsPerSlide = computed(() => (isDesktop.value ? 2 : 1));
const totalSlides = computed(() => Math.ceil(limitedBundles.value.length / itemsPerSlide.value));

onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 992px)')
  isDesktop.value = mediaQuery.matches
  mediaQuery.addEventListener('change', e => {
    isDesktop.value = e.matches
  })
  updateStates()
  emblaApi.value.on('select', updateStates)
  emblaApi.value.on('init', updateStates)
})

function updateStates() {
  if (!emblaApi.value) return
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
  canScrollPrev.value = emblaApi.value.canScrollPrev()
  canScrollNext.value = emblaApi.value.canScrollNext()
}
function scrollPrev() {
  const prevIndex = selectedIndex.value - itemsPerSlide.value;
  emblaApi.value?.scrollTo(prevIndex);
}
function scrollNext() {
  const nextIndex = selectedIndex.value + itemsPerSlide.value;
  emblaApi.value?.scrollTo(nextIndex);
}
function scrollTo(idx) {
  emblaApi.value?.scrollTo(idx);
}
</script>

<style lang="scss" scoped>
.embla {
    overflow: hidden;
    
    .embla__container {
        display: flex;
        gap: 6px;
        justify-content: space-between;
        
        .embla__slide {
            flex: 0 0 100%;
            min-width: 100%;
            padding-right: 0.5rem;

            @media (min-width: 768px) {
                flex: 0 0 50%;
                min-width: 50%;
            }
            @media (max-width: 576px) {
                padding-right: 0;
            }
        }
    }

    .embla__button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--white);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

        &.embla__button--prev {
            left: 3px;
        }

        &.embla__button--next {
            right: 3px;
        }

        &.embla__button:disabled {
            background-color: var(--grey);
        }
    }

    .embla__dots {
        position: absolute;
        bottom: -50px;
        left: 50%;
        transform: translate(-50%);
        display: flex;
        align-items: center;
        gap: 10px;

        .embla__dot {
            display: block;
            width: 10px;
            height: 10px;
            background-color: var(--white);
            color: var(--white);
            border-radius: 50px;
            box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
            transform: scale(1);
            transition: transform 0.2s ease-in-out;

            &.embla__dot-selected {
                background-color: var(--primary);
                transform: scale(1.3);
            }
        }
    }
}
</style>