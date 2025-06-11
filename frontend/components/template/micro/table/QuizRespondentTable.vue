<template>
    <div class="col">
        <div class="card">
            <!-- Card header -->
            <div class="card-header">
                <div class="row">
                    <div class="col-6 d-flex align-items-center">
                        <div
                            @click="backButton"
                            class="
                                mr-3
                                text-white
                                shadow
                                d-inline-block
                                btn
                                icon icon-shape
                                bg-dark
                                rounded-circle
                            "
                        >
                            <i class="ni ni-bold-left"></i>
                        </div>
                        <h3 class="mb-0">{{ quizDetail.title || "Daftar Perespon" }}</h3>
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
                        pagination.currentPage == 1
                            ? data.index + 1
                            : data.index +
                              (pagination.currentPage == 2
                                  ? pagination.currentPage * 5 + 1
                                  : (pagination.currentPage - 1) * 10 + 1)
                    }}
                </template>

                <template #cell(action)="row">
                    <b-button
                        size="sm"
                        variant="primary"
                        @click="onClickOpen(row.item)"
                    >
                        <span class="btn-inner--text">Lihat</span>
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
                class="mx-4"
                align="right"
                v-model="pagination.currentPage"
                :total-rows="pagination.totalRows"
                :per-page="pagination.perPage"
                @input="pageChange"
            ></b-pagination>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    components: {},
    props: {
        isBusy: Boolean,
        fields: {
            type: Array,
        },
        items: {
            type: Array,
            default: [],
        },
        quizDetail: {
            type: Object,
            default: {}
        },
        pagination: {
            type: Object,
            default: {
                currentPage: 1,
                perPage: 10,
                totalRows: 50,
            },
        },
    },
    data() {
        return {};
    },
    filters: {},
    computed: {
        ...mapState({
            authState: (state) => state.Auth,
        })
    },
    mounted() {
        // Set the initial number of items
        this.pagination.totalRows = this.items.length;
    },
    methods: {
        backButton() {
            this.$emit("backHanlde")
        },
        pageChange(data) {
            this.$emit("page", data);
        },
        async onClickOpen(item) {
            // // console.log(item);

            const responseId = "responseId=" + item.responseId
            const redirectLms = "redirectTo=" + window.location.href

            const urlForm = process.env.formURL + "/preview?" + responseId + "&" + redirectLms

            // // console.log(url)
            // window.open(url, "_blank")

            // await this.$store.dispatch("Auth/getAppToken");

            // if (!this.authState.status) {
            //     console.error(
            //         "Failed to get app token",
            //         this.authState.message
            //     );
            //     this.isLoaded = true;
            // } else {
                const baseUrl = process.env.alkademiAuth;
                // const appToken = "appToken=" + this.authState.appToken;
                const redirect = "&redirectTo=" + urlForm;
                const lmsId = "&lmsId=" + localStorage.getItem('lmsId');

                // const url = `${baseUrl}/check?${appToken}${redirect}${lmsId}`;
                const url = `${baseUrl}/check?${redirect}${lmsId}`;

                // setTimeout(() => {
                // this.isLoaded = true;
                window.open(url, "_blank");
                // console.log("URL: ", url)
                // }, 1000);
            // }
        },
    },
};
</script>

<style lang="scss" scoped>
.td {
    vertical-align: middle !important;
}
</style>