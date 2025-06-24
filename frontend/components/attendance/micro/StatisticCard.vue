<template>
    <div>
        <div class="d-flex flex-row justify-content-between align-items-center">
            <h5>Absensi</h5>

            <!-- <b-dropdown
                variant="transparent"
                class="more-menu border rounded"
                toggle-class="p-1"
                size="sm"
                no-caret
                right
            >
                <template #button-content>
                    <div class="d-flex align-items-center">
                        <i class="ri-more-line" style="font-size: 20px"></i>
                    </div>
                </template>
                <b-dropdown-item @click="$emit('onEdit')">
                    <i class="ri-edit-line"></i><span>Edit Absensi</span>
                </b-dropdown-item>
                <b-dropdown-item @click="$emit('onDelete')">
                    <i class="ri-delete-bin-7-line text-danger"></i><span>Hapus Absensi</span>
                </b-dropdown-item>
            </b-dropdown> -->
        </div>

        <b-row>
            <b-col
                v-for="(item, idx) of attendanceStats"
                :key="idx"
                cols="4"
                class="border my-3"
            >
                <div class="d-flex py-1 justify-content-center align-items-center bg-stats rounded">
                    <div class="text-center">
                        <h3>{{ item?.name === 'percentage' ? `${item?.value}%` : item?.value }}</h3>
                        <p class="font-size: 12px">{{ item?.title }}</p>
                    </div>
                </div>
            </b-col>
        </b-row>

        <b-row>
            <b-col cols="12" md="6" class="mb-4 px-lg-0">
                <div class="row">
                    <Doughnat
                        v-if="!isChartBusy"
                        containerClass="col-12"
                        :chartProps="chartProps"
                        :chartData="chartData"
                        :showHeader="false"
                        :isCard="false"
                        :height="chartHeight"
                    />
                </div>
            </b-col>
            <b-col cols="12" md="6" class="mb-4 pl-lg-1">
                <b-row>
                    <b-col cols="6" ref="qrContainer">
                        <VueQRCodeComponent
                            v-if="!isQRBusy"
                            :text="urlQR"
                            :size="size"
                            error-level="L"
                        />
                    </b-col>
                    <b-col cols="6" class="pl-lg-1">
                        <div class="d-flex flex-row align-items-center gap-1 cursor-pointer" @click="onDownloadQR">
                            <p>Generate QR Code</p>
                            <p><i class="ri-refresh-line" style="font-size: 18px"></i></p>
                        </div>
                        <b-button
                            variant="primary"
                            class="btn-action-add py-1 mb-2"
                            block
                            @click="onDownloadQR"
                        >
                            <div hidden>
                                <VueQRCodeComponent
                                    v-if="!isQRBusy"
                                    ref="qrVariant"
                                    :text="urlQR"
                                    :size="800"
                                    error-level="L"
                                />
                            </div>
                            <div class="d-flex flex-row align-items-center gap-2 justify-content-center">
                                <i class="ri-download-line" style="font-size: 14px"></i>
                                JPG
                            </div>
                        </b-button>
                        <b-button variant="primary" class="py-1 w-100" @click="isShowPreviewQR = !isShowPreviewQR">Preview</b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

        <!-- Modal Preview QR Code -->
        <b-modal
            v-model="isShowPreviewQR"
            hide-footer
            title="Preview"
            centered
            header-class="px-3 px-lg-4 pt-3 pt-lg-4 pb-3"
            body-class="px-3 px-lg-4 pb-3 pb-lg-4 pt-0"
        >
            <VueQRCodeComponent
                v-if="!isQRBusy"
                ref="qrVariant"
                :text="urlQR"
                error-level="L"
                class="qr-code--wrapper"
            />
        </b-modal>
    </div>
</template>

<script>
import VueQRCodeComponent from 'vue-qrcode-component'
import Doughnat from '~/components/template/micro/chart/Doughnat.vue'

export default {
    components: { Doughnat, VueQRCodeComponent },
    props: {
        attendanceStats: {
            type: Array,
            default: () => []
        },
        chartProps: {
            type: Object,
            default: () => {}
        },
        chartData: {
            type: Object,
            default: () => {}
        },
        urlQR: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            screenWidth: 0,
            size: 0,
            isQRBusy: true,

            chartHeight: 0,
            isChartBusy: true,
            isShowPreviewQR: false,
        }
    },
    watch: {
        screenWidth() {
            this.isQRBusy = true
            this.isChartBusy = true

            const qrContainer = this.$refs?.qrContainer
            this.size = qrContainer?.clientWidth - 25

            if (this.screenWidth > 480) {
                this.chartHeight = 175
            } else {
                this.chartHeight = 225
            }

            setTimeout(() => {
                this.isQRBusy = false
                this.isChartBusy = false
            }, 100)
        }
    },
    methods: {
        handleResize() {
            this.screenWidth = window.innerWidth
        },
        onDownloadQR() {
            const qrVariant = this.$refs?.qrVariant
            const canvasQR = qrVariant?.qrCode?._oDrawing?._elCanvas
            const tempQR = new Image
            tempQR.src = canvasQR.toDataURL('image/png')

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = 850
            canvas.height = 850

            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(tempQR, 25, 25)

            const download = document.createElement('a')
            const name = Date.now()

            download.download = name
            download.href = canvas.toDataURL('image/png')
            download.click()
            download.remove()
        }
    },
    mounted() {
        this.handleResize()
    },
    created() {
        window.addEventListener('resize', this.handleResize)
    },
    destroyed() {
        window.addEventListener('resize', this.handleResize)
    },
}
</script>

<style scoped lang="scss">
.qr-code--wrapper ::v-deep{
    width: 100%;
    aspect-ratio: 1 / 1;

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
