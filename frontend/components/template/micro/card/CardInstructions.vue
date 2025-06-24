<template>
    <b-row>
        <b-col md="6">
            <b-card no-body class="overflow-hidden">
                <b-card-body>
                    <b-row no-gutters align-v="center">
                        <b-col md="12" class="mb-3" style="height: 95px">
                            <b-img center :src="srcLogoDark" alt="Left image" width="140"></b-img>
                        </b-col>
                        <b-col md="12" class="mb-1">
                            <div class="text-center">
                                <b-card-title class="mb-0">1. Daftar di <a href="https://alkademi.com">Alkademi.com</a></b-card-title>
                            </div>
                        </b-col>
                        <!-- <b-col md="12">
                            <div class="text-center">
                                <b-button
                                    pill
                                    variant="success"
                                    style="color: white"
                                    @click="showConfirmModal">
                                    Pilih Program
                                </b-button>
                            </div>
                        </b-col> -->
                    </b-row>
                </b-card-body>
            </b-card>
        </b-col>
        <b-col md="6">
            <b-card no-body class="overflow-hidden">
                <b-card-body>
                    <b-row no-gutters align-v="center">
                        <b-col md="12" class="mb-3 d-flex align-items-center" style="height: 95px;">
                            <b-img center fluid src="@/assets/img/brand/akademio.png" alt="Left image" width="140"></b-img>
                        </b-col>
                        <b-col md="12" class="mb-1">
                            <div class="text-center">
                                <b-card-title class="mb-0">2. Daftar di <a href="https://akademio.id">Akademio.id</a> </b-card-title>
                            </div>
                        </b-col>
                        <!-- <b-col md="12">
                            <div class="text-center">
                                <b-button
                                    pill
                                    variant="success"
                                    style="color: white"
                                    @click="showConfirmModal">
                                    Pilih Program
                                </b-button>
                            </div>
                        </b-col> -->
                    </b-row>
                </b-card-body>
            </b-card>
        </b-col>
        <b-col md="6">
            <b-card no-body class="overflow-hidden">
                <b-card-body>
                    <b-row no-gutters align-v="center">
                        <b-col md="12" class="mb-3 d-flex align-items-center" style="height: 95px;">
                            <b-img center fluid src="@/assets/img/brand/akademio.png" alt="Left image" width="140"></b-img>
                        </b-col>
                        <b-col md="12" class="mb-1">
                            <div class="text-center">
                                <b-card-title class="mb-0">3. Tunggu email konfirmasi untuk mendapat voucher pelatihan di akademio</b-card-title>
                            </div>
                        </b-col>
                        <!-- <b-col md="12">
                            <div class="text-center">
                                <b-button
                                    pill
                                    variant="success"
                                    style="color: white"
                                    @click="showConfirmModal">
                                    Pilih Program
                                </b-button>
                            </div>
                        </b-col> -->
                    </b-row>
                </b-card-body>
            </b-card>
        </b-col>
        <b-col md="6">
            <b-card no-body class="overflow-hidden">
                <b-card-body>
                    <b-row no-gutters align-v="center">
                        <b-col md="12" class="mb-3 d-flex align-items-center" style="height: 95px;">
                            <b-img center fluid src="@/assets/img/brand/akademio.png" alt="Left image" width="140"></b-img>
                        </b-col>
                        <b-col md="12" class="mb-1">
                            <div class="text-center">
                                <b-card-title class="mb-0">4. Ikuti petunjuk pada email yang terdaftar pada akademio</b-card-title>
                            </div>
                        </b-col>
                        <!-- <b-col md="12">
                            <div class="text-center">
                                <b-button
                                    pill
                                    variant="success"
                                    style="color: white"
                                    @click="showConfirmModal">
                                    Pilih Program
                                </b-button>
                            </div>
                        </b-col> -->
                    </b-row>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import moment from 'moment'

export default {
    props: {
        events: Array,
        isBusy: Boolean,
    },
    filters: {
        beautifyDate(date) {
            return moment(date).locale('ID').fromNow()
        },
    },
    data() {
        return {
            srcLogoDark: '',
        }
    },
    mounted() {
        this.srcLogoDark = localStorage.getItem('logo-dark')
    },
    methods: {
        goDetail(code) {
            const id = code.charAt(4)

            this.$router.push(`/dashboard/events/${id}`)
        }
    }

}
</script>

<style lang="scss" scoped>
.timeline-one-side .timeline-content {
    max-width: 100%;
    width: inherit !important;
}
</style>
