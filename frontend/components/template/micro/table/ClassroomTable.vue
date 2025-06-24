<template>
  <div class="col">
    <div class="card border">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                    <h3 class="mb-0">Daftar {{ role == 'DraftKelas' ? 'Draft' : res == 'tes' ? 'Tes' : 'Kelas' | capitalize }}</h3>
                </div>
                <div v-if="userKind == 'admin' || userKind == 'superadmin'" class="col-12 col-md-4 d-flex justify-content-md-end">
                    <!-- <b-button v-show="items.length != 0" class="btn btn-sm btn-round btn-icon" variant="success" @click="onExportClick">
                        <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
                        <span class="btn-inner--text">Export</span>
                    </b-button> -->
                    <!-- <b-button v-if="role == 'DraftKelas'" class="btn btn-sm btn-round btn-icon" variant="secondary" data-toggle="tooltip" data-original-title="Release Class" @click="onClickAction(null, 'release')">
                        <span class="btn-inner--icon"><i class="fas fa-box-open"></i></span>
                        <span class="btn-inner--text">Release</span>
                    </b-button> -->
                    <!-- <b-button v-if="role == 'Kelas'" class="btn btn-sm btn-round btn-icon" variant="secondary" data-toggle="tooltip" data-original-title="Draft Class" @click="onClickAction(null, 'draft')">
                        <span class="btn-inner--icon"><i class="fas fa-archive"></i></span>
                        <span class="btn-inner--text">Draft</span>
                    </b-button> -->
                    <b-button class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Add Class" @click="onClickAction(null, 'create')">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah {{ res == 'tes' ? 'Tes' : 'Kelas' }}</span>
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
            <template #cell(name)="row">
                <span class="d-block mb-0">{{ row.item.name }}</span>
                <p v-if="userKind != 'student'" :class="`badge badge-${row.item.visibility == 'public' ? 'success' : 'danger'} mb-0`">{{ row.item.visibility }}</p>
            </template>
            <template #cell(totalStudent)="row">
                <b-button v-if="userKind != 'student' && row.item.totalStudent != 0" size="sm" variant="primary" @click="onClickAction(row.item, 'students')">
                    <span class="btn-inner--text">Lihat {{row.item.totalStudent}}</span>
                </b-button>
                <b-button v-else-if="userKind != 'student' && row.item.totalStudent == 0" size="sm" variant="primary" @click="onClickAction(row.item, 'addStudents')">
                    <span class="btn-inner--text">Tambah</span>
                </b-button>
                <span v-else>{{row.item.totalStudent != 0 ? row.item.totalStudent : 'Belum ada'}}</span>
            </template>
            <template #cell(registration)="row">
                {{beautifyDate(row.item.registrationStart)}} - {{beautifyDate(row.item.registrationEnd)}}
            </template>
            <template #cell(start)="row">
                {{beautifyDate(row.item.start)}} - {{beautifyDate(row.item.end)}}
            </template>
            <template #cell(classState)="row">
                <p :class="`badge badge-${generateStatusBadge(row.item.classState, 'status')} mb-0`">{{ generateStatusBadge(row.item.classState, 'name') }}</p>
            </template>
            <template #cell(action)="row">
                <b-button size="sm" variant="primary" @click="onClickAction(row.item, 'preview')">
                    <span class="btn-inner--text">Detail {{ res == 'tes' ? 'Tes' : 'Kelas' }}</span>
                </b-button>
                <template v-if="userKind == 'superadmin' || userKind == 'admin'">
                    <b-button variant="warning" size="sm" @click="onClickAction(row.item, 'edit')">
                        <i class="fas fa-pen"></i>
                    </b-button>
                    <b-button variant="danger" size="sm" @click="onClickAction(row.item, 'delete')">
                        <i class="fas fa-trash"></i>
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
            @change="onUpdatePage"
        ></b-pagination>
    </div>
</div>
</template>

<script>
import customFunction from "@/store/customFunction.js"
import moment from 'moment'

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
        isTestCase: {
            type: Boolean,
            default: false,
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
        beautifyDate(date) {
            return moment(date).format("DD MMM YY")
        },
        generateStatusBadge(data, state) {
            return customFunction.statusClass(data,state)
        },
        generateStatusName(data) {
            if (data.onRegistration) return 'Pendaftaran'
            if (data.started) return 'Berlangsung'
            if (data.ended) return 'Berakhir'
        },
        onClickAction(item, type) {
            if (type == 'students') this.$router.push(`/dashboard/${this.res}/students/${item.id}`);
            if (type == 'addStudents') this.$router.push(`/dashboard/${this.res}/students/${item.id}?addStudents=true`);
            if (type == 'release') this.$router.push(`/dashboard/${this.res}`);
            if (type == 'draft') this.$router.push(`/dashboard/${this.res}/draft`);
            if (type == 'preview') {
                if (this.isTestCase && this.userKind == 'student') this.$router.push(`/dashboard/${this.res}/assignments/${item.id}`);
                else this.$router.push(`/dashboard/${this.res}/${item.id}`);
            }
            if (type == 'create') this.$router.push(`/dashboard/${this.res}/create`)
            if (type == 'edit') this.$router.push(`/dashboard/${this.res}/edit/${item.id}`);
            if (type == 'delete') this.showConfirmation(item)
        },
        showConfirmation(item) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus ${item.name}?`, {
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
            await this.$store.dispatch('Services/deleteClassroom', id)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed delete classroom', servicesState.message)
                    this.$emit('isLoading', true)
                } else {
                    if (this.pagination.page > 1 && this.item.length == 1) {
                        this.onUpdatePage(this.pagination.page - 1);
                    } else {
                        this.onUpdatePage(this.pagination.page);
                    }
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
