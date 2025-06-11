<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row">
                <div class="col-12 col-md-8 mb-3 mb-md-0">
                    <h3 class="mb-0">Daftar {{ role | capitalize }} Batch 1</h3>
                </div>
                <div class="col-12 col-md-4 d-flex justify-content-md-end text-right">
                    <a href="#" class="btn btn-sm btn-primary btn-round btn-icon" data-toggle="tooltip" data-original-title="Edit product">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah {{ role | capitalize }}</span>
                    </a>
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
            <template #cell(pretestTitle)="row">
                {{ row.item.pretestTitle }}
            </template>
            <template #cell(pretestQuestion)="row">
                {{ row.item.pretestQuestion }}
            </template>
            <template #cell(action)>
                <a href="#!" class="table-action" data-toggle="tooltip" data-original-title="Edit Pretest">
                    <i class="fas fa-pen"></i>
                </a>
                <a href="#!" class="table-action table-action-delete" data-toggle="tooltip" data-original-title="Delete Pretest">
                    <i class="fas fa-trash"></i>
                </a>
            </template>
        </b-table>
        <b-pagination
          class="mx-4"
          align="right"
          v-model="pagination.currentPage"
          :total-rows="pagination.totalRows"
          :per-page="pagination.perPage"
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
        onDetailClicked(title) {
            this.$router.push(`/dashboard/programs/batch/${title}`)
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
