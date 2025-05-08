<template>
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb-scroll">
        <button
          v-if="breadcrumbs.length > 1"
          @click="goBack"
          class="bg-white px-2 py-1 rounded border text-black hover:underline whitespace-nowrap me-2"
        >
          <i class="ri-arrow-left-s-line"></i>
        </button>
  
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <span
                v-if="index === breadcrumbs.length - 1"
                class="text-sm text-primary font-semibold whitespace-nowrap"
            >
                {{ crumb.truncateTitle }}
            </span>
            <NuxtLink
                v-else
                :to="crumb.to"
                class="text-sm text-black hover:underline whitespace-nowrap"
            >
                {{ crumb.truncateTitle }}
            </NuxtLink>
            <span v-if="index < breadcrumbs.length - 1" class="mx-1">
              <i class="ri-arrow-right-s-line"></i>
            </span>
        </template>
      </div>
      <h2 class="mt-3 mb-2 fw-medium">{{ breadcrumbs[breadcrumbs.length - 1]?.title || '' }}</h2>
    </div>
  </template>
  
<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'
  import { breadcrumbTitleMap } from '~/utils/constants/breadcrumb'
  import { formatBreadcrumbSegment, truncateWords } from '~/utils/breadcrumb'
  
  const route = useRoute()
  const router = useRouter()
  
  const segments = computed(() => route.path.split('/').filter(Boolean))
  
  const breadcrumbs = computed(() => {
    const crumbs = []
    let pathAcc = ''
  
    for (const segment of segments.value) {
      // Skip numeric segments
      if (!isNaN(Number(segment))) continue
  
      pathAcc += `/${segment}`
  
      const translated = breadcrumbTitleMap[segment] || formatBreadcrumbSegment(segment)
      crumbs.push({
        to: pathAcc,
        truncateTitle: String(truncateWords(translated))?.toUpperCase(),
        title: translated
      })
    }
  
    return crumbs
  })
  
  // Go back to previous path
  const goBack = () => {
    const crumbs = breadcrumbs.value
    if (crumbs.length > 1) {
      const target = crumbs[crumbs.length - 2]
      router.push(target.to)
    }
  }
  
  // Manage overflow - simple rule: show first 3, rest in dropdown
  const visibleBreadcrumbs = computed(() => breadcrumbs.value.slice(0, 3))
  const hiddenBreadcrumbs = computed(() => breadcrumbs.value.slice(3))
  </script>
  
<style scoped>
.breadcrumb-scroll {
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: 0.5rem;
  overflow-x: auto;
  max-width: 100%;
  min-width: 0;
  padding-bottom: 4px;

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.breadcrumb-wrapper {
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
  