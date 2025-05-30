<template>
    <BModal
        id="modal-participant-selection"
        :show="modelValue"
        no-header
        no-footer
        centered
        scrollable
        :size="size"
        title="Tambah Peserta"
    >
        <div class="modal-header pb-0">
            <h4 class="modal-title">{{ title }}</h4>
        </div>
        <div class="modal-body pt-2 pb-4">
            <FormMultipleSelect 
                :options="options"
                placeholder="Cari atau Pilih Email Mentor"
                tag-position="horizontal"
            />
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary px-3" @click="handleSubmit">
                Tambahkan
            </button>
            <button type="button" class="btn btn-danger px-3" @click="cancel">
                Batal
            </button>
        </div>
    </BModal>
</template>

<script setup>
import { BModal } from 'bootstrap-vue-next';
import FormMultipleSelect from '../forms/FormMultipleSelect.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
        default: true,
    },
    title: {
        type: String,
        default: 'Pilih Data',
    },
    size: { type: String, default: 'lg' },
    options: { type: Array, default: () => [] },
    selectedOptions: { type: Array, default: () => [] },
    placeholder: { type: String, default: "" },
    label: { type: String, default: "" },
    tagPosition: { type: String, default: "horizontal" }
});

const emit = defineEmits(['update:modelValue', 'update:selected', 'close']);

const internalSelected = ref([...props.selectedOptions]);

watch(
    () => props.selectedOptions,
    (val) => {
        internalSelected.value = [...val];
    }
)

function cancel() {
    emit("update:modelValue", false);
    emit("close");
}

function handleSubmit() {
    emit("update:selected", internalSelected.value);
    cancel();
}

</script>

<style lang="scss" scoped>

.modal-header {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-header, .modal-footer {
    border: none;
}

.modal-content, .modal-body {
    overflow: visible;
}

</style>