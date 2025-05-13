<template>
    <BModal
        :show="isLoading"
        no-header
        no-footer
        centered
        scrollable
        size="md"
    >
        <div class="d-flex align-items-center justify-content-center gap-3">
            <BSpinner label="Loading..." class="spinner" />
            <span class="fw-bolder text-lg">Mohon Tunggu</span>
        </div>
    </BModal>
</template>

<script setup>
import { BModal, BSpinner } from 'bootstrap-vue-next'

const props = defineProps({
    isLoading: {
        type: Boolean,
        required: true,
        default: true
    } 
})

</script>

<style lang="scss" scoped>
.spinner {
  width: 1.5rem;
  height: 1.5rem;
}

:global(.dark .modal-body) {
    background-color: var(--black2);
    color: white;
} 

</style>