<template>
  <div class="col">
    <div class="card">
        <!-- Card header -->
        <div class="card-header">
            <div class="row d-flex align-items-center">
                <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                    <h3 v-if="!isBusy" class="mb-0 d-inline-block module-title text-truncate">{{moduleDetail.title | capitalize}}</h3>

                    <b-skeleton v-else width="50%"></b-skeleton>
                </div>
                <div class="col-12 col-md-4 d-flex justify-content-md-end">
                    <b-button
                        class="btn btn-sm btn-round btn-icon"
                        variant="primary"
                        data-toggle="tooltip"
                        data-original-title="Edit product"
                        @click="onClickAction(item, 'create')"
                    >
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tambah Modul</span>
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
                    pagination.page == 1
                    ? data.index + 1
                    : data.index + (pagination.page == 2 ? pagination.page * 5 + 1 : (pagination.page - 1) * 10 + 1 )
                }}
            </template>
            <template #cell(action)="row">
                <button type="button" class="btn btn-sm btn-primary" @click="onClickAction(row.item, 'preview')">Detail Modul</button>
                <b-button class="btn btn-sm btn-warning btn-round btn-icon" @click="onClickAction(row.item, 'edit')">
                    <i class="fas fa-pen"></i>
                </b-button>
                <b-button class="btn btn-sm btn-danger btn-round btn-icon" @click="onClickAction(row.item, 'delete')">
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
import { mapState } from 'vuex';

import { toEncrypt } from '~/commons/utils';

export default {
    props: {
        isBusy: Boolean,
        role: String,
        courseId: Number,
        courseName: String,
        moduleDetail: Object,
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
    },
    mounted() {
      // Set the initial number of items
      this.pagination.totalRows = this.items.length
    },
    computed: {
        rows() {
            return this.items.length
        },
        ...mapState({
            courseState: (state) => state.Courses
        })
    },
    methods: {
        onClickAction(item, type) {
            localStorage.setItem('topicId', toEncrypt(item?.id))
            localStorage.setItem('courseId', toEncrypt(this.courseId))
            // if (type == 'preview') this.$router.push(`/dashboard/courses/modules/${item.id}`);
            if (type == 'preview') {
                // console.log(`/dashboard/courses/modules/${this.courseName}/detail/${item.id}`);
                // return;
                this.$router.push({
                    path: `/dashboard/courses/modules/${this.courseName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/detail/${item.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`,
                })
            }
            if (type == 'create') {
                this.$router.push({
                    path: `${this.courseName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/create`,
                })
            }

            if (type == 'edit') {
                this.$router.push({
                    path: `${this.courseName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit/${item?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`,
                });
            }

            if (type == 'delete') this.showConfirmation(item)
        },
        showConfirmation(item) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus ${item.title}?`, {
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
            await this.$store.dispatch('Services/deleteTopic', id)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed delete topic: ', servicesState.message)
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
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
    }
}
</script>

<style lang="scss" scoped>
.td {
  vertical-align: middle !important;
}
.module-title{
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  width:100%;
  display:block;
}
</style>