<template>
  <div class="col">
    <div class="card">
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
            :busy="isBusy">
            <template #cell(index)="data">
                {{
                    pagination.page == 1
                    ? data.index + 1
                    : data.index + (pagination.page == 2 ? pagination.page * 5 + 1 : (pagination.page - 1) * 10 + 1 )
                }}
            </template>
            <template #cell(name)="row">
                <b-img
                    class="mr-2"
                    variant="primary"
                    height="48"
                    :src="row.item.logo"
                    :text="row.item.logo == '' || null ? row.item.name[0] : ''">
                </b-img>
                {{ row.item.name }}
            </template>

            <template #cell(type)="row">
                {{ !!row.item.type ? row.item.type : '-' | capitalize }}
            </template>

            <template #cell(company)="row">
                {{ !!row.item.company ? row.item.company : '-' }}
            </template>

            <template #cell(city)="row">
                <span style="text-transform: capitalize">{{ !!row.item.city ? row.item.city?.toLowerCase() : '-'}}</span>
            </template>

            <template #cell(active)="row">
                {{ !!row.item.active ? 'Active' : 'Inactive' }}
            </template>

            <template #cell(action)="row">
                <b-button v-if="!batchId" class="btn btn-sm btn-warning btn-round btn-icon" @click="onClickAction(row.item, 'edit')">
                    <i class="fas fa-pen"></i>
                </b-button>
                <b-button v-if="!batchId" class="btn btn-sm btn-danger btn-round btn-icon" @click="onClickAction(row.item, 'delete')">
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
import { toEncrypt } from '~/commons/utils'

export default {
    props: {
        isBusy: Boolean,
        isRequest:Boolean,
        batchId: Number,
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
            value = value.toString().toLowerCase()
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
        onSiswaClicked(programId) {
            if (this.isRequest) this.$router.push(`/dashboard/students/request/batchs/${this.batchId}/programs/${programId}`)
            else if (this.batchId && this.roundId) this.$router.push(`${programId}/students`)
            else this.$router.push(`/dashboard/programs/${programId}`)
        },
        onUpdatePage(val) {
            this.$emit('fetchData', val, 5)
        },
        onClickAction(item, type) {
            // if (type == 'preview') this.$router.push(`/dashboard/${this.res}/${item.id}`);
            if (type === 'create') this.$router.push(`career/create`)
            if (type === 'edit') {
                localStorage.setItem('careerId', toEncrypt(item?.id))
                this.$router.push({
                    path: `career/edit/${item.title.toLowerCase().replace(" ", "-")}`,
                })
            }
            if (type === 'delete') this.showConfirmation(item)
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
                    console.error('Failed delete program', servicesState.message)
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
