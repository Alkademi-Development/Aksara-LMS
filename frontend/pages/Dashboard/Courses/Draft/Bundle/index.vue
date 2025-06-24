<template>
  <div class="container-fluid py-4">
    <FilterForms 
      :isBusy="isLoading"
      :actionButtons="filterActionButtons"
      :pagination="pagination"
      :sortItems="sortBundle"
      :searchPlaceholder="'Cari berdasarkan nama bundle'"
      :isWrap="true"
      @onClickBundle="onClickBundle"
      @fetchFilters="setFiltersAndFetch"
      :showActionButtons="isShowButtonCreate"
      @typingSearch="isLoading = $event"
    />
    <section id="section-course">
      <div v-if="!isLoading">
        <div v-if="bundle?.length > 0 && bundle != null" class="row">
          <CardBundle v-for="(item, index) in bundle"
            :data="item"
            :key="index"
            @onEdit="onClickEditbundle($event)"
            @onDelete="toggleDeleteBundle($event)"
            class="col-12 col-lg-6"
          />
          <div v-if="isBundleLoadMore" class="col-12 col-lg-6">
            <div style="height: 250px;">
              <b-skeleton-img height="250px"></b-skeleton-img>
            </div>
          </div>
          <div v-if="isBundleLoadMore" class="col-12 col-lg-6">
            <div style="height: 250px;">
              <b-skeleton-img height="250px"></b-skeleton-img>
            </div>
          </div>
        </div>
        <div v-else class="w-100 empty-bundle d-flex justify-content-center align-items-center">
          <p>Bundle Belum Tersedia</p>
        </div>
      </div>
      <div v-else class="row">
        <div class="col-12 col-lg-6">
          <div style="height: 250px;">
            <b-skeleton-img height="250px"></b-skeleton-img>
          </div>
        </div>
        <div class="col-12 col-lg-6">
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
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';
import CardBundle from "@/components/template/micro/card/CardBundle.vue";
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";

import { mapActions, mapState } from 'vuex'
import { TABLE_COLUMN_USERS } from "@/commons/constants/users"
import { SORT_BUNDLE } from '~/commons/constants/filters';

export default {
  layout: 'dashboard',
  components: {
    FilterForms,
    CardBundle,
    ModalConfirmation
  },
  computed: {
      ...mapState({
          coursesState: (state) => state.Courses,
      }),
      isShowButtonCreate(){
        // return this.activeTab === 'myCourses';
        return this.role === 'superadmin' && this.activeTab === 'library'
      }
  },
  watch: {
    endOfPage() {
        if (this.endOfPage) {
            window.removeEventListener("scroll", this.handleScrolledScreen)
            this.loadMore()
        }
    },
  },
  data(){
    return{
      fields: TABLE_COLUMN_USERS,
      pagination: {
          page: 1,
          pageSize: 4,
          totalItems: 0,
          totalPages: 0,
      },
      isBundleLoadMore: false,
      endOfPage: false,
      filterActionButtons: [
          {
              class: 'btn btn-primary',
              isAction: true,
              text: 'Bundle',
              to: 'onClickBundle',
              type: 'button',
              iconClass: 'ri-add-fill mr-1'
          }
      ],
      
      sortBundle: SORT_BUNDLE,

      role: localStorage.getItem('user_kind') == null ? this.$store.state.Sidebar.role : localStorage.getItem('user_kind'),
      bundle: [],
      isLoading: false,
      searchQuery: null,
      selectedSort: null,
      selectedCategory: null,
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
    }
  },
  mounted(){
    this.fetchListBundle();
    this.fetchAllCategory();
  },
  methods: {
    ...mapActions({
        getListBundle: "Courses/getListBundle",
    }),
    setFiltersAndFetch({page, perPage, sortBy, search, category}) {
        this.searchQuery = search
        this.selectedSort = sortBy
        this.selectedCategory = category

        this.pagination.page = 1
        this.fetchListBundle();
    },
    async fetchListBundle(){
      if (!this.isBundleLoadMore) this.isLoading = true
      else this.isLoading = false;

      const params = {
        page: this.pagination?.page,
        pageSize: this.pagination?.pageSize,
        search: !!this.searchQuery ? this.searchQuery : null,
        sort: !!this.selectedSort ? this.selectedSort : null,
        categorySlug: !!this.selectedCategory ? this.selectedCategory : null,
      }

      await this.getListBundle(params);

      if(!this.coursesState.status){
        this.bundle = this.coursesState.bundle
        this.isBundleLoadMore = false;
        this.isLoading = false;
      }else{
        this.pagination = {
          page: this.coursesState?.pagination?.currentPage,
          pageSize: this.coursesState?.pagination?.perPage,
          totalItems: this.coursesState?.pagination?.totalRows,
          totalPages: this.coursesState?.pagination?.totalPage,
        };

        let bundleData = this.coursesState?.bundle ?? []

        if(!this.isBundleLoadMore) this.bundle = this.coursesState.bundle
        else {
          bundleData.map(item => {
            this.bundle.push(item);
          })
        }

        if(this.bundle?.length > 0 && this.bundle != null){
          this.bundle.map(item => {
            // Checking whether image or not
            item.isImage = this.isCoverImage(item.cover);
            // Checking what is the name of category Id
            item.category = this.checkCategory(item.categoryId);
            // How many modules that selected
            item.totalModules = item?.modules?.length
          });
        }
        console.log(this.bundle, 201);
        this.setupInfiniteScroll();
        this.isBundleLoadMore = false;
        this.isLoading = false;
      }
    },
    checkCategory(category){
      const categories = this.coursesState?.categories;
      let selectedCategory = null;

      if(categories){
        categories.map((item) => {
          if(item.id == category) selectedCategory = item.name;
        });
      };

      return selectedCategory;
    },
    setupInfiniteScroll() {
        const isInfiniteScroll = (window.innerHeight + window.pageYOffset) <= (document.body.offsetHeight - 100)
        if (isInfiniteScroll && this.pagination.page < this.pagination.totalPages) window.addEventListener("scroll", this.handleScrolledScreen);
        else setTimeout(() => {
            this.loadMore()
        }, 50);
    },
    loadMore() {
        if (this.pagination.page < this.pagination.totalPages) {

            this.isBundleLoadMore = true
            this.pagination.page += 1
            setTimeout(() => {
                this.fetchListBundle()
            }, 50);

        } else this.isBundleLoadMore = false
        
    },
    handleScrolledScreen() { 
        this.endOfPage = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 100);
    },
    isCoverImage(url) {
      if (url) {
        const imageExtensionRegex =
          /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
        return imageExtensionRegex.test(url);
      }
    },
    onClickBundle() {
        this.$router.push(`/dashboard/courses/bundle/create`)
    },
    async fetchAllCategory() {
        await this.$store.dispatch('Courses/getListCategory')
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
    }
}
}
</script>

<style scoped lang="scss">
.empty-bundle{
  height: 150px;

  p{
    font-size: 22px;
  }
}
</style>