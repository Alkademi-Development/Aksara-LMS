<template>
  <div :class="`${containerClass}`">
    <div class="card border">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                    <h5 class="mb-0">{{ title }}</h5>
                </div>
            </div>
        </div>
        <b-table
            id="datatables"
            class="pb-4 m-0"
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
            <template #cell(className)="row">
                <div class="d-flex flex-column">
                    <nuxt-link :to="`/dashboard/classroom/${row?.item?.id}`">
                        <h5>{{ row?.item?.name ?? '-' }}</h5>
                    </nuxt-link>
                    <!-- <div class="d-flex flex-row pb-1">
                        <span class="pr-2">{{ row?.item?.testDetail?.duration }} Minutes</span>
                        <span>{{ row?.item?.testDetail?.questionsCount }} Questions</span>
                    </div> -->
                    <div class="d-flex flex-row pt-2">
                        <span :class="`badge badge-${statusClass(row?.item?.classState)?.style}`">
                            {{ statusClass(row?.item?.classState)?.label ?? '-' }}
                        </span>
                        <span class="px-2">
                            {{ toDate(row?.item?.start) }} - {{ toDate(row?.item?.end) }}
                        </span>
                    </div>
                </div>
            </template>
            <template #cell(invited)="row">
                <span class="font-weight-bold">
                    {{ row?.item?.totalStudent ?? '-' }}
                    <i class="fa-regular fa-user"></i>
                </span>
            </template>
            <template #cell(notSubmitted)="row">
                <span class="font-weight-bold">
                    {{ row?.item?.onProgress ?? '-' }}
                    <i class="fa-regular fa-user"></i>
                </span>
            </template>
            <template #cell(submitted)="row">
                <span class="text-success font-weight-bold">
                    {{ row?.item?.finished ?? '-' }}
                    <i class="fa-regular fa-user"></i>
                </span>
            </template>
        </b-table>
    </div>
</div>
</template>

<script>
import { toDate, statusClass } from '@/commons/utils/.'

export default {
    props: {
        containerClass: {
            type: String,
            default: 'col',
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
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            res: "",
            userKind: localStorage.getItem('user_kind'),
        }
    },
    methods: {
        toDate,
        statusClass,
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
 