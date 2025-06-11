<template>
    <b-row align-v="center" class="mb-4">
        <b-col cols="12" :md="mdSize" :lg="lgSize">
            <div :class="`d-flex gap-3 flex-row align-items-center mb-3 mb-md-0 ${isWrap ? 'flex-wrap flex-sm-nowrap' : ''}`">
                <b-form class="filter-container d-flex flex-row align-items-center" @submit="onSubmitAction">
                    <template v-if="showSorting">
                        <button
                            v-if="!!sortItems"
                            id="dropdown-sort"
                            :class="`sort-button btn mr-0 ${isWrap && isSelected ? 'border-sm-right d-flex align-items-center w-100 w-max' : 'border-right'}`"
                            type="button" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                        >
                            <i class="ri-arrow-up-down-line"></i>
                            {{ !!selectedSort ? selectedSort?.label : 'Sort' }}
                            <i class="ri-arrow-drop-down-line"></i>
                        </button>
                        
                        <div 
                            aria-labelledby="dropdown-sort"
                            class="dropdown-menu dropdown-menu-left mt-3" 
                            style="z-index: 99;"
                        >
                            <template v-if="sortItems?.length > 0">
                                <div 
                                    class="dropdown-item" 
                                    v-for="(item, idx) in sortItems" 
                                    :key="idx"
                                    @click="onClickSort(item)"
                                >
                                    {{ item?.label }}
                                </div>
                            </template>
                            <template v-else>Belum Ada Item</template>
                        </div>
                    </template>
                    
                    <b-form-group
                        id="filter-input-group"
                        :class="`search-input ${isSelected ? 'd-none d-sm-block' : 'd-block'}`"
                    >
                        <div class="d-flex flex-row align-items-center">
                            <i class="ri-search-line ml-2" id="filter-input"></i>
                            <b-form-input
                                id="filter-input"
                                type="text"
                                :placeholder="searchPlaceholder"
                                v-model="searchQuery"
                            ></b-form-input>
                        </div>
                    </b-form-group>
                </b-form>

                <b-form :class="`filter-container flex-row align-items-center ${isSelected ? 'd-flex d-sm-none mt-2' : 'd-none'}`" @submit="onSubmitAction">
                    <b-form-group
                        id="filter-input-group"
                        class="search-input"
                    >
                        <div class="d-flex flex-row align-items-center">
                            <i class="ri-search-line ml-2" id="filter-input"></i>
                            <b-form-input
                                id="filter-input"
                                type="text"
                                :placeholder="searchPlaceholder"
                                v-model="searchQuery"
                            ></b-form-input>
                        </div>
                    </b-form-group>
                </b-form>
                <template v-if="showFilter">
                    <FilterItem
                        v-for="(filter, idx) in filterFields"
                        :id="`filter-${ filter?.id }`"
                        :key="`filter-${idx}`"
                        :options="filtersData?.[filter?.options]"
                        :typeFilter="filter?.type"
                        :placeholder="filter?.placeholder"
                        :filterBy="filter?.options"
                        :isLoadingData="stateLoading?.[filter?.options]?.data"
                        :isLoadingMore="stateLoading?.[filter?.options]?.pagination"
                        :pagination="filtersPagination?.[filter?.options]"
                        :selectedItem="selectedFilterBy?.[filter?.options]"
                        :withPaginationFilter="withPaginationFilter"
                        :withSearchFilter="withSearchFilter"
                        :label="filter?.label"
                        @onChangePage="$emit('onChangePage', filter?.options)"
                        @searchOption="$emit('searchOption', $event, filter?.options)"
                        @applyFilter="applyFilter(filter?.options, filter?.type == 'select' ? $event?.key : $event)"
                    />
                </template>
                <button 
                    v-if="!!selectedSort || countSelectedFilter > 0" 
                    :class="`btn btn-text-primary ${isSelected || isWrap ? 'mt-2 mt-sm-0' : ''}`" 
                    role="button" 
                    @click="onRemoveFilter()"
                >
                    Hapus Filter
                </button>
            </div>
        </b-col>

        <template v-if="showActionButtons && role !== 'teacher'">
            <b-col 
                class="d-flex flex-row justify-content-end gap-3">
                <div 
                    v-for="(action, idx) in actionButtons" 
                    :key="idx"
                >
                    <div v-if="action?.text != 'Keluarkan'">
                        <button 
                            v-if="action?.type === 'button'" 
                            :class="`${action?.isLoading ? 'btn--loading' : ''} ${action?.class}`"
                            :disabled="action?.isLoading" 
                            @click="action?.isAction ? onClickAction(action?.to) : onClickLink(action?.to)"
                        >
                            <div v-if="action?.isLoading" class="loading-state d-flex align-items-center gap-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Loading...</strong>
                            </div>
                            <template v-else>
                                <i 
                                    v-if="!!action?.iconClass" 
                                    :class="action?.iconClass">
                                </i>
                                {{ action?.text }}
                            </template>
                        </button>
                    </div>
                    <div v-else>
                        <button 
                            v-if="action?.type === 'button' && isCheckedBox && items.length > 0" 
                            :class="action?.class" 
                            @click="action?.isAction ? onClickAction(action?.to) : onClickLink(action?.to)"
                        >
                            <i 
                                v-if="!!action?.iconClass" 
                                :class="action?.iconClass">
                            </i>
                            {{ action?.text }}
                        </button>
                    </div>
                </div>
            </b-col>
        </template>
    </b-row>
</template>

<script>
import { mapState } from 'vuex'

import FilterItem from '@/components/template/micro/form/FilterItem.vue';
import SearchSelect from '@/components/template/micro/inputs/SearchSelect.vue';

// Mixins
import useDebounceMixin from '~/mixins/useDebounceMixin';

export default {
    mixins: [ useDebounceMixin ],
    props: {
        actionButtons: {
            type: Array,
            default: () => []
        },
        fields: {
            type: Array,
            default: () => []
        },
        isBusy: {
            type: Boolean,
            default: true
        },
        isCheckedBox: {
            type: Boolean,
        },
        pagination: {
            type: Object,
            default: () => {}
        },
        items: {
            type: Array,
            default: () => []
        },
        sortItems: {
            type: Array,
            default: () => []
        },
        searchPlaceholder: {
            type: String,
            default: ''
        },
        mdSize: {
            type: Number,
            default: 7
        },
        isWrap: {
            type: Boolean,
            default: false
        },
        lgSize: {
            type: Number,
            default: 7
        },
        showFilter: {
            type: Boolean,
            default: true
        },
        showActionButtons: {
            type: Boolean,
            default: true
        },
        showSorting: {
            type: Boolean,
            default: true,
        },
        valueOfSelectedSort: {
            type: Object,
            default: null,
        },
        valueOfSearchQuery: {
            type: String,
            default: "",
        },
        stateLoading: {
            type: Object,
            default: () => {}
        },
        filtersData: {
            type: Object,
            default: () => {}
        },
        filtersPagination: {
            type: Object,
            default: () => {}
        },
        withPaginationFilter: {
            type: Boolean,
            default: true,
        },
        withSearchFilter: {
            type: Boolean,
            default: true,
        }
    },
    components: {
        FilterItem,
        SearchSelect
    },
    data() {
        return {
            selectedSort: null,
            
            searchQuery: "",

            filterFields: [],

            selectedCategoryBundle: null,

            isSelected: false,
            role: localStorage.getItem('user_kind') == null ? this.$store.state.Sidebar.role : localStorage.getItem('user_kind'),

            selectedFilterBy: {},
            countSelectedFilter: 0,
            selectedItem: null,

            debounceTimeout: null, // For debouncing
        }
    },
    watch: {
        searchQuery() {
            this.useDebounce(() => {
                let params;

                if (this.role === 'lead_region') {
                    params = {
                        page: 1, 
                        perPage: this.pagination?.perPage, 
                        sortBy: this.selectedSort?.key, 
                        search: this.filterStr(this.searchQuery),
                        ...this.selectedFilterBy
                    }
                }else {
                    params = {
                        page: 1, 
                        perPage: this.pagination?.perPage, 
                        sortBy: this.selectedSort?.key, 
                        search: this.filterStr(this.searchQuery),
                        ...this.selectedFilterBy
                    }
                }
    
                this.$emit('fetchFilters', params)
            }, 300, () => {
                this.$emit("typingSearch", true);
            })
        },
        valueOfSelectedSort(sort){
            this.selectedSort = sort;
        },
        valueOfSearchQuery(search){
            this.searchQuery = search;
        },
        selectedFilterBy: {
            handler(filters){
                const arrFilters = Object.keys(filters);
                this.countSelectedFilter = arrFilters?.length;
            },
            deep: true,
        },
        fields() {
            this.filterFields = this.fields
        }
    },
    computed: {
        ...mapState({
            categoryBundle: (state) => state.Courses?.categories,
        }),
    },
    created() {
        this.filterFields = JSON.parse(JSON.stringify(this.fields));
    },
    methods: {
        emitSearchQuery(query) {
            let params;

            if (this.role === 'lead_region') {
                params = {
                    page: 1,
                    perPage: this.pagination?.perPage,
                    sortBy: this.selectedSort?.key,
                    search: this.filterStr(query),
                    ...this.selectedFilterBy,
                };
            } else {
                params = {
                    page: 1,
                    perPage: this.pagination?.perPage,
                    sortBy: this.selectedSort?.key,
                    search: this.filterStr(query),
                    ...this.selectedFilterBy,
                };
            }

            this.$emit('fetchFilters', params);
        },
        filterStr(str) {
            const charList = [
                { char: /;/g, val: '%3B' },
                { char: /#/g, val: '%23' },
                { char: /&/g, val: '%26' },
            ]

            let result = str
            if(result) charList.map(item => result = result.replace(item.char, item.val))
            return result
        },
        categoryBundleOptions() {
            let categories = []

            this.categoryBundle?.map((category) => {
                let value = category?.name
                if (value?.length > 18) value = value?.substring(0, 15) + '...'

                let tempProgram = {
                    key: category?.slug,
                    value
                }

                categories.push(tempProgram)
            })

            return categories;
        },

        /**
         * @param {string} filterBy - filter based on what, like based on roles, based on programs, etc
         * @param {string} filterValue - value of filter that want to apply
         */
        applyFilter(filterBy, filterValue) {           
            // Set Object Deepth so can reactive using $set
            this.$set(this.selectedFilterBy, filterBy, filterValue);

            const params = {
                page: this.pagination?.page, 
                perPage: this.pagination?.perPage, 
                sortBy: this.selectedSort?.key, 
                search: this.filterStr(this.searchQuery),
                ...this.selectedFilterBy
            }

            this.$emit('fetchFilters', params);
        },
        onClickSort(sort) {
            this.selectedSort = sort
            this.isSelected = true

            const params = {
                page: this.pagination?.page, 
                perPage: this.pagination?.perPage, 
                sortBy: this.selectedSort?.key, 
                search: this.filterStr(this.searchQuery),
                ...this.selectedFilterBy
            }

            this.$emit('fetchFilters', params)
        },
        onClickAction(action) {
            this.$emit(action)
        },
        onClickLink(link) {
            this.$router.push(link)
        },
        onRemoveFilter() {
            this.searchQuery = ''
            this.selectedSort = null
            this.isSelected = false;
            this.selectedFilterBy = {};

            if (!!this.filterFields) {
                this.filterFields.forEach(item => { item.value = ''; });
            }

            this.$emit('fetchFilters', {
                page: this.pagination?.page, 
                perPage: this.pagination?.perPage, 
                sortBy: null, 
                search: null,
            });
        },
        onSubmitAction(evt) {
            evt.preventDefault()
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/micro/forms/filter-forms.scss';
::v-deep .dropdown-menu {
    z-index: 6 !important;
}
.btn-soft-danger {
    background-color: rgba(245, 54, 92, .3);
    color: rgb(245, 54, 92);
}

@media screen and (min-width: 768px) {
    .filter-container {
        .w-max {
            width: max-content !important;
        }
    }
}

.loading-state{
    span{
        width: 14px;
        height: 14px;
        color: rgb(107, 107, 107);
    }

    strong{
        color: rgb(107, 107, 107);
    }
}

.btn--loading:hover{
    background-color: transparent !important;
}

</style>
