<template>
    <div class="container-fluid">
        <div>
            <div class="d-flex align-items-center justify-content-between">
                <h3>Paket</h3>
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
                                <div class="embla__slide"><CardBundle /></div>
                                <div class="embla__slide"><CardBundle /></div>
                                <div class="embla__slide"><CardBundle /></div>
                            </div>

                            <div class="embla__controls">
                                <div class="embla__buttons">
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
                    <div class="d-flex align-items-center justify-content-center mt-7">
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
import { BProgress, BCarousel, BCarouselSlide } from "bootstrap-vue-next";
import emblaCarouselVue from 'embla-carousel-vue';

const isDesktop = ref(false)
const bundles = ref([{}, {}, {}])
const [emblaRef, emblaApi] = emblaCarouselVue({ loop: false });
const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const itemsPerSlide = computed(() => (isDesktop.value ? 2 : 1));
const totalSlides = computed(() => Math.ceil(bundles.value.length / itemsPerSlide.value));

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

    .embla__buttons {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        top: 50%;
        width: 100%;

        .embla__button {
            background-color: var(--white);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

            &.embla__button:disabled {
                background-color: var(--grey);
            }
        }
    }

    .embla__dots {
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
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

            &.embla__dot-selected {
                background-color: var(--primary);
            }
        }
    }
}
</style>