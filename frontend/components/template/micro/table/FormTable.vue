<template>
  <div class="col">
    <div class="card border">
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
            empty-text="Belum ada data"
            tdClass="vetical-align: middle"
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

            <template #cell(title)="row" >
                <span class="special-cell badge-dot mb-1">
                    <span class="status mr-1">{{ row.item.title | truncate }}</span>
                </span>
                <span class="special-cell cities">
                    <span :class="`badge badge-pill badge-${setStatusBadges(row.item.formType)}`">{{ row.item.formType == 'basic' ? 'Basic' : row.item.formType == 'quiz' ? 'Quiz' : 'Register' }} - Type</span>
                </span>
            </template>

            <template #cell(timer)="row" >
                {{row.item.timer != 0 ? row.item.timer + ' Menit' : 'Tidak ada'}}
            </template>

            <template #cell(totalRespondent)="row" >
                {{row.item.totalRespondent != 0 ? row.item.totalRespondent + ' Perespon' : 'Belum ada'}}
            </template>

            <template #cell(formType)="row" >
                <span :class="`badge badge-pill badge-${setStatusBadges(row.item.formType)}`">{{ row.item.formType == 'basic' ? 'Basic' : row.item.formType == 'quiz' ? 'Quiz' : 'Register' }}</span>
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
        <!-- Pagination -->
        <b-pagination
            v-if="!isBusy"
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
import moment from 'moment'
import { mapActions } from 'vuex'

import appToken from '~/api/app-token'

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
    created() {
        this.initializeFormUrl(null, 'create')
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
        ...mapActions({
            setAction: 'Layouts/setAction'
        }),
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
        beautifyDate(date) {
            return moment(date).format("D MMM YY")
        },
        onClickCreate() {
            this.$router.push('events/create')
        },
        onClickAction(data, type) {
            if (type == 'create') this.goToForm(null, type)
            if (type == 'edit') this.goToForm(data._id, type)
            if (type == 'delete') this.showConfirmation(data)
        },
        showConfirmation(data) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus ${data.title}?`, {
                okVariant: 'danger',
                okTitle: 'Iya',
                cancelVariant: 'info',
                cancelTitle: 'Tidak',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            }).then((value) => {
                if (value) {
                    this.fetchDeleteItem(data._id)
                }
            }).catch((error) => {

            });
        },
        setStatusBadges(type) {
             switch (type) {
                 case 'basic':
                     return 'primary'
                     break;
                 case 'quiz':
                     return 'success'
                     break;
                 case 'register':
                     return 'warning'
                     break;
                 default:
                     return 'default'
                     break;
            }
        },
        async goToForm(id, type) {
            this.isCreateQuiz = true

            const formId = "&formId=" + id
            const redirectLms = "&redirectTo=" + window.location.href
            const action = type == 'create' ? '' : type

            const urlForm = process.env.formURL + `/${action}?` + formId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlForm;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const code = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

            const url = `${baseUrl}/check?${redirect}${lmsId}${code}${generatedToken}`;

            setTimeout(() => {
                window.open(url, "_blank");
            }, 250);
        },
        async fetchDeleteItem(id) {
            this.$emit('isLoading', true)
            await this.$store.dispatch('Forms/deleteForms', id)
            .then(() => {
                var formsState = this.$store.state.Forms

                if(!formsState.status) {
                    console.log('Failed delete forms', formsState.message)
                    this.$emit('isLoading', false)
                } else {
                    if (this.pagination.currentPage > 1 && this.items.length == 1) {
                        this.onUpdatePage(this.pagination.currentPage - 1);
                    } else {
                        this.onUpdatePage(this.pagination.currentPage);
                    }
                }
            })
        },
        async initializeFormUrl(id, type) {
            this.isCreateQuiz = true

            const formId = "&formId=" + id
            const redirectLms = "&redirectTo=" + window.location.href
            const action = type == 'create' ? '' : type

            const urlForm = process.env.formURL + `/${action}?` + formId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlForm;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const code = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

            const url = `${baseUrl}/check?${redirect}${lmsId}${code}${generatedToken}`;

            this.setAction(url)
        }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
