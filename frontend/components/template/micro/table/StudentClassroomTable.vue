<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div v-if="!isBusy" class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                    <CircleBackButton class="d-inline-block" />
                    <h3 class="mb-0">{{classroomDetail.name}}</h3>
                </div>
                <div v-if="userKind == 'admin' || userKind == 'superadmin'" class="col-12 col-md-4 d-flex justify-content-md-end">
                    <b-button class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Add Class" @click="onClickAction(null, 'create')">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah Peserta</span>
                    </b-button>
                </div>
            </div>
            <div v-else class="row">
                <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                    <b-skeleton type="avatar" class="mr-2"></b-skeleton>
                    <div class="w-100">
                        <b-skeleton width="60%"></b-skeleton>
                        <b-skeleton width="80%"></b-skeleton>
                    </div>
                </div>
                <div v-if="userKind == 'admin' || userKind == 'superadmin'" class="col-12 col-md-4 d-flex align-items-center justify-content-md-end w-100">
                    <b-skeleton width="50%"></b-skeleton>
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
            :current-page="pagination.page"
            :per-page="pagination.perPage"
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
            <template #cell(name)="row">
                <b-avatar
                    v-b-tooltip
                    variant="primary"
                    :src="row.item.photo"
                    :text="row.item.photo && row.item.photo != '' ? '' : row.item.name.charAt(0)"
                    :title="row.item.name"
                    class="mr-3"
                ></b-avatar>
                <span>{{row.item.name}}</span>
            </template>
            <template #cell(email)="row">
                <p class="badge badge-pill badge-warning email zoom">{{row.item.email}}</p>
            </template>
            <template #cell(action)="row">
                <template>
                    <b-button
                        size="sm"
                        variant="primary" 
                        @click="onClickAction(row.item, 'detail')"
                    >
                        Lihat
                    </b-button>
                </template>
                <template v-if="userKind == 'superadmin' || userKind == 'admin'">
                    <b-button variant="danger" size="sm" class="btn-icon" @click="onClickAction(row.item, 'delete')">
                        <span class="btn-inner--icon"><i class="fas fa-trash"></i></span>
                        <span class="btn-inner--text">Keluarkan</span>
                    </b-button>
                </template>
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
        onClickAction(item, type) {
            if (type === 'create') this.$emit('toggleInviteModal')
            if (type === 'delete') this.showConfirmation(item)
            if (type === 'detail') this.$router.push(`/dashboard/students/${item.id}`)
        },
        showConfirmation(item) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan mengeluarkan ${item.name}?`, {
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
                    // console.log('delete')
                }
            }).catch((error) => {
                console.error('Modal error.', error)
            });
        },
        async fetchDeleteItem(id) {
            this.$emit('isLoading', true)
            const params = {
                userId: id,
                classroomId: this.classroomDetail.id
            }
            await this.$store.dispatch('Services/classroomKickStudent', params)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed kick student', servicesState.message)
                    this.$emit('setEvent', {message: servicesState.message, status: false})
                    this.$emit('isLoading', true)
                } else {
                    this.$emit('setEvent', {message: "Berhasil mengeluarkan peserta.", status: true})
                    this.onUpdatePage(this.pagination.page);
                }
            })
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
</style>
