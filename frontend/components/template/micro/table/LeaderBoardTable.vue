<template>
  <div class="col">
    <div class="card m-0">
        <!-- Card header -->
        <div class="card-header">
            <div v-if="!isBusy" class="row d-flex align-items-center justify-content-between">
                <div class="col-12 col-md d-flex align-items-center mb-3 mb-md-0">
                    <CircleBackButton class="d-inline-block" />
                    <h3 v-if="leaderboardDetail.rank" class="mb-0">Ranking {{ leaderboardDetail.rank }} di {{ leaderboardDetail.class }}</h3>
                    <h3 v-else class="mb-0">Leaderboard {{ leaderboardDetail.class }}</h3>
                </div>
                <b-button v-if="items.length != 0 && userKind != 'student'" class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Add Class" @click="onClickDownload">
                    <span class="btn-inner--icon"><i class="fas fa-download"></i></span>
                    <span class="btn-inner--text">Download</span>
                </b-button>
            </div>
            <div v-else class="w-100">
                <b-skeleton width="40%"></b-skeleton>
                <b-skeleton width="60%"></b-skeleton>
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
            :busy="isBusy"
            :tbody-tr-class="rowClass"
        >
            <template #cell(ranking)="data">
                {{data.item.no}}
            </template>
            <template #cell(score)="data">
                {{data.item.score}} / 100
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
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
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
        leaderboardDetail: {
            type: Object,
            default: {}
        },
        classroomDetail: {
            type: Object,
            default: {}
        },
        items: {
            type: Array,
            default: []
        },
        pagination: {
            type: Object,
            default: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
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
    data() {
        return {
            res: "",
            userKind: localStorage.getItem('user_kind'),
            user: JSON.parse(localStorage.getItem('user'))
        }
    },
    mounted() {
      // Set the initial number of items
        const url = this.$router.currentRoute.fullPath
        this.res = url.split('/')
        this.res.shift()
        this.res = this.res[1]
        this.pagination.totalItems = this.items.length
    },
    methods: {
        async onClickDownload(){
            let dispatch = 'Services/classroomLeaderboardsExport'
            
            if (this.classroomDetail.pretest == 1) dispatch = 'Services/pretestLeaderboardsExport'

            await this.$store.dispatch(dispatch, this.classroomDetail.id)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed download leaderboard', servicesState.message)
                } else {
                }
            })
        },
        onClickOpen(item) {
            const url = `/dashboard/students/${item.userId}`
            this.$router.push(url)
        },
        rowClass(item, type) {
            if (!item || type !== 'row') return
            if (item.userId === this.user.id) return 'table-primary'
        },
        beautifyDate(date) {
            return moment(date).format("DD MMM YY")
        },
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
    .badge {
        text-transform: none !important;
    }
</style>
