<template>
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb-scroll">
        <button
          v-if="breadcrumbs.length > 1"
          @click="goBack"
          class="text-blue-500 hover:underline whitespace-nowrap mr-2"
        >
          Go Back
        </button>
  
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <span
                v-if="index === breadcrumbs.length - 1"
                class="text-gray-900 font-semibold whitespace-nowrap"
            >
                {{ crumb.title }}
            </span>
            <NuxtLink
                v-else
                :to="crumb.to"
                class="text-gray-700 hover:underline whitespace-nowrap"
            >
                {{ crumb.title }}
            </NuxtLink>
            <span v-if="index < breadcrumbs.length - 1" class="mx-1">></span>
        </template>
      </div>
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
        title: truncateWords(translated)
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
.breadcrumb-wrapper {
  width: 100%;
  overflow-x: auto;
}

.breadcrumb-scroll {
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: 0.5rem;
  padding-bottom: 4px;

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
  