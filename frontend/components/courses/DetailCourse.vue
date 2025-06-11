<template>
    <div id="detail-course">
        <b-row>
            <b-col cols="12">
                <b-card v-if="isLoaded" class="border">
                    <template v-if="moduleDetail">
                        <b-row v-if="moduleDetail?.isImage" :class="`${isFromBundle ? 'd-lg-none' : ''} mb-3 wrapper-cover`">
                            <b-col cols lg="12">
                                <div class="overflow-hidden w-100 rounded border cover-course">
                                    <img :src="moduleDetail?.cover" class="w-100 h-100" style="object-fit: cover"/>
                                </div>
                                <!-- <div class="w-100 rounded" :style="{'background-color': moduleDetail?.isImage ? moduleDetail?.cover : '#EFECF4', 'height': '250px'}"></div> -->
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" :lg="moduleDetail?.isImage && isFromBundle ? 8 : 12" class="wrapper-content">
                                <div class="w-100">
                                    <h1 class="mb-4 text-primary">{{ moduleDetail?.title }}</h1>
                                    <div class="mb-4 description-course" style="font-size: 16px" v-html="moduleDetail?.description"></div>
                                </div>
                                <div class="w-100">
                                    <!-- <p class="d-flex gap-3">
                                        <span class="d-flex align-items-center gap-2" style="font-weight: 700">
                                            <span class="text-yellow">4.8</span>
                                            <span class="text-yellow d-flex align-items-center">
                                                <i class="ri-star-fill"></i>
                                                <i class="ri-star-fill"></i>
                                                <i class="ri-star-fill"></i>
                                                <i class="ri-star-fill"></i>
                                                <i class="ri-star-half-fill"></i>
                                            </span>
                                        </span>
                                        <span> (90,300 ratings)</span>
                                    </p> -->
                                    <p class="d-flex align-items-center gap-2">
                                        <i class="ri-account-circle-line text-primary"></i> Dibuat oleh <span class="text-primary">{{ (moduleDetail?.author?.name || moduleDetail?.Author?.name) || '-' }}</span>
                                    </p>
                                    <p class="d-flex align-items-center gap-2 mb-3">
                                        <i class="ri-history-fill text-primary"></i> Terakhir diupdate {{ setUpdatedDate(moduleDetail?.updated_at) }}
                                    </p>
                                    <p v-if="!isFromClass && !moduleDetail?.owned && !isFromBundle" class="mb-0">Ingin mendapatkan materi ini?</p>
                                    <div class="mt-3">
                                        <b-button
                                            v-if="!isFromClass && !moduleDetail?.owned && !isFromBundle"
                                            variant="primary"
                                            id="start-study"
                                            @click="handleContactUs()"
                                        >
                                            Hubungi Kami
                                        </b-button>
                                        <!-- <b-button
                                            v-if="!isFromClass && !moduleDetail?.owned && !isFromBundle"
                                            variant="primary"
                                            id="start-study"
                                            @click="moduleDetail?.price > 0 ? handleContactUs() : handlerActionCourse()"
                                        >
                                            {{ moduleDetail?.price > 0 ? 'Hubungi Kami' : 'Tambahkan' }}
                                        </b-button> -->
                                        <b-button
                                            v-if="isFromClass && role === 'student' && !isFromBundle && listTopicsState?.length > 0"
                                            variant="primary"
                                            id="start-study"
                                            @click="handlerActionCourse"
                                        >
                                            Mulai Belajar
                                        </b-button>
                                        <!-- <b-button
                                            variant="outline-primary"
                                            @click="goToSection('aboutCourse')"
                                        >
                                            Tentang Materi
                                        </b-button> -->
                                    </div>
                                </div>
                            </b-col>
                            <b-col v-if="moduleDetail?.isImage && isFromBundle" class="d-none d-lg-flex wrapper-cover" lg="4">
                                <div class="overflow-hidden w-100 rounded border" style="max-height: 350px; aspect-ratio: 1 / 1">
                                    <img :src="moduleDetail?.cover" class="w-100 h-100" style="object-fit: cover"/>
                                </div>
                            </b-col>
                        </b-row>
                    </template>
                    <template v-else>
                        <div class="d-flex flex-column gap-3 justify-content-center align-items-center">
                            <i class="ri-book-3-fill text-gray" style="font-size: 42px;"></i>
                            <p class="mb-0 text-gray" style="font-size: 18px">Tidak terdapat materi</p>
                        </div>
                    </template>
                </b-card>

                <b-card v-else class="border">
                    <div class="d-flex flex-column gap-2">
                        <b-skeleton width="60%" height="50px"></b-skeleton>
                        <b-skeleton width="90%"></b-skeleton>
                        <b-skeleton width="80%"></b-skeleton>
                        <b-skeleton width="50%"></b-skeleton>
                        <b-skeleton width="30%"></b-skeleton>
                    </div>
                </b-card>
            </b-col>

            <b-col cols="12" :lg="12">

                <!-- Card Materi ini Berisi -->
                <!-- <b-card class="border">
                    <h3 class="mb-3">Materi ini berisi</h3>
                    <p class="d-flex align-items-center gap-2">
                        <i class="ri-video-line text-primary"></i> 22 jam video pembelajaran
                    </p>
                    <p class="d-flex align-items-center gap-2">
                        <i class="ri-code-fill text-primary"></i> 19 latihan coding
                    </p>
                    <p class="d-flex align-items-center gap-2">
                        <i class="ri-file-list-line text-primary"></i> {{ totalTopics }} modul pembelajaran
                    </p>
                </b-card> -->

                <!-- Card Tentang Materi -->
                <!-- <b-card ref="aboutCourse" class="about-course border">
                    <template v-if="isLoaded">
                        <template v-if="moduleDetail?.description">
                            <h3 class="mb-4">Tentang materi</h3>
                            <p class="description mb-0" v-html="moduleDetail?.description" />
                        </template>
                        <div v-else class="d-flex flex-column gap-3 justify-content-center align-items-center">
                            <i class="ri-file-paper-2-fill text-gray" style="font-size: 42px;"></i>
                            <p class="mb-0 text-gray" style="font-size: 18px">Deskripsi Materi belum ada</p>
                        </div>
                    </template>
                    <b-skeleton v-else animation="wave" width="100%" class="mb-0"></b-skeleton>
                </b-card> -->

                <b-card class="border list-modules" role="tablist">
                    <template v-if="isLoaded">
                        <template v-if="listTopics?.length > 0">
                            <template v-for="(topic, idx) of listTopics">
                                <template v-if="idx < 5">
                                    <div :key="idx">
                                        <div 
                                            class="cursor-pointer d-flex justify-content-between align-items-center gap-6"
                                            role="tab"
                                            v-b-toggle="`accordion-${topic?.slug + idx}`"
                                        >
                                            <div>
                                                <h5 class="title font-medium text-limit limit-1">{{ topic?.title }}</h5>
                                                <p class="mb-0 description">Modul {{ idx + 1 }}</p>
                                                <!-- <p>Modul {{ idx + 1 }} • 19 menit</p> -->
                                            </div>
                                            <i class="ri-arrow-down-s-line text-primary" style="font-size: 20px"></i>
                                        </div>
                                        <b-collapse :id="`accordion-${topic?.slug + idx}`" accordion="my-accordion" role="tabpanel" class="mt-2">
                                            <p v-if="topic?.description" class="description" v-html="topic?.description"></p>
                                            <div v-else>-</div>
                                            <!-- <div v-if="topic?.description" v-html="topic?.description" />
                                            <p v-else>Lorem ipsum dolor sit amet consectetur adipisicing elit. A dolorum nulla deserunt neque deleniti nemo facere. Eaque, officia! Nostrum, dolor?</p> -->
                                        </b-collapse>
                                    </div>
                                    <hr v-if="(!showAllTopics && idx != 4 && idx !== listTopics?.length - 1) || (showAllTopics && idx !== listTopics?.length - 1)" :key="idx + 'hr'" class="divider-menu my-3">
                                </template>
                            </template>
        
                            <b-collapse id="show-all-topics" accordion="topic-accordion" role="tabpanel">
                                <template v-for="(topic, idx) of listTopics">
                                    <template v-if="idx >= 5">
                                        <div :key="idx">
                                            <div 
                                                class="cursor-pointer d-flex justify-content-between align-items-center gap-6"
                                                role="tab"
                                                v-b-toggle="`accordion-${topic?.slug + idx}`"
                                            >
                                                <div>
                                                    <h5 class="font-medium title text-limit limit-1">{{ topic?.title }}</h5>
                                                    <p class="mb-0 description">Modul {{ idx + 1 }}</p>
                                                    <!-- <p>Modul {{ idx + 1 }} • 19 menit</p> -->
                                                </div>
                                                <i class="ri-arrow-down-s-line text-primary" style="font-size: 20px"></i>
                                            </div>
                                            <b-collapse :id="`accordion-${topic?.slug + idx}`" accordion="my-accordion" role="tabpanel" class="mt-2">
                                                <p v-if="topic?.description" class="description" v-html="topic?.description"></p>
                                                <div v-else>-</div>
                                                <!-- <div v-if="topic?.description" v-html="topic?.description" />
                                                <p v-else>Lorem ipsum dolor sit amet consectetur adipisicing elit. A dolorum nulla deserunt neque deleniti nemo facere. Eaque, officia! Nostrum, dolor?</p> -->
                                            </b-collapse>
                                        </div>
                                        <hr v-if="idx !== listTopics?.length - 1" :key="idx + 'hr'" class="divider-menu my-3">
                                    </template>
                                </template>
                            </b-collapse>
        
                            <p
                                v-if="listTopics?.length > 5"
                                class="d-flex justify-content-center align-items-center mb-0 gap-2 text-primary font-medium cursor-pointer user-select-none"
                                role="tab"
                                v-b-toggle="`show-all-topics`"
                                @click="showAllTopics = !showAllTopics"
                            >
                                <template v-if="!showAllTopics">
                                    <i class="ri-arrow-down-s-line" style="font-size: 20px"></i>
                                    Lihat Semua Modul
                                </template>
                                <template v-else>
                                    <i class="ri-arrow-up-s-line" style="font-size: 20px"></i>
                                    Lihat Lebih Sedikit
                                </template>
                            </p>
                        </template>
                        <div v-else class="d-flex flex-column gap-3 justify-content-center align-items-center py-3">
                            <i class="ri-file-list-2-fill text-gray" style="font-size: 42px;"></i>
                            <p class="mb-0 text-gray" style="font-size: 18px">Module belum tersedia</p>
                        </div>
                    </template>
                    <template v-else>
                        <template v-for="index in 3">
                            <b-row :key="index" class="">
                                <b-col cols md="10" lg="11" class="d-flex align-items-start flex-column justify-content-center gap-2">
                                    <b-skeleton animation="wave" width="85%"></b-skeleton>
                                    <b-skeleton animation="wave" width="70%"></b-skeleton>
                                </b-col>
                            </b-row>
                            <hr v-if="index !== 3" :key="index + 'hr'" class="divider-menu my-3">
                        </template>
                    </template>
                </b-card>

                <!-- <b-card v-if="isFromBundle" class="border">
                    <h3 class="mb-3">Deskripsi</h3>
                    <div v-html="moduleDetail?.description" />
                </b-card> -->

                <!-- <div>
                    <div class="mb-4 mt-5 d-flex justify-content-between align-items-center">
                        <h3>Materi Lainnya</h3>
                        <nuxt-link to="#" class="mb-0 text-primary">Lihat Semua</nuxt-link>
                    </div>
                    <b-card class="border">
                        <template v-for="(item, idx) of topics">
                            <template v-if="idx < 3">
                                <b-row :key="idx" class="cursor-pointer" @click="onClickDetail(item?.slug)">
                                    <b-col cols md="2" lg="1">
                                        <b-skeleton-img aspect height="100%" class="rounded"></b-skeleton-img>
                                    </b-col>
                                    <b-col cols md="10" lg="11" class="d-flex align-items-start flex-column justify-content-center">
                                        <h4 class="mb-1 font-semibold">{{ item?.title }}</h4>
                                        <p class="d-flex align-items-center gap-1 mb-2">
                                            15 Modul • 19 menit • 
                                            <span class="d-flex align-items-center gap-1 font-bold">4.8 <i class="ri-star-fill text-yellow"></i></span>
                                            (90,300 ratings)
                                        </p>
                                    </b-col>
                                </b-row>
                                <hr v-if="idx !== 2 && idx !== topics.length - 1" :key="idx + 'hr'" class="divider-menu my-3">
                            </template>
                        </template>
                    </b-card>
                </div> -->

                <!-- <b-card v-if="!isFromBundle" class="border">
                    <h3 class="mb-3">Reviews</h3>

                    <template v-for="(item, idx) of moduleDetail?.modules">
                        <b-row :key="idx" class="mb-4">
                            <b-col cols="2">
                                <b-skeleton-img aspect height="100%" class="rounded"></b-skeleton-img>
                            </b-col>
                            <b-col cols="10">
                                <h5>{{ item?.title }}</h5>
                                <p class="d-flex align-items-center gap-1">
                                    15 Modul • 19 menit • 
                                    <span class="d-flex align-items-center gap-1 font-bold">4.8 <i class="ri-star-fill text-primary"></i></span>
                                    (90,300 ratings)
                                </p>

                                <p v-if="!!moduleDetail?.price" class="font-bold">{{ toIDR(moduleDetail?.price) }}</p>
                                <p v-else>Free</p>
                            </b-col>
                        </b-row>
                    </template>
                </b-card> -->
            </b-col>

            <b-col v-if="isFromBundle" cols="12">
                <div>
                    <div class="mb-4 mt-4 d-flex justify-content-between align-items-center" style="padding: 0px 12px;">
                        <h4>Materi Lainnya</h4>
                        <nuxt-link :to="navigationCourseSeeMore" class="mb-0 text-primary font-medium" style="font-size: 14px;">Lihat Semua</nuxt-link>
                    </div>
                    <b-card class="border list-other-course">
                        <template v-if="isLoaded">
                            <template v-if="listOtherCourse && listOtherCourse?.length > 0">
                                <template v-for="(item, idx) of listOtherCourse">
                                    <template v-if="idx < 3">
                                        <div :key="idx" class="p-4 d-flex align-items-center gap-6 cursor-pointer" @click="onClickOtherCourse(item?.slug)">
                                            <div class="rounded overflow-hidden" :style="{'background-color': !item?.isImage ? item?.cover || '#EFECF4' : '', 'aspect-ratio': '1 / 1', 'height': '64px'}">
                                                <img v-if="item?.isImage" :src="item?.cover" class="w-100 h-100" style="object-fit: cover;" />
                                            </div>
                                            <div class="d-flex align-items-start flex-column justify-content-center">
                                                <h5 class="font-semibold">{{ item?.title }}</h5>
                                                <!-- <div class="d-flex align-items-center gap-2">
                                                    <p class="mb-0">{{ item?.modules ? item?.modules?.length : '0' }} Materi</p>
                                                    <span>•</span>
                                                    <p class="mb-0">19 menit</p>
                                                    <span>•</span>
                                                    <span class="d-flex align-items-center gap-1 font-bold">4.8 <i class="ri-star-fill text-yellow"></i></span>
                                                    <p class="mb-0">(90,300 ratings)</p>
                                                </div> -->
                                            </div>
                                        </div>
                                        <hr v-if="idx < (listOtherCourse?.length > 3 ? 2 : listOtherCourse?.length - 1)" :key="idx + 'hr'" class="divider-menu my-0">
                                    </template>
                                </template>
                            </template>
                            <template v-else>
                                <div class="d-flex flex-column gap-3 justify-content-center align-items-center py-4">
                                    <i class="ri-book-3-fill text-gray" style="font-size: 42px;"></i>
                                    <p class="mb-0 text-gray" style="font-size: 18px">Tidak ada materi lain pada bundle ini</p>
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <template v-for="index in 3">
                                <div :key="index" class="p-4 d-flex align-items-center gap-6 cursor-pointer w-100">
                                    <div style="height: 64px; aspect-ratio: 1 / 1">
                                        <b-skeleton-img aspect height="100%" class="rounded"></b-skeleton-img>
                                    </div>
                                    <div class="d-flex align-items-start flex-column justify-content-center w-100">
                                        <b-skeleton animation="wave" width="85%"></b-skeleton>
                                        <b-skeleton animation="wave" width="70%"></b-skeleton>
                                    </div>
                                </div>
                                <hr v-if="index !== 3" :key="index + 'hr'" class="divider-menu my-0">
                            </template>
                        </template>
                    </b-card>
                </div>
            </b-col>

            <!-- <b-col cols="12">
                <b-row>
                    <b-col cols="12" lg="4" class="pr-4">
                        <div  class="position-sticky" style="top: 8rem">
                            <div class="d-flex align-items-center gap-2">
                                <h3 class="mb-0 font-weight-bold text-yellow" style="font-size: 36px;">4.8</h3>
                                <i class="ri-star-fill text-yellow" style="font-size: 36px;"></i>
                            </div>
                            <div class="d-flex align-items-center gap-3 mb-2">
                                <p class="mb-0">247 ratings</p>
                                <p class="mb-0" style="font-size: 28px;">•</p>
                                <p class="mb-0">65 ulasan</p>
                            </div>
                            <div class="d-flex flex-column gap-2">
                                <div v-for="(item, idx) in reviews" :key="idx" class="">
                                    <div class="d-flex align-items-center gap-1" style="flex-shrink: 0">
                                        <i class="ri-star-fill text-yellow"></i>
                                        <p class="mb-0">{{ item.star }}</p>
                                    </div>
                                    <b-progress :value="item.percentage" :max="100" class="mb-0" variant="primary"></b-progress>
                                    <p class="mb-0" style="flex-shrink: 0;">{{ item.review }}</p>
                                </div>
                                <b-row v-for="(item, idx) in reviews" :key="idx" class="align-items-center">
                                    <b-col cols="2" class="d-flex align-items-center gap-1">
                                        <i class="ri-star-fill text-yellow"></i>
                                        <p class="mb-0">{{ item.star }}</p>
                                    </b-col>
                                    <b-col cols="8">
                                        <b-progress :value="item.percentage" :max="100" class="mb-0" variant="primary"></b-progress>
                                    </b-col>
                                    <b-col cols="2">
                                        <p class="mb-0">{{ item.review }}</p>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </b-col>
    
                    <b-col cols="12" lg="8">
                        <b-card v-for="(item, idx) of topics" :key="idx" class="border">
                            <b-col cols="12" class="px-0 d-flex align-items-center mb-3">
                                <b-col cols="1" class="pl-0">
                                    <b-skeleton-img aspect height="100%" class="rounded"></b-skeleton-img>
                                </b-col>
                                <b-col cols="11" class="pr-0 d-flex align-items-start flex-column justify-content-center">
                                    <h4 class="mb-1 font-semibold">{{ item?.title }}</h4>
                                    <div class="d-flex align-items-center gap-4">
                                        <div class="d-flex align-items-center gap-1">
                                            <i v-for="index in 5" :key="`idx-${index}`" class="ri-star-fill text-yellow"></i>
                                        </div>
                                        <p class="mb-0" style="color: rgb(121, 121, 121);">2 minggu lalu</p>
                                    </div>
                                </b-col>
                            </b-col>
                            <b-col cols="12" class="px-0">
                                <p class="mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus ratione esse soluta quo voluptatum commodi perferendis consequuntur delectus reprehenderit quos rerum illo assumenda quasi quidem, quae maxime non ut repellat quod hic ducimus, velit temporibus? Est deleniti consectetur architecto tempora.</p>
                            </b-col>
                        </b-card>

                        <b-pagination
                            v-model="pagination.page"
                            :total-rows="pagination?.totalPages"
                            :per-page="pagination?.perPage"
                        ></b-pagination>
                    </b-col>
                </b-row>
            </b-col> -->

            <!-- <b-col v-if="isFromBundle" cols="12" lg="4">
                <b-button
                    variant="outline-primary"
                    class="btn-action-add mb-4"
                    block
                >
                    Edit Materi
                </b-button>

                <b-card class="border position-sticky" style="top: 8rem">
                    <div class="mb-3">
                        <b-skeleton-img aspect height="100%" class="rounded"></b-skeleton-img>
                    </div>
                    <h3 v-if="!!moduleDetail?.price" class="font-bold">{{ toIDR(moduleDetail?.price ?? 0) }}</h3>
                    <h3 v-else class="font-bold">Free</h3>
                    <p class="font-semibold">
                        <span class="text-through">Rp 549.000</span>
                        <span class="text-danger"> Diskon 76%</span>
                    </p>
                    <b-button
                        v-if="!isFromBundle"
                        variant="primary"
                        class="btn-action-add mt-4"
                        block
                    >
                        Beli Materi Ini
                    </b-button>
                </b-card>
            </b-col> -->
        </b-row>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { toEncrypt, toDecrypt } from '~/commons/utils';
import { toDateShort } from '~/commons/utils';

export default {
    props: {
        slug: {
            type: String,
            default: '',
        },
        isFromBundle: {
            type: Boolean,
            default: false,
        },
        isFromClass: {
            type: Boolean,
            default: false,
        },
        totalTopics: {
            type: Number,
            default: 0,
        }
    },
    created() {
        if(this.isFromClass) this.fetchClassroomDetailModule();
        else this.fetchDetailModule();
    },
    data() {
        return {
            moduleDetail: null,
            isLoaded: false,
            topics: [],
            showAllTopics: false,
            reviews: [
                { star: 5, percentage: 60, review: 231 },
                { star: 4, percentage: 40, review: 13 },
                { star: 3, percentage: 10, review: 1 },
                { star: 2, percentage: 20, review: 2 },
                { star: 1, percentage: 0, review: 0 },
            ],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 5,
            },
            role: localStorage.getItem("user_kind"),
            isLoadingOthersCourse: false,
            listOtherCourse: null,
            bundleDetail: null,
        }
    },
    computed: {
        ...mapState({
            coursesState: state => state.Courses,
            servicesState: state => state.Services,
            classroomsState: (state) => state.Classrooms,
            listModulesState: (state) => state.Classrooms?.listModules,
            listTopicsState: (state) => state?.Classrooms?.listTopics,
            getActiveTab: (state) => state?.Layouts?.activeTab
        }),
        navigationCourseSeeMore(){
            return this.getActiveTab === 'library' ? "/dashboard/courses/materi" : "/dashboard/courses/my-courses/materi";
        },
        listTopics(){
            return this.isFromClass ? this.classroomsState?.listTopics : this.servicesState?.topics;
        }
    },
    methods: {
        ...mapActions({
            getDetailModule: 'Classrooms/getDetailModule',
        }),
        async fetchModules(page = 1) {
            this.isLoaded = false

            await this.$store.dispatch('Services/topics', { moduleSlug: this.slug, page: page })
            if(!this.servicesState.status) {
                console.error('Failed get topics by module', this.servicesState.message)
                this.isLoaded = true
            } else {
                this.topics = this.servicesState.topics ?? [];
                this.moduleDetail = this.servicesState.moduleDetail;
                this.pagination = this.servicesState.pagination
                this.moduleDetail.isImage = this.isCoverImage(this.moduleDetail?.cover);
                if(this.isFromBundle) this.fetchBundleDetail();
                this.isLoaded = true
            }
        },
        async fetchDetailModule(){
            this.isLoaded = false;

            await this.$store?.dispatch("Services/detailModuleV2", { slug: this.slug });

            if(!this.servicesState.status) {
                console.error('Failed get module', this.servicesState.message)
                const message = "Materi tidak ditemukan";
                if(message.toLowerCase() == this.servicesState?.message.toLowerCase()){
                    const itemAlert = {
                        isShow: true,
                        textAlert: this.servicesState?.message,
                        iconAlert: "ri-question-line",
                        isShowAction: false,
                        variant: "warning",
                        textAction: "",
                    }

                    this.$emit("courseNotFound", itemAlert);
                }
                this.isLoaded = true;
                this.$nextTick(() => {
                    this.$emit("callbackLoaded");
                })
            } else {
                this.moduleDetail = this.servicesState.moduleDetail;
                this.moduleDetail.isImage = this.isCoverImage(this.moduleDetail?.cover);
                this.topics = this.servicesState?.topics;
                if(this.isFromBundle){
                    await this.fetchListTopics();
                    await this.fetchBundleDetail();
                }
                this.isLoaded = true
                this.$emit("callbackLoaded");
            }
        },
        async fetchClassroomDetailModule(){
            this.isLoaded = false

            const detailModule = this.listModulesState?.find(course => course?.slug === this.slug);

            const classroomSlug = this.$route?.params?.classroom;
            const moduleUUID = detailModule?.uuid;
            // const moduleUUID = toDecrypt(localStorage.getItem("courseUUID"));

            await this.getDetailModule({ moduleUUID, classroomSlug });

            if(!this.classroomsState.status) {
                console.error('Failed get topics by module', this.classroomsState.message)
                this.isLoaded = true;
                this.$nextTick(() => {
                    this.$emit("callbackLoaded");
                })
            } else {
                this.moduleDetail = this.classroomsState.detailModule;
                this.moduleDetail.isImage = this.isCoverImage(this.moduleDetail?.cover);
                this.topics = this.classroomsState?.listTopics;
                this.isLoaded = true;
                this.$nextTick(() => {
                    this.$emit("callbackLoaded");
                })
            }
        },
        async fetchBundleDetail() {
            this.isLoaded = false

            const bundleSlug = this.$route?.params?.slug;

            await this.$store.dispatch("Courses/getDetailBundle", bundleSlug)

            if (!this.coursesState.status) {
                console.error('Failed fetch bundle detail', this.coursesState.message)
                this.setEvent(this.coursesState.message, false)
                this.isLoaded = true
            } else {
                this.bundleDetail = this.coursesState?.bundle ?? null
                const listModules = this.bundleDetail?.modules;
                if(listModules && listModules?.length > 0){
                    const findIndexCourse = listModules?.findIndex((item) => item?.id === this.moduleDetail?.id);
                    if(findIndexCourse !== -1){
                        listModules.splice(findIndexCourse, 1);
                        this.listOtherCourse = listModules;
                    }
                }
                if(this.listOtherCourse?.length > 0){
                    this.listOtherCourse?.map((module, index) => {
                        module.isImage = this.isCoverImage(module?.cover);
                    })
                }

                this.isLoaded = true
            }
        },
        onClickOtherCourse(slug){
            const bundleSlug = this.$route?.params?.slug;
            this.$router.push(`/dashboard/courses/bundle/${bundleSlug}/modules/${slug}`)
        },
        toIDR(value) {
            const IDR = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            });

            return IDR.format(value).split(",")[0];
        },
        goToModule(item){
            if(!this.isFromBundle){
                const courseName = this.$route.params.courseId
                localStorage.setItem('topicId', toEncrypt(item?.id))
    
                this.$router.push({
                    path: `/dashboard/courses/modules/${courseName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/detail/${item.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`,
                })
            }
        },
        goToSection(section){
            const refElement = this.$refs[section];
            if (refElement) {
                const rect = refElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const offset = rect.top + scrollTop - (this.role == 'student' ? 165 : 135);
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        },
        isCoverImage(url) {
            if (url) {
                const imageExtensionRegex =
                /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
                const urlRegex = /^(http|https):\/\/[^ "]+$/;

                return imageExtensionRegex.test(url) || urlRegex.test(url);
            }
        },
        setUpdatedDate(date){
            if(date){
                const resultOfDate = toDateShort(date);
                const splitOfDate = resultOfDate.split("-");
                let modifiedDateArray = splitOfDate.map(item => item.startsWith('0') ? item.slice(1) : item);
                return modifiedDateArray.reverse().join("/")
            }
        },
        async fetchAssignModuleToLMS(){
            this.isLoaded = false;
            const moduleId = this.moduleDetail?.id;

            await this.$store?.dispatch("Courses/assignModuleToLMS", { moduleId });

            if(!this.coursesState?.status){
                console.error("Failed to Assign Module : " + this.coursesState?.message);
            }else{

                this.$emit("passModuleAdded");

                await this.getDetailModule();

                this.isLoaded = true;
            }
        },
        handlerActionCourse(){
            if(this.role === 'student'){
                this.$emit('startLearning')
            }else{
                this.fetchAssignModuleToLMS();
            }
        },
        handleContactUs(){
            const domain = window.location.hostname;
            const email = 'hello@alkademi.id';
            const subject = `Pemesanan Materi untuk LMS ${domain}`;
            const body = `Halo Alkademi,\n\nSaya tertarik dengan materi "${this.moduleDetail?.title}" untuk ditambahkan ke LMS ${domain}\n\nTerima kasih.`;
            const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailURL, "_blank");
        },
        async fetchListTopics(){
            const courseSlug = this.$route?.params?.courseSlug;

            const params = {
                moduleSlug: courseSlug,
            }

            await this.$store.dispatch('Services/topics', params)

            if(!this.servicesState.status){
                console.error('failed fetch all topics', this.servicesState.message);
                this.$store.dispatch("Services/setListTopics", null);
                this.topics = this.servicesState?.topics;
            } else{
                this.topics = this.servicesState?.topics ?? [];
            }
        },
    }
}
</script>

<style lang="scss">
@import "@/assets/scss/components/courses/description-overview-module.scss";
</style>

<style lang="scss" scoped>
#detail-course{

    .cover-course{
        // height: 250px;
        aspect-ratio: 16 / 9;

        @media(max-width: 768px){
            height: auto;
            width: 100%;
            aspect-ratio: 16 / 9;
        }
    }

    .wrapper-content{
        // display: flex;
        // flex-wrap: wrap;
        // align-content: space-between;

        h1{
            font-size: 36px;
        }
    }

    .list-other-course{
        .card-body{
            padding: 0px;
        }
    }

    .list-modules{
        .title{
            font-size: 20px;
        }
        .description{
            font-size: 14px;
        }
    }

    .btn-action-add {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;

        text-transform: capitalize;

        i {
            margin-left: 20px;
            font-size: 10px;
        }
    }
    p {
        font-family: var(--bs-font-paragraph);
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        // color: rgb(121, 121, 121);
        color: rgba(0, 0, 0);

        i {
            font-size: 18px;
        }
        span {
            i {
                font-size: inherit;
            }
        }
    }
    .font-medium {
        font-weight: 500;
    }
    .font-semibold {
        font-weight: 600;
    }
    .font-bold {
        font-weight: 700;
    }

    .b-pagination{
        margin: 1.5rem 0rem !important;
    }
}
</style>