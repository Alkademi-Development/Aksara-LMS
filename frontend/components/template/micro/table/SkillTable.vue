<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="col-12 col-md-8 mb-3 mb-md-0">
                    <h3 class="mb-0">Daftar {{ role == 'request_siswa' ? ' Request Peserta' : role | capitalize }}</h3>
                </div>
                <div class="col-12 col-md-4 d-flex justify-content-md-end">
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
            :busy="isBusy"
            :current-page="pagination.currentPage"
            :per-page="pagination.perPage">
            <template #cell(index)="data">
                {{
                    pagination.currentPage == 1
                    ? data.index + 1
                    : data.index + (pagination.currentPage == 2 ? pagination.currentPage * 5 + 1 : (pagination.currentPage - 1) * 10 + 1 )
                }}
            </template>

            <!-- <template #cell(amount)="">

            </template> -->

            <!-- <template #cell(skill)="row">
                <b-avatar
                    class="mr-2"
                    variant="primary"
                    :src="row.item.photo_profile"
                    :text="row.item.photo_profile == '' || null ? row.item.skill[0] : ''">
                </b-avatar>
                {{ row.item.skill }}
            </template> -->

            <!-- <template #cell(status)="row">
                <span :class="`badge badge-pill badge-${setBadges(row.item.status)}`">{{ row.item.status }}</span>
            </template> -->

            <template #cell(action)>
                <b-button class="btn btn-sm btn-warning btn-round btn-icon">
                    <i class="fas fa-pen"></i>
                </b-button>
                <b-button class="btn btn-sm btn-danger btn-round btn-icon">
                    <i class="fas fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <!-- Pagination -->
        <b-pagination
          class="mx-4"
          align="right"
          v-model="pagination.currentPage"
          :total-rows="pagination.totalRows"
          :per-page="pagination.perPage"
        ></b-pagination>

    </div>
    <!-- Detail Modal -->
    <!-- <b-modal id="detail-modal" centered title="Detail Siswa" size="lg"> -->
        <!-- <div>
            <h3 class="mb-3">Rapor Siswa</h3>
            <b-img src="https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2149&q=80" fluid alt="Responsive image" aria-placeholder=""></b-img>
        </div> -->
        <!-- <div>
            <h3 class="mb-3">
                Jawaban
            </h3>
        </div> -->
    <!-- </b-modal> -->

</div>
</template>

<script>
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
        onClickCreate() {
            this.$router.push('skills/create')
        },
        setBadges(status) {
            switch (status) {
                case 'active' || 'verified':
                    return 'primary'
                    break;
                case 'banned':
                    return 'danger'
                    break;
                case 'unverified':
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
