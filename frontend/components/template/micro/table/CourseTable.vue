<template>
    <section id="student-table" class="card">
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
                <button type="button" class="btn btn-sm btn-primary" @click="onClickAction(row.item, 'preview')">Lihat Modul</button>
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

            <!-- <template #empty>
                <div class="my-2 text-center text-muted">
                    <strong>Belum ada materi yang dibuat</strong>
                </div>
            </template> -->
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
    </section>
</template>

<script>
import { mapActions } from 'vuex'

import { toEncrypt } from '~/commons/utils'

export default {
    props: {
        isBusy: Boolean,
        role: String,
        courseId: String,
        courseName: String,
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
      this.pagination.totalItems = this.items.length
    },
    computed: {
        rows() {
            return this.items.length
        },
    },
    created() {
        this.initializeAction()
    },
    methods: {
        ...mapActions({
            setAction: 'Layouts/setAction'
        }),
        initializeAction() {
            this.setAction(`/dashboard/courses/create?type=${this.role}`)
        },
        onClickAction(item, type) {
            if (type == 'module') this.$router.push(`/dashboard/courses/pretest`);
            if (type == 'pretest') this.$router.push(`/dashboard/courses/`);
            
            localStorage.setItem('courseId', toEncrypt(item.id))
            if (type == 'preview') {
                this.$router.push({
                    path: `courses/modules/${item.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`,
                });
            }
            if (type == 'create') this.$router.push(`courses/create?type=${this.role}`)
            if (type == 'edit') {
                 this.$router.push({
                    path: `courses/edit/${item.title.toLowerCase().replace(" ", "-")}`,
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
            await this.$store.dispatch('Services/deleteModule', id)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed delete module: ', servicesState.message)
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
    @import "@/assets/scss/components/micro/table/student-table.scss";
    .td {
        vertical-align: middle !important;
    }
</style>
