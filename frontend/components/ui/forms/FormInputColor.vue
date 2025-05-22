<template>
    <div>
      <label class="fw-medium mb-2">{{ label }}</label>
      <ul class="d-flex align-items-center gap-2 list-unstyled mb-0">
        <li
          v-for="color in colorList"
          :key="color"
          class="d-flex align-items-center justify-content-center rounded-pill"
          :style="{
            width: '50px',
            height: '50px',
            backgroundColor: color,
            cursor: 'pointer',
            border: modelValue === color ? '2px solid #0d6efd' : '2px solid #ffffff'
          }"
          @click="selectColor(color)"
        >
          <i
            v-if="modelValue === color"
            class="ri-check-line d-flex align-items-center justify-content-center text-2xl rounded-pill"
            style="width: 40px; height: 40px; color: #fff; background: rgba(0,0,0,0.12);"
          ></i>
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
    emit('update:modelValue', color);
  }
  </script>