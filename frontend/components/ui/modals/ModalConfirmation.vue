<template>
    <BModal
        id="modal-confirmation"
        :show="modelValue"
        no-header
        no-footer
        :title="title"
        centered
        scrollable
        @ok="onOk"
        @cancel="onCancel"
        :ok-title="okTitle"
        :cancel-title="cancelTitle"
        :ok-variant="okVariant"
        :cancel-variant="cancelVariant"
    >
        <div class="modal-content-wrapper">
            <p class="modal-message">
                Apakah anda yakin akan menghapus <strong>{{ itemName }}</strong>?
            </p>
            <div class="modal-action">
                <button class="btn btn-primary" @click="emitCancel">{{ cancelTitle }}</button>
                <button class="btn btn-danger" @click="emitConfirm">{{ okTitle }}</button>
            </div>
        </div>
    </BModal>
</template>

<script setup>
import { BModal } from 'bootstrap-vue-next'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: 'Konfirmasi',
    },
    okTitle: {
        type: String,
        default: 'OK'
    },
    cancelTitle: {
        type: String,
        default: 'Batal'
    },
    okVariant: {
        type: String,
        default: 'primary'
    },
    cancelVariant: {
        type: String,
        default: 'secondary'
    },
    itemName: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

function emitConfirm() {
    emit('update:modelValue', false)
    emit('confirm')
}

function emitCancel() {
    emit('update:modelValue', false)
    emit('cancel')
}

</script>

<style lang="scss" scoped>
#modal-confirmation {

    .modal-content-wrapper {
        padding-inline: 12px;

        .modal-message {
            font-size: large;
            font-weight: 500;
            margin-bottom: 30px;
        }
        .modal-action {
            display: flex;
            align-items: center;
            justify-content: end;
            gap: 8px;
        }
    }
}
</style>