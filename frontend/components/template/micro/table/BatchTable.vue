<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="col-12 col-md-8 mb-3 mb-md-0">
                    <h3 class="mb-0">Daftar {{ role | capitalize }} Terbaru</h3>
                </div>
                <div v-if="userKind == 'admin' || userKind == 'superadmin'" class="col-12 col-md-4 d-flex justify-content-md-end">
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
            <template #cell(name)="row">

                <span class="special-cell badge-dot mb-1">
                    <span class="status mr-1">{{ row.item.name }}</span>
                    <i v-if="row.item.active == 1" class="bg-success"></i>
                </span>

                <span v-if="allCity.length != 0 && row.item.cities.length == allCity.length" class="special-cell cities">
                    <span class="badge badge-pill badge-primary">
                        Semua Kota
                    </span>
                </span>
                <template v-else>
                    <span class="special-cell cities" v-for="(cities, index) in row.item.cities" :key="index">
                        <span class="badge badge-pill badge-primary">
                            {{removeCity(cities.name)}}
                        </span>
                    </span>
                </template>

            </template>
            <template #cell(cities)="row">
                <span class="cities" v-for="(cities, index) in row.item.cities" :key="index">
                        {{cities.name}}{{index != row.item.cities.length - 1 ? ',&nbsp;' : ''}}
                </span>
            </template>
            <template #cell(registration)="row">
                {{ beautifyDate(row.item.registration.start) }} - {{ beautifyDate(row.item.registration.end) }}
            </template>
            <template #cell(schedule)="row">
                {{ beautifyDate(row.item.schedule.start) }} - {{ beautifyDate(row.item.schedule.end) }}
            </template>
            <template #cell(action)="row">
                <button type="button" class="btn btn-sm btn-primary" @click="onDetailClicked(row.item.id)">Lihat Putaran</button>
                <b-button v-show="userKind == 'admin' || userKind == 'superadmin'" class="btn btn-sm btn-warning btn-round btn-icon" @click="onEditClicked(row.item.id)">
                    <i class="fas fa-pen"></i>
                </b-button>
                <b-button v-show="userKind == 'admin' || userKind == 'superadmin'" class="btn btn-sm btn-danger btn-round btn-icon">
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
        allCity: Array,
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
    data(){
        return {
            userKind: localStorage.getItem('user_kind'),
            BASE_URL: process.env.baseURL,
        }
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
        onExportClick() {

            const token = localStorage.getItem('access_token')

            var downloadUrl = null

            downloadUrl = `${this.BASE_URL}report/batches?token=${token}`

            window.open(downloadUrl, '_blank')

        },
        removeCity(string) {
            return string.toLowerCase().replace("kota", "").replace("kabupaten", "kab. ")
        },
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
        onClickCreate() {
            this.$router.push('/dashboard/batch/create')
        },
        beautifyDate(date) {
            return moment(date).format("D MMM YY")
        },
        onDetailClicked(id) {
            this.$router.push(`/dashboard/batch/${id}/rounds`)
        },
        onEditClicked(id) {
            this.$router.push(`/dashboard/batch/edit/${id}`)
        },
        setBadges(status) {
            switch (status) {
                case 'active' || 'terverifikasi':
                    return 'primary'
                    break;
                case 'banned':
                    return 'danger'
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
