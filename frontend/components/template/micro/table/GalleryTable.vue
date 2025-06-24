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
            tdClass="vertical-align: middle"
            :fields="fields"
            :items="items"
            :busy="isBusy"
        >
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

            <template #cell(cover)="row">
                <b-img
                    class="mr-2"
                    variant="primary"
                    width="72"
                    :src="row.item.cover">
                </b-img>
            </template>

            <template #cell(action)="row">
                <b-button size="sm" variant="primary" @click="onClickShow(row.item)">
                    <span class="btn-inner--text">Lihat Galeri</span>
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
        <!-- Pagination -->
        <b-pagination
            v-if="!isBusy"
            class="mx-4"
            align="right"
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
            :per-page="pagination.perPage"
            @change="pageChange"
        ></b-pagination>

    </div>
    <b-modal
        v-if="isModalOpen"
        hide-footer
        v-model="isModalOpen"
        id="detail-gallery"
        centered
        size="xl"
        body-class="container"
        @hide="closeModal"
    >
        <b-row>
            <b-col cols="12" lg="8" class="mx-auto">
                <img :src="selectedImage.cover" alt="">
            </b-col>
            <div class="w-100"></div>
            <b-col cols="12" lg="8" class="mx-auto mt-2">
                <h1>{{ selectedImage.title }}</h1>
            </b-col>
            <div class="w-100"></div>
            <b-col cols="12" lg="8" class="mx-auto mt-2">
                <p>{{ selectedImage.summary }}</p>
            </b-col>
        </b-row>
    </b-modal>
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
    data () {
        return {
            selectedImage: null,
            isModalOpen: false,
        };
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
            this.$router.push('/dashboard/galleries/create')
        },
        onClickShow (item) {
            // this.selectedImage = item;
            // this.isModalOpen = true;
            // this.$bvModal.show('detail-gallery');
            localStorage.setItem('galleryId', toEncrypt(item?.id))
            this.$router.push({
                path: `/dashboard/galleries/${item.title.toLowerCase().replace(" ", "-")}`,
            });
        },
        onClickEdit (item) {
            localStorage.setItem('galleryId', toEncrypt(item?.id))
            this.$router.push({
                path: `/dashboard/galleries/edit/${item.title.toLowerCase().replace(" ", "-")}`,
            });
        },
        onClickDelete(item) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus galeri: ${item.title} ?`, {
                okVariant: 'danger',
                okTitle: 'Iya',
                cancelVariant: 'info',
                cancelTitle: 'Tidak',
                centered: true,
                bodyClass: 'container',
                size: 'sm'
            }).then((value) => {
                if (value) {
                    this.$emit('deleteGallery', item.id);
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
        },
        closeModal () {
            this.isModalOpen = false;
            this.$bvModal.hide('detail-gallery');
            this.selectedImage = null;
        }
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>
