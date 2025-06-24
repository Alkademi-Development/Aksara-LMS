<template>
  <div class="col">
    <div class="card border">
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="col d-flex align-items-center">
                    <h3 class="mb-0">Daftar {{role | capitalize}}</h3>
                </div>
                <div class="col-12 col-md-4 d-flex justify-content-md-end">
                    <b-button class="btn btn-sm btn-round btn-icon" variant="secondary" data-toggle="tooltip" data-original-title="Edit product" @click="onClickAction(null, 'category')">
                        <span class="btn-inner--text">Kategori Soal</span>
                    </b-button>
                    <b-button class="btn btn-sm btn-round btn-icon" variant="primary" data-toggle="tooltip" data-original-title="Edit product" @click="onClickAction(null, 'create')">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah Soal</span>
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
            :busy="isBusy">

            <template #cell(index)="data">
                {{
                    pagination.currentPage == 1
                    ? data.index + 1
                    : data.index + (pagination.currentPage == 2 ? pagination.currentPage * 5 + 1 : (pagination.currentPage - 1) * 10 + 1 )
                }}
            </template>

            <template #cell(question)="row" >
                <span v-html="$options.filters.truncate(row.item.question)"></span>
            </template>

            <template #cell(category)="row" >
                {{ row.item.category.name }}
            </template>

            <template #cell(action)="row">
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

</div>
</template>

<script>
import moment from 'moment'

import { toEncrypt } from '~/commons/utils'

export default {
    props: {
        isBusy: Boolean,
        role: String,
        paketId: String,
        paketName: String,
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
            var clip = 60
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    mounted() {
      // Set the initial number of items
      this.pagination.totalRows = this.items.length
      
      // localStorage.removeItem('questionId')
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
        onClickAction(data, type) {
            if (type == 'category') this.$router.push(`/dashboard/forms/category`)

            localStorage.setItem('questionId', toEncrypt(data?._id))
            if (type == 'create') this.$router.push({
                path: `${this.paketName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/create`,
            })
            if (type == 'edit') this.$router.push({
                path: `${this.paketName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit/${data.question.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`,
            })
            if (type == 'delete') this.showConfirmation(data)
        },
        showConfirmation(data) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus ${data.question}?`, {
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
        async fetchDeleteItem(id) {
            this.$emit('isLoading', true)
            const params = {
                formId: this.paketId,
                questionId: id
            }
            await this.$store.dispatch('Forms/formDeleteQuestion', params)
            .then(() => {
                var formsState = this.$store.state.Forms

                if(!formsState.status) {
                    console.log('Failed delete question', formsState.message)
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
    .td {
        vertical-align: middle !important;
    }
</style>
