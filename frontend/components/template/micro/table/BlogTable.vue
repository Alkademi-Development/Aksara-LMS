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
                tdClass="vertical-align: middle"
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

                <template #cell(summary)="row">
                    {{ row.item.summary | truncate }}
                </template>

                <template #cell(action)="row">

                    <b-button size="sm" variant="primary" @click="onClickShow(row.item)">
                        <span class="btn-inner--text">Lihat Blog</span>
                    </b-button>

                    <b-button size="sm" variant="warning" @click="onClickEdit(row.item)">
                        <i class="fas fa-pen"></i>
                    </b-button>

                    <b-button size="sm" variant="danger" @click="onClickDelete(row.item)">
                        <i class="fas fa-trash"></i>
                    </b-button>

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
                class="mx-4 mt-3"
                align="right"
                v-model="pagination.page"
                :total-rows="pagination.totalItems"
                :per-page="pagination.perPage"
                @change="pageChange"
            ></b-pagination>
        </div>
    </div>
</template>

<script>
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
        truncate(str) {
            var clip = 50
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    mounted() {
        // Set the initial number of items
        this.pagination.totalItems = this.items.length;
    },
    methods: {
        onClickCreate() {
            this.$router.push('/dashboard/blog/create')
        },
        onClickShow (item) {
            localStorage.setItem('blogId', toEncrypt(item?.id))
            this.$router.push({
                path: `/dashboard/blog/${item.title.toLowerCase().replace(" ", "-")}`,
            });
        },
        onClickEdit (item) {
            localStorage.setItem('blogId', toEncrypt(item?.id))
            this.$router.push({
                path: `/dashboard/blog/edit/${item.title.toLowerCase().replace(" ", "-")}`,
            });
        },
        onClickDelete(item) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin menghapus artikel: ${item.title} ?`, {
                okVariant: 'danger',
                okTitle: 'Iya',
                cancelVariant: 'info',
                cancelTitle: 'Tidak',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            }).then((value) => {
                if (value) {
                    this.$emit('deleteBlog', item.id);
                }
            }).catch((error) => {
                //
            });
        },
        setBadges(status) {
            switch (status) {
                case 'active' || 'verified':
                    return 'primary';
                case 'banned':
                    return 'danger';
                case 'unverified':
                    return 'danger';
                default:
                    return 'default';
            }
        },
        pageChange(data) {
            this.$emit('page', data);
        }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
