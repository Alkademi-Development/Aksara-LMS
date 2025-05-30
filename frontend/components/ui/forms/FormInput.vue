<template>
    <BFormGroup
        :label="label"
        :description="description"
        :valid-feedback="validFeedback"
        :invalid-feedback="errorMessage"
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

        <!-- Textarea Input -->
        <BFormTextarea
            v-else-if="type === 'textarea'"
            ref="inputRef"
            :placeholder="placeholder"
            :required="required"
            :value="modelValue"
            @input="onInput"
            @blur="onBlur"
            @invalid="onInvalid"
            :state="inputState"
            class="w-100"
            :minlength="min"
            :maxlength="max"
        />

        <!-- Select Input -->
        <BFormSelect
            v-else-if="type === 'select'"
            v-model="modelValueProxy"
            :options="options"
            :required="required"
            value-field="value"
            text-field="text"
            @blur="onBlur"
            @invalid="onInvalid"
            :state="inputState"
            class="w-100"
        />

        <!-- Radio Input -->
        <div v-else-if="type === 'radio'" class="d-flex flex-wrap gap-3">
            <BFormRadio
                v-for="opt in options"
                :key="String(opt.value)"
                ref="inputRef"
                :name="id"
                :value="opt.value"
                :checked="modelValue === opt.value"
                :required="required"
                @change="onInput"
                @blur="onBlur"
                @invalid="onInvalid"
                :state="inputState"
            >
                {{ opt.label }}
            </BFormRadio>
        </div>

        <!-- Checkbox Input -->
        <BFormCheckbox
            v-else-if="type === 'checkbox'"
            ref="inputRef"
            :required="required"
            :checked="modelValue"
            @change="onInput"
            @blur="onBlur"
            @invalid="onInvalid"
            :state="inputState"
            >
            {{ checkboxLabel || label }}
        </BFormCheckbox>
        
        <!-- Regular Input with suffix -->
        <div class="position-relative w-100" v-else>
            <BFormInput 
                ref="inputRef"
                :type="type"
                :placeholder="placeholder"
                :required="required"
                :min="min"
                :max="max"
                :value="modelValue"
                @input="onInput"
                @blur="onBlur"
                :state="inputState"
                :class="[
                    'w-100', 
                    suffixIcon ? (errorMessage ? 'pe-9' : valid ? 'pe-9' : 'pe-7') : ''
                ]"
            />
            <!-- Suffix Icon -->
            <span
                v-if="suffixIcon"
                @click="onSuffixClick"
                class="form-input-suffix"
                :class="{ 'with-error': !!errorMessage, 'with-valid': valid && !errorMessage }"
            >
                <slot name="suffix">
                    <i :class="[suffixIcon, 'text-lg']"></i>
                </slot>
            </span>
        </div>

        <p class="text-grey2 text-sm mt-1" v-if="helperText">{{ helperText }}</p>
    </BFormGroup>
</template>

<script setup>
import { BFormGroup, BFormFile, BFormTextarea, BFormCheckbox, BFormSelect, BFormRadio, BFormInput } from "bootstrap-vue-next";

const props = defineProps({
  modelValue: [String, Number, File, null],
  label: String,
  checkboxLabel: String,
  id: { type: String, default: () => `input-${Math.random().toString(36).substring(2, 10)}` },
  type: { type: String, default: "text" },
  error: { type: String, default: '' },
  valid: { type: Boolean, default: false },
  validFeedback: { type: String, default: "Terlihat bagus!" },
  placeholder: String,
  description: String,
  required: Boolean,
  accept: String,
  suffixIcon: String,
  onSuffixClick: Function,
  min: [String, Number],
  max: [String, Number],
  options: { // Untuk select/radio: [{label, value}]
    type: Array,
    default: () => []
  },
  helperText: {
    type: String,
    default: ''
  },
  // Tambahkan prop untuk pesan kustom
  customMessages: {
    type: Object,
    default: () => ({
      valueMissing: `{label} wajib diisi.`,
      typeMismatch: "Format tidak valid.",
      email: "Masukkan alamat email yang valid.",
      tooShort: "Isian terlalu pendek.",
      tooLong: "Isian terlalu panjang.",
      rangeUnderflow: "Nilai terlalu kecil.",
      rangeOverflow: "Nilai terlalu besar."
    })
  }
})

const emit = defineEmits(['update:modelValue', 'validation']);

const inputRef = ref(null);
const internalError = ref("");

const errorMessage = computed(() => props.error || internalError.value);

const inputState = computed(() => {
  if (errorMessage.value) return false;
  if (props.valid) return true;
  return null;
});

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: val => emit("update:modelValue", val)
});

function onInput(e) {
  emit('update:modelValue', e.target.value);
  validate(e.target);
}

function onBlur(e) {
  validate(e.target);
}

// Fungsi untuk mengatur pesan validasi custom
function onInvalid(e) {
  let msg = "";
  const validity = e.target.validity;
  const type = props.type;

  if (validity.valueMissing) {
    msg = props.customMessages.valueMissing.replace("{label}", props.label || "Field");
  } else if (validity.typeMismatch) {
    if (type === "email") {
      msg = props.customMessages.email;
    } else {
      msg = props.customMessages.typeMismatch;
    }
  } else if (validity.tooShort) {
    msg = props.customMessages.tooShort;
  } else if (validity.tooLong) {
    msg = props.customMessages.tooLong;
  } else if (validity.rangeUnderflow) {
    msg = props.customMessages.rangeUnderflow;
  } else if (validity.rangeOverflow) {
    msg = props.customMessages.rangeOverflow;
  }

  e.target.setCustomValidity(msg);
  internalError.value = msg;
  emit('validation', msg);
}

function validate(el) {
  // Reset customValidity agar pesan bisa berganti
  el.setCustomValidity('');
  if (!el.checkValidity()) {
    onInvalid({ target: el });
  } else {
    internalError.value = "";
    emit('validation', "");
  }
}

function onFileChange(e) {
  const file = e.target.files[0] || null;
  emit('update:modelValue', file);
}
</script>

<style lang="scss" scoped>

// .form-control {
//     padding: 0.8rem 1rem;
// }

.form-control.is-valid {
    background-image: none;
}

.form-input-suffix {
    position: absolute;
    right: 1rem;
    top: 52%;
    transform: translateY(-50%);
    cursor: pointer;

    // &.with-error, 
    // &.with-valid {
    //     // right: 2rem
    // }
}

</style>