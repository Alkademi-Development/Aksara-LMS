<template>
    <div>
      <label class="fw-medium mb-2">{{ label }} <span class="text-danger" v-if="required">*</span></label>
      <ul class="d-flex align-items-center gap-2 flex-wrap flex-md-nowrap list-unstyled mb-0">
        <li
          v-for="color in colorList"
          :key="color"
          class="d-flex align-items-center justify-content-center rounded-pill"
          :style="{
            width: '50px',
            height: '50px',
            backgroundColor: color,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }"
          @click="!disabled && selectColor(color)"
        >
          <i
            v-if="modelValue === color"
            class="ri-check-line d-flex align-items-center justify-content-center text-2xl rounded-pill text-white p-1 border border-3 border-white"
            style="width: 40px; height: 40px;"
          ></i>
        </li>
        <!-- Tambakan satu li lagi untuk yg no color atau disable color -->
        <li 
            class="d-flex align-items-center justify-content-center rounded-pill bg-white border border-3 border-danger"
            style="width: 50px; height: 50px;"
            v-if="disabled"
        >
            <i class="ri-blur-off-line d-flex align-items-center justify-content-end text-2xl rounded-pill text-danger"></i>
        </li>
      </ul>
      <div v-if="error" class="small text-danger mt-1">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: "",
    },
    colors: {
      type: Array,
      default: () => [
        "#ffe1cc",
        "#d3f5ec",
        "#ffd6e0",
        "#e9e7fd",
        "#e0f2fe",
        "#fff8db",
        "#dcfce7",
        "#fee2e2",
      ]
    },
    error: String,
    label: {
      type: String,
      default: "Pilih Warna"
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue']);
  
  const colorList = computed(() => props.colors?.length ? props.colors : [
    "#ffe1cc",
    "#d3f5ec",
    "#ffd6e0",
    "#e9e7fd",
    "#e0f2fe",
    "#fff8db",
    "#dcfce7",
    "#fee2e2",
  ]);
  
  function selectColor(color) {
    console.log(color);
    emit('update:modelValue', color);
  }
  </script>