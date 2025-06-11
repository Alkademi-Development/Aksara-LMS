<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="col-12 col-md-8 mb-3 mb-md-0">
                    <h3 class="mb-0">Daftar {{ role | capitalize }}</h3>
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
            tdClass="vertical-align: middle"
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

            <template #cell(content)="row">
                {{ row.item.content | truncate }}
            </template>

            <!-- <template #cell(action)="row">
                <b-button size="sm" variant="primary" @click="onClickShow(row.item.id)">
                    <span class="btn-inner--text">Lihat Pengumuman</span>
                </b-button>
                <b-button size="sm" variant="warning" @click="onClickEdit(row.item.id)">
                    <i class="fas fa-pen"></i>
                </b-button>
                <b-button size="sm" variant="danger" @click="onClickDelete(row.item.id)">
                    <i class="fas fa-trash"></i>
                </b-button>
            </template> -->

            <template #table-busy>
                <div class="my-2 text-center text-primary">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>
        </b-table>
        <!-- Pagination -->
        <b-pagination
            class="mx-4"
            align="right"
            v-model="pagination.currentPage"
            :total-rows="pagination.totalRows"
            :per-page="pagination.perPage"
            @input="pageChange"
        ></b-pagination>

    </div>
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
        truncate(str) {
            var clip = 50
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    mounted() {
        // Set the initial number of items
        this.pagination.totalRows = this.items.length;
    },
    methods: {
        onClickCreate() {
            this.$router.push('announcements/create')
        },
        // onClickShow (id) {
        //     this.$router.push(`announcements/${id}`);
        // },
        // onClickEdit (id) {
        //     this.$router.push(`announcements/edit/${id}`);
        // },
        // onClickDelete(id) {
        //     this.$emit('deleteAnnouncement', id);
        // },
        pageChange(data) {
            this.$emit('page', data);
        }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
