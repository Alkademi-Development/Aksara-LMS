<template>
    <section id="student-table" class="card">
        <b-table
            id="datatables"
            class="pb-4"
            head-variant="light"
            responsive
            outlined
            foot-variant="null"
            show-empty
            no-footer-sorting
            tdClass="vetical-align: middle"
            :fields="fields"
            :items="items"
            :busy="isBusy"
        >
            <template #table-busy>
                <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>

            <!-- <template #thead-top>
                <b-tr>
                    <b-th class="text-center">Filter</b-th>
                    <b-th colspan="2">
                        <b-form-input
                            size="sm"
                            placeholder="Nama &amp; email"
                            trim
                            v-model="keyword"
                        ></b-form-input>
                    </b-th>
                    <b-th></b-th>
                    <b-th>
                        <b-form-select 
                            id="filter-role"
                            size="sm"
                            text-field="label"
                            value-field="value"
                            v-model="selectedRole" 
                            :options="roles"                            
                        >
                        <template #first>
                            <b-form-select-option value="" disabled>-- Role --</b-form-select-option>
                        </template>
                        </b-form-select>
                    </b-th>
                    <b-th class="text-right">
                        <button class="btn btn-primary btn-sm" @click="onClearFilter">
                            <i class="fas fa-refresh"></i>
                            Reset
                        </button>
                    </b-th>
                </b-tr>
            </template> -->
            
            <template #cell(index)="data">
                <div class="w-100 text-center">
                    {{
                        pagination.page == 1
                        ? data.index + 1
                        : data.index + (pagination.page == 2 ? pagination.page * 5 + 1 : (pagination.page - 1) * 10 + 1 )
                    }}
                </div>
            </template>

            <template #cell(name)="row">
                <span
                    v-if="row?.item?.kind === 4"
                    class="name-link pointer" 
                    @click="detailUser(row)"
                >
                    {{ !!row?.item?.name ? trimString(row?.item?.name, 32) : '-' }}
                </span>
                <span v-else>{{ !!row?.item?.name ? trimString(row?.item?.name, 32) : '-' }}</span>
                <span v-if="sassState.isSchoolCase" :class="`badge badge-pill badge-info`">{{ row.item.school ?? '' }}</span>
            </template>

            <template #cell(email)="row">
                <span>{{ !!row?.item?.email ? trimString(row?.item?.email, 32) : '-' }}</span>
            </template>

            <template #cell(phone)="row">
                <span>{{ !!row?.item?.phone ? trimString(row?.item?.phone, 32) : '-' }}</span>
            </template>

            <template #cell(kind)="row">
                <div :class="`badge badge-${roleClass(row?.item?.kind)?.style}`">
                    {{ roleClass(row?.item?.kind)?.label ?? '-' }}
                </div>
            </template>

            <template #cell(action)="row">
                <b-button 
                    size="sm" 
                    variant="warning" 
                    @click="onClickAction(row.item, 'edit')"
                >
                    <i class="fas fa-pen"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination
            v-if="!isBusy"
            align="right"
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
            :per-page="pagination.perPage"
            @change="onUpdatePage"
        ></b-pagination>
    </section>
</template>

<script>
import { roleClass, trimString, toEncrypt } from '@/commons/utils/.'
import { ROLES_USERS } from '~/commons/constants/users'
import { mapState } from 'vuex'

export default {
    props: {
        containerClass: {
            type: String,
            default: 'col',
        },
        fields: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        },
        isBusy: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        pagination: {
            type: Object,
            default: () => {}
        }
    },  
    computed: {
        ...mapState({ sassState: (state) => state.Sass })
    },
    data() {
        return {
            res: "",
            userKind: localStorage.getItem('user_kind'),

            selectedRole: '',
            roles: ROLES_USERS,

            keyword: ''
        }
    },
    watch: {
        keyword(word) {
            this.$emit('getUserList', 1, this.selectedRole, !!word ? word : '')
        },  
        selectedRole(role) {
            if (!!role) this.$emit('getUserList', 1, role, this.keyword)
        }
    },
    methods: {
        roleClass,
        trimString,
        onUpdatePage(val) {
            this.$emit('getUserList', val, this.selectedRole, this.keyword)
        },
        showConfirmation(item) {
            this.$bvModal.msgBoxConfirm(`Apakah anda yakin akan menghapus ${item.name}?`, {
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
                console.log(error);
            });
        },
        async fetchDeleteItem(id) {
            console.log("Delete", id);
            // this.$emit('isLoading', true)
            // await this.$store.dispatch('Services/deleteClassroom', id)
            // .then(() => {
            //     var servicesState = this.$store.state.Services

            //     if(!servicesState.status) {
            //         console.error('Failed delete classroom', servicesState.message)
            //         this.$emit('isLoading', true)
            //     } else {
            //         if (this.pagination.page > 1 && this.item.length == 1) {
            //             this.onUpdatePage(this.pagination.page - 1);
            //         } else {
            //             this.onUpdatePage(this.pagination.page);
            //         }
            //     }
            // })
            this.onUpdatePage(1);
        },
        onClickAction(item, type) {
            switch (type) {
                case 'create':
                    this.$router.push(`/dashboard/users/create`)
                    break;
                case 'edit':
                    localStorage.setItem('userId', toEncrypt(item?.id))
                    this.$router.push({
                        path: `/dashboard/users/edit/${item.name.toLowerCase().replace(" ", "-")}`,
                    })
                    break;
                case 'delete':
                    this.showConfirmation(item)
                    break;
                case 'detail':
                    this.$router.push({
                        path: `/dashboard/students/${item.name.toLowerCase().replace(" ", "-")}}`,
                        query: {
                            id: item.id,
                        }
                    })
                    break;
                default:
                    this.$router.push(`/dashboard/users`)
                    break;
            }
        },
        onClearFilter() {
            this.selectedRole = ''
            this.keyword = ''
            this.$emit('getUserList', 1, '')
        },  
        onBlurSearch(word) {
            this.$emit('getUserList', 1, this.selectedRole, !!word ? word : '')
        },
        detailUser(row) {
            localStorage.setItem('userId', toEncrypt(row?.item?.id))
            this.$router.push({
                path: `/dashboard/students/${row?.item?.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`,
            })
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/micro/table/student-table.scss";
    .name-link {
        font-weight: inherit;
        font-size: 14px;
        line-height: inherit;
        color: var(--bs-primary);
    
        &:hover {
            color: var(--bs-primary) !important;
        }
    }
</style>
