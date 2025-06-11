<template>
  <section>
    <h3 class="mb-3">Statistik Belajar</h3>
    <FilterForms
      :isBusy="isFilterBusy"
      :pagination="pagination"
      :showSorting="false"
      :showFilter="false"
      :searchPlaceholder="'Cari berdasarkan nama siswa'"
      :isWrap="true"
      :mdSize="10"
      :lgSize="7"
      @fetchFilters="setSearching"
      @typingSearch="isBusy = $event"
    />

    <div class="wrapper-table-statistic">
      <div class="wrapper-table-statistic--table">
        <b-table
          borderless
          :items="items"
          show-empty
          :fields="fields"
          responsive="sm"
          :busy="isLoadingStatistic"
          class="rounded mb-0 bg-white"
        >
          <template #head()="data">
            <div class="header-table--statistic">
              <div class="label">{{ data?.label }}</div>
              <i :class="`ri-arrow-up-line icon-sorting ${data?.field?.sort?.includes(sortBy) && sortBy.includes('desc') ? 'active' : ''}`" @click="sortingBy(data?.field)"></i>
            </div>
          </template>
          <template #cell(updated_at)="data">
            <span v-if="data?.item?.updated_at">{{ data?.item?.updated_at }}</span>
            <i v-else class="ri-subtract-fill" style="font-weight: 500"></i>
          </template>
          <template #table-busy>
            <div class="text-center text-danger">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #empty>
            <p class="empty-state my-2">Belum ada data siswa yang tersedia</p>
          </template>
        </b-table>
      </div>
      <PaginationBorderless
        :page="pagination?.page"
        :totalItems="pagination?.totalItems"
        :perPage="pagination?.perPage"
        :hideGotoEndButtons="true"
        @onPageChange="setPagination"
        class="statistic-pagination"
      />
    </div>
  </section>
</template>

<script>
import { SORT_COURSES_FROM_CLASS } from '@/commons/constants/filters';
import { FIELDS_FILTER_ASSIGNMENT } from '@/commons/constants/forms';
import { mapActions, mapState } from "vuex";
import { toDate } from "@/commons/utils/.";

// Components
import FilterForms from '@/components/classrooms/micro/FilterForms.vue'
import PaginationBorderless from '@/components/template/micro/pagination/PaginationBorderless.vue';

export default {
  props: {
    isLoadedContent: {
      type: Boolean,
      default: false,
    },
    detailModule: {
      type: Object,
      default: () => {},
    },
    classroomDetail: {
      type: Object,
      default: () => {},
    },
    isFetchStatistic: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    FilterForms,
    PaginationBorderless
  },
  computed: {
    ...mapState({
      statisticsState: (state) => state?.Statistics,
    }),
    isLoadingStatistic(){
      return this.isBusy || !this.isLoadedContent;
    },
  },
  watch: {
    isFetchStatistic(state){
      if(state) this.fetchStudentProgressModule();
    },
    sortBy(){
      this.pagination.page = 1;
      this.isFiltering = true;
      this.fetchStudentProgressModule()
    },
  },
  data(){
    return{
      isFilterBusy: true,
      pagination: {
          page: 1,
          perPage: 10,
          totalItems: 0,
          totalPages: 0,
      },
      sortCoursesFromClass: SORT_COURSES_FROM_CLASS,
      filterFields: FIELDS_FILTER_ASSIGNMENT,
      /**
       * name.asc, name.desc -> name student
       * asc, desc (default) -> progress
       * date.asc, date.desc -> last update
       */
      sortBy: 'desc',
      fields: [
        { key: 'name', label: "Nama Siswa", sort: ['name.asc', 'name.desc'], sortKey: "name" },
        { key: 'progress', label: "Progress", sort: ['asc', 'desc'] },
        { key: 'updated_at', label: "Last Update", sort: ['date.asc', 'date.desc'], sortKey: "date" },
      ],
      items: [],
      listStudentProgressModule: [],
      debounceTimeout: null,
      keyword: "",

      isBusy: false,
      isFiltering: false,
    }
  },
  methods:{
    ...mapActions({
        fetchListStudentProgressModule: 'Statistics/fetchListStudentProgressModule',
    }),
    async fetchStudentProgressModule(){
      this.isBusy = true;
      
      const params = {
        page: this.pagination?.page,
        pageSize: this.pagination?.perPage,
        order: this.sortBy,
        moduleId: this.detailModule?.id,
        classroomId: this.classroomDetail?.id,
        keyword: this.keyword,
      }

      await this.fetchListStudentProgressModule(params);

      if(!this.statisticsState?.status){
        console.error("Failed to fetch progress student module : " + this.statisticsState?.message);
        this.pagination.page = 1;
        this.pagination.totalItems = 1;
        this.isBusy = false;
        this.isSorting = false;
      }else{
        const response = this.statisticsState?.listStudentProgressModule;
        this.listStudentProgressModule = response?.items;

        // If sorting we set the items to empty array, so to avoid duplicate data
        if(this.isFiltering) this.items = [];

        // Set Data Student that will show to the table
        this.listStudentProgressModule?.map((student) => {
          this.items.push({
            name: student?.name,
            progress: `${student?.progress}%`,
            updated_at: student?.updated_at || student?.updated_at !== null ? toDate(student?.updated_at, null, { country: "id-ID", type: "long" }) : null,
          });
        });

        // Set Pagination
        this.pagination.page = response?.page ?? this.pagination?.page;
        this.pagination.perPage = response?.perPage ?? this.pagination.perPage;
        this.pagination.totalItems = response?.totalItems ?? this.pagination.totalItems;
        this.pagination.totalPages = response?.totalPages ?? this.pagination.totalPages;

        this.isBusy = false;
        this.isFiltering = false;
      }
    },
    sortingBy(data){
      const sortName = data?.key;
      const listSort = data?.sort;
      const sortKey = data?.sortKey;

      if(sortName == "progress"){
        if(listSort.includes(this.sortBy)) this.sortBy = this.sortBy == "desc" ? "asc" : "desc";
        else this.sortBy = "desc";
      }else{
        if(listSort.includes(this.sortBy)) this.sortBy = this.sortBy.split(".").includes("desc") ? `${sortKey}.asc` : `${sortKey}.desc`;
        else this.sortBy = `${sortKey}.desc`;
      }
    },
    setPagination(page){
      this.pagination.page = page;
      this.isFiltering = true;
      this.fetchStudentProgressModule();
    },
    setSearching({page, perPage, sortBy, search, minimumScore, maximumScore}){
      this.isBusy = true;

      // Remove timeout before
      clearTimeout(this.debounceTimeout);

      // set timeout, and if there is no typing in 300 ms, it's will running the code
      this.debounceTimeout = setTimeout(() => {
        this.keyword = search;
        this.pagination.page = 1;
        this.isFiltering = true;
        this.fetchStudentProgressModule();
      }, 300);
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .b-table{
  thead{
    tr{
      border-bottom: 1px solid rgba(0, 0, 0, .05) !important;
    }

    th{
      font-weight: 600;
      color: rgb(0, 0, 0);
      text-transform: capitalize;
      letter-spacing: normal;
    }
  }

  td{
    color: rgb(0, 0, 0);
  }

  tr{
    border: none !important;
  }
}

.wrapper-table-statistic--table{
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, .1);
}

.header-table--statistic{
  display: flex;
  align-items: center;
  gap: 10px;

  .label, .icon-sorting{
    font-weight: 600;
    text-transform: capitalize;
    letter-spacing: normal;
  }

  .label{
    color: rgb(0, 0, 0);
  }

  .icon-sorting{
    width: auto;
    height: auto;
    cursor: pointer;
    color: #B3B3B3;

    &.active{
      color: rgb(0, 0, 0);
    }
  }
}

.empty-state{
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: rgba(0,0,0,.65);
}

.statistic-pagination{
  margin: 24px 24px 24px 0px !important;
}

</style>