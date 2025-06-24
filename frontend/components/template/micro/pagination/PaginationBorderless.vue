<template>
  <b-pagination
    :value="page"
    :total-rows="totalItems"
    :per-page="perPage"
    :hide-goto-end-buttons="hideGotoEndButtons"
    @change="onPageChange"
    class="pagination-borderless"
  >
  </b-pagination>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1,
    },
    totalItems: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 1,
    },
    hideGotoEndButtons: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    onPageChange(page){
      this.$emit("onPageChange", page);
    }
  }
}
</script>


<style lang="scss" scoped>
.pagination-borderless ::v-deep{
  .page-item [aria-label="Go to previous page"].page-link,
  .page-item [aria-label="Go to next page"].page-link{
    font-size: 20px;
  }

  .page-item .page-link{
    font-size: 14px;
    border: none;
    background-color: transparent;
    border-radius: 0%!important;
    font-weight: 600;
  }
  .page-item.active .page-link{
    border: none;
    border-bottom: 2px solid var(--bs-primary);
    box-shadow: none;
    color: var(--bs-primary);
  }
}
</style>