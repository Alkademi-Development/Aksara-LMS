<template>
    <div class="col">
        <div class="card">
            <!-- Card header -->
            <div class="card-header">
                <div class="row">
                    <div class="col-6">
                        <h3 class="mb-0">Daftar Tugas Peserta</h3>
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
                    {{
                        pagination.page == 1
                        ? data.index + 1
                        : data.index + (pagination.page == 2 ? pagination.page * 5 + 1 : (pagination.page - 1) * 10 + 1 )
                    }}
                </template>

                <template #cell(submitted_at)="row">
                        {{ (row?.item?.submitted_at ? toDateFromNow(row?.item?.submitted_at) : 'Belum Mengumpulkan Tugas') }}
                </template>

                <template #cell(task)="data">
                    <!-- <b-button size="sm" variant="primary" @click="onClickTask(data.item.studioId, 'jongstudio')" v-show="data.item.studioId">
                        <span class="btn-inner--text">Jong Studio</span>
                    </b-button> -->
                    <b-button size="sm" variant="warning" @click="onClickTask(data.item.link, 'other')" v-if="data.item.link != '' && data.item.type == 'link'">
                        <span class="btn-inner--text">Link Tugas</span>
                    </b-button>
                    <b-button size="sm" variant="primary" @click="onClickTask(data.item.externalId, 'compiler')" v-if="data.item.externalId != '' && data.item.type == 'studio'">
                        <span class="btn-inner--text">Lihat Editor</span>
                    </b-button>
                    <b-button size="sm" variant="secondary" @click="onClickTask(data.item.externalId, 'form')" v-if="data.item.externalId != '' && data.item.type == 'form'">
                        <span class="btn-inner--text">Lihat Form</span>
                    </b-button>
                </template>

                <template #cell(action)="row">
                    <b-button size="sm" variant="primary" @click="onClickScore(row.item)">
                        <span class="btn-inner--text">Ubah Nilai</span>
                    </b-button>
                    <b-button size="sm" variant="success" @click="onClickDownload(row.item.files)" v-show="row.item.files">
                        <span class="btn-inner--text">Download</span>
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
                @change="onUpdatePage"
            ></b-pagination>
        </div>
        <b-modal
            centered
            hide-footer
            v-if="isModalOpen"
            v-model="isModalOpen"
            @hide="closeModal"
            id="score-modal"
            :title="studentSelected.userName"
            body-class="container"
            size="md"
        >
            <!-- <b-row>
                <b-col> -->
                    <TaskForm
                        action="verify"
                        :classroomId="classroomId"
                        :topicId="topicId"
                        :studentId="studentSelected.userId"
                        :verified="verified"
                        :score="parseInt(studentSelected.score)"
                        :mentorNotes="studentSelected.mentorNotes"
                        @verifyTask="verifyTask"
                    />
                <!-- </b-col>
            </b-row> -->
        </b-modal>
    </div>
</template>

<script>
import moment from 'moment';
import TaskForm from '@/components/template/micro/form/TaskForm.vue';
import { toDateFromNow } from '@/commons/utils/.'
import appToken from '~/api/app-token'

export default {
    components: {
        TaskForm
    },
    props: {
        classroomId: Number,
        topicId: Number,
        isBusy: Boolean,
        role: String,
        counter: Object,
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
            studentSelected: null,
            isModalOpen: false,
            verified: null
        };
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        date: function (value) {
            if (!value) return 'Belum Mengumpulkan Tugas';
            return moment(value).fromNow();
        }
    },
    mounted() {
        // Set the initial number of items
        this.pagination.totalItems = this.items.length;
    },
    methods: {
        onClickTask (url, type) {
            if(type == 'jongstudio') {
                var token = localStorage.getItem('access_token')
                const EDITOR_URL = process.env.editorURL;

                window.open(`${EDITOR_URL}editor?editor_id=${url}&token=${token}`, '_blank');
            } else if (type == 'compiler') {
                // this.$emit('openCompiler', url)
                this.openForm(url, type)
            } else if (type == 'form') {
                this.openForm(url, type)
            } else {
                window.open(url, '_blank');
            }
        },
        async openForm(id, type) {

            const responseId = "&responseId=" + id
            const redirectLms = "&redirectTo=" + window.location.href

            var urlTarget = ''
            if (type == 'compiler') urlTarget = process.env.editorURL + `compiler?&metronomId=${id}` + redirectLms
            if (type == 'form') urlTarget = process.env.formURL + "/preview?" + responseId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const code = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            const url = `${baseUrl}/check?${redirect}${lmsId}${code}${generatedToken}`;

            window.open(url, '_blank')
        },
        onClickScore (item) {
            // this.studentSelected = item;
            // this.verified = item.verified;
            // this.isModalOpen = true;
            // this.$bvModal.show('score-modal');
            this.$router.push(`${this.topicId}/scoring/${item.userId}`)
        },
        closeModal () {
            this.studentSelected = null;
            // this.verified = null;
            this.isModalOpen = false;
            this.$bvModal.hide('score-modal');
        },
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },
        onClickDownload (files) {
            window.open(files, '_blank');
        },
        verifyTask () {
            this.closeModal();
            this.$emit('updateData');
        },
        toDateFromNow
    }
}
</script>

<style lang="scss" scoped>
    .td {
        vertical-align: middle !important;
    }
</style>