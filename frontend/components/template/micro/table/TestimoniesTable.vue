<template>
  <div class="col">
    <div class="card border">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="col-12 col-md-8 d-flex align-items-center mb-3 mb-md-0">
                    <CircleBackButton v-if="(roundId) || isRequest" class="d-inline-block" />
                    <h3 class="mb-0">Daftar {{ role | capitalize }}</h3>
                </div>
                <div class="col-12 col-md-4 d-flex justify-content-md-end">
                    <b-button class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Edit product" @click="onClickAction(null, 'create')">
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
            show-empty
            tdClass="vetical-align: middle"
            :fields="fields"
            :items="items"
            :busy="isBusy"
        >
            <template #cell(index)="data">
                {{
                    pagination.page == 1
                    ? data.index + 1
                    : data.index + (pagination.page == 2 ? pagination.page * 5 + 1 : (pagination.page - 1) * 10 + 1 )
                }}
            </template>
            <template #cell(title)="row">
                {{ row.item.title }}
            </template>
            <template #cell(subtitle)="row">
                {{ row.item.subtitle ? row.item.subtitle : '-' }}
            </template>
            <template #cell(type)="row">
                {{ row.item.type ? row.item.type : '-' | capitalize }}
            </template>
            <template #cell(active)="row">
                {{ row.item.active === 1 ? 'Active' : 'Disable' }}
            </template>

            <template #cell(action)="row">
                <b-button class="btn btn-sm btn-warning btn-round btn-icon" @click="onClickAction(row.item, 'edit')">
                    <i class="fas fa-pen"></i>
                </b-button>
                <b-button class="btn btn-sm btn-danger btn-round btn-icon" @click="onClickAction(row.item, 'delete')">
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
export default {
    props: {
        isBusy: Boolean,
        isRequest:Boolean,
        roundId: Number,
        batchName: {
            default: '',
            type: String
        },
        roundName: {
            default: '',
            type: String
        },
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
        truncate(str) {
            var clip = 50
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    mounted() {
      // Set the initial number of items
      this.pagination.totalItems = this.items.length
    },
    computed: {
        rows() {
            return this.items.length
        },
    },
    methods: {
        onUpdatePage(val) {
            this.$emit('fetchData', val, 6)
        },
        onClickAction(item, type) {
            if (type == 'create') this.$router.push(`testimonies/create`)
            if (type == 'edit') this.$router.push(`testimonies/edit/${item.id}`)
            if (type == 'delete') this.showConfirmation(item)
        },
        showConfirmation(item) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus ${item?.title}?`, {
                okVariant: 'danger',
                okTitle: 'Iya',
                cancelVariant: 'primary',
                cancelTitle: 'Tidak',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            }).then((value) => {
                if (value) {
                    this.fetchDeleteItem(item.id)
                }
            }).catch((error) => {

            });
        },
        async fetchDeleteItem(id) {
            this.$emit('isLoading', true)
            await this.$store.dispatch('Post/deletePost', id)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed delete testimonies', servicesState.message)
                    this.$emit('isLoading', true)
                } else {
                    if (this.pagination.page > 1 && this.items.length == 1) {
                        this.onUpdatePage(this.pagination.page - 1);
                    } else {
                        this.onUpdatePage(this.pagination.page);
                    }
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
