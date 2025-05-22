<template>
  <div class="multiple-select" ref="multipleSelectRef">
    <label class="fw-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <div 
        class="select-box" 
        :class="{ 'border border-danger': !!errorMessage }" 
        @click="toggleDropdown"
        tabindex="0"
        @blur="blurred = true;"
    >
      <span v-if="!selectedOptions.length">{{ placeholder }}</span>
      <span class="text-black" v-else>{{ selectedOptions.length }} dipilih</span>
      <i :class="['text-lg', dropdownOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line']"></i>
    </div>

    <div v-if="dropdownOpen" class="dropdown-list">
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        @click.stop="toggleSelect(option.value)"
      >
        <input
          type="checkbox"
          :checked="isSelected(option.value)"
          @change.stop="toggleSelect(option.value)"
        />
        <span class="option-label">{{ option.label }}</span>
      </div>
    </div>

    <!-- Selected tags -->
    <div :class="['selected-tags mt-2', tagPosition == 'vertical' ? 'vertical' : 'horizontal']">
      <div
        v-for="option in selectedOptions"
        :key="option.value"
        class="selected-tag"
      >
        {{ option.label }}
        <span class="remove-tag" @click="removeOption(option.value)">×</span>
      </div>
    </div>

    <div v-if="errorMessage" class="text-danger" style="display:block;">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, required: true },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "Pilih..." },
  required: { type: Boolean, default: false },
  tagPosition: { type: String, default: 'vertical '},
  error: { type: String, default: "" },   
  customMessages: {
    type: Object,
    default: () => ({
      valueMissing: "{label} wajib diisi.",
    })
  }
});
const emit = defineEmits(["update:modelValue"]);

const dropdownOpen = ref(false);
const blurred = ref(false);

// 1. Ref untuk root komponen
const multipleSelectRef = ref(null);

// 2. Fungsi click outside
function handleClickOutside(event) {
  if (
    multipleSelectRef.value &&
    !multipleSelectRef.value.contains(event.target)
  ) {
    dropdownOpen.value = false;
  }
}

// 3. Watch dropdownOpen untuk pasang/lepas event listener
watch(dropdownOpen, (val) => {
  if (val) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }
});

// 4. Clean up jika komponen di-unmount
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function isSelected(val) {
  return props.modelValue.includes(val);
}

function toggleSelect(val) {
  let newValue = [...props.modelValue];
  if (newValue.includes(val)) {
    newValue = newValue.filter(v => v !== val);
  } else {
    // Batasi jika max > 0
    if (props.max > 0 && newValue.length >= props.max) return;
    newValue.push(val);
  }
  emit("update:modelValue", newValue);
}

function removeOption(val) {
  emit("update:modelValue", props.modelValue.filter(v => v !== val));
}

const selectedOptions = computed(() =>
  props.options.filter(opt => props.modelValue.includes(opt.value))
);

const errorMessage = computed(() => {
    if (!blurred.value) return "";
    if (props.error) return props.error;
    // Internal validation
    if (props.required && props.modelValue.length === 0)
        return props.customMessages.valueMissing.replace("{label}", props.label || "Field");
    return "";
});
</script>

<style scoped>
.multiple-select {
  width: 100%;
  position: relative;
}
.select-box {
  border: 1px solid var(--grey);
  border-radius: 6px;
  padding: 0.7rem 1rem;
  background: var(--white);
  cursor: pointer;
  position: relative;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: auto;
  transition: border-color .15s;
}
.arrow {
  font-size: 1rem;
  color: var(--grey2);
}
.dropdown-list {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  background: var(--white);
  border: 1px solid var(--grey);
  border-radius: 6px;
  box-shadow: 0 2px 10px var(--grey);
  margin-top: 4px;
  max-height: 220px;
  overflow-y: auto;
}
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  user-select: none;
  transition: all .1s;
}
.dropdown-item:hover {
  background: var(--grey4);
}
.option-label {
  margin-left: 0.6rem;
}
.selected-tags {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  
    &.vertical {
        flex-direction: column;
    }
  
    &.horizontal {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .selected-tag {
        background: var(--grey);
        color: var(--grey4);
        border-radius: 7px;
        padding: 0.55rem 1rem 0.55rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1rem;
        font-weight: 400;
    }
    .remove-tag {
        margin-left: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.1rem;
        color: var(--black);
        transition: color .15s;
    }
}
</style>