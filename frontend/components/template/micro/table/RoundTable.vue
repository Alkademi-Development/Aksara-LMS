<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                    <CircleBackButton class="d-inline-block" />
                    <h3 class="mb-0">Daftar {{ `${role} ${batchName}` | capitalize }}</h3>
                </div>
                <div v-if="(userKind == 'admin' || userKind == 'superadmin') && !isRequest" class="col-12 col-md-4 d-flex justify-content-md-end">
                    <b-button v-if="!isSubmitRound && !isBusy && items.length > 1 && items[items.length - 1].status == 0" v-b-modal.modal-continue-round class="btn btn-sm btn-round btn-icon" variant="info" data-toggle="tooltip">
                        <span class="btn-inner--icon"><i class="fas fa-forward"></i></span>
                        <span class="btn-inner--text">Lanjut Putaran Selanjutnya</span>
                    </b-button>
                    <b-button v-if="isSubmitRound" class="btn btn-sm btn-round btn-icon" variant="info" data-toggle="tooltip">
                        <b-spinner label="Spinning"></b-spinner>
                    </b-button>
                    <b-button class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Edit product" @click="onClickCreate">
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

            <template #cell(status)="row">
                <span :class="['badge badge-pill', row.item.status == 1 ? 'badge-success' : 'badge-primary']">{{row.item.status == 1 ? 'Aktif' : 'Tidak Aktif'}}</span>
            </template>
            <template #cell(action)="row">
                <b-button class="btn btn-sm btn-round btn-icon" variant="primary" @click="onProgramsClicked(row.item.id)">
                    <span class="btn-inner--text">{{userKind == 'admin' || userKind == 'superadmin' ? 'Lihat Program' : 'Lihat Peserta'}}</span>
                </b-button>
                <b-button v-if="(userKind == 'admin' || userKind == 'superadmin') && !isRequest" class="btn btn-sm btn-warning btn-round btn-icon" @click="onEditClicked(row.item.id)">
                    <i class="fas fa-pen"></i>
                </b-button>
                <a v-if="(userKind == 'admin' || userKind == 'superadmin') && !isRequest && !batchId" href="#!" class="btn btn-sm btn-danger btn-round btn-icon">
                    <i class="fas fa-trash"></i>
                </a>
            </template>

            <template #table-busy>
                <div class="my-2 text-center text-primary">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>
        </b-table>
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
        id="modal-continue-round"
        ref="modal"
        title="Lanjut ke Putaran Selanjutnya"
        :ok-disabled="!isValidCheck"
        cancel-variant="primary"
        ok-title="Lanjut"
        cancel-title="Batal"
        ok-variant="info"
        @show="resetModal"
        @hidden="resetModal"
        @ok="submitRound"
    >
        <form ref="form" @submit.stop.prevent="submitRound">
            <b-form-group
            label=""
            v-slot="{ ariaDescribedby }"
            :state="isValidCheck"
            >
                <b-form-checkbox-group
                    v-model="selectedOptions"
                    :options="optionsCheckBox"
                    :aria-describedby="ariaDescribedby"
                    name="flavour-1a"
                ></b-form-checkbox-group>
            </b-form-group>
        </form>
    </b-modal>
</div>
</template>

<script>
export default {
    props: {
        isBusy: Boolean,
        isRequest:Boolean,
        programId: Number,
        batchId: Number,
        batchName: {
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
                currentPage: 1,
                perPage: 10,
                totalRows: 50,
            }
        },
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
            userKind: localStorage.getItem('user_kind'),
            name: "",

            isValidCheck: false,

            activeRound: null,
            nextRound: null,

            selectedOptions: [],
            optionsCheckBox: [],

            isSubmitRound: false
        }
    },
    mounted() {
      // Set the initial number of items
    //   this.setDataRound()
      this.pagination.totalRows = this.items.length
    },
    computed: {
        rows() {
            return this.items.length
        },
    },
    watch: {
        selectedOptions(value) {
            if (value.length == 2) this.isValidCheck = true
            else this.isValidCheck = false
        }
    },
    methods: {
        setDataRound() {

            const findActvRound = this.items.findIndex((item) => item.status == 1)
            // console.log(this.items[findActvRound])
            this.activeRound = this.items[findActvRound]
            this.nextRound = this.items[findActvRound + 1]
            // console.log(this.activeRound, this.nextRound)
            this.optionsCheckBox = [

                { text: `Lanjut dari ${this.activeRound.name} ke ${this.nextRound.name}`, value: 0 },
                { text: 'Siswa yang memiliki nilai di atas standart kelulusan akan langsung masuk ke putaran selanjutnya', value: 1 },

            ]
        },
        async submitRound() {
            this.isSubmitRound = true

            this.$nextTick(() => {
                this.$bvModal.hide('modal-continue-round')
            })

            await this.$store.dispatch('Rounds/continueRound').then(() => {
                var stateRounds = this.$store.state.Rounds

                if(!stateRounds.status) {
                    console.log('Failed get rounds: ', stateRounds.message)
                    this.isSubmitRound = false
                } else {
                    this.generateClassrooms()
                }

            })

        },
        async generateClassrooms() {
            const params = {
                groupBy: [],
                orderBy: 'equal',
                max: 99
            }

            await this.$store.dispatch('Classrooms/generate', params).then(() => {

                var classroomsState = this.$store.state.Classrooms

                if (!classroomsState.status) {

                    console.error('Failed generate classrooms', classroomsState.message);
                    this.isSubmitRound = false

                } else {

                    this.$emit('reloadData')
                    this.isSubmitRound = false

                }

            })
        },
        resetModal() {
            this.setDataRound()
            this.isValidCheck = false
            this.selectedOptions = []
        },
        onProgramsClicked(roundId) {
            if(this.userKind == 'admin' || this.userKind == 'superadmin' || this.userKind == 'partner'){
                this.$router.push(`rounds/${roundId}/programs/`)
            } else {
                this.$router.push(`rounds/${roundId}/programs/${this.programId}/students`)
            }
        },
        onUpdatePage(val) {
            // this.$emit('fetchData', val)
        },
        onClickCreate() {
            this.$router.push(`rounds/create`)
        },
        onEditClicked(roundId) {
            this.$router.push(`rounds/edit/${roundId}`)
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
