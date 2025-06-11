<template>
  <div class="container-fluid py-4">
    <FilterForms 
      :isBusy="isBusy"
      :actionButtons="filterActionButtons"
      :pagination="pagination"
      :sortItems="sortMateri"
      :searchPlaceholder="'Cari berdasarkan nama materi'"
      :isWrap="true"
      @onClickMateri="onClickMateri"
      @fetchFilters="setFiltersAndFetch"
      :showFilter="false"
      :showActionButtons="isShowButtonCreate"
      @typingSearch="isBusy = $event"
    />

    <section id="section-course">
      <div v-if="!isBusy">
        <div v-if="materi?.length > 0 && materi != null" class="row" style="gap: 24px 0px">
          <CardMaterial 
            v-for="item in materi"
            :data="item"
            :key="item?.id"
            @onEdit="onClickEdit($event)"
            @onDelete="toggleDelete($event)"
          />
          <template v-for="index in 4">
            <div :key="index" v-if="isMateriLoadMore" class="col-12 col-md-6 col-lg-4">
              <div style="height: 330px;">
                <b-skeleton-img height="330px"></b-skeleton-img>
              </div>
            </div>
          </template>
        </div>
        <div v-else class="w-100 empty-bundle d-flex justify-content-center align-items-center">
          <p>Materi Belum Tersedia</p>
        </div>
      </div>
      <div v-else class="row">
        <div v-for="index in 4" :key="index" class="col-12 col-md-6 col-lg-3">
          <div style="height: 330px;">
            <b-skeleton-img height="330px"></b-skeleton-img>
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
            @actionYes="deleteMateri()"
            @actionNo="toggleDelete()"/>
    </b-modal>
  </div>
</template>

<script>
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';
import CardMaterial from "@/components/template/micro/card/CardMaterial.vue";
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";

import { TABLE_COLUMN_USERS } from "@/commons/constants/users"
import { FIELDS_FILTER_USERS } from '~/commons/constants/forms';
import { SORT_MATERI } from '~/commons/constants/filters';
import { mapState } from 'vuex';

export default {
  layout: 'dashboard',
  components: {
    FilterForms,
    CardMaterial,
    ModalConfirmation
  },
  created(){
      this.fetchCourses()
      
      // localStorage.removeItem('courseId')
  },
  computed: {
      ...mapState({
          servicesState: (state) => state.Services,
          getActiveTab: (state) => state?.Layouts?.activeTab
      }),
      isShowButtonCreate(){
        // return this.activeTab === 'myCourses';
        return this.role === 'superadmin' && this.getActiveTab === 'library'
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
      isBusy: false,
      fields: TABLE_COLUMN_USERS,
      pagination: {
          page: 1,
          pageSize: 6,
          totalItems: 0,
          totalPages: 0,
      },
      endOfPage: false,
      isMateriLoadMore: false,
      filterActionButtons: [
          {
              class: 'btn btn-primary',
              isAction: true,
              text: 'Materi',
              to: 'onClickMateri',
              type: 'button',
              iconClass: 'ri-add-fill mr-1'
          }
      ],
      
      sortMateri: SORT_MATERI,
      filterFields: FIELDS_FILTER_USERS,

      typeCourse: 'module',
      materi: [],
      searchQuery: null,
      selectedSort: null,
      isModalConfirm: false,
      modalConfirmData: {
          title: "",
          description: "",
          btnYesTitle: "Ya, Saya Yakin",
          btnYesVariant: "danger",
          type: "delete"
      },
      isModalConfirmProcess: false,
      materiSelected: null,
      role: localStorage.getItem('user_kind'),
    }
  },
  methods: {
    setFiltersAndFetch({page, perPage, sortBy, search, kind}) {
        this.searchQuery = search
        this.selectedSort = sortBy

        this.pagination.page = 1
        this.fetchCourses();
    },
    async fetchCourses(){
      if (!this.isMateriLoadMore) this.isBusy = true
      else this.isBusy = false;

      const params = {
        page: this.pagination?.page,
        pageSize: this.pagination?.pageSize,
        type: this.typeCourse,
        search: !!this.searchQuery ? this.searchQuery : null,
        sort: !!this.selectedSort ? this.selectedSort : null,
      }

      await this.$store.dispatch('Services/getListModulesLibrary', params)

      if(!this.servicesState.status) {
          console.error('Failed fetch modules', this.servicesState.message)
          this.isMateriLoadMore = false;
          this.isBusy = false;
      } else {
          this.pagination = {
            page: this.servicesState?.pagination?.page,
            pageSize: this.servicesState?.pagination?.perPage,
            totalItems: this.servicesState?.pagination?.totalItems,
            totalPages: this.servicesState?.pagination?.totalPages,
          }

          let materiData = this.servicesState.modules ?? [];

          if(!this.isMateriLoadMore) this.materi = materiData
          else {
            materiData.map(item => {
              this.materi.push(item);
            })
          }

          if(this.materi?.length > 0 && this.materi != null){
            this.materi.map(item => {
              // Checking whether image or not
              item.isImage = this.isCoverImage(item.cover);
            });
          }

          this.setupInfiniteScroll();
          this.isMateriLoadMore = false;
          this.isBusy = false
      }

    },
    isCoverImage(url) {
      if (url) {
        const imageExtensionRegex =
          /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
        return imageExtensionRegex.test(url);
      }
    },
    setupInfiniteScroll() {
        const isInfiniteScroll = (window.innerHeight + window.pageYOffset) <= (document.body.offsetHeight - 100)
        // Scrolled Screen Listener
        if (isInfiniteScroll && this.pagination.page < this.pagination.totalPages) window.addEventListener("scroll", this.handleScrolledScreen);
        
        // Auto Load More Without Scroll Screen
        else setTimeout(() => {
            this.loadMore()
        }, 50);
    },
    loadMore() {
        // Check is last page disabled load more
        if (this.pagination.page < this.pagination.totalPages) {

            this.isMateriLoadMore = true
            this.pagination.page += 1
            setTimeout(() => {
                this.fetchCourses()
            }, 50);

        } else this.isMateriLoadMore = false
        
    },
    handleScrolledScreen() { 
        this.endOfPage = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 100);
    },
    onClickMateri() {
        this.$router.push(`/dashboard/courses/library/materi/create`);
    },
    toggleDelete(data) {
        this.isModalConfirm = !this.isModalConfirm
        this.modalConfirmData.type = 'delete'

        if (this.isModalConfirm) {
            this.materiSelected = data;
            this.modalConfirmData.btnYesVariant = 'danger'
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Materi <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.materiSelected?.title }</span> ini?<h5>`
        } else {
            this.materiSelected = null
            this.modalConfirmData.description = ``
        }
    },
    deleteMateri() {
        this.isModalConfirmProcess = true
        this.modalConfirmData.btnYesTitle = `Loading...`
        this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Materi <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.materiSelected?.title }</span> ini?<h5>`

        this.$store.dispatch("Services/deleteModule", this.materiSelected?.id).then(() => {
            if (this.servicesState?.status) {
                this.pagination.page = 1
                this.fetchCourses();
                this.toggleDelete();
            } else {
                this.modalConfirmData.description += `</br><p class='text-danger'>${this.servicesState.message}</p>`
            }
            this.isModalConfirmProcess = false
            this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
        })
    },
    onClickEdit(item){
      this.$router.push(`edit/${item.title.toLowerCase().replace(" ", "-")}`);
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