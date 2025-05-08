<template>
    <header class="position-sticky top-0">
        <div
            class="bg-white border-bottom px-4 pt-5"
        >
            <div class="d-grid" style="grid-template-columns: 1fr auto; align-items: start; gap: 1rem; min-width: 0;">
                <div class="overflow-hidden">
                    <Breadcrumb />
                </div>
                
                <div class="d-flex flex-column align-items-end">
                    <button
                        type="button"
                        @click="$emit('toggle-sidebar')"
                        class="d-block d-xl-none px-2 py-1 rounded bg-white border"
                    >
                        <i :class="`${sidebarShowIcon} text-lg`"></i>
                    </button>
                    <component :is="actionContentComponent" v-if="actionContentComponent" />
                </div>
            </div>
            
            <component :is="extraContentComponent" v-if="extraContentComponent" />
        </div>
    </header>
  </template>

<script setup>
import Breadcrumb from "@/components/partials/Breadcrumb.vue"
import { extraHeaderComponents, actionHeaderComponents } from '@/utils/constants/header'

const props = defineProps({
  isSidebarVisible: Boolean
})

const sidebarShowIcon = computed(() =>
  props.isSidebarVisible ? 'ri-close-line' : 'ri-menu-line'
)

const route = useRoute();

const extraContentComponent = computed(() => {
  const loader = extraHeaderComponents[route.name]
  return loader ? defineAsyncComponent(loader) : null
})

const actionContentComponent = computed(() => {
  const loader = actionHeaderComponents[route.name]
  return loader ? defineAsyncComponent(loader) : null
})

</script>

<style scoped>

</style>