<template>
  <section class="header-editor">

    <div class="header-editor-content position-relative">

      <div class="d-flex align-items-center wrapper-brand">
        <i class="ri-arrow-left-line back" @click="back"></i>
        <nuxt-link to="/dashboard/newsletter" class="d-md-inline">
          <img v-if="logo?.primary" :src="logo?.primary" :class="`navbar-brand-img d-none d-xl-flex ${isSizeImageNotDefault ? 'navbar-brand-img--md' : ''}`" alt="Primary Logo">
          <img v-if="logo?.short" :src="logo?.short" :class="`navbar-brand-img d-none d-lg-flex d-xl-none ${isSizeImageNotDefault ? 'navbar-brand-img--md' : ''}`" alt="Short Logo">
        </nuxt-link>
      </div>

      <div class="d-flex gap-2">
        <!-- Desktop Version -->
        <div class="d-none d-flex wrapper-content">
            <div v-if="startAutoSave" class="wrapper-state__autosave d-flex align-items-center gap-2">
              <p :class="['mb-0', stateOfAutoSave?.customStyleText]">{{ stateOfAutoSave?.label }}</p>
              <i :class="[stateOfAutoSave?.icon, stateOfAutoSave?.customStyleIcon]"></i>
            </div>
            <div class="d-lg-flex gap-4">

              <div class="d-none d-md-flex align-items-center">
                <b-dropdown
                  :text="$options.filters.truncateWords(selectedClass?.label || 'Pilih Kelas', 2)"
                  variant="outline"
                  right
                  toggle-class="w-100 custom-select text-limit limit-1"
                  class="wrapper-dropdown style-2"
                  menu-class="dropdown-menu-auto-width"
                  @shown="setInfiniteScroll"
                >
                  <b-form-input
                    v-model="searchClass"
                    placeholder="Cari kelas..."
                    class="mx-3 my-2 w-auto"
                    style="width: 90% !important;"
                    @input="debouncedSearchClass"
                  />

                  <b-dropdown-item
                    v-for="(item, idx) in filteredClasses"
                    :key="idx"
                    @click="handleSelectedClass(item)"
                    :disabled="item?.value == selectedClass?.value"
                    class="style-2 w-100"
                  >
                    {{ item?.label | truncate }}
                  </b-dropdown-item>

                  <b-dropdown-item v-if="filteredClasses.length === 0" disabled>
                    Tidak ada hasil
                  </b-dropdown-item>

                  <div v-if="isLoadMoreClass" class="w-auto d-flex justify-content-center align-items-center py-2">
                    <b-spinner label="Spinning" variant="primary" style="width: 25px; height: 25px;"></b-spinner>
                  </div>
                </b-dropdown>
                <b-form-group
                  label-for="filter-select"
                  class="mb-0"
                  label-cols="auto"
                >
                  <b-form-select
                    id="filter-select"
                    v-model="selectedFilter.gender"
                    :options="genderOptions"
                    @change="handleFilterChange"
                    class="w-auto"
                  >
                    <template #first>
                      <option disabled value="">Pilih Gender</option>
                    </template>
                  </b-form-select>
                </b-form-group>
                <b-dropdown
                  :text="selectedCityLabel || 'Pilih Kota'"
                  variant="outline"
                  right
                  toggle-class="w-100 custom-select text-limit limit-1"
                  class="wrapper-dropdown style-2 ml-2"
                  menu-class="dropdown-menu-auto-width"
                >
                  <b-form-input
                    v-model="searchCity"
                    placeholder="Cari kota..."
                    class="mx-3 my-2 w-auto"
                    style="width: 90% !important;"
                    @click.stop
                    @keydown.stop
                  />

                  <b-dropdown-item
                    v-for="city in filteredCities"
                    :key="city.value"
                    @click="selectCity(city)"
                  >
                    {{ city.text }}
                  </b-dropdown-item>

                  <b-dropdown-item v-if="filteredCities.length === 0" disabled>
                    Tidak ada hasil
                  </b-dropdown-item>
                </b-dropdown>
              </div>

              <div class="d-none d-xl-flex gap-4 wrapper-export-import">
                <b-button variant="primary" class="mr-0 d-flex align-items-center gap-2" @click="openFileExplorer" :disabled="isDisableButtonAction">
                  <span style="font-size: 12px;">Import Document</span>
                  <input type="file" class="d-none" ref="fieldImport" @change="handleFileSelected" />
                </b-button>
              </div>

              <!-- Save Button Topic -->
              <b-button variant="outline-primary" class="d-none d-xl-block mr-0" @click="saveNewsletter('release', true)" :disabled="isDisableButtonAction">Simpan dan Terbitkan Newsletter</b-button>
            </div>
        </div>
        <!-- Mobile Version -->
        <div class="d-flex gap-2 position-relative wrapper-action">
          <div class="d-md-none d-flex cursor-pointer action-save border" @click="showMobileFilters = !showMobileFilters">
            <i class="ri-filter-line"></i>
          </div>
          <b-collapse v-model="showMobileFilters" class="wrapper-collapse border position-absolute bg-white">
            <div class="wrapper-list p-3 d-flex flex-column gap-2">
              <b-dropdown
                id="classroom-newsletter-filter"
                :text="$options.filters.truncateWords(selectedClass?.label || 'Pilih Kelas', 2)"
                variant="outline"
                right
                toggle-class="w-100 custom-select text-limit limit-1"
                class="wrapper-dropdown style-2"
                menu-class="dropdown-menu-auto-width"
                :disabled="classroomOptions?.length > 0 ? false : true"
                @shown="setInfiniteScroll"
              >
                <b-dropdown-item
                  v-for="(item, idx) in classroomOptions"
                  :key="idx"
                  :value="item?.value"
                  @click="handleSelectedClass(item)"
                  :disabled="item?.value == selectedClass?.value"
                  class="style-2 w-100"
                >
                  {{ item?.label | truncate }}
                </b-dropdown-item>

                <div v-if="isLoadMoreClass" class="w-auto d-flex justify-content-center align-items-center py-2">
                  <b-spinner label="Spinning" variant="primary" style="width: 25px; height: 25px;"></b-spinner>
                </div>
              </b-dropdown>
              <b-dropdown
                  :text="selectedCityLabel || 'Pilih Kota'"
                  variant="outline"
                  left
                  toggle-class="w-100 custom-select text-limit limit-1"
                  class="wrapper-dropdown style-2 ml-lg-2"
                  menu-class="dropdown-menu-auto-width"
                >
                  <b-form-input
                    v-model="searchCity"
                    placeholder="Cari kota..."
                    class="mx-3 my-2 w-auto"
                    style="width: 90% !important;"
                    @click.stop
                    @keydown.stop
                  />

                  <b-dropdown-item
                    v-for="city in filteredCities"
                    :key="city.value"
                    @click="selectCity(city)"
                  >
                    {{ city.text }}
                  </b-dropdown-item>

                  <b-dropdown-item v-if="filteredCities.length === 0" disabled>
                    Tidak ada hasil
                  </b-dropdown-item>
                </b-dropdown>

                <b-form-select
                  v-model="selectedFilter.gender"
                  :options="genderOptions"
                  @change="handleFilterChange"
                >
                  <template #first>
                    <option disabled value="">Pilih Gender</option>
                  </template>
                </b-form-select>
            </div>
          </b-collapse>
          <div class="d-xl-none cursor-pointer action-save border" @click="openFileExplorer" :disabled="isDisableButtonAction">
            <i class="ri-download-2-fill"></i>
          </div>
          <div v-b-toggle.collapse-1 class="d-xl-none action-save border">
            <i class="ri-save-line"></i>
          </div>

          <b-collapse id="collapse-1" class="wrapper-collapse border position-absolute bg-white">
            <div class="wrapper-list">
              <div class="list-item" @click="saveNewsletter('release', true)" :disabled="isDisableButtonAction">Simpan dan Terbitkan Newslette</div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapState } from "vuex";
import IMAGES_BRAND from "~/commons/constants/images";


// Mixins
import useImportDocument from "~/mixins/useImportDocument";

export default {
  mixins: [useImportDocument],
  props: {
    isBusy: {
      type: Boolean,
      default: false,
    },
    editor: {
      type: Object,
      default: () => {},
    },
    newsletterDetail: {
      type: Object,
      default: () => {}
    },
    featureAction: {
      type: String,
      default: "",
    },
    startAutoSave: {
      type: Boolean,
      default: false,
    },
    stateOfAutoSave: {
      type: Object,
      default: () => {}
    },
  },
  filters: {
    truncate(str) {
      const clip = 155
      return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
    },
    truncateWords(str, maxWords = 2) {
      if (!str) return '';
      const words = str.trim().split(/\s+/);
      return words.slice(0, maxWords).join(' ') + (words.length > maxWords ? '...' : '');
    },
  },
  computed: {
    ...mapState({
      servicesState: (state) => state.Services,
      sassState: (state) => state.Sass,
      classroomsState: (state) => state?.Classrooms,
      cityState: (state) => state?.Cities,
    }),
    isSizeImageNotDefault(){
      return this.setting?.layout === 'sekolahbeta' || this.setting?.layout === 'alkademi';
    },
    isDisableButtonAction(){
      return this.stateOfAutoSave?.isLoadingAutoSave || this.isBusy;
    },
    selectedCityLabel() {
      const city = this.cities.find(c => c.value === this.selectedFilter.cityId);
      return city ? city.text : null;
    },
    filteredCities() {
      if (!this.searchCity) return this.cities;
      return this.cities.filter(city =>
        city.text.toLowerCase().includes(this.searchCity.toLowerCase())
      );
    },
    filteredClasses() {
      if (!this.searchClass) return this.classroomOptions;
      return this.classroomOptions.filter((classroom) =>
        classroom.label.toLowerCase().includes(this.searchClass.toLowerCase())
      );
    },
  },
  watch: {
    'sassState.settings': {
      handler(state){
        if(state) this.setLogo();
      },
      deep: true,
    },
  },
  created() {
      this.initiateComponent();
      this.fetchCities()
  },
  mounted() {
    this.fetchListClassrooms();
  },
  data() {
    return {
      setting: null,
      title: document.location.hostname,
      logo: {
        primary: null,
        short: null,
      },
      isLoadingExport: false,
      userRole: null,

      // Import
      fileImport: null,

      showMobileFilters: false,
      selectedFilter: {
        gender: '',
        cityId: '',
      },

      searchCity: '',
      cities: [],

      // Filter Options by Role
      roleOptions: [
        { value: 10, text: 'Semua User' },
        { value: 1, text: 'Admin' },
        { value: 2, text: 'Mentor' },
        { value: 3, text: 'Guru' },
        { value: 4, text: 'Siswa' },
        { value: 6, text: 'Content Writer' },
        { value: 7, text: 'Lead Program' },
        { value: 8, text: 'Lead Region' },
        { value: 9, text: 'Partner' },
      ],

      // Filter Gender by Options
      genderOptions: [
        { value: 'all', text: 'Semua Jenis Kelamin' },
        { value: 'l', text: 'Laki-Laki' },
        { value: 'p', text: 'Perempuan' },
      ],

      // Filter Target by Classrooms
      pagination: {
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
      selectedClass: null,
      isLoadedClass: false,
      searchClass: '',
      classrooms: null,
      classroomOptions: [],
      isLoadMoreClass: false,
    }
  },
  methods: {
    async fetchCities(){
        await this.$store.dispatch('Cities/getLocationCities')

        if (!this.cityState.status) {
            console.error('Failed get cities', this.cityState.message);
        } else {
            let city = [];

            for (let index = 0; index < this.cityState.cities.length; index++) {
              city.push({ text: this.cityState.cities[index].name, value: this.cityState.cities[index].id })
            }

            this.cities = city;
        }
    },
    async fetchListClassrooms(){
      this.isLoadedClass = false; // Disable dropdown during fetch

      const params = {
        page: this.pagination?.page,
        perPage: this.pagination?.perPage,
        search: this.searchClass, // Include the search parameter
      };

      await this.$store?.dispatch("Services/classrooms", params);

      if (!this.servicesState?.status) {
        console.error("Failed to fetch list classrooms: " + this.servicesState?.message);
        this.isLoadedClass = true; // Re-enable dropdown even if fetch fails
      } else {
        this.classrooms = this.servicesState?.classrooms;

        const paginationClass = this.servicesState?.pagination;

        this.pagination.page = paginationClass?.page;
        this.pagination.perPage = paginationClass?.perPage;
        this.pagination.totalItems = paginationClass?.totalItems;
        this.pagination.totalPages = paginationClass?.totalPages;

        this.classroomOptions = this.classrooms.map((item) => ({
          label: item?.name,
          slug: item?.slug,
          value: item?.id,
        }));

        if (this.classroomOptions.length === 0) {
          this.classroomOptions.push({ label: "Belum ada kelas!", value: -1 });
        }

        this.isLoadedClass = true; // Re-enable dropdown after fetch completes
      }
    },
    selectCity(city) {
      this.selectedFilter.cityId = city.value;
      this.handleFilterChange();
    },
    debouncedSearchClass: debounce(function () {
      this.handleSearchClass();
    }, 200),
    handleSearchClass() {
      this.pagination.page = 1; // Reset the page to the first page
      this.classroomOptions = []; // Clear existing classroom options
      this.fetchListClassrooms(); // Fetch classrooms based on the current search
    },
    handleSelectedCity(item) {
      this.selectedFilter.cityId = item.value;
      this.handleFilterChange(); // trigger emit if needed
    },

    getCityLabelById(value) {
      const city = this.cities.find((item) => item.value === value);
      return city ? city.label : '';
    },
    setInfiniteScroll(){
      this.$nextTick(() => {
        const wrapperList = document.querySelector(`.wrapper-dropdown .dropdown-menu`);
        if (wrapperList && !wrapperList._infiniteScrollBound) {
          wrapperList._infiniteScrollBound = true;

          wrapperList.addEventListener("scroll", () => {
            const isBottom =
            Math.floor(wrapperList.scrollHeight) - Math.floor(wrapperList.scrollTop) <=
            Math.floor(wrapperList.clientHeight) + 1;

            if (isBottom && this.pagination.page < this.pagination.totalPages && !this.isLoadMoreClass) {
              this.handlePaginationClass();
            }
          });
        }
      })
    },
    handlePaginationClass(){
      this.pagination.page += 1;
      this.isLoadMoreClass = true;
      this.fetchListClassrooms();
    },
    saveNewsletter(state, isPublish = false){
      this.$emit("onClickSave", state, isPublish);
    },
    /**
     * Initialization data or fetch api that needed in this component
     */
    initiateComponent(){
      this.initiateData();
      this.setLogo();
    },

    /**
     * Initializatio data that needed in this component
     */
     initiateData(){
      this.setting = this.sassState.settings;
      this.title = this.setting?.title ?? document.location.hostname;
      this.userRole = localStorage.getItem("user_kind");
    },

    handleFilterChange() {
      this.$emit('filterChanged', this.selectedFilter);
    },
    handleSelectedClass(item) {
      this.selectedClass = item;
      this.$emit("selectedClass", this.selectedClass);
    },

    /**
     * set logo in header that will get the data in server or while fetch data setting
     */
    setLogo(){
      this.logo.primary = this.setting?.logo_dark;
      if(this.setting?.layout === 'sekolahbeta') this.logo.short = this.setting?.logo_dark;
      else this.logo.short = IMAGES_BRAND?.[this.setting?.layout]?.short;
    },

    /**
     * Open File Explorer when clicked import button
     */
    openFileExplorer() {
      this.$refs.fieldImport.click();
    },

    /**
     * logic when user selected the file
     *
     * @param {Object} event - Object event that represent from a DOM event
     */
     async handleFileSelected(event) {
      this.fileImport = event.target.files[0];
      if(this.fileImport) this.importTopic();

      // Reset file input to to can select the same file
      this.$refs.fieldImport.value = null;
    },

    /**
     * To Import Document
     */
     async importTopic(){
      // Set Loading
      this.$store.dispatch("Courses/setLoadingImportDocument", true);
      this.$emit("importing");

      try{
        const response = await this.importDocument(this.fileImport);

        if(!response.status){
          console.error("Failed to import : " + response?.message.title);
          let onToast = {
            title: response?.message.title,
            description: response?.message.description,
            isShow: true,
          }

          this.$emit("callbackImport", {
            status: false,
            data: onToast,
          });
        }else{
          const content = this.removeParagraphWrapper(response.data);
          this.$emit("callbackImport", {
            status: true,
            data: content,
          });
          // this.$store.dispatch("Courses/setLoadingImportDocument", false)
        }
      }catch(error){
        console.error(error);
      }
    },

    removeParagraphWrapper(html) {
      // Ganti <p><img></p> menjadi <img>
      return html.replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, '$1');
    },

    back() {
      this.$router.replace("/dashboard/newsletter")
    },
  },
}
</script>

<style scoped lang="scss">
.header-editor{
  background-color: white;
  padding: 15px 30px;
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 999;
  height: max-content;
  border-bottom: 1px solid rgba(0, 0, 0, .08);

  @media (min-width: 992px) {
    padding: 15px 50px;
  }

  .wrapper-brand{
    gap: 15px;
  }

  .wrapper-action{

    .btn-undo, .btn-redo{
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover,
      &.is-active{
        background: rgb(227, 227, 227);
      }

      i{
        color: rgb(107, 107, 107);
        font-size: 24px;
      }
    }

    span{
      font-size: 24px;
      color: rgb(107, 107, 107);
    }
  }

  .back{
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }

  .wrapper-content{
    gap: 15px;
  }

  .character-count{
    display: flex;
    flex-direction: column;
    align-items: end;
    border-right: 1px solid #cbcbcb;
    padding-right: 15px;


    p{
      font-family: var(--bs-font-paragraph), sans-serif;
      font-size: 14px;
      line-height: 150%;
      margin: 0;
      color: #313131;
    }
  }

  .header-editor-content{
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navbar-brand-img{
      max-width: 200px;
      max-height: 40px;
      object-fit: contain;

      @media (min-width: 992px) {
        &.navbar-brand-img--md{
          max-width: 200px;
          max-height: 48px;
        }
      }
    }
  }

  .wrapper-btn{
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .wrapper-state__autosave{
    p{
      font-weight: 400;
    }

    i{

      &.animate-load{
        animation-name: animateRotate;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }

      font-size: 18px;
      line-height: 0;
      columns: black;
    }
  }

  @keyframes animateRotate {
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
}

.wrapper-action{
  .action-save{
    // border: 1px solid var(--bs-light);
    line-height: 0px;
    padding: 10px;
    border-radius: 6px;

    i{
      font-size: 18px;
    }
  }

  .wrapper-collapse{
    width: max-content;
    top: 100%;
    right: 0;
    margin-top: 6px;
    // box-shadow: 0 2px 5px rgba(0, 0, 0, .15);
    border-radius: 6px;

    .wrapper-list{
      .list-item{
        padding: 12px;
        cursor: pointer;

        &:hover{
          background-color: rgb(237, 237, 237);
        }
      }
    }

  }
}

::v-deep(.dropdown-toggle) {
  padding: .625rem 1.75rem .625rem .75rem;

  &::after {
    display: none;
  }

  @media (max-width: 768px) {
    min-width: 100% !important;
    border: none !important;
    box-shadow: inset 0 1px 2px rgba(0,0,0,.075);
    color: black !important;
    font-size: .85rem !important;
    font-weight: 400 !important;
    text-align: left;

    &:hover {
      background-color: white !important;
    }
  }
}

#city-select {
  max-width: 200px !important; // atau sesuaikan dengan kebutuhan
}

.wrapper-export-import{
  border-right: 2px solid rgb(190, 190, 190);
  padding-right: 16px;
}

.wrapper-dropdown ::v-deep .dropdown-menu {
  transform: translateY(0) !important;
  margin-top: 2px !important;
  max-height: 300px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.wrapper-dropdown ::v-deep .dropdown-menu-auto-width {
  min-width: max-content;
  width: auto !important;
  max-width: none;
}

.btn-outline-primary.dropdown-toggle {
    color: unset !important;
}
</style>