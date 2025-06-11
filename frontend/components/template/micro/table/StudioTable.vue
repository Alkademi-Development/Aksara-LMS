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

            <template #cell(name)="row" >
                <span class="special-cell badge-dot mb-1">
                    <span class="status mr-1">{{ row.item.name | truncate }}</span>
                </span>
            </template>

            <template #cell(timer)="row">
                <span v-if="row.item.timer != 0">{{ row.item.timer }} Menit</span>
                <span v-else>Tidak Ada</span>
            </template>

            <template #cell(template)="row">
                <span>{{ generateLanguage(row.item) | truncate }}</span>
            </template>

            <template #cell(action)="row">
                <b-button variant="primary" size="sm" @click="onClickAction(row.item, 'preview')">
                    Lihat
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
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        truncate(str) {
            var clip = 30
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    mounted() {
      // Set the initial number of items
      this.pagination.totalRows = this.items.length
      localStorage.removeItem('studioId')
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
        onDetailClicked(id) {
            this.$router.push(`/dashboard/events/${id}`)
        },
        onClickAction(data, type) {
            if (type == 'preview') this.goToEditor(data.id)
            if (type == 'create') this.$router.push('studio/create')
            if (type == 'edit') {
                localStorage.setItem('studioId', toEncrypt(data?.id))
                
                this.$router.push({
                    path: `studio/edit/${data.name.toLowerCase().replace(" ", "-")}`,
                })
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
            await this.$store.dispatch('Studio/delete', id)
            .then(() => {
                var stateStudio = this.$store.state.Studio

                if(!stateStudio.status) {
                    console.log('Failed delete forms', stateStudio.message)
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
        async goToEditor(id){

            const redirectLms = "redirectTo=" + window.location.href

            const urlStudio = process.env.editorURL + `compiler?&metronomId=${id}` + "&" + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlStudio;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const code = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

            const url = `${baseUrl}/check?${redirect}${lmsId}${code}${generatedToken}`;

            window.open(url, '_blank')
        },
        generateLanguage(item) {
            const ext = item.template
            let stringExt = ""

            ext.map((e, i) => {
                stringExt += e.ext + (i != (ext.length - 1) ? ', ' : '')
            })

            return stringExt
        }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
