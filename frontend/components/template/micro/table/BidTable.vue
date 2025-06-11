<template>
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 mb-md-0">
                    <h3 class="mb-0">Daftar {{ role | capitalize }}</h3>
                </div>
            </div>
        </div>
        <!-- Table -->
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
            :busy="isBusy"
        >
            <template #cell(index)="data">
                {{ data.index + 1 }}
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
                    {{ data.item.origin ? data.item.origin : '' }}
                </span>
            </template>

            <template #cell(action)="row">
                <b-button size="sm" v-if="role == 'penawaran'" variant="primary" :disabled="!row.item.file || row.item.file == 'undefined'" @click="onClickDownload(row.item.file)">
                    <span class="btn-inner--text">Download</span>
                </b-button>
                <b-button size="sm" v-if="role == 'penawaran'" variant="success" @click="onClickApprove({ project_id: row.item.projectId, user_id: row.item.userId })">
                    <span class="btn-inner--text">Approve</span>
                </b-button>
                <b-button size="sm" v-if="role == 'penawaran'" variant="danger" @click="onClickDecline({ project_id: row.item.projectId, user_id: row.item.userId })">
                    <span class="btn-inner--text">Decline</span>
                </b-button>
            </template>

            <template #table-busy>
                <div class="my-2 text-center text-primary">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>
        </b-table>
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
        items: {
            type: Array,
            default: []
        },
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
    },
    methods: {
        onClickDownload (url) {
            window.open(url, '_blank');
        },
        onClickApprove ({ project_id, user_id }) {
            this.$bvModal.msgBoxConfirm('Apakah anda yakin menyetujui penawaran ini?', {
                okVariant: 'info',
                okTitle: 'Iya',
                cancelVariant: 'danger',
                cancelTitle: 'Tidak',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            }).then((value) => {
                if (value) {
                    this.$emit('approve', { project_id, user_id });
                }
            }).catch((error) => {
                //
            });
        },
        onClickDecline ({ project_id, user_id }) {

        },
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>