<template>
    <b-modal
        v-model="isModalOpen"
        size="md"
        centered
        hide-header
        hide-footer
    >
        <b-row>
            <b-col cols="12" class="text-center">
                <h4>{{ detailAttend?.name }}</h4>
                <p class="text-muted">{{ detailAttend?.email }}</p>
            </b-col>
        </b-row>
        <b-table
            id="datatables"
            head-variant="light"
            responsive
            show-empty
            tdClass="vertical-align: center"
            :fields="fields"
            :items="detailAttend.items"
        >
            <template #cell(proofAttendance)="data">
                <div class="d-flex flex-row align-items-center justify-content-center gap-3">
                    <div
                        v-for="(item, idx) of proofAttendItems"
                        :key="idx"
                        :class="[
                            'pointer',
                            checkData(item.action, data.item) ? 'color-primary' : 'color-muted',
                        ]"
                        @click="onDetailProofClick(item.action, data.item)"
                    >
                        <i :class="item.value" style="font-size: 1.25rem"></i>
                    </div>
                </div>
            </template>
        </b-table>
    </b-modal>
</template>

<script>
import { TABLE_DETAIL_ATTENDANCE } from '~/commons/constants/attendance'

export default {
    props: {
        onOpenModal: {
            type: Boolean,
            default: false
        },
        detailAttend: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            isModalOpen: false,

            fields: TABLE_DETAIL_ATTENDANCE,
            proofAttendItems: [
                // { value: 'ri-qr-scan-line', action: 'selfie' },
                { value: 'ri-map-pin-2-line', action: 'location' },
                { value: 'ri-edit-box-fill', action: 'signature' },
            ]
        }
    },
    watch: {
        onOpenModal() {
            this.isModalOpen = this.onOpenModal
        },
        isModalOpen() {
            if (!this.isModalOpen) this.$emit('openModal')
        },
    },
    methods: {
        checkData(action, data) {
            return (action === "signature" && data.signature) ||
                // (action === "selfie" && data.selfie) ||
                (action === "location" && data.latitude != null && data.longitude != null)
        },
        onDetailProofClick(action, data) {
            if (this.checkData(action, data)) {
                this.$emit('onPreviewClick', { action, data })
            }
        },
    }
}
</script>
