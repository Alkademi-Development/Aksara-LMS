<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="col-12 col-md-8 mb-3 mb-md-0">
                    <h3 class="mb-0">Daftar {{role | capitalize}}</h3>
                </div>
                <div class="col-2 col-md-4 d-flex justify-content-md-end">
                    <b-button v-show="items.length != 0" class="btn btn-sm btn-round btn-icon" variant="success" @click="onExportClick">
                        <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
                        <span class="btn-inner--text">Export</span>
                    </b-button>
                    <b-button class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Edit product" @click="onClickCreate">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah {{ role | capitalize }}</span>
                    </b-button>
                </div>
            </div>
        </div>
        <!-- Table -->
        <b-table
            id="datatables"
            class="pb-4 m-0"
            head-variant="light"
            responsive
            outlined
            foot-clone
            foot-variant="null"
            caption-bottom
            no-footer-sorting
            tdClass="vetical-align: middle"
            :fields="fields"
            :items="items"
            :busy="isBusy">

            <template #cell(index)="data">
                {{
                    pagination.currentPage == 1
                    ? data.index + 1
                    : data.index + (pagination.currentPage == 2 ? pagination.currentPage * 5 + 1 : (pagination.currentPage - 1) * 10 + 1 )
                }}
            </template>

            <template #cell(date)="row">
                {{ beautifyDate(row.item.start) }} - {{ beautifyDate(row.item.end) }}
            </template>

            <template #cell(active)="row">
                <span :class="`badge badge-pill badge-${setStatusBadges(row.item.active)}`">{{ row.item.active == 1 ? 'Active' : row.item.active == 0 ? 'Unactive' : '' }}</span>
            </template>

            <template #cell(action)="row">
                <button type="button" class="btn btn-sm btn-primary" @click="onDetailClicked(row.item.id)">Detail Event</button>
                <b-button class="btn btn-sm btn-warning btn-round btn-icon" @click="onClickEdit(row.item.id)">
                    <i class="fas fa-pen"></i>
                </b-button>
                <b-button class="btn btn-sm btn-danger btn-round btn-icon">
                    <i class="fas fa-trash"></i>
                </b-button>
            </template>

            <template #table-busy>
                <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>

        </b-table>
        <!-- Pagination -->
        <b-pagination
            class="mx-4 mt-3"
            align="right"
            v-model="pagination.currentPage"
            :total-rows="pagination.totalRows"
            :per-page="pagination.perPage"
            @change="onUpdatePage"
        ></b-pagination>

    </div>

</div>
</template>

<script>
import moment from 'moment'

export default {
    props: {
        isBusy: Boolean,
        role: String,
        fields: {
            type: Array
        },
        items: {
            type: Array,
            default: []
        },
        pagination: {
            type: Object,
            default: {
                currentPage: 1,
                perPage: 10,
                totalRows: 50,
            }
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
    },
    mounted() {
      // Set the initial number of items
      this.pagination.totalRows = this.items.length
    },
    computed: {
        rows() {
            return this.items.length
        },
    },
    methods: {
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
        beautifyDate(date) {
            return moment(date).format("D MMM YY")
        },
        onDetailClicked(id) {
            this.$router.push(`/dashboard/events/${id}`)
        },
        onClickCreate() {
            this.$router.push('events/create')
        },
        onClickEdit(id) {
            this.$router.push(`events/edit/${id}`)
        },
        setStatusBadges(verified) {
             switch (verified) {
                 case -1:
                     return 'danger'
                     break;
                 case 1:
                     return 'primary'
                     break;
                 case 0:
                     return 'default'
                     break;
                 default:
                     return 'default'
                     break;
             }
         }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
