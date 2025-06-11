<template>
    <div :class="`${containerClass}`">
        <div class="card border align-items-stretch">
            <div class="card-header">
                <div class="row d-flex align-items-center">
                    <div class="col-12 col-md-auto d-flex align-items-center mb-3 mb-md-0">
                        <h5 class="mb-0">{{ title }}</h5>
                    </div>
                    <div class="col text-right d-flex justify-content-end">
                        <ButtonDropdownFilter
                            v-if="!(!!classroomId)"
                            id="top-weekly-participant-filter"
                            toggleClass="px-3 py-1"
                            variant="outline-primary"
                            itemClass="text-limit limit-1"
                            menuClass="max-w--default"
                            refMenuClass="top-ranking-class"
                            :noDefaultValue="true"
                            :isLoaded="!isBusy"
                            :pagination="paginationFilter"
                            :isLoadMoreClass="isLoadMorePaginationFilter"
                            :items="filtersActiveClass?.length > 0 ? filtersActiveClass : [{label: 'Kelas'}]"
                            :selectedItem="selectedFilterValue"
                            :text="!!selectedFilterValue?.label ? truncateText(selectedFilterValue?.label) : 'Pilih Kelas'"
                            @onChange="filterClass"
                            @onChangePage="handleChangePage"
                        />
                    </div>
                </div>
            </div>
            <b-table
                id="datatables"
                class="max-scroll"
                head-variant="light"
                responsive
                outlined
                foot-variant="null"
                show-empty
                no-footer-sorting
                tdClass="vetical-align: middle"
                :fields="fields"
                :items="items"
                :busy="isBusy"
            >
                <template #table-busy>
                    <div class="text-center text-primary my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
                <template #cell(index)="data">
                    <span>{{ data?.index + 1 }}</span>
                </template>
                <template #cell(userName)="row">
                    <span 
                        @click="detailUser(row?.item)"
                        class="pointer"
                    >
                        <span class="font-weight-normal text-primary">
                            {{ row?.item?.name }}
                        </span>
                    </span>
                </template>
                <template #cell(classroomName)>
                    <span>{{ selectedFilterValue?.label }}</span>
                </template>
                <template #cell(score)="row">
                    <span>{{ row?.item?.averageScore }}</span>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
import { toEncrypt } from '~/commons/utils';
import ButtonDropdownFilter from '../../../buttons/ButtonDropdownFilter.vue';

export default {
    props: {
        activeClassroom: {
            type: Array,
            default: () => []
        },
        containerClass: {
            type: String,
            default: "col",
        },
        fields: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        },
        isBusy: {
            type: Boolean,
            default: true
        },
        isLoadMorePaginationFilter: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ""
        },
        selectedFilterValue: {
            type: Object,
            default: () => {}
        },
        classroomId: {
            type: Number,
            default: 0
        },
        classroomName: {
            type: String,
            default: null
        },
        paginationFilter: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            res: "",
            userKind: localStorage.getItem("user_kind"),
            selectedParticipantFilter: null
        };
    },
    components: { 
        ButtonDropdownFilter 
    },
    computed: {
        filtersActiveClass() {
            let activeClasses = []

            this.activeClassroom?.map((item) => {
                let objClass = {}

                objClass['label'] = item?.name
                objClass['value'] = item?.id

                activeClasses.push(objClass)
            })

            return activeClasses
        }
    },
    methods: {
        filterClass(filter) {
            this.$emit('onChangeFilter', filter)
        },
        detailUser(value) {
            const userId = value?.userId || value?.id
            localStorage.setItem('userId', toEncrypt(userId))

            this.$router.push(`/dashboard/students/${(value?.name.toLowerCase().replace(/\s/g, '-'))}`)
        },
        truncateText(str) {
            if (str?.length <=25) return str
            return str?.substring(0, 25) + '...'
        },
        handleChangePage(){
            this.$emit("onChangePageFilter");
        }
    }

}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
    .max-scroll{
        min-height: 395px !important;
        overflow: auto !important;

        ::-webkit-scrollbar{
            width:2px; height: 2px;
        }
    }
</style>