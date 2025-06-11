<template>
    <section id="student-table" class="col">
        <div class="card border">
            <b-table
                id="datatables"
                class="pb-4 m-0"
                head-variant="light"
                responsive
                outlined
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
                    <span class="special-cell badge-dot mb-1" style="white-space: normal;">
                        <span class="status mr-1 text-limit limit-1">{{ row.item.title }}</span>
                    </span>
                </template>
    
                <template #cell(timer)="row" >
                    <span>{{ row.item.timer && row.item.timer != 0 ? `${row.item.timer} Menit` : `Tidak ada` }}</span>
                </template>
                
                <template #cell(randomize)="row" >
                    <span :class="`badge ${row.item.randomize ? 'badge-success' : 'badge-danger'}`">{{ row.item.randomize ? 'Iya' : 'Tidak' }}</span>
                </template>
    
                <template #cell(action)="row">
                    <b-button size="sm" variant="primary" @click="onClickAction(row.item, 'preview')">
                        <span class="btn-inner--text">List Soal</span>
                    </b-button>
                    <b-button variant="warning" size="sm" @click="onClickAction(row.item, 'edit')">
                        <i class="fas fa-pen"></i>
                    </b-button>
                    <b-button variant="danger" size="sm" @click="onClickAction(row.item, 'delete')">
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
    </section>
</template>

<script>
import moment from 'moment'

import appToken from '~/api/app-token'
import { toEncrypt } from '~/commons/utils'

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
            let splitValue = value.split('_')

            let newText = value

            if (splitValue.length > 0) {
                newText = ""
                splitValue.map((item) => {
                    let uppercase = item.charAt(0).toUpperCase() + item.slice(1)
                    newText += (`${uppercase} `)
                })
            }
            return newText
        },
        truncate(str) {
            var clip = 50
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    mounted() {
      // Set the initial number of items
      this.pagination.totalRows = this.items.length
      
      // localStorage.removeItem('bankQuestionsId')
    },
    computed: {
        rows() {
            return this.items.length
        },
    },
    methods: {
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
        beautifyDate(date) {
            return moment(date).format("D MMM YY")
        },
        onClickCreate() {
            this.$router.push('events/create')
        },
        onClickAction(data, type, optional) {
            if (type == 'category') this.$router.push(`/dashboard/forms/category`)
            if (type == 'create') this.$router.push('banks/create')

            localStorage.setItem('bankQuestionsId', toEncrypt(data?._id))

            if (type == 'preview') this.$router.push({
                path: `banks/${data.title.toLowerCase().replace(" ", "-")}`,
            })
            if (type == 'edit') this.$router.push({
                path: `banks/edit/${data.title.toLowerCase().replace(" ", "-")}`,
            })
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
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "@/assets/scss/components/micro/table/student-table.scss";  
    .td {
        vertical-align: middle !important;
    }

    .special-cell{
        max-width: 100%;
    }
</style>
