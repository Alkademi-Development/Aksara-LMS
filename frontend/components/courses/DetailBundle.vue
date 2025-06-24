<template>
    <div id="detail-bundle">
        <b-row>
            <b-col cols="12">
                <b-card v-if="isLoaded" class="border p-4">
                  <template v-if="bundleDetail">
                    <div class="wrapper-card d-flex flex-wrap gap-6">
                      <div v-if="bundleDetail?.isImage" class="wrapper-cover d-lg-none">
                          <img :src="bundleDetail?.cover" class="w-100 h-100" style="object-fit: cover"/>
                      </div>
                      <div :class="`wrapper-content ${!bundleDetail?.isImage ? 'w-100' : ''}`">
                          <h1 class="mb-3 title">{{ bundleDetail?.title }}</h1>
                          <div class="mb-4 description" v-html="bundleDetail?.description" />
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
                              <i class="ri-account-circle-line text-primary"></i> Dibuat oleh <span class="text-primary">{{ (bundleDetail?.author?.name || bundleDetail?.Author?.name) || '-' }}</span>
                          </p>
                          <p class="d-flex align-items-center gap-2">
                              <i class="ri-history-fill text-primary"></i> Terakhir diupdate {{ setUpdatedDate(bundleDetail?.updated_at) }}
                          </p>
                          <div class="mt-4">
                              <b-button
                                  v-if="!bundleDetail?.owned"
                                  variant="primary"
                                  @click="bundleDetail?.price === 0 ? handleAssignBundle() : handleContactUs()"
                              >
                                  {{ bundleDetail?.price === 0 ? 'Tambahkan' : "Hubungi Kami" }}
                              </b-button>
                              <!-- <b-button
                                  variant="outline-primary"
                                  @click="goToSection('aboutBundle')"
                              >
                                  Tentang Paket
                              </b-button> -->
                          </div>
                      </div>
                      <div v-if="bundleDetail?.isImage" class="wrapper-cover d-none d-lg-flex">
                          <img :src="bundleDetail?.cover" class="w-100 h-100" style="object-fit: cover"/>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                      <div class="d-flex flex-column gap-3 justify-content-center align-items-center py-4">
                          <i class="ri-book-3-fill text-gray" style="font-size: 42px;"></i>
                          <p class="mb-0 text-gray" style="font-size: 18px">Paket belum tersedia</p>
                      </div>
                  </template>
                </b-card>
                <b-card v-else class="border p-4">
                    <div class="d-flex gap-6 flex-wrap">
                        <div class="d-lg-none w-100" style="max-height: 300px; aspect-ratio: 1 / 1;">
                            <b-skeleton-img width="100%" height="100%" no-aspect></b-skeleton-img>
                        </div>
                        <div class="wrapper-skeleton-content d-flex gap-3 flex-column">
                            <div class="w-100 flex-grow-1 d-flex flex-column gap-2">
                                <b-skeleton width="60%" height="50px" class="mb-3"></b-skeleton>
                                <b-skeleton width="90%"></b-skeleton>
                                <b-skeleton width="80%"></b-skeleton>
                                <b-skeleton width="50%"></b-skeleton>
                                <b-skeleton width="30%"></b-skeleton>
                                <b-skeleton width="70%"></b-skeleton>
                                <b-skeleton width="90%"></b-skeleton>
                                <b-skeleton width="80%"></b-skeleton>
                                <b-skeleton width="50%"></b-skeleton>
                            </div>
                            <div class="d-flex align-items-center gap-3">
                                <b-skeleton type="button"></b-skeleton>
                                <b-skeleton type="button"></b-skeleton>
                            </div>
                        </div>
                        <div class="d-none d-lg-flex w-25" style="aspect-ratio: 1 / 1;">
                            <b-skeleton-img width="100%" height="100%" no-aspect></b-skeleton-img>
                        </div>
                    </div>
                </b-card>
            </b-col>
        </b-row>

        <!-- SECTION TENTANG PAKET -->
        <!-- <b-row>
            <b-col cols="12">
                <b-card ref="aboutBundle" class="border p-4">
                    <h3 class="mb-4">Tentang paket</h3>
                    <div v-html="bundleDetail?.description" />
                </b-card>
            </b-col>
        </b-row> -->

        <!-- SECTION LIST MATERI -->
        <b-row>
            <b-col cols="12">
                <b-card class="border">
                  <template v-if="isLoaded">
                      <template v-if="bundleDetail?.modules && bundleDetail?.modules?.length > 0">
                          <template v-for="(item, idx) of bundleDetail?.modules">
                              <template v-if="idx < 5">
                                  <div :key="idx" class="p-4 d-flex align-items-center gap-6 cursor-pointer" @click="onClickDetailCourse(item?.slug)">
                                      <div class="rounded overflow-hidden" :style="{'background-color': !item?.isImage ? item?.cover || '#EFECF4' : '', 'aspect-ratio': '1 / 1', 'height': '64px'}">
                                        <img v-if="item?.isImage" :src="item?.cover" class="w-100 h-100" style="object-fit: cover;" />
                                      </div>
                                      <div class="d-flex align-items-start flex-column justify-content-center">
                                          <h5 class="font-semibold" style="margin-bottom: 6px;">{{ item?.title }}</h5>
                                          <!-- <div class="d-flex align-items-center gap-2">
                                            <p class="mb-0">15 Modul</p>
                                            <span>•</span>
                                            <p class="mb-0">19 menit</p>
                                            <span>•</span>
                                            <span class="d-flex align-items-center gap-1 font-bold">4.8 <i class="ri-star-fill text-yellow"></i></span>
                                            <p class="mb-0">(90,300 ratings)</p>
                                          </div> -->
                                      </div>
                                  </div>
                                  <hr v-if="(!showAllCourses && idx < (bundleDetail?.modules?.length > 5 ? 4 : bundleDetail?.modules?.length - 1)) || (showAllCourses && idx !== bundleDetail?.modules?.length - 1)" :key="idx + 'hr'" class="divider-menu my-0">
                              </template>
                          </template>
      
                          <b-collapse id="show-all-courses" accordion="courses-accordion" role="tabpanel">
                              <template v-for="(item, idx) of bundleDetail?.modules">
                                  <template v-if="idx >= 5">
                                    <div :key="idx" class="p-4 d-flex align-items-center gap-6 cursor-pointer" @click="onClickDetailCourse(item?.slug)">
                                      <div class="rounded overflow-hidden" :style="{'background-color': !item?.isImage ? item?.cover || '#EFECF4' : '', 'aspect-ratio': '1 / 1', 'height': '64px'}">
                                        <img v-if="item?.isImage" :src="item?.cover" class="w-100 h-100" style="object-fit: cover;" />
                                      </div>
                                      <div class="d-flex align-items-start flex-column justify-content-center">
                                          <h5 class="font-semibold" style="margin-bottom: 6px;">{{ item?.title }}</h5>
                                          <!-- <div class="d-flex align-items-center gap-2">
                                            <p class="mb-0">15 Modul</p>
                                            <span>•</span>
                                            <p class="mb-0">19 menit</p>
                                            <span>•</span>
                                            <span class="d-flex align-items-center gap-1 font-bold">4.8 <i class="ri-star-fill text-yellow"></i></span>
                                            <p class="mb-0">(90,300 ratings)</p>
                                          </div> -->
                                      </div>
                                    </div>
                                    <hr v-if="(!showAllCourses && idx < (bundleDetail?.modules?.length > 5 ? 4 : bundleDetail?.modules?.length - 1)) || (showAllCourses && idx !== bundleDetail?.modules?.length - 1)" :key="idx + 'hr'" class="divider-menu my-0">
                                  </template>
                              </template>
                          </b-collapse>
      
                          <p
                              v-if="bundleDetail?.modules?.length > 5"
                              class="d-flex justify-content-center align-items-center mb-4 gap-2 text-primary font-medium cursor-pointer user-select-none"
                              role="tab"
                              v-b-toggle="`show-all-courses`"
                              @click="showAllCourses = !showAllCourses"
                          >
                              <template v-if="!showAllCourses">
                                  <i class="ri-arrow-down-s-line" style="font-size: 20px"></i>
                                  Lihat Semua {{ bundleDetail?.modules?.length }} Materi
                              </template>
                              <template v-else>
                                  <i class="ri-arrow-up-s-line" style="font-size: 20px"></i>
                                  Lihat Lebih Sedikit
                              </template>
                          </p>
                      </template>
                      <template v-else>
                          <div class="d-flex flex-column gap-3 justify-content-center align-items-center py-5">
                              <i class="ri-book-open-fill text-gray" style="font-size: 42px;"></i>
                              <p class="mb-0 text-gray" style="font-size: 18px">Materi belum tersedia</p>
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
            </b-col>
        </b-row>

        <!-- SECTION PAKET LAINNYA -->
        <b-row>
          <b-col cols="12">
              <div>
                  <div class="my-4 d-flex justify-content-between align-items-center" style="padding: 0px 12px;">
                      <h4>Paket Lainnya</h4>
                      <nuxt-link :to="navigationBundleSeeMore" class="mb-0 text-primary" style="font-size: 14px;">Lihat Semua</nuxt-link>
                  </div>
                  <b-card class="border">
                      <template v-if="!isLoadingOthersBundle">
                          <template v-if="listBundleRelated">
                              <template v-for="(item, idx) of listBundleRelated">
                                  <div :key="idx" class="p-4 d-flex align-items-center gap-6 cursor-pointer" @click="onClickOtherBundle(item?.slug)">
                                    <div class="rounded overflow-hidden" :style="{'background-color': !item?.isImage ? item?.cover || '#EFECF4' : '', 'aspect-ratio': '1 / 1', 'height': '64px'}">
                                      <img v-if="item?.isImage" :src="item?.cover" class="w-100 h-100" style="object-fit: cover;" />
                                    </div>
                                    <div class="d-flex align-items-start flex-column justify-content-center">
                                        <h5 class="font-semibold">{{ item?.title }}</h5>
                                        <div class="d-flex align-items-center gap-2">
                                          <p class="mb-0">{{ item?.modules ? item?.modules?.length : '0' }} Materi</p>
                                          <!-- <span>•</span>
                                          <p class="mb-0">19 menit</p>
                                          <span>•</span>
                                          <span class="d-flex align-items-center gap-1 font-bold">4.8 <i class="ri-star-fill text-yellow"></i></span>
                                          <p class="mb-0">(90,300 ratings)</p> -->
                                        </div>
                                    </div>
                                  </div>
                                  <hr v-if="idx < listBundleRelated?.length - 1" :key="idx + 'hr'" class="divider-menu my-0">
                              </template>
                          </template>
                          <template v-else>
                              <div class="d-flex flex-column gap-3 justify-content-center align-items-center py-5">
                                  <i class="ri-book-3-fill text-gray" style="font-size: 42px;"></i>
                                  <p class="mb-0 text-gray" style="font-size: 18px">Paket belum tersedia</p>
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
        </b-row>
        <!-- <b-col cols="12">
            <b-row>
                <b-col cols="12" lg="4">
                    <div  class="position-sticky" style="top: 8rem">
                        <div class="d-flex align-items-center gap-2">
                            <h3 class="mb-0 font-weight-bold text-yellow" style="font-size: 36px;">4.8</h3>
                            <i class="ri-star-fill text-yellow" style="font-size: 36px;"></i>
                        </div>
                        <div class="d-flex align-items-center gap-3 mb-2">
                            <p class="mb-0">247 ratings</p>
                            <p class="mb-0" style="font-size: 24px;">•</p>
                            <p class="mb-0">65 ulasan</p>
                        </div>
                        <div class="d-flex flex-column gap-2">
                            <b-row v-for="(item, idx) in reviews" :key="idx" class="align-items-center">
                                <b-col cols="1" class="d-flex align-items-center gap-1">
                                    <i class="ri-star-fill text-yellow"></i>
                                    <p class="mb-0">{{ item.star }}</p>
                                </b-col>
                                <b-col cols="10">
                                    <b-progress :value="item.percentage" :max="100" class="mb-0" variant="primary"></b-progress>
                                </b-col>
                                <b-col cols="1">
                                    <p class="mb-0">{{ item.review }}</p>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </b-col>

                <b-col cols="12" lg="8">
                    <b-card v-for="(item, idx) of bundleDetail?.modules" :key="idx" class="border">
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
                                    <p class="mb-0" style="color: rgb(121, 121, 121) !important">2 minggu lalu</p>
                                </div>
                            </b-col>
                        </b-col>
                        <b-col cols="12" class="px-0">
                            <p class="mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus ratione esse soluta quo voluptatum commodi perferendis consequuntur delectus reprehenderit quos rerum illo assumenda quasi quidem, quae maxime non ut repellat quod hic ducimus, velit temporibus? Est deleniti consectetur architecto tempora.</p>
                        </b-col>
                    </b-card>
                </b-col>
            </b-row>
        </b-col> -->
        <b-modal
            v-model="onEvent.isShow"
            size="sm" 
            centered 
            hide-header 
            hide-footer
            >
            <ModalAlert
                :title="onEvent?.title"
                :description="onEvent?.description"
                :icon="onEvent?.icon"
                :typeOfAlert="onEvent?.typeOfAlert"
            />
        </b-modal>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { toDateShort } from '~/commons/utils';
import ModalAlert from '@/components/template/micro/modal/ModalAlert.vue';

export default {
    props: {
        slug: {
            type: String,
            default: '',
        },
    },
    components: {
        ModalAlert,
    },
    created() {
        this.getCredential();
    },
    data() {
        return {
            bundleDetail: null,
            isLoaded: false,
            reviews: [
                { star: 5, percentage: 60, review: 231 },
                { star: 4, percentage: 40, review: 13 },
                { star: 3, percentage: 10, review: 1 },
                { star: 2, percentage: 20, review: 2 },
                { star: 1, percentage: 0, review: 0 },
            ],
            showAllCourses: false,
            pagination: {
                page: 1,
                perPage: 3,
                totalItems: 0,
                totalPages: 0,
            },
            isLoadingOthersBundle: true,
            listBundleRelated: null,
            onEvent: {
                title: "",
                description: "",
                icon: "",
                typeOfAlert: "", // danger, success, warning, ....
                isShow: false,
            },
        }
    },
    computed: {
        ...mapState({
            coursesState: state => state.Courses,
            getActiveTab: (state) => state?.Layouts?.activeTab
        }),
        navigationBundleSeeMore(){
            return this.getActiveTab === 'library' ? "/dashboard/courses/bundle" : "/dashboard/courses/my-courses/bundle";
        }
    },
    methods: {
        ...mapActions({
            getListBundle: "Courses/getListBundle",
            assignBundleToLMS: "Courses/assignBundleToLMS",
            getListBundleLibrary: "Courses/getListBundleLibrary",
            getListBundleRelated: "Courses/getListBundleRelated",
        }),
        setEventAlert(title, description, icon, typeOfAlert, isShow){
            this.onEvent = {
                title,
                description,
                icon,
                typeOfAlert,
                isShow,
            }
        },
        async getCredential(){
            await this.fetchBundleDetail();
            await this.fetchListBundleRelated();
        },
        async fetchBundleDetail() {
            this.isLoaded = false

            await this.$store.dispatch("Courses/getDetailBundle", this.slug)

            if (!this.coursesState.status) {
                console.error('Failed fetch bundle detail', this.coursesState.message)
                this.setEvent(this.coursesState.message, false)
                this.isLoaded = true
            } else {
                this.bundleDetail = this.coursesState?.bundle ?? null
                this.bundleDetail.isImage = this.isCoverImage(this.bundleDetail?.cover);
                if(this.bundleDetail?.modules){
                    this.bundleDetail?.modules.map((module, index) => {
                        module.isImage = this.isCoverImage(module?.cover);
                    })
                }
                this.isLoaded = true
            }
        },
        toIDR(value) {
            const IDR = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            });

            return IDR.format(value).split(",")[0];
        },
        onClickDetail(slug) {
            this.$router.push(`/dashboard/courses/bundle/${this.bundleDetail?.slug}/${slug}`)
        },
        onClickOtherBundle(slug){
            this.$router.push(`/dashboard/courses/bundle/${slug}`);
        },
        onClickDetailCourse(slug){
            this.$router.push(`/dashboard/courses/bundle/${this.bundleDetail?.slug}/modules/${slug}`);
        },
        goToSection(section){
            const refElement = this.$refs[section];
            if (refElement) {
                const rect = refElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const offset = rect.top + scrollTop - 135;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        },
        isCoverImage(url) {
            if (url) {
                const imageExtensionRegex =
                /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
                return imageExtensionRegex.test(url);
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
        async fetchListBundleRelated(){
            this.isLoadingOthersBundle = true;

            const bundleSlug = this.$route?.params?.slug;

            const params = {
                bundleSlug
            }

            await this.getListBundleRelated(params);

            if(!this.coursesState.status){
                this.isLoadingOthersBundle = false;
                this.listBundleRelated = this.coursesState.listBundleRelated
                console.error("Failed to fetch list bundle : " + this.coursesState?.message)
            }else{
                this.listBundleRelated = this.coursesState?.listBundleRelated

                if(this.listBundleRelated){
                    this.listBundleRelated.map(item => {
                        item.isImage = this.isCoverImage(item.cover);
                    });
                }

                this.isLoadingOthersBundle = false;
            }
        },
        handleAssignBundle(){
            if(this.bundleDetail?.price === 0){
                this.fetchAssignBundleToLMS();
            }
        },
        async fetchAssignBundleToLMS(){
            this.isLoaded = false;

            const params = {
                bundleSlug: this.bundleDetail?.slug,
            }

            await this.assignBundleToLMS(params);

            if(!this.coursesState?.status){
                console.error("Failed assign bundle to LMS : " + this.coursesState?.message);
                this.isLoaded = true;
            }else{
                this.setEventAlert("Paket berhasil ditambahkan", "Paket telah berhasil ditambahkan ke dalam LMS. Sekarang, Paket tersebut sudah dapat di akses!", "ri-checkbox-circle-fill", "success", true);

                await this.getCredential();

                this.isLoaded = true;
            }
        },
        handleContactUs(){
            const domain = window.location.hostname;
            const email = 'hello@alkademi.id';
            const subject = `Pemesanan Paket Materi untuk LMS ${domain}`;
            const body = `Halo Alkademi,\n\nSaya tertarik dengan paket materi "${this.bundleDetail?.title}" untuk ditambahkan ke LMS ${domain}\n\nTerima kasih.`;
            const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailURL, "_blank");
        }
    }
}
</script>

<style lang="scss" scoped>
#detail-bundle {

  .wrapper-card{

    .wrapper-content{
      width: 100%;
  
      @media(min-width: 992px){
        width: 70%;
      }
  
      .title{
        font-size: 36px;
      }
  
      .description ::v-deep{
        font-weight: 400 !important;
        font-size: 16px;
        line-height: 150% !important;
        color: rgba(0,0,0) !important;
  
        span, p{
          font-weight: 400 !important;
          line-height: 150% !important;
          color: rgba(0,0,0) !important;
          font-size: 16px !important;
        } 
      }
    }
  
    .wrapper-cover{
      width: 100%;
      aspect-ratio: 1 / 1;
      max-height: 300px;
  
      @media(min-width: 992px){
        width: calc(30% - 24px);
        max-height: 400px;
        aspect-ratio: 1 / 1;
      }
    }
  }

  .wrapper-skeleton-content{
    width: 100%;

    @media(min-width: 992px){
        width: calc(75% - 24px);
    }
  }


  .card{
    .card-body{
      padding: 0px;
    }
  }

  // .btn-action-add {
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     padding: 16px;
  //     font-style: normal;
  //     font-weight: 400;
  //     font-size: 16px;
  //     line-height: 22px;

  //     text-transform: capitalize;

  //     i {
  //         margin-left: 20px;
  //         font-size: 10px;
  //     }
  // }
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
}
</style>