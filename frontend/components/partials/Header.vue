<template>
  <header class="position-sticky top-0" style="z-index: 99;">
      <div
          class="bg-white border-bottom container px-4 pt-5"
      >
        <div class="d-grid align-items-start justify-content-between" style="grid-template-columns: 1fr auto; align-items: start; gap: 1rem; min-width: 0;">
          <div class="overflow-hidden">
              <Breadcrumb />
          </div>
          <button
              type="button"
              @click="$emit('toggle-sidebar')"
              class="d-block d-xl-none px-2 py-1 rounded bg-white border"
          >
              <i :class="`${sidebarShowIcon} text-lg`"></i>
          </button>
        </div>
        <div :class="['pt-2 d-flex align-items-center flex-wrap flex-md-nowrap justify-content-between', extraContentHeader ? 'pb-2' : 'pb-3']">
          <h2 class="fw-medium">{{ breadcrumbs[breadcrumbs.length - 1]?.title || '' }}</h2>
          <component 
            :is="actionHeader?.component"
            v-bind="actionHeader?.props"
            :key="route.name + '-action'"
            v-if="actionHeader"
          />
        </div>
          
        <component 
          :is="extraContentHeader?.component"
          v-bind="extraContentHeader?.props"
          :key="route.name + '-extra'"
          v-if="extraContentHeader"
        />
      </div>
  </header>
</template>

<script setup>
import Breadcrumb from "@/components/partials/Breadcrumb.vue"
import { extraHeaderComponents, actionHeaderComponents } from '@/utils/constants/header'
import { breadcrumbTitleMap } from '~/utils/constants/breadcrumb'
import { formatBreadcrumbSegment, truncateWords } from '~/utils/breadcrumb'

const props = defineProps({
isSidebarVisible: Boolean
})

const sidebarShowIcon = computed(() =>
props.isSidebarVisible ? 'ri-close-line' : 'ri-menu-line'
)

const route = useRoute()
const currentRouteName = ref(route.name)

watch(() => route.name, (newName) => {
  currentRouteName.value = newName
})

const extraContentHeader = computed(() => {
  const config = extraHeaderComponents[currentRouteName.value]
  if (!config) return null

  return {
    component: defineAsyncComponent(config.component),
    props: config.props || {}
  }
})

const actionHeader = computed(() => {
  const config = actionHeaderComponents[currentRouteName.value]
  if (!config) return null

  return {
    component: defineAsyncComponent(config.component),
    props: config.props || {}
  }
})

const isMobile = ref(false)

const updateIsMobile = () => isMobile.value = window.innerWidth < 576;

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const segments = computed(() => route.path.split('/').filter(Boolean))

const breadcrumbs = computed(() => {
  const crumbs = []
  let pathAcc = ''

  for (const segment of segments.value) {
    // Skip numeric segments
    if (!isNaN(Number(segment))) continue

    pathAcc += `/${segment}`

    const translated = breadcrumbTitleMap[pathAcc] || formatBreadcrumbSegment(segment)
    crumbs.push({
      to: pathAcc,
      truncateTitle: String(truncateWords(translated))?.toUpperCase(),
      title: translated
    })
  }

  return crumbs
})

</script>

<style scoped>

</style>