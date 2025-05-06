import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { breadcrumbTranslations } from '@/utils/breadcrumbTranslations'

export function useBreadcrumb(fetchTitleMap = {}) {
  const route = useRoute()
  const router = useRouter()

  const pathSegments = computed(() => {
    const segments = route.path.split('/').filter(Boolean)
    return segments
  })

  const isNumeric = (str) => /^\d+$/.test(str)

  const truncate = (text, words = 3) => {
    const split = text.split(' ')
    return split.length > words ? split.slice(0, words).join(' ') + '...' : text
  }

  const getPathUntil = (index) => {
    return '/' + pathSegments.value.slice(0, index + 1).join('/')
  }

  const breadcrumbs = computed(() => {
    const crumbs = []
    let skipNext = false

    pathSegments.value.forEach((seg, i) => {
      if (isNumeric(seg)) {
        skipNext = false
        return // Skip numeric id
      }

      let label = breadcrumbTranslations[seg] || seg.replace(/-/g, ' ')
      const fullPath = getPathUntil(i)

      if (fetchTitleMap[fullPath]) {
        label = truncate(fetchTitleMap[fullPath])
      }

      crumbs.push({ label, path: fullPath })
    })

    return crumbs
  })

  const showGoBack = computed(() => breadcrumbs.value.length > 1)

  const tryNavigateBack = async (index) => {
    if (index < 0) return // stop if no more crumbs
  
    const target = breadcrumbs.value[index]
    try {
      await router.push(target.to)
    } catch (err) {
      // if navigation failed (e.g., route doesn't exist), go to previous
      tryNavigateBack(index - 1)
    }
  }
  
  const goBack = () => {
    if (breadcrumbs.value.length > 1) {
      const backPath = breadcrumbs.value[breadcrumbs.value.length - 2].path
      router.push(backPath)
    }
  }

  return {
    breadcrumbs,
    showGoBack,
    goBack
  }
}
