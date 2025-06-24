<template>
    <b-modal
        v-model="isModalOpen"
        size="md"
        centered
        hide-header
        hide-footer
    >
        <b-row>
            <b-col cols="12" v-if="!isBusy">
                <VueQRCodeComponent
                    ref="sourceQR"
                    :text="url"
                    :size="size"
                    error-level="L"
                />
            </b-col>
            <b-col cols="12">
                <b-button
                    variant="primary"
                    class="btn-action-add mt-4"
                    block
                    @click="onDownloadClick"
                >Download QR</b-button>
            </b-col>
        </b-row>
    </b-modal>
</template>
<script>
import VueQRCodeComponent from 'vue-qrcode-component'

export default {
    components: { VueQRCodeComponent },
    props: {
        url: {
            type: String,
            default: ''
        },
        onOpenModal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isModalOpen: false,
            size: 450,
            screenWidth: 0,
            isBusy: true
        }
    },
    watch: {
        onOpenModal() {
            this.isModalOpen = this.onOpenModal
        },
        isModalOpen() {
            if (!this.isModalOpen) this.$emit('openModal')
        },
        screenWidth() {
            if (this.screenWidth < 480) {
                this.size = this.screenWidth - 65
            } else if (this.screenWidth <= 481) {
                this.size = this.screenWidth - 75
            } else if (this.screenWidth <= 575) {
                this.size = this.screenWidth - 85
            } else {
                this.size = 450
            }
            this.isBusy = false
        },
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
    methods: {
        handleResize() {
            this.isBusy = true
            this.screenWidth = window.innerWidth
            this.isBusy = false
        },
        onDownloadClick() {
            const sourceQR = this.$refs?.sourceQR
            const canvasQR = sourceQR?.qrCode?._oDrawing?._elCanvas
            const tempQR = new Image
            tempQR.src = canvasQR.toDataURL('image/png')

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = this.size + 50
            canvas.height = this.size + 50

            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(tempQR, 25, 25)

            const download = document.createElement('a')
            const name = Date.now()

            download.download = name
            download.href = canvas.toDataURL('image/png')
            download.click()
            download.remove()
        },
    }
}
</script>
