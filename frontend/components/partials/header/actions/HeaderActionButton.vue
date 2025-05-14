<template>
    <NuxtLink
      :href="to"
      :class="'px-3 py-2 text-md bg-primary text-white rounded d-flex align-items-center gap-2 max-w-max', classes"
    >
      <i :class="icon"></i>
      {{ label }}
    </NuxtLink>
</template>
  
<script setup>
defineProps({
    label: { type: String, required: true },
    icon: { type: String, default: 'ri-add-fill' },
    to: { type: String, required: true },
    classes: { type: String },
})
</script>
