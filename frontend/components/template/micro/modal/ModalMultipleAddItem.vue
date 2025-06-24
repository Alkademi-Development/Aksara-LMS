<template>
    <b-modal
        v-model="isModalOpen"
        :title="title"
        size="lg"
        centered
        hide-footer
    >
        <b-row>
            <b-col cols="12">
                <FilterForms 
                    :isBusy="isBusy"
                    :showFilter="false"
                    :sortItems="null"
                    :searchPlaceholder="'Cari berdasarkan nama / email'"
                    :mdSize="8"
                    :lgSize="6"
                    :isWrap="true"
                    @fetchFilters="fetchToggle"
                    @typingSearch="isBusy = $event"
                />
            </b-col>

            <b-col cols="12">
                <section id="multiple-select-table">
                    <b-table
                        id="datatables"
                        head-variant="light"
                        responsive
                        show-empty
                        tdClass="vertical-align: center"
                        :busy="isBusy"
                        :fields="fields"
                        :items="items"
                    >
                        <template #cell(checklist)="data">
                            <div class="w-100 text-center">
                                <input type="checkbox" :checked="data?.item?.checked" :value="stringifyJSON(data)" @click="updateSelectedItem">
                            </div>
                        </template>
                    </b-table>
                </section>
            </b-col>
            
            <b-col cols="12" class="mt-4">
                <b-row class="d-flex align-items-center">
                    <b-col cols="6">
                        <b-pagination
                            v-if="!isBusy"
                            align="left"
                            v-model="pagination.page"
                            :total-rows="pagination.totalItems"
                            :per-page="pagination.perPage"
                            @change="onUpdatePage"
                        ></b-pagination> 
                    </b-col>
                    <b-col cols="6">
                        <div class="d-flex flex-wrap justify-content-left justify-content-md-end box-button">
                            <b-button type="button" variant="primary" @click="$emit('onSave')">Pilih {{ totalModules }} Materi</b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-modal>
</template>

<script>
import FilterForms from '@/components/classrooms/micro/FilterForms.vue'

export default {
    components: {
        FilterForms
    },
    props: {
        onOpenModal: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        fields: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        },
        pagination: {
            type: Object,
            default: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            }
        },
        isBusy: {
            type: Boolean,
            default: true
        },
        totalModules: {
            type: Number,
            default: 0
        }
    },
    watch: {
        onOpenModal() {
            this.isModalOpen = this.onOpenModal
        },
        isModalOpen() {
            if (!this.isModalOpen) this.$emit('openModal')
        },
    },
    data() {
        return {
            isModalOpen: false,
            selectedItems: []
        }
    },
    methods: {
        stringifyJSON(value) {
            if (typeof value == 'object') return JSON.stringify(value)

            return value
        },
        updateSelectedItem() {
            this.selectedItems = []
            const checkboxesItems = document.querySelectorAll('#multiple-select-table input[type=checkbox]') || []
            checkboxesItems.forEach(checkbox => {
                const item = JSON.parse(checkbox?.value)?.item
                item['checked'] = checkbox?.checked ?? false
                this.selectedItems.push(item)
            })
            this.$emit('selectedItemsChanged', this.selectedItems)
        },
        onUpdatePage(val) {
            this.$emit('onChangePage', val)
        },
        fetchToggle({page, perPage, order, search}) {
            this.$emit('onSearch', search)
        },
    }
}
</script>
