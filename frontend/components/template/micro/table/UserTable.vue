<template>
    <div class="col">

        <div class="card">

            <!-- Card header -->
            <div class="card-header">

                <!-- Table Header -->
                <div class="row d-flex align-items-center">

                    <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                        <CircleBackButton v-if="(batchId && programId) || programId || isRequest" class="d-inline-block" />
                        <h3 class="mb-0">Daftar {{
                            role == 'request_siswa' ? `Peserta ${programName} menunggu konfirmasi`
                            : role == "mentor_classroom" ? 'Peserta pada Kelas'
                            : role == 'students_by_batch' ? `Peserta ${programName}, ${batchName}, ${roundName}`
                            : role == 'students_by_program' ? `Peserta ${programName}`
                            : role == 'students_by_batch_registrar' ? `Pendaftar ${programName}`
                            : role == 'siswa' ? `Peserta`
                            : role | capitalize}}</h3>
                    </div>

                    <div v-if="userKind == 'admin' || userKind == 'superadmin' || userKind == 'lead_program' || userKind == 'partner'" class="col-12 col-md-4 d-flex justify-content-md-end">
                        <b-button v-show="role != 'request_siswa' && role != 'mentor_classroom' && items.length != 0 && (userKind == 'admin' || userKind == 'superadmin' || userKind == 'partner' || (userKind == 'lead_program' && role != 'mentor'))" class="btn btn-sm btn-round btn-icon" variant="success" @click="onExportClick">
                            <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
                            <span class="btn-inner--text">Export</span>
                        </b-button>
                        <b-button v-show="(role != 'request_siswa' && role != 'mentor_classroom' && role != 'students_by_batch' && role != 'students_by_program' && role != 'students_by_batch_registrar' && userKind != 'industry' && userKind != 'partner') || (role == 'mentor' && userKind == 'lead_program')" class="btn btn-sm btn-round btn-icon" variant="primary" @click="onCreateClick">
                            <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                            <span class="btn-inner--text">Tambah {{ role == 'siswa' ? "peserta" : role | capitalize }}</span>
                        </b-button>
                    </div>

                </div>

                <!-- Table Filter -->
                <div id="table-filter" v-if="(role == 'siswa' || role == 'students_by_batch' || role == 'students_by_program' || role == 'students_by_batch_registrar' || role == 'request_siswa') && userKind != 'teacher'" class="mt-4 row d-flex align-items-center">

                    <!-- Search -->
                    <div class="mb-3 mb-md-0 col-12 col-md-4">

                        <b-form @submit.prevent="search">
                            <b-form-group>
                                <b-form-input
                                    v-model="keyword"
                                    id="search-student"
                                    type="text"
                                    placeholder="Cari Peserta"
                                ></b-form-input>
                            </b-form-group>
                        </b-form>

                    </div>

                    <!-- Filter -->
                    <div class="mb-3 ml-auto mb-md-0 col-12 col-md-2" >
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

                    <div class="mb-3 mb-md-0 col-12 col-md-2" v-if="(role == 'siswa' && userKind != 'industry') || role == 'students_by_batch_registrar'">
                        <b-form-group>
                            <v-select
                                class="select-city form-control"
                                placeholder="Pilih Berdasarkan"
                                :options="filters"
                                label="name"
                                id="selectFilter"
                                v-model="selectFilter"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                    Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari filter.</em>
                                </template>
                            </v-select>
                        </b-form-group>
                    </div>

                    <div class="mb-3 mb-md-0 col-12 col-md-2" v-if="role == 'siswa' && !programId">
                        <b-form-group>
                            <v-select
                                class="select-city form-control"
                                placeholder="Pilih Program"
                                :options="programs"
                                label="name"
                                id="selectProgram"
                                v-model="selectProgram"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                    Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari program.</em>
                                </template>
                            </v-select>
                        </b-form-group>
                    </div>

                    <div class="mb-3 mb-md-0 col-12 col-md-2" v-if="(role == 'siswa' && userKind != 'industry' && userKind != 'partner') || role == 'students_by_batch' || role == 'students_by_program' || role == 'students_by_batch_registrar' || role == 'request_siswa'">
                        <b-form-group>
                            <v-select
                                class="select-city form-control"
                                placeholder="Pilih Kota"
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
                tdClass="vertical-align: middle"
                :fields="fields"
                :items="items"
                :busy="isBusy">

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

                <template #cell(program)="data">
                    {{
                        data.item.program ? data.item.program.name : ''
                    }}
                </template>

                <template #cell(email)="data">
                    <span v-if="data.item.email" :class="`badge badge-pill badge-danger email zoom`">
                        {{ data.item.email }}
                    </span>
                    <br />
                    <span v-if="data.item.phone" :class="`badge badge-pill badge-success zoom`">
                        {{ data.item.phone }}
                    </span>
                </template>

                <template #cell(origin)="data">
                    <span v-if="data.item.address != null || data.item.address != ''" class="mb-2 d-block text-uppercase">
                        {{  data.item.address }}
                    </span>
                    <span v-if="data.item.origin" :class="`badge badge-pill badge-info zoom`">
                        {{ data.item.origin ? data.item.origin.name : '' }}
                    </span>
                </template>

                <template #cell(city)="data">
                    <span v-if="data.item.address != null || data.item.address != ''" class="mb-2 d-block text-uppercase">
                        {{  data.item.address }}
                    </span>
                    <span v-if="data.item.city" :class="`badge badge-pill badge-info zoom`">
                        {{ data.item.city ? data.item.city.name : '' }}
                    </span>
                </template>

                <template #cell(score)="data">
                    {{  data.item.score != undefined ? parseInt(data.item.score) : '' }}
                </template>

                <template #cell(verified)="row">
                    <span :class="`badge badge-pill badge-${setVerifiedBadges(row.item.verified)}`">{{ row.item.verified == 1 ? 'Verified' : 'Unverified' }}</span>
                </template>

                <template #cell(statusUser)="row">
                    <span :class="`mb-2 badge badge-pill badge-${setStatusUserBadges(row.item)}`">{{ setStatusUserMessage(row.item) }}</span>
                </template>

                <template #cell(status)="row">
                    <span :class="`badge badge-pill badge-${setStatusBadges(row.item.status)}`">{{ row.item.status == 1 ? 'Active' : row.item.status == 0 ? 'Unactive' : 'Blocked' }}</span>
                </template>

                <template #cell(action)="data">

                    <div v-if="role == 'request_siswa' && userKind != 'partner'">
                        <a :href="onViewClick(data.item.id)" target="_blank">
                            <b-button size="sm" variant="primary"> <i class="mr-2 fas fa-eye"></i> Lihat</b-button>
                        </a>
                        <!-- <b-button size="sm" variant="primary" @click="onViewClick(data.item.id)"> <i class="mr-2 fas fa-eye"></i> Lihat</b-button> -->
                    </div>

                    <div v-else-if="role == 'students_by_batch' && userKind != 'industry' && userKind != 'partner'">
                        <b-button size="sm" variant="primary" @click="onScoreClick(data.item)">
                            <i class="fas fa-pen"></i>
                            <span class="btn-inner--text">Edit Nilai</span>
                        </b-button>
                    </div>

                    <div v-else>

                        <b-button v-show="role == 'siswa' && userKind != 'industry' && userKind != 'partner' && userKind != 'teacher'" class="btn btn-sm btn-success btn-round btn-icon" @click="onDownloadCertificate(data)">
                            <span class="btn-inner--icon">
                                <i class="fa fa-download"></i>
                            </span>
                            <span class="btn-inner--text">Sertifikat</span>
                        </b-button>

                        <!-- <a v-show="role == 'siswa' || role == 'mentor' || role == 'admin' || role == 'industri'" class="btn btn-sm btn-primary btn-round btn-icon" @click="onDetailClick(data.item.id)"> -->
                        <a v-show="role == 'siswa' && userKind != 'teacher'" class="btn btn-sm btn-primary btn-round btn-icon" @click="onDetailClick(data.item.id)">
                            <span class="btn-inner--text">Lihat</span>
                        </a>

                        <b-button v-show="(role == 'siswa' || role == 'mentor' || role == 'admin' || role == 'industri') && userKind != 'industry' && userKind != 'partner' && userKind != 'teacher'" class="btn btn-sm btn-warning btn-round btn-icon" @click="onEditClick(data.item.id)">
                            <i class="fas fa-pen"></i>
                        </b-button>

                        <b-button v-show="role == 'industri' && userKind != 'industry' && userKind != 'partner' && userKind != 'teacher'" size="sm" variant="success" :disabled="data.item.status == -1 || data.item.status == 1" @click="showAgreementActivate(data.item)">Aktifkan</b-button>
                        <b-button v-show="role == 'industri' && userKind != 'industry' && userKind != 'partner' && userKind != 'teacher'" size="sm" variant="warning" :disabled="data.item.status == -1 || data.item.status == 0" @click="showAgreementDeactivate(data.item)">Nonaktifkan</b-button>
                        <b-button v-show="(role == 'siswa' || role == 'mentor' || role == 'admin' || role == 'industri') && userKind != 'industry' && userKind != 'partner' && userKind != 'teacher'" size="sm" variant="danger" :disabled="data.item.status == -1" @click="showAgreementBlock(data.item)">Blokir</b-button>

                    </div>

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

        <b-modal
            centered
            hide-footer
            v-if="isModalOpen"
            v-model="isModalOpen"
            @hide="closeModal"
            id="score-modal"
            body-class="container"
            size="sm"
        >
            <b-row>
                <b-col>
                    <TaskForm
                        action="verify"
                        :roundId="roundId"
                        :studentId="studentId"
                        :score="score"
                        :verified="verified"
                        @verifyTask="verifyTask"
                    />
                </b-col>
            </b-row>
        </b-modal>

    </div>
</template>

<script>
import TaskForm from '@/components/template/micro/form/TaskForm';

export default {
    props: {
        isBusy: Boolean,
        isRequest:Boolean,
        role: String,
        batchName: {
            default: '',
            type: String
        },
        batchId: Number,
        programName: {
            default: '',
            type: String
        },
        programId: Number,
        roundName: {
            default: '',
            type: String
        },
        roundId: Number,
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
        },
        programs: Array,
        cities: Array,
        filters: Array,
    },
    components: {
        TaskForm
    },
    data(){
        return {
            BASE_URL: process.env.baseURL,

            downloadUrl: null,
            userKind: localStorage.getItem('user_kind'),
            isModalOpen: false,
            studentId: null,
            verified: null,
            score: null,
            keyword: null,

            selectProgram: null,
            selectedProgram: null,

            selectCity: null,
            selectedCity: null,

            sortBy: [
                {
                    name: 'Nama Peserta (A-Z)',
                    by: 'name',
                    type: 'asc',
                },
                {
                    name: 'Nama Peserta (Z-A)',
                    by: 'name',
                    type: 'desc',
                },
            ],

            selectSort: null,
            selectedSortBy: null,
            selectedSortType: null,

            selectFilter: null,
            selectedFilter: null,
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
        this.pagination.totalRows = this.items.length;
    },
    computed: {
        rows() {
            return this.items.length
        },
        res() {
            const url = this.$router.currentRoute.fullPath
            var urlSplit = url.split('/')
            urlSplit.shift()
            return urlSplit[1].toLowerCase()
        }
    },
    methods: {
        search (page) {
            const params = {
                keyword: this.keyword,
                sortBy: this.selectedSortBy,
                sortType: this.selectedSortType,
                program: this.selectedProgram,
                city: this.selectedCity,
                studentStatus: this.selectedFilter,
                page: typeof page == 'number' ? page : 1
            };
            this.$emit('fetchData', params);
        },
        async onDownloadCertificate(data) {

            const token = localStorage.getItem('access_token')

            const payload = {
                batch_id: data.item.program.batchId,
                user_id: data.item.id,
            }

            await this.$store.dispatch('Users/downloadCertificate', payload)
                .then(() => {
                    const stateUsers = this.$store.state.Users

                    if (!stateUsers.status) {
                        this.showModalMessage(`Gagal mendownload sertifikat, ${stateUsers.message}`)
                    } else {
                        window.open(`${this.BASE_URL}batch/${payload.batch_id}/user/${payload.user_id}/certificate?token=${token}`, '_blank')

                        this.showDownloadCertificate(payload)
                    }
                })
        },
        showDownloadCertificate(payload) {
            const token = localStorage.getItem('access_token')

            const h = this.$createElement
            // Using HTML string
            const titleVNode = h('div', {
                domProps: { innerHTML: 'Download Sertifikat'
            }})

            // More complex structure
            const messageVNode = h('p', {
                style: 'color: blue',
                domProps: { innerHTML: `<a href='${this.BASE_URL}batch/${payload.batch_id}/user/${payload.user_id}/certificate?token=${token}' target='_blank'>Klik disini jika download belum mulai</a>` },
            })

            // We must pass the generated VNodes as arrays
            this.$bvModal.msgBoxOk([messageVNode], {
                title: [titleVNode],
                buttonSize: 'sm',
                centered: true, size: 'sm'
            })
        },
        showAgreementBlock(data) {
            this.$bvModal.msgBoxConfirm(`Anda yakin akan memblokir ${data.name}?`, {
                okVariant: 'danger',
                okTitle: 'Benar',
                cancelVariant: 'info',
                cancelTitle: 'Batal',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            })
            .then(value => {
                if(value) {
                    this.blockUser(data)
                }
            })
            .catch(err => {
                // An error occurred
            })
        },
        showAgreementActivate(data) {
            this.$bvModal.msgBoxConfirm(`Anda yakin akan mengaktifkan ${data.name}?`, {
                okVariant: 'info',
                okTitle: 'Benar',
                cancelVariant: 'danger',
                cancelTitle: 'Batal',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            })
            .then(value => {
                if(value) {
                    this.activateUser(data)
                }
            })
            .catch(err => {
                // An error occurred
            })
        },
        showAgreementDeactivate(data) {
            this.$bvModal.msgBoxConfirm(`Anda yakin akan menonaktifkan ${data.name}?`, {
                okVariant: 'danger',
                okTitle: 'Benar',
                cancelVariant: 'info',
                cancelTitle: 'Batal',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            })
            .then(value => {
                if(value) {
                    this.deactivateUser(data)
                }
            })
            .catch(err => {
                // An error occurred
            })
        },
        showModalMessage(message) {
            this.$bvModal.msgBoxOk(message, {
                okVariant: 'info',
                okTitle: 'Oke',
                centered: true,
            })
            .then(value => {
                this.onUpdatePage(this.pagination.currentPage);
            })
            .catch(err => {
                //
            });
        },
        onScoreClick (item) {
            this.studentId = item.id.toString();
            this.verified = item.verified.toString();
            this.score = parseInt(item.score);
            this.isModalOpen = true;
            this.$bvModal.show('score-modal');
        },
        closeModal () {
            this.studentId = null;
            this.verified = null;
            this.score = null;
            this.isModalOpen = false;
            this.$bvModal.hide('score-modal');
        },
        async blockUser(data) {
            this.isBusy = true

            var dispatch = ''

            if(this.res == 'students') dispatch = 'Users/blockirUser'
            if(this.res == 'mentors') dispatch = 'Users/blockirMentor'
            if(this.res == 'admin') dispatch = 'Users/blockAdmin'
            // if(this.res == 'industri') dispatch = 'Users/blockirIndustries'

            await this.$store.dispatch(dispatch, data.id).then(() => {
                const stateUsers = this.$store.state.Users

                if(!stateUsers.status){
                    // console.log('Failed to reject user: ', stateUsers.message)
                    this.showModalMessage(`Gagal memblokir ${data.name}`)
                    this.isBusy = false
                } else {
                    // console.log('Success to reject user: ', stateUsers.message)
                    this.showModalMessage(`Berhasil memblokir ${data.name}`)
                }
            })
        },
        async activateUser(data) {
            this.isBusy = true

            await this.$store.dispatch('Users/activateIndustry', {
                    id: data.id
                }).then(() => {
                const stateUsers = this.$store.state.Users

                if(!stateUsers.status){
                    // console.log('Failed to reject user: ', stateUsers.message)
                    this.showModalMessage(`Gagal mengaktifkan ${data.name}`)
                    this.isBusy = false
                } else {
                    // console.log('Success to reject user: ', stateUsers.message)
                    this.showModalMessage(`Berhasil mengaktifkan ${data.name}`)
                }
            })
        },
        async deactivateUser(data) {
            this.isBusy = true

            await this.$store.dispatch('Users/deactivateIndustry', {
                    id: data.id
                }).then(() => {
                const stateUsers = this.$store.state.Users

                if(!stateUsers.status){
                    // console.log('Failed to reject user: ', stateUsers.message)
                    this.showModalMessage(`Gagal menonaktifkan ${data.name}`)
                    this.isBusy = false
                } else {
                    // console.log('Success to reject user: ', stateUsers.message)
                    this.showModalMessage(`Berhasil menonaktifkan ${data.name}`)
                }
            })
        },
        onUpdatePage(val) {
            if (!this.keyword
                && !this.selectedSortBy
                && !this.selectedSortType
                && !this.selectedProgram
                && !this.selectedCity
                && !this.selectedFilter) {
                this.$emit('fetchData', {page: val})
            } else {
                this.search(val);
            }
        },
        onExportClick() {

            const token = localStorage.getItem('access_token')


            var downloadUrl = null

            if (this.role == 'students_by_batch') {

                downloadUrl = `${this.BASE_URL}report/batch/round/${this.roundId}/program/${this.programId}/students?token=${token}`

                if (this.keyword) downloadUrl += `&search=${this.keyword}`;
                if (this.selectedSortBy && this.selectedSortType) downloadUrl += `&sort=${this.selectedSortBy}&sortType=${this.selectedSortType}`;
                if (this.selectedCity) downloadUrl += `&cityId=${this.selectedCity}`;
                downloadUrl += `&studentStatus=2`;

            } else if (this.role == 'students_by_program') {

                downloadUrl = `${this.BASE_URL}report/program/${this.programId}/students?token=${token}`

                if (this.keyword) downloadUrl += `&search=${this.keyword}`;
                if (this.selectedSortBy && this.selectedSortType) downloadUrl += `&sort=${this.selectedSortBy}&sortType=${this.selectedSortType}`;
                if (this.selectedCity) downloadUrl += `&cityId=${this.selectedCity}`;

            } else if (this.role == 'students_by_batch_registrar') {

                downloadUrl = `${this.BASE_URL}report/batch/round/${this.roundId}/program/${this.programId}/students?token=${token}`

                if (this.keyword) downloadUrl += `&search=${this.keyword}`;
                if (this.selectedCity) downloadUrl += `&cityId=${this.selectedCity}`;
                if (this.selectedSortBy && this.selectedSortType) downloadUrl += `&sort=${this.selectedSortBy}&sortType=${this.selectedSortType}`;
                if (this.selectedFilter) downloadUrl += `&studentStatus=${this.selectedFilter}`;

            } else {

                if (this.res == 'admin') {

                    downloadUrl = `${this.BASE_URL}report/admins?token=${token}`

                } else if (this.res == 'mentors') {

                    downloadUrl = `${this.BASE_URL}report/mentors?token=${token}`

                } else if (this.res == 'students') {

                    downloadUrl = `${this.BASE_URL}report/students?token=${token}`

                // } else if (this.res == 'industri') {

                //     downloadUrl = `${this.BASE_URL}report/industri?token=${token}`

                }

                if (this.keyword) downloadUrl += `&search=${this.keyword}`;
                if (this.selectedCity) downloadUrl += `&cityId=${this.selectedCity}`;
                if (this.selectedProgram) downloadUrl += `&programId=${this.selectedProgram}`;
                if (this.selectedSortBy && this.selectedSortType) downloadUrl += `&sort=${this.selectedSortBy}&sortType=${this.selectedSortType}`;
                if (this.selectedFilter) downloadUrl += `&studentStatus=${this.selectedFilter}`;

            }
            // console.log('EXPORT: ', downloadUrl)
            window.open(downloadUrl, '_blank')

        },
        onDetailClick(id) {

            this.$router.push(`/dashboard/${this.res}/${id}`)
        },
        onEditClick(id) {

            this.$router.push(`/dashboard/${this.res}/edit/${id}`)
        },
        onCreateClick() {

            this.$router.push(`/dashboard/${this.res}/create`)
        },
        onViewClick(id) {
            const url = window.location.origin;
            return `${url}/dashboard/students/request/batchs/${this.batchId}/programs/${this.programId}/detail/${id}`
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
        },
        setStatusBadges(verified) {
            switch (verified) {
                case -1:
                    return 'danger'
                    break;
                case 1:
                    return 'primary'
                    break;
                case 0:
                    return 'default'
                    break;
                default:
                    return 'default'
                    break;
            }
        },
        setStatusUserBadges(item) {
            if (item.verified == 0) {
                return 'danger';
            } else {
                if (item.pretestStatus == 0) {
                    return 'primary';
                } else {
                    if (item.approvalStatus == 1) {
                        return 'success';
                    } else if (item.approvalStatus == 0) {
                        return 'default';
                    } else if (item.approvalStatus == -1) {
                        return 'danger';
                    }
                }
            }
        },
        setStatusUserMessage(item) {
            if (item.verified == 0) {
                return 'Belum Verifikasi';
            } else {
                if (item.pretestStatus == 0) {
                    return 'Belum Pretest';
                } else {
                    if (item.approvalStatus == 1) {
                        return 'Peserta';
                    } else if (item.approvalStatus == 0) {
                        return 'Pendaftar';
                    } else if (item.approvalStatus == -1) {
                        return 'Tidak Diterima';
                    }
                }
            }
        },
        verifyTask() {
            this.closeModal();
            this.onUpdatePage(this.pagination.currentPage);
        },
    },
    watch: {
        selectProgram: function () {
            if (this.selectProgram) {
                const selectedProgram = this.programs.find((program) => program.name == this.selectProgram.name);
                if (selectedProgram) {
                    this.selectedProgram = selectedProgram.id;
                    this.search();
                }
            } else {
                this.selectedProgram = null;
                this.search();
            }
        },
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
        selectFilter: function () {
            if (this.selectFilter) {
                const selectedFilter = this.filters.find((filter) => filter.name == this.selectFilter.name);
                if (selectedFilter) {
                    this.selectedFilter = selectedFilter.id;
                    this.search();
                }
            } else {
                this.selectedFilter = null;
                this.search();
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
