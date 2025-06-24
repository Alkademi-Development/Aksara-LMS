<template>
  <section>
    <h3 class="mb-3 title">{{ title }}</h3>
    <FilterForms
      v-if="showSearching"
      :pagination="pagination"
      :showSorting="false"
      :showFilter="false"
      :searchPlaceholder="'Cari berdasarkan nama siswa'"
      :isWrap="true"
      :mdSize="10"
      :lgSize="7"
      @fetchFilters="setSearching"
      @typingSearch="isLoading = $event"
    />

    <div class="wrapper-data">
      <div class="wrapper-table">
        <b-table
          borderless
          :items="itemsTable"
          show-empty
          :fields="fieldTable"
          responsive="sm"
          :busy="isLoading"
          :class="`rounded mb-0 bg-white ${isDividerRow ? 'divider-row' : ''}`"
        >
          <template #head()="data">
            <div class="header-table">
              <div class="label">{{ data?.label }}</div>
              <i v-if="showSorting" :class="`ri-arrow-up-line icon-sorting ${data?.field?.sort?.includes(sortBy) && sortBy.includes('desc') ? 'active' : ''}`" @click="sortingBy(data?.field)"></i>
            </div>
          </template>
          <template #cell(highest_score)="data">
            <template v-if="isSubmitted(data)">
                <template v-if="isAssessed(data)">
                    <template v-if="checkAssignment(data, 'link')">
                        <span v-if="checkAssignment(data, 'type') === 'studio' || checkAssignment(data, 'type') === 'form'" class="cursor-pointer name-link" @click="openTaskExternal(checkAssignment(data, 'link'), checkAssignment(data, 'type'))">{{ checkAssignment(data, "score") }}</span>
                        <a v-else :href="checkAssignment(data, 'link')" class="name-link" target="_blank">{{ checkAssignment(data, "score") }}</a>
                    </template>
                    <span v-else class="name-link">{{ checkAssignment(data, 'score') }}</span>
                </template>
                <template v-else>
                    <img src="/dashboard/assets/image/progressyellow.svg" width="16" />
                </template>
            </template>
            <template v-else>
                <i class="ri-subtract-fill" style="font-weight: 500"></i>
            </template>
          </template>
          <template #cell(score)="data">
            <img v-if="data?.item?.status == 'on_review'" src="/dashboard/assets/image/progressyellow.svg" width="16" />
            <span v-else>{{ data?.item?.score }}</span>
          </template>
          <template #cell(status)="data">
            <div :class="`status status--${setVariantStatus(data?.item?.status)}`">{{ setStatusHistory(data?.item?.status) }}</div>
          </template>
          <template #cell(action)="data">
            <div class="action" @click="handleActionDetail(data?.item)">Lihat Detail</div>
          </template>
          <template #cell(comment)="data">
            <div class="action action--icon" @click="handleActionComment(data?.item)">
              <i class="ri-eye-line"></i>
            </div>
          </template>
          <template #cell(submitted_at)="data">
            <span v-if="data?.item?.submitted_at">{{ data?.item?.submitted_at }}</span>
            <i v-else class="ri-subtract-fill" style="font-weight: 500"></i>
          </template>
          <template #table-busy>
            <div class="text-center text-danger">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #empty>
            <p class="empty-state my-2">{{ textEmptyData }}</p>
          </template>
        </b-table>
      </div>
      <PaginationBorderless
        :page="pagination?.page"
        :totalItems="pagination?.totalItems"
        :perPage="pagination?.perPage"
        :hideGotoEndButtons="true"
        @onPageChange="setPagination"
        class="pagination"
      />
    </div>

    <!-- Modal Alert -->
    <b-modal
      v-model="onAlert.show"
      scrollable
      centered
      hide-footer
      :title="onAlert.title"
      :size="onAlert?.img ? 'lg' : 'md'"
      id="modal-alert"
      :content-class="`${onAlert?.img ? 'modal-alert--image' : ''}`"
    >
      <img v-if="onAlert?.img" :src="onAlert?.img" class="w-100" alt="image-preview" />
      <div v-else-if="onAlert?.message" v-html="onAlert?.message"></div>
      <p v-else class="modal--empty-state mb-3">{{ onAlert?.emptyMessage }}</p>
    </b-modal>
  </section>
</template>

<script>
import FilterForms from '@/components/classrooms/micro/FilterForms.vue';
import PaginationBorderless from '@/components/template/micro/pagination/PaginationBorderless.vue';

import appToken from "~/api/app-token";

export default {
  components: {
    FilterForms,
    PaginationBorderless
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: "",
    },
    fieldTable: {
      type: Array,
      default: () => [],
    },
    itemsTable: {
      type: Array,
      default: () => [],
    },
    sortBy: {
      type: String,
      default: "",
    },
    textEmptyData: {
      type: String,
      default:"",
    },
    showSorting: {
      type: Boolean,
      default: false,
    },
    isDividerRow: {
      type: Boolean,
      default: true,
    },
    showSearching: {
      type: Boolean,
      default: false,
    }
  },
  data(){
    return{
      listStudentProgressModule: [],
      debounceTimeout: null,
      isOpenModalAlert: true,
      onAlert: {
        message: "",
        show: false,
        title: "",
        emptyMessage: "",
        img: "",
      }
    }
  },
  methods: {
    setSearching({page, perPage, sortBy, search, minimumScore, maximumScore}){
      this.$emit("changeLoadingState", true);

      // Remove timeout before
      clearTimeout(this.debounceTimeout);

      // set timeout, and if there is no typing in 300 ms, it's will running the code
      this.debounceTimeout = setTimeout(() => {
        this.$emit("setFilter", { keyword: search, page })
      }, 300);
    },
    setPagination(page){
      this.$emit("onPageChange", page);
    },
    sortingBy(data){
      const listSort = data?.sort;
      const sortKey = data?.sortKey;

      if(!sortKey){
        if(listSort.includes(this.sortBy)) this.$emit("onSortByChange", this.sortBy == "desc" ? "asc" : "desc")
        else this.$emit("onSortByChange", "desc");
      }else{
        if(listSort.includes(this.sortBy)) this.$emit("onSortByChange", this.sortBy.split(".").includes("desc") ? `${sortKey}.asc` : `${sortKey}.desc`)
        else this.$emit("onSortByChange", `${sortKey}.desc`);
      }
    },
    setStatusHistory(status){
      switch(status){
        case 'passed':
          return "Lulus";
        case 'not_passed':
          return "Belum Lulus";
        case "on_review":
          return "Sedang Direview";
        default:
          return status;
      }
    },
    setVariantStatus(status){
      switch(status){
        case 'passed':
          return "success";
        case 'not_passed':
          return "danger";
        case "on_review":
          return "warning";
        default:
          return "default";
      }
    },
    handleActionComment(data){
      this.setAlert({
        title: "Komentar Mentor",
        message: data?.comment,
        emptyMessage: "Tidak ada komentar yang diberikan",
        show: true,
      })
    },
    setAlert({ title, show, message, emptyMessage, img }){
      this.onAlert.title = title;
      this.onAlert.show = show;
      this.onAlert.message = message;
      this.onAlert.emptyMessage = emptyMessage;
      this.onAlert.img = img;
    },
    handleActionDetail(data){
      if(data?.typeOfAssignment == 'link' || data?.typeOfAssignment == 'file') window.open(data?.action, "_blank");
      // if(data?.typeOfAssignment == 'file') {
      //   this.setAlert({
      //     title: "Preview",
      //     message: "",
      //     emptyMessage: "",
      //     show: true,
      //     img: data?.action,
      //   })
      // }
      if(data?.typeOfAssignment == "form" || data?.typeOfAssignment == "studio") this.openTaskExternal(data?.action, data?.typeOfAssignment);
    },
    isSubmitted(data){
      return data?.item?.submitted_at;
    },
    isAssessed(data){
      return data?.item?.scored == 1;
    },
    checkAssignment(data, kind){
      if (kind === "score") return data?.item?.score;
      else if (kind === "type") return data?.item?.type;
      else if (kind === "link") return data?.item?.type === 'studio' || data?.item?.type === 'form' ? data?.item?.externalId : data?.item?.link;
    },
    async openTaskExternal(id, type){
        const responseId = "&responseId=" + id
        const redirectLms = "&redirectTo=" + window.location.href

        var urlTarget = ''
        if (type == 'studio') urlTarget = process.env.editorURL + `compiler?&metronomId=${id}` + redirectLms
        if (type == 'form') urlTarget = process.env.formURL + "/preview?" + responseId + redirectLms

        const baseUrl = process.env.alkademiAuth;
        const redirect = "&redirectTo=" + urlTarget;
        const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
        const codeToken = `&code=${await appToken?.getCode()}`
        const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
        const url = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;

        window.open(url, '_blank')
    },
  }
}
</script>


<style scoped lang="scss">
.title{
  font-size: 20px;
  font-weight: 600;
}

::v-deep .divider-row .b-table{
  tr{
    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  }

  tbody{
    tr:last-child{
      border: none !important;
    }
  }
}

::v-deep .b-table{
  thead{
    tr{
      border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
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
    font-weight: 500;
  }

  tr{
    border: none !important;
  }
}

.wrapper-table{
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, .1);
}

.header-table{
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

.pagination{
  margin: 24px 24px 24px 0px !important;
}

.name-link {
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  color: var(--bs-primary);

  &:hover {
      color: var(--bs-primary) !important;
  }
}

.status{
  font-size: 14px;
  font-weight: 500;
  padding: 8px;
  border-radius: 6px;
  width: max-content;


  &.status--warning{
    border: 1px solid #FFC55A !important;
    color: #FFC55A !important;
  }

  &.status--success{
    border: 1px solid var(--bs-success);
    color: var(--bs-success);
  }

  &.status--danger{
    border: 1px solid var(--bs-danger);
    color: var(--bs-danger);
  }

  &.status--default{
    border: 1px solid #6c757d;
    color: #6c757d;
  }
}

.action{
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  width: max-content;
  background: rgba(0, 0, 0, 0.05);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: .3s;
  
  &.action--icon{
    line-height: 0px;
  }

  &:hover{
    transform: translateY(-3px);
  }

  i{
    font-size: 20px;
  }
}

.modal--empty-state{
  color: var(--bs-light);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

::v-deep .modal-alert--image{
  .modal-body{
    padding: 0px !important;
  }
}
</style>