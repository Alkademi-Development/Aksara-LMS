<template>
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row">
                <div class="mb-3 col-12 mb-md-0">
                    <h3 class="mb-0">Ranking Peserta {{ className }}</h3>
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
            tdClass="vertical-align: middle"
            :current-page="pagination.currentPage"
            :per-page="pagination.perPage"
            :fields="fields"
            :items="items" 
            :busy="isBusy"
        >
            <template v-if="isBusy" #cell(index)>
                <b-skeleton width="100%"></b-skeleton>
            </template>
            <template v-else #cell(index)="data">
                {{ data.index + 1 }}
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

            <template #cell(score)="row">
                {{ row.item.score | fixedNumber }}
            </template>

            <template #cell(action)="row">
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
        <div class="d-flex justify-content-center mb-4">
            <nuxt-link :to="`/dashboard/leaderboards/${classroomId}`" class="text-primary m-0">Lihat semuanya</nuxt-link>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: {
        className: String,
        classroomId: Number,
    },
    computed: {
        ...mapState({
            classroomsState: (state) => state.Classrooms,
        })
    },
    data() {
        return  {
            isBusy: true,
            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'name',
                    label: 'Nama Peserta',
                },
                {
                    key: 'score',
                    label: 'Nilai',
                },
                {
                    key: 'action',
                    label: '',
                },
            ],
            pagination: {
                currentPage: 1,
                perPage: 10,
                totalRows: 10,
            },
            items: [],
        }
    },
    filters: {
        fixedNumber: function (number) {
            return (parseFloat(number)).toFixed();
        }
    },
    mounted() {
        this.getLeaderboards()
    },
    methods: {
        async getLeaderboards() {
            this.isBusy = true;
            await this.$store.dispatch('Classrooms/getLeaderboards', this.classroomId);

            if (!this.classroomsState.status) {
                console.error('Failed fetch leaderboards', this.classroomsState.message);
                this.isBusy = false;
            } else {
                this.leaderboardDetail = this.classroomsState.leaderboardDetail
                this.items = this.leaderboardDetail.leaderboards

                this.pagination = {
                    currentPage: 1,
                    perPage: 10,
                    totalRows: this.items.length,
                };

                this.isBusy = false;
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
/* Hide scrollbar for Chrome, Safari and Opera */
.table-responsive::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.table-responsive {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>