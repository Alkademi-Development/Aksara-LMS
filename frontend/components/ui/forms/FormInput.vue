<template>
    <BFormGroup
        :label="label"
        :description="description"
        :valid-feedback="validFeedback"
        :invalid-feedback="error"
        :state="inputState"
        class="w-100"
    >
        <!-- Label -->
        <template #label>
            <span class="fw-medium">
                {{ label }}
                <span v-if="required" class="text-danger">*</span>
            </span>
        </template>
        <!-- File Input -->
        <BFormFile 
            v-if="type === 'file'"
            :required="required"
            :accept="accept"
            @change="onFileChange"
            :state="inputState"
            class="w-100"
        />
        <!-- Regular Input with suffix -->
        <div class="position-relative w-100" v-else>
            <BFormInput 
                :type="type"
                :placeholder="placeholder"
                :required="required"
                :value="modelValue"
                @input="(e) => $emit('update:modelValue', e.target.value)"
                :state="inputState"
                :class="[
                    'w-100', 
                    suffixIcon ? (error ? 'pe-9' : valid ? 'pe-9' : 'pe-7') : ''
                ]"
            />
            <!-- Suffix Icon -->
            <span
                v-if="suffixIcon"
                @click="onSuffixClick"
                class="form-input-suffix"
                :class="{ 'with-error': !!error, 'with-valid': valid && !error }"
            >
                <slot name="suffix">
                    <i :class="[suffixIcon, 'text-lg']"></i>
                </slot>
            </span>
        </div>
    </BFormGroup>
</template>

<script setup>
import { BFormGroup, BFormFile, BFormInput } from "bootstrap-vue-next";

const props = defineProps({
    modelValue: [String, Number, File, null],
    label: String,
    id: {
        type: String,
        default: () => `input-${Math.random().toString(36).substring(2, 10)}`,
    },
    type: {
        type: String,
        default: "text",
    },
    error: {
        type: String,
        default: ''
    },
    valid: {
        type: Boolean,
        default: false
    },
    validFeedback: {
        type: String,
        default: "Looks good!"
    },
    placeholder: String,
    error: String,
    description: String,
    required: Boolean,
    accept: String,
    suffixIcon: String,
    onSuffixClick: Function,
})

const emit = defineEmits(['update:modelValue']);

const inputState = computed(() => {
    if (props.error) return false;
    if (props.valid) return true;
    return null;
});

function onFileChange(e) {
    const file = e.target.files[0] || null;
    emit('update:modelValue', file);
}

</script>

<style lang="scss" scoped>

// .form-control {
//     padding: 0.8rem 1rem;
// }

.form-input-suffix {
    position: absolute;
    right: 1rem;
    top: 52%;
    transform: translateY(-50%);
    cursor: pointer;

    &.with-error, 
    &.with-valid {
        right: 2rem
    }
}

</style>