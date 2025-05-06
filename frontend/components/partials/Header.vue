<template>
    <header class="relative bg-white border-bottom px-4 py-5">
        <div class="d-flex align-items-start justify-content-between">
            <Breadcrumb />
            <button type="button" @click="$emit('toggle-sidebar')" class="d-block d-xl-none px-2 py-1 rounded bg-white border">
                <i :class="`${sidebarShowIcon} text-lg`"></i>
            </button>
        </div>
    </header>
</template>

<script setup>
import Breadcrumb from "@/components/partials/Breadcrumb.vue"

const props = defineProps({
  isSidebarVisible: Boolean
})

const sidebarShowIcon = computed(() =>
  props.isSidebarVisible ? 'ri-close-line' : 'ri-menu-line'
)

</script>

<style scoped>

</style>