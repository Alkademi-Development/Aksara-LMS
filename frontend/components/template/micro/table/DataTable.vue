<template>
  <div class="col">

    <div class="card">

        <!-- Card header -->
        <div class="card-header">
            <div class="row">
                <div class="col-6">
                    <h3 class="mb-0">Daftar {{ title == 'request_siswa' ? ' Request Peserta' : title | capitalize }}</h3>
                </div>
                <div class="col-6 text-right">
                    <b-button v-show="title != 'request_siswa'" class="btn btn-sm btn-round btn-icon" variant="primary" @click="onCreateClick">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah {{ title | capitalize }}</span>
                    </b-button>
                </div>
            </div>
        </div>

        <!-- Table Vue Bootstrap -->
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
            :fields="fields"
            :items="items"
            :busy="isBusy">

            <!-- Custom Field Table -->
            <template #cell(index)="data">

                {{
                    pagination.currentPage == 1
                    ? data.index + 1
                    : data.index + (pagination.currentPage == 2 ? pagination.currentPage * 5 + 1 : (pagination.currentPage - 1) * 10 + 1 )
                }}

            </template>

            <template #cell(name)="row">

                <b-avatar
                    class="mr-2"
                    variant="primary"
                    :src="row.item.photo"
                    :text="row.item.photo == '' || row.item.photo == null ? row.item.name[0] : ''">
                </b-avatar>
                {{ row.item.name != null || undefined ? row.item.name : '' }}

            </template>

            <template #cell(program)="data">

                {{
                    data.item.program ? data.item.program.name : ''
                }}

            </template>

            <template #cell(origin)="data">

                {{
                    data.item.origin ? data.item.origin.name : ''
                }}

            </template>

            <template #cell(verified)="row">

                <span :class="`badge badge-pill badge-${setVerifiedBadges(row.item.verified)}`">{{ row.item.verified == 1 ? 'Verified' : 'Unverified' }}</span>

            </template>

            <template #cell(action)>

                <div v-if="title == 'request_siswa'">
                    <a href="#!" class="btn btn-sm btn-primary btn-round btn-icon" v-b-modal.detail-modal>
                        <i class="fas fa-eye"></i>
                        <span>Jawaban</span>
                    </a>
                </div>
                <div v-else>
                    <a v-show="title == 'siswa' || title == 'mentor'" href="#" class="btn btn-sm btn-primary btn-round btn-icon">
                        <span class="btn-inner--text">Lihat</span>
                    </a>
                    <a href="#!" class="btn btn-sm btn-warning btn-round btn-icon">
                        <i class="fas fa-pen"></i>
                    </a>
                    <a href="#!" class="btn btn-sm btn-danger btn-round btn-icon">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>

            </template>

            <template #table-busy>
                <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>

        </b-table>

        <!-- Pagination Vue Bootstrap -->
        <b-pagination
            class="mx-4 mt-3"
            align="right"
            v-model="pagination.currentPage"
            :total-rows="pagination.totalRows"
            :per-page="pagination.perPage"
            @change="onUpdatePage"
        ></b-pagination>

    </div>
    <!-- Detail Modal -->
    <b-modal id="detail-modal" centered title="Detail Peserta" size="lg">
        <div>
            <b-img src="https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2149&q=80" fluid alt="Responsive image" aria-placeholder=""></b-img>
        </div>
    </b-modal>

</div>
</template>

<script>
export default {
    props: {
        title: String,
        isBusy: Boolean,
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
        // Filter Word Capitalize
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
        onCreateClick() {
            const url = this.$router.currentRoute.fullPath
            var resSplit = url.split('/')
            resSplit.shift()
            var res = resSplit[1]

            if(res == 'admin'){
                this.$router.push('/dashboard/admin/create')
            }
            if(res == 'students'){
                this.$router.push('/dashboard/students/create')
            }
            if(res == 'mentors'){
                this.$router.push('/dashboard/mentors/create')
            }
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
        },
        setVerifiedBadges(verified) {
             switch (verified) {
                 case 1:
                     return 'primary'
                     break;
                 case 0:
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

</style>
