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
                    <NuxtLink to="/dashboard/courses/bundle" class="btn btn-primary d-flex align-items-center gap-2">
                        <i class="ri-add-line text-md"></i>
                        <span>Paket</span>
                    </NuxtLink>
                </div>
                <div class="mt-4">
                    <div class="position-relative">
                        <div class="custom-swiper-navigation position-absolute z-3 d-flex align-items-center justify-content-between px-1 w-100">
                            <button ref="prevEl" class="swiper-previous d-flex align-items-center justify-content-center bg-white text-primary rounded-pill shadow">
                                <i class="ri-arrow-left-s-line"></i>
                            </button>
                            <button ref="nextEl" class="swiper-next d-flex align-items-center justify-content-center bg-white text-primary rounded-pill shadow">
                                <i class="ri-arrow-right-s-line"></i>
                            </button>
                        </div>
                        <Swiper
                            :space-between="20"
                            :pagination="{ el: '.custom-swiper-pagination', clickable: true }"
                            :navigation="{ prevEl: prevEl, nextEl: nextEl }"
                            :breakpoints="{
                                0: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                                992: {
                                    slidesPerView: 2,
                                },
                                1200: {
                                    slidesPerView: 2,
                                }
                            }"
                            @swiper="onSwiper"
                            class="pb-1"
                        >
                            <SwiperSlide :key="index" v-for="(item, index) in bundles">
                                <CardBundle />
                            </SwiperSlide>
                        </Swiper>
                        <div class="custom-swiper-pagination d-flex align-items-center justify-content-center gap-2 mt-3"></div>
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
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination } from 'swiper'

SwiperCore.use([Navigation, Pagination])

const prevEl = ref(null)
const nextEl = ref(null)

const bundles = ref([{}, {}, {}])

function onSwiper(swiper) {
  swiper.params.navigation.prevEl = prevEl.value
  swiper.params.navigation.nextEl = nextEl.value
  swiper.navigation.init()
  swiper.navigation.update()
}

const isDesktop = ref(false)

onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 992px)')
  isDesktop.value = mediaQuery.matches
  mediaQuery.addEventListener('change', e => {
      isDesktop.value = e.matches
    })
})


</script>

<style lang="scss" scoped>
.custom-swiper-navigation {
    top: 40%;

    button:disabled {
        background-color: var(--grey) !important;
        color: var(--grey2) !important;
    }

    .swiper-previous,
    .swiper-next {
        width: 40px;
        height: 40px;
    }
}
</style>