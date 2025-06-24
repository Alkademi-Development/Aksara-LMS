<template>
  <div :class="`${containerClass}`">
    <div class="card border">
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
            <template #cell(index)="data">
                <span>{{ data?.index + 1 }}</span>
            </template>
            <template #cell(userName)="row">
                <nuxt-link 
                    :to="`/dashboard/students/${row?.item?.userId}`" 
                    style="font-size: 14px"
                >
                    <span class="font-weight-normal text-primary fs-1">
                        {{ row?.item?.userName }}
                    </span>
                </nuxt-link>
            </template>
            <template #cell(submitted_at)="row">
                <span>{{ toDate(row?.item?.submitted_at) }}</span>
            </template>
        </b-table>
    </div>
</div>
</template>

<script>
import { toDate } from '@/commons/utils/.'

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
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
