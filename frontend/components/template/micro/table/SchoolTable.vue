<template>
  <div class="col">
    <div class="card">

        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 mb-md-0">
                    <h3 class="mb-0">Daftar {{ role == 'schoolRequest' ? 'Permintaan Sekolah' : role | capitalize }}</h3>
                </div>
                <div v-if="role != 'schoolRequest'" class="col-12 col-md-4 d-flex justify-content-md-end">
                    <!-- <b-button class="btn btn-sm btn-round btn-icon" variant="success" @click="onExportClick">
                        <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
                        <span class="btn-inner--text">Export</span>
                    </b-button> -->
                    <b-button class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Edit product" @click="onClickAction(null, 'create')">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah {{ role | capitalize }}</span>
                    </b-button>
                </div>
            </div>

            <!-- Table Filter -->
            <!-- <div v-if="role != 'schoolRequest'" id="table-filter" class="mt-4 row d-flex align-items-center"> -->
            <div id="table-filter" hidden>

                    <!-- Search -->
                    <div class="mb-3 col-12 col-md-4 mb-md-0">
                        <b-form @submit.prevent="search">
                            <b-form-group>
                                <b-form-input
                                    v-model="keyword"
                                    id="search-school"
                                    type="text"
                                    placeholder="Nama Sekolah"
                                ></b-form-input>
                            </b-form-group>
                        </b-form>
                    </div>

                    <!-- Sort -->
                    <div class="mb-3 col-12 col-md-4 mb-md-0">
                        <b-form-group>
                            <v-select
                                class="select-city form-control"
                                placeholder="Urutkan dari"
                                :options="sortBy"
                                label="name"
                                id="selectSort"
                                v-model="selectSort"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                    Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari urutan.</em>
                                </template>
                            </v-select>
                        </b-form-group>
                    </div>

                    <!-- Filter -->
                    <div class="mb-3 col-12 col-md-4 mb-md-0">
                        <b-form-group>
                            <v-select
                                class="select-city form-control"
                                placeholder="Filter via Kota"
                                :options="cities"
                                label="name"
                                id="selectCity"
                                v-model="selectCity"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                    Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari kota.</em>
                                </template>
                            </v-select>
                        </b-form-group>
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
            :fields="fields"
            :items="items"
            :busy="isBusy">

            <template #cell(index)="data">
                {{
                    pagination?.page == 1
                    ? data.index + 1
                    : data.index + (pagination?.page == 2 ? pagination?.page * 5 + 1 : (pagination?.page - 1) * 10 + 1 )
                }}
            </template>

            <template #cell(name)="row">

                <b-img
                    v-if="row.item.picture"
                    class="mr-2 mb-2"
                    variant="primary"
                    height="32"
                    :src="row.item.picture"
                    :text="row.item.picture == '' || null ? row.item.name[0] : ''">
                </b-img>
                <div class="school-name-container">
                    {{ row.item.name }}
                </div>

            </template>

            <template #cell(website)="row">
                <div v-if="row.item.website" class="d-flex align-items-center">
                    <a :href="row.item.website" target="_blank" class="mr-2"><i class="fas fa-magnifying-glass"></i></a>
                    <span>{{ row.item.website | clipText }}</span>
                </div>
                <span v-else>Tidak ada.</span>
            </template>

            <template #cell(address)="row">
                <span class="d-block">{{ row.item.address | clipText }}</span>
                <span :class="`badge badge-pill badge-info`">{{ row.item.city }}</span>
            </template>

            <template #cell(action)="row">
                <button type="button" class="btn btn-sm btn-primary" @click="onClickAction(row.item, 'preview')">Lihat Sekolah</button>
                <b-button v-if="role != 'schoolRequest'" variant="warning" size="sm" @click="onClickAction(row.item, 'edit')">
                    <i class="fas fa-pen"></i>
                </b-button>

                <b-button v-if="role != 'schoolRequest'" variant="danger" size="sm" @click="onClickAction(row.item, 'delete')">
                    <i class="fas fa-trash"></i>
                </b-button>

            </template>

            <!-- Loading on Busy -->
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
            v-model="pagination.page"
            :total-rows="pagination?.totalItems"
            :per-page="pagination?.perPage"
            @change="onUpdatePage"
        ></b-pagination>

    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {

    props: {

        isBusy: Boolean,

        role: String,

        fields: {

            type: Array,
            default: () => []

        },

        items: {

            type: Array,
            default: () => []

        },

        pagination: {

            type: Object,
            default: {

                page: 1,
                perPage: 10,
                totalPages: 1,
                totalItems: 1,
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],

            }

        },

        cities: {

            type: Array,
            default: () => []

        }

    },

    data () {

        return {

            BASE_URL: process.env.baseURL,
            keyword: null,

            selectCity: null,
            selectedCity: null,

            sortBy: [
                {
                    name: 'Nama Sekolah (A-Z)',
                    by: 'name',
                    type: 'asc',
                },
                {
                    name: 'Nama Sekolah (Z-A)',
                    by: 'name',
                    type: 'desc',
                },
            ],

            selectSort: null,
            selectedSortBy: null,
            selectedSortType: null,

        }

    },

    filters: {

        // Filter Word Capitalize
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        clipText: function (text) {

            var clip = 50

            if (text.length > clip) text = text.substr(0, clip-1) + '...'
            else text

            return text

        },

    },

    mounted() {
      // Set the initial number of items
      this.pagination.totalRows = this.items.length
    },

    computed: {
        ...mapState({
            schoolsState: (state) => state.Schools
        }),
        rows() {
            return this.items.length
        },
    },

    methods: {
        search (page) {
            this.$emit('fetchData', {
                keyword: this.keyword,
                city: this.selectedCity,
                sortBy: this.selectedSortBy,
                sortType: this.selectedSortType,
                page: typeof page == 'number' ? page : 1
            });
        },
        onExportClick() {

            const token = localStorage.getItem('access_token')

            var downloadUrl = null

            downloadUrl = `${this.BASE_URL}report/schools?token=${token}`

            window.open(downloadUrl, '_blank')

        },
        // onUpdatePage(val) {
            
        //     if (!this.keyword
        //         && !this.selectedCity
        //         && !this.selectedSortBy
        //         && !this.selectedSortType) {

        //         this.$emit('fetchData', {page: val})
                
        //     } else {
        //         this.search(val);
        //     }
        // },
        onUpdatePage(val) {
            
            this.$emit( 'fetchData', val )

        },
        showAgreement(item, approve) {
            this.$bvModal.msgBoxConfirm(`${approve ? 'Terima' : 'Tolak'} permintaan dari ${item.name}?`, {
                okVariant: `${approve ? 'primary' : 'danger'}`,
                okTitle: 'Iya',
                cancelVariant: `${approve ? 'danger' : 'primary'}`,
                cancelTitle: 'Batal',
                centered: true,
            })
            .then(value => {
                if(value) {
                    this.onClickAction(item.id, approve ? 'approve' : 'reject')
                }
            })
            .catch(err => {
                // An error occurred
            })
        },
        onClickCreate() {
            this.$router.push('schools/create')
        },
        // onClickAction(id, type) {
        //     const data = {
        //         type: type,
        //         id: id,
        //     }
        //     this.$emit('schoolAction', data)
        // },
        onClickAction(data, type) {
            if (type == 'create') this.$router.push('/dashboard/schools/create')
            if (type == 'edit'){
                this.schoolsState.schoolName = data.name;
                this.$router.push(`/dashboard/schools/edit/${data.id}`)   
            }
            if (type == 'preview'){
                this.schoolsState.schoolName = data.name;
                this.$router.push(`/dashboard/schools/students/${data.id}`)
            }
            if (type == 'delete') this.showConfirmation(data)
        },
        showConfirmation(data) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus ${data.name}?`, {
                okVariant: 'danger',
                okTitle: 'Iya',
                cancelVariant: 'info',
                cancelTitle: 'Tidak',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            }).then((value) => {
                if (value) {
                    this.fetchDeleteItem(data.id)
                }
            }).catch((error) => {

            });
        },
        async fetchDeleteItem(id) {
            this.$emit('isLoading', true)
            await this.$store.dispatch('Schools/delete', id)
            .then(() => {
                var stateSchools = this.$store.state.Schools

                if(!stateSchools.status) {
                    console.error(stateSchools.message)
                    this.$emit('isLoading', false)
                } else {
                    if (this.pagination.page > 1 && this.items.length == 1) {
                        this.onUpdatePage(this.pagination.page - 1);
                    } else {
                        this.onUpdatePage(this.pagination.page);
                    }
                }
            })
        },
        setBadges(status) {
            switch (status) {
                case 'active':
                    return 'primary'
                    break;
                case 'banned':
                    return 'danger'
                    break;
                default:
                    return 'default'
                    break;
            }
        },
        setStatusBadges(verified) {
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
    },

    watch: {
        selectCity: function () {
            if (this.selectCity) {
                const selectedCity = this.cities.find((city) => city.name == this.selectCity.name);
                if (selectedCity) {
                    this.selectedCity = selectedCity.id;
                    this.search();
                }
            } else {
                this.selectedCity = null;
                this.search();
            }
        },
        selectSort: function () {
            if (this.selectSort) {
                const selectedSort = this.sortBy.find((sort) => sort.name == this.selectSort.name);
                if (selectedSort) {
                    this.selectedSortBy = selectedSort.by;
                    this.selectedSortType = selectedSort.type;
                    this.search();
                }
            } else {
                this.selectedSortBy = null;
                this.selectedSortType = null;
                this.search();
            }
        },
    }

}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
