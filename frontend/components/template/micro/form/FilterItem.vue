<template>
  <div :class="`wrapper-filter ${typeFilter === 'checkbox' ? 'w-max-content' : 'w-default'}`">
    <!-- Type Select / Dropdown -->
    <template v-if="typeFilter == 'select'">
      <div class="filter-action d-flex align-items-center">
        <input
          :id="id"
          type="text"
          :placeholder="placeholder"
          v-model="keyword"
          autocomplete="off"
          @keyup="handleTyping"
          @click="isShowOptions = !isShowOptions"
        />
        <div class="filter-action--icon" @click="isShowOptions = !isShowOptions">
          <i :class="`ri-arrow-down-s-line ${isShowOptions ? 'icon-rotate' : ''}`"></i>
        </div>
      </div>
      <div v-show="isShowOptions" class="filter-options" ref="filterOptions">
        <div v-if="isLoadingData || isTyping" class="w-100 d-flex justify-content-center align-items-center filter-options--loading">
            <b-spinner label="Spinning" variant="primary"></b-spinner>
        </div>
        <template v-else-if="!isLoadingData">
          <template v-if="itemOptions?.length > 0">
            <div v-for="(option, index) in itemOptions" :key="`options-${index}`" class="filter-options--item" @click="onClickOption(option)"><span class="text-limit limit-1">{{ option?.value }}</span></div>
            <div v-if="isLoadingMore" class="w-100 d-flex justify-content-center align-items-center filter-options--loading">
                <b-spinner label="Spinning" variant="primary"></b-spinner>
            </div>
          </template>
          <template v-else>
            <div class="filter-options--item filter-options--empty text-center"><span class="text-limit limit-1">Tidak ada {{ label?.toLowerCase() }} {{ keyword }}</span></div>
          </template>
        </template>
      </div>
    </template>

    <!-- Type Checkbox -->
    <template v-else-if="typeFilter === 'checkbox'">
      <div :class="`filter-action filter-action--checkbox ${isCheckboxActive ? 'action-active' : ''}`" @click="handleCheckbox">
        <span>{{ label }}</span>
      </div>
    </template>

    <!-- Other type -->
    <template v-else>
      <div class="filter-action">
        <input
          :id="id"
          :type="typeFilter === 'number' ? 'number' : 'text'"
          :placeholder="placeholder"
          v-model="keyword"
          :min="typeFilter === 'number' ? 0 : undefined"
          :max="typeFilter === 'number' ? 100 : undefined"
          @input="handleTyping"
          autocomplete="off"
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => []
    },
    isLoadingMore: {
      type: Boolean,
      default: false,
    },
    isLoadingData: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    typeFilter: {
      type: String,
      default: "",
    },
    selectedItem: {
      type: [String, Number, Boolean],
      default: "",
    },
    withPaginationFilter: {
      type: Boolean,
      default: true,
    },
    withSearchFilter: {
      type: Boolean,
      default: true,
    },
    filterBy: {
      type: String,
      default: ""
    }
  },
  watch: {
    isLoadingData(state){
      if(!state && this.withPaginationFilter) this.setInfiniteScroll();
      this.isTyping = false;
    },
    options(data){
      this.itemOptions = data;
    },
    selectedItem(value){
      if(!value) this.isShowOptions = false;
      if(this.typeFilter == 'select'){
        const foundOption = this.options.find((option) => option.key == value);
        this.keyword = foundOption?.value ?? "";

        // to reset the options to the beginning again after searching for options
        if(!value) this.handleTyping();
      }else if(this.typeFilter == 'checkbox'){
        this.isCheckboxActive = !!value;
      }else{
        this.keyword = value;
      }
    },
  },
  data(){
    return{
      isShowOptions: false,
      itemOptions: [],
      keyword: "",
      debounceTimeout: null,
      isTyping: false,
      isCheckboxActive: false,
    }
  },
  mounted(){
    document.addEventListener('click', this.handleOutsideClick);
    this.itemOptions = this.options;
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    setInfiniteScroll(){
      const wrapperList = this.$refs.filterOptions;
      if(wrapperList){
          wrapperList.addEventListener("scroll", () => {
              const isBottom = Math.floor(wrapperList?.scrollHeight) - Math.floor(wrapperList?.scrollTop) <= Math.floor(wrapperList?.clientHeight) + 1;
              if(isBottom && this.pagination?.page < this.pagination?.totalPages && !this.isLoadingMore){
                  this.$emit("onChangePage");
              }
          })
      }
    },
    onClickOption(option){
      this.isShowOptions = false;
      this.$emit('applyFilter', option);
    },
    handleTyping(){
      if(this.withSearchFilter){
        // Remove timeout before
        clearTimeout(this.debounceTimeout);

        // Set animation loading
        this.isTyping = true;

        // set timeout, and if there is no typing in 300 ms, it's will fetch data blog
        this.debounceTimeout = setTimeout(() => {
      if (this.typeFilter === 'select') {
        this.$emit("searchOption", this.keyword);
      } else if (this.typeFilter === 'number') {
        // Pembatasan input angka antara 0 dan 100
        if (this.keyword < 0) this.keyword = 0;
        if (this.keyword > 100) this.keyword = 100;
        this.$emit("applyFilter", this.keyword);
      } else {
        this.$emit("applyFilter", this.keyword);
      }
      }, 300);
      }else{
        if(this.keyword){
          this.itemOptions = this.options.filter((option) => {
            return option.value.toLowerCase().includes(this.keyword?.toLowerCase());
          })
        }else{
          this.itemOptions = this.options;
        }
      }
    },
    handleCheckbox(){
      this.isCheckboxActive = !this.isCheckboxActive;
      this.$emit("applyFilter", this.isCheckboxActive);
    },
    handleOutsideClick(event) {
      const dropdown = this.$el.querySelector('.filter-action');
      if (dropdown && !dropdown.contains(event.target)) {
        this.isShowOptions = false; // Tutup dropdown
      }
    },
  }
}
</script>


<style scoped lang="scss">
@import "@/assets/scss/components/micro/forms/filter-item.scss";
</style>
