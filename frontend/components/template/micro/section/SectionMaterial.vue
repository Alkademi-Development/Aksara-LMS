<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="font-semibold">{{ titleOfSection }}</h2>
      <div class="d-flex align-items-center" style="gap: 20px;">
        <!-- <button class="btn btn-primary d-flex align-items-center" @click="onClickMateri">
            <i class="ri-add-fill mr-1"></i>
            Materi
        </button> -->
        <nuxt-link :to="navigationCourse" class="see-all text-primary">Lihat Semua</nuxt-link>
      </div>
    </div>
    <div>
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
        :lgSize="6"
        @typingSearch="isBusy = $event"
      />
    </div>
    <section id="section-course">
      <div v-if="!isBusy">
        <div v-if="materi?.length > 0 && materi != null" class="row mb-4" style="gap: 24px 0px">
          <template v-for="(item, index) in materi">
            <CardMaterial 
              :data="item"
              :key="index"
              @onEdit="onClickEdit($event)"
              @onDelete="toggleDelete($event)"
            />
          </template>
          <template v-for="index in 4">
            <div :key="index" v-if="isMateriLoadMore" class="col-12 col-md-6 col-lg-4">
              <div style="height: 330px;">
                <b-skeleton-img height="330px"></b-skeleton-img>
              </div>
            </div>
          </template>
        </div>
        <div v-else class="w-100 empty-bundle d-flex justify-content-center align-items-center">
          <p class="mb-0">Materi belum tersedia</p>
        </div>
      </div>
      <div v-else class="row">
        <div v-for="index in 6" :key="index" class="col-12 col-md-6 col-lg-4 mb-4">
          <div style="height: 330px;">
            <b-skeleton-img height="330px"></b-skeleton-img>
          </div>
        </div>
      </div>
      <div v-if="pagination?.totalItems > 6 && !isBusy" class="d-flex justify-content-center align-items-center">
        <div @click="gotoAllCourse" class="shadow bg-white px-6 py-2 text-primary cursor-pointer rounded btn-see-more">Lihat Semua</div>
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
import CardMaterial from "@/components/template/micro/card/CardMaterial.vue";
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';

import { mapState } from 'vuex';
import { FIELDS_FILTER_USERS } from '~/commons/constants/forms';
import { SORT_MATERI } from '~/commons/constants/filters';

export default {
    components: {
        CardMaterial,
        ModalConfirmation,
        FilterForms
    },
    props: {
      activeTab: {
        type: String,
        default: "",
      }
    },
    created(){
      // this.initialCourse();
      this.fetchCourses();
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        }),
        titleOfSection(){
          const tabActive = this.valueOfTabs.find(tab => tab.name == this.activeTab);
          return tabActive.title;
        },
        navigationCourse(){
          const tabActive = this.valueOfTabs.find(tab => tab.name == this.activeTab);
          return tabActive?.navigateAllCourses;
        },
        isShowButtonCreate(){
          // return this.activeTab === 'myCourses'
          return (this.userRole === 'superadmin' || this.userRole === "admin") && this.activeTab === 'library'
        }
    },
    watch: {
      endOfPage() {
          if (this.endOfPage) {
              window.removeEventListener("scroll", this.handleScrolledScreen)
              this.loadMore()
          }
      },
      activeTab(){
        this.fetchCourses();
      }
    },
    data(){
      return{
        role: 'module',
        materi: [],
        isBusy: false,
        pagination: {
          page: 1,
          pageSize: 6,
          totalItems: 0,
          totalPages: 0,
        },
        endOfPage: false,
        isMateriLoadMore: false,
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
        userRole: localStorage.getItem("user_kind"),
        valueOfTabs: [
          { name: 'library', title: "Materi", navigateAllCourses: "/dashboard/courses/materi" },
          { name: 'myCourses', title: "Materi Saya", navigateAllCourses: "/dashboard/courses/my-courses/materi" },
          { name: 'draft', title: "Materi Draft", navigateAllCourses: "/dashboard/courses/draft/materi" },
        ]
      }
    },
    methods: {
      gotoAllCourse(){
        if(this.searchQuery) localStorage.setItem("searchQuery", this.searchQuery);
        if(this.selectedSort) localStorage.setItem("selectedSort", this.selectedSort);
        this.$router.push(this.navigationCourse)
      },
      onClickMateri() {
        if(this.activeTab === 'library') this.$router.push(`/dashboard/courses/materi/create`);
        else if(this.activeTab === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/materi/create`);
      },
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
          type: this.role,
          search: !!this.searchQuery ? this.searchQuery : null,
          sort: !!this.selectedSort ? this.selectedSort : null,
        }

        if(this.activeTab === 'library') await this.$store.dispatch('Services/getListModulesLibrary', params)
        else if (this.activeTab === 'myCourses') await this.$store.dispatch('Services/modules', params);
        else if (this.activeTab === 'draft') await this.$store.dispatch('Services/getListModulesDraft', params);

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
            
            // this.setupInfiniteScroll();
            this.isMateriLoadMore = false;
            this.isBusy = false
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
        this.$router.push(`/dashboard/courses/edit/${item.title.toLowerCase().replace(" ", "-")}`);
      },
    }
};
</script>

<style scoped lang="scss">

.empty-bundle{
  height: 150px;

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

.btn-see-more{
  border: 1px solid var(--bs-primary);
  transition: .3s;

  &:hover{
    transform: translateY(-3px);
  }
}
</style>