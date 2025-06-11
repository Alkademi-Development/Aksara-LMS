<template>
    <div class="col">
        <div class="card">
            <!-- Card header -->
            <div class="card-header">
                <div class="row d-flex align-items-center">
                    <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                        <h3 class="mb-0">Daftar {{role | capitalize}}</h3>
                    </div>
                    <div class="col-12 col-md-4 d-flex justify-content-md-end">
                        <b-button class="btn btn-sm btn-round btn-icon" variant="success" @click="onExportClick" v-show="userKind != 'student'">
                            <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
                            <span class="btn-inner--text">Export</span>
                        </b-button>
                        <b-button class="btn btn-sm btn-round btn-icon" variant="primary" @click="onClickCreate" v-show="userKind != 'student'">
                            <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                            <span class="btn-inner--text">Tambah {{ role | capitalize }}</span>
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
                    <span class="name">
                        {{ row.item.name != null || undefined ? row.item.name : '' }}
                    </span>

                </template>

                <template #cell(description)="row">
                    <div class="text-table-ellipsis">{{ row.item.description }}</div>
                </template>

                <template #cell(onBid)="row">
                    <span :class="`badge badge-pill badge-${setStatusBadges(row.item)}`">{{setStatusMessage(row.item)}}</span>
                </template>

                <template #cell(action)="row">
                    <b-button size="sm" variant="primary" @click="onClickView(row.item.id)">
                        <span class="btn-inner--text">Lihat</span>
                    </b-button>
                    <b-button size="sm" v-show="userKind != 'student'" variant="warning" @click="onClickEdit(row.item.id)">
                        <i class="fas fa-pen"></i>
                    </b-button>
                    <b-button size="sm" v-show="userKind != 'student'" variant="danger" @click="onClickDelete(row.item.id)">
                        <i class="fas fa-trash"></i>
                    </b-button>
                </template>

                <template #table-busy>
                    <div class="my-2 text-center text-primary">
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
    </div>
</template>

<script>
export default {
    props: {
        isBusy: Boolean,
        role: String,
        userKind: String,
        fields: {
            type: Array
        },
        userKind: String,
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
    data() {
        return {
            BASE_URL: process.env.baseURL,
        }
    },
    mounted() {
        // Set the initial number of items
        this.pagination.totalRows = this.items.length
    },
    methods: {
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
        onExportClick() {

            const token = localStorage.getItem('access_token')

            var downloadUrl = `${this.BASE_URL}report/projects?token=${token}`

            window.open(downloadUrl, '_blank')

        },
        onClickCreate () {
            this.$router.push('projects/create');
        },
        onClickView (id) {
            this.$router.push(`projects/${id}`);
        },
        onClickEdit (id) {
            this.$router.push(`projects/edit/${id}`);
        },
        onClickDelete (id) {
            this.$bvModal.msgBoxConfirm('Apakah anda yakin menghapus proyek ini?', {
                okVariant: 'danger',
                okTitle: 'Iya',
                cancelVariant: 'info',
                cancelTitle: 'Tidak',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            }).then((value) => {
                if (value) {
                    this.$emit('deleteProject', id);
                }
            }).catch((error) => {
                //
            });
        },
        setStatusBadges(data) {
            if(data.onBid == 1) {
                if(data.approved == 0) {
                    return 'warning'
                }
                if(data.approved == 1) {
                    return 'success'
                }
            }
            if(data.onBid == 0) {
                return 'primary'
            }
            return 'default'
        },
        setStatusMessage(data){
            const result = this.setStatusBadges(data)

            if(result == 'warning') {
                return 'Menunggu Konfirmasi'
            }
            if(result == 'success') {
                return 'Diterima'
            }
            if(result == 'primary') {
                return 'Tersedia'
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
