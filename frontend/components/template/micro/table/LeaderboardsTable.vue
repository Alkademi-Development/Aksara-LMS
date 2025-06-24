<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            
            <div v-if="!isBusy" class="row d-flex align-items-center">
                <div class="col-12 col-md-10 d-flex align-items-center mb-3 mb-md-0">
                    <CircleBackButton class="d-inline-block" />
                    <div>
                        <h3 v-if="userKind == 'student'" class="mb-0">Ranking {{leaderboardDetail.rank}} dari {{leaderboardDetail.totalStudent}}</h3>
                        <h3 v-else class="mb-0">Ranking Peserta {{leaderboardDetail.classroom}}</h3>
                        <span v-if="layout && layout == 'umptn' && leaderboardDetail.classroomId == 36">Ranking masih dapat berubah sampai dengan tanggal <strong>20 Oktober 2022</strong>.</span>
                    </div>
                </div>
                <div class="col-12 col-md-2 d-flex justify-content-md-end">
                    <b-button v-if="items.length != 0 && !isDownload" class="btn btn-sm btn-round btn-icon" variant="success" data-toggle="tooltip" data-original-title="Edit product" @click="onClickExport">
                        <span class="btn-inner--icon"><i class="fas fa-file-download"></i></span>
                        <span class="btn-inner--text">Export</span>
                    </b-button>
                    <b-button v-else class="btn btn-sm btn-round d-flex align-items-center" variant="success">
                        <b-spinner small class="mr-2"></b-spinner>
                        <span>Loading...</span>
                    </b-button>
                </div>
            </div>
            <div v-else class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                    <b-skeleton type="avatar" class="mr-2"></b-skeleton>
                    <div class="w-100">
                        <b-skeleton width="60%"></b-skeleton>
                        <b-skeleton width="40%"></b-skeleton>
                    </div>
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
            :current-page="pagination.currentPage"
            :per-page="pagination.perPage"
            :fields="fields"
            :items="items"
            :busy="isBusy"
        >
            <template #cell(index)="data">
                {{
                    pagination.currentPage == 1
                    ? data.index + 1
                    : data.index + (pagination.currentPage == 2 ? pagination.currentPage * 5 + 1 : (pagination.currentPage - 1) * 10 + 1 )
                }}
            </template>
            <template #cell(name)="row">
                <span class="special-cell cities">
                    {{ row.item.name }}
                </span>
                <span class="special-cell cities">
                    <span class="badge badge-pill badge-primary">
                        {{removeCity(row.item.city)}}
                    </span>
                </span>
            </template>
            <template v-if="userKind != 'student'" #cell(action)="row">
                <b-button
                    size="sm"
                    variant="primary"
                    @click="onClickOpen(row.item)"
                >
                    <span class="btn-inner--text">Lihat</span>
                </b-button>
            </template>
            <template #table-busy>
                <div class="my-2 text-center text-primary">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>
        </b-table>
        <b-pagination
            v-if="!isBusy"
            class="mx-4"
            align="right"
            v-model="pagination.currentPage"
            :total-rows="pagination.totalRows"
            :per-page="pagination.perPage"
            aria-controls="datatables"
        ></b-pagination>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
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
        leaderboardDetail: {
            type: Object,
            default: {}
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
    computed: {
        ...mapState({
            sassState: (state) => state.Sass,
            classroomState: (state) => state.Classrooms,
        })
    },
    data() {
        return {
            res: "",
            isDownload: false,
            userKind: localStorage.getItem('user_kind'),
            layout: null
        }
    },
    mounted() {
      // Set the initial number of items
        this.layout = this.sassState.settings.layout
        const url = this.$router.currentRoute.fullPath
        this.res = url.split('/')
        this.res.shift()
        this.res = this.res[1]
        this.pagination.totalRows = this.items.length
    },
    methods: {
        async onClickExport(){
            this.isDownload = true
            await this.$store.dispatch('Classrooms/exportLeaderboards', this.leaderboardDetail.classroomId)

            if(!this.classroomState.status) {
                console.error(this.classroomState.message)
                this.isDownload = false
            } else {
                this.isDownload = false
            }
        },
        removeCity(string) {
            return string.toLowerCase().replace("kota", "").replace("kabupaten", "kab. ")
        },
        onClickOpen(item) {
            const url = `/dashboard/students/${item.id}`
            this.$router.push(url)
        }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
