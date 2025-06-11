<template>
  <div class="mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="font-semibold">{{ titleOfSection }}</h2>
      <div class="d-flex align-items-center" style="gap: 20px;">
        <!-- <button class="btn btn-primary d-flex align-items-center" @click="onClickBundle">
            <i class="ri-add-fill mr-1"></i>
            Bundle
        </button> -->
        <nuxt-link :to="navigationBundle" class="see-all text-primary">Lihat Semua</nuxt-link>
      </div>
    </div>
    <div class="">
      <FilterForms 
        :isBusy="isLoading"
        :actionButtons="filterActionButtons"
        :pagination="pagination"
        :sortItems="sortBundle"
        :searchPlaceholder="'Cari berdasarkan nama paket'"
        :isWrap="true"
        :showFilter="false"
        :lgSize="6"
        @onClickBundle="onClickBundle"
        @fetchFilters="setFiltersAndFetch"
        :showActionButtons="isShowButtonCreate"
        @typingSearch="isLoading = $event"
      />
    </div>
    <section id="section-course">
      <div v-if="!isLoading">
        <div  v-if="bundle?.length > 0 && bundle != null" class="position-relative">
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(item, index) in bundle" :key="index">
              <CardBundle 
                :data="item"
                @onEdit="onClickEditbundle($event)"
                @onDelete="toggleDeleteBundle($event)"
              />
            </swiper-slide>
            <swiper-slide v-if="pagination?.totalItems > 2">
              <div @click="gotoAllBundle" class="bg-white border rounded d-flex justify-content-center align-items-center cursor-pointer" style="height: 250px">
                <div class="d-flex align-items-center gap-3" style="border-bottom: 1px solid rgba(0, 0, 0, .2);">
                  <p class="mb-0" style="font-size: 24px">Lihat Semua</p>
                  <i class="ri-arrow-right-line" style="font-size: 24px"></i>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
          <div class="swiper-pagination" slot="pagination"></div>
        </div>
        <div v-else class="w-100 empty-bundle">
          <p>Bundle Belum Tersedia</p>
        </div>
      </div>
      <div v-else class="row">
        <div v-for="index in 2" class="col-12 col-lg-6" :key="index">
          <div style="height: 250px;">
            <b-skeleton-img height="250px"></b-skeleton-img>
          </div>
        </div>
      </div>
    </section>
    <b-modal v-model="isModalConfirm" size="sm" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc body-class="p-0">
        <ModalConfirmation
            :title="modalConfirmData?.title"
            :description="modalConfirmData?.description"
            :btnYesVariant="modalConfirmData?.btnYesVariant"
            :btnYesTitle="modalConfirmData?.btnYesTitle"
            :centered="true"
            :btnNoHide="isModalConfirmProcess"
            :btnYesDisabled="isModalConfirmProcess"
            @actionYes="deleteBundle()"
            @actionNo="toggleDeleteBundle()"/>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { SORT_BUNDLE } from '~/commons/constants/filters';
import { FIELDS_FILTER_CATEGORY } from '~/commons/constants/forms';

import CardBundle from "@/components/template/micro/card/CardBundle.vue";
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';

export default {
    props: {
      activeTab: {
        type: String,
        default: "",
      }
    },
    components: {
        CardBundle,
        Swiper,
        SwiperSlide,
        ModalConfirmation,
        FilterForms
    },
    computed: {
        ...mapState({
            coursesState: (state) => state.Courses,
        }),
        titleOfSection(){
          return this.activeTab == 'library' ? "Paket" : "Paket Saya";
        },
        navigationBundle(){
          return this.activeTab == 'library' ? "/dashboard/courses/bundle" : "/dashboard/courses/my-courses/bundle"
        },
        isShowButtonCreate(){
          // return this.activeTab === 'myCourses';
          return this.role === 'superadmin' && this.activeTab === 'library'
        }
    },
    watch: {
      activeTab(){
        this.fetchListBundle();
      }
    },
    data(){
      return{
        swiperOption: {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: false,
          grabCursor: true,
          breakpoints: {
            992: {
              slidesPerView: 2,
              spaceBetween: 20
            },
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        bundle: [],
        isLoading: false,
        pagination: {
          page: 1,
          perPage: 10,
          totalItems: 0,
          totalPages: 0,
        },
        isModalConfirm: false,
        modalConfirmData: {
            title: "",
            description: "",
            btnYesTitle: "Ya, Saya Yakin",
            btnYesVariant: "danger",
            type: "delete"
        },
        bundleSelected: null,
        isModalConfirmProcess: false,
        
        filterActionButtons: [
          {
              class: 'btn btn-primary',
              isAction: true,
              text: 'Paket',
              to: 'onClickBundle',
              type: 'button',
              iconClass: 'ri-add-fill mr-1'
          }
        ],
        sortBundle: SORT_BUNDLE,
        filterFields: FIELDS_FILTER_CATEGORY,
        searchQuery: null,
        selectedSort: null,
        role: localStorage.getItem("user_kind"),
      }
    },
    created(){
      this.fetchListBundle();
    },
    methods: {
      ...mapActions({
          getListBundle: "Courses/getListBundle",
          getListBundleLibrary: "Courses/getListBundleLibrary"
      }),
      setFiltersAndFetch({page, perPage, sortBy, search, category}) {
          this.searchQuery = search
          this.selectedSort = sortBy
          this.selectedCategory = category

          this.pagination.page = 1
          this.fetchListBundle();
      },

      async fetchListBundle(){
        this.isLoading = true;

        const params = {
          page: this.pagination?.page,
          perPage: this.pagination?.perPage,
          search: !!this.searchQuery ? this.searchQuery : null,
          sort: !!this.selectedSort ? this.selectedSort : null,
        }

        if(this.activeTab === 'library') await this.getListBundleLibrary(params);
        else if(this.activeTab === 'myCourses') await this.getListBundle(params);

        if(!this.coursesState.status){
          this.isLoading = false;
          this.bundle = this.coursesState.bundle
        }else{
          this.pagination = {
            page: this.coursesState?.pagination?.currentPage,
            perPage: this.coursesState?.pagination?.perPage,
            totalItems: this.coursesState?.pagination?.totalRows,
            totalPages: this.coursesState?.pagination?.totalPage,
          };

          this.bundle = this.coursesState.bundle

          if(this.bundle){
            this.bundle.map(item => {
              item.isImage = this.isCoverImage(item.cover);
            });
          }

          this.isLoading = false;
        }
      },
      isCoverImage(url) {
        if (url) {
          const imageExtensionRegex =
            /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
          return imageExtensionRegex.test(url);
        }
      },
      onClickBundle() {
        if(this.activeTab === 'library') this.$router.push(`/dashboard/courses/bundle/create`);
        else if (this.activeTab === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/bundle/create`);
      },
      deleteBundle() {
        this.isModalConfirmProcess = true
        this.modalConfirmData.btnYesTitle = `Loading...`
        this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Bundle <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.bundleSelected?.title }</span> ini?<h5>`

        this.$store.dispatch("Courses/deleteBundle", this.bundleSelected?.slug).then(() => {
            if (this.coursesState?.status) {
                this.pagination.page = 1
                this.fetchListBundle();
                this.toggleDeleteBundle();
            } else {
                this.modalConfirmData.description += `</br><p class='text-danger'>${this.coursesState.message}</p>`
            }
            this.isModalConfirmProcess = false
            this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        })
      },
      toggleDeleteBundle(data) {
          this.isModalConfirm = !this.isModalConfirm
          this.modalConfirmData.type = 'delete'

          if (this.isModalConfirm) {
              this.bundleSelected = data;
              this.modalConfirmData.btnYesVariant = 'danger'
              this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Bundle <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.bundleSelected?.title }</span> ini?<h5>`
          } else {
              this.bundleSelected = null
              this.modalConfirmData.description = ``
          }
      },
      onClickEditbundle(data){
        this.$router.push(`/dashboard/courses/bundle/edit/${data?.slug}`)
      },
      gotoAllBundle(){
        if(this.searchQuery) localStorage.setItem("searchQuery", this.searchQuery);
        if(this.selectedSort) localStorage.setItem("selectedSort", this.selectedSort);
        this.$router.push(this.navigationBundle);
      }
    }
};
</script>

<style scoped lang="scss">

.empty-bundle{
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;

  p{
    font-size: 22px;
  }
}
.font-semibold {
    font-weight: 600;
}

.see-all{
  font-size: 16px;
}

.swiper-pagination ::v-deep{
  display: flex;
  gap: 10px;
  // background-color: white;
  // box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 10px 20px;
  border-radius: 20px;
  left: 50%;
  bottom: -23px;
  transform: translateX(-50%);
  .swiper-pagination-bullet.swiper-pagination-bullet-active{
    transform: scale(1.5);
    transition: all .3s;
  }
  .swiper-pagination-bullet-active{
    background: var(--bs-primary);
  }
}


.swiper-button-prev,
.swiper-button-next{
  background-color: white;
  border-radius: 50%;
  opacity: 1;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  transform: translateY(-30%);
}

.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled{
  opacity: 0;
}

.swiper-button-prev::after,
.swiper-button-next::after{
  font-size: 14px;
  font-weight: bold;
  color: var(--bs-primary);
}
</style>