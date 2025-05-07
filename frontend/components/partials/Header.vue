<template>
    <header class="relative">
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
                    <!-- <button type="button" class="mt-3 px-3 py-2 fs-6 bg-primary text-white rounded d-flex align-items-center gap-2">
                        <i class="ri-add-fill"></i>
                        Kelas
                    </button> -->
                </div>
            </div>
            
            <component :is="extraContentComponent" v-if="extraContentComponent" />
        </div>
    </header>
  </template>

<script setup>
import Breadcrumb from "@/components/partials/Breadcrumb.vue"
import FilterTabsClassroom from "@/components/partials/header/extras/FilterTabsClassroom.vue"
import BadgeStatusRegistration from "@/components/partials/header/actions/BadgeStatusRegistration.vue"

const props = defineProps({
  isSidebarVisible: Boolean
})

const sidebarShowIcon = computed(() =>
  props.isSidebarVisible ? 'ri-close-line' : 'ri-menu-line'
)

const route = useRoute();

const extraHeaderComponent = {
    'dashboard-classroom': FilterTabsClassroom,
}
const extraContentComponent = computed(() => extraHeaderComponent[route.name] || null);

const actionHeaderComponent = {
    'dashboard-classroom-slug': BadgeStatusRegistration,
}
const actionContentComponent = computed(() => actionHeaderComponent[route.name] || null)

</script>

<style scoped>

</style>