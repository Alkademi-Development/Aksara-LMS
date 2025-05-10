import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { get } from 'lodash-es'
import { SEO_CONFIG } from '@/utils/constants/seo'

function stripHtml(text) {
  if (!text) return ''
  return text.replace(/<[^>]+>/g, '')
}

function resolveValue(entry, config) {
    const { stores = {} } = config
  
    if (entry?.isDynamic && entry?.storePath != '') {
      const [storeName, ...path] = entry.storePath.split('.')
      const store = stores[storeName]
      if (store) {
        return get(store, path.join('.')) || ''
      }
    }

    console.log(entry)
  
    return entry?.static || ''
}
  

export function useSeo(config = {}) {
  const route = useRoute()

  const layoutKey = config.layout || 'alkademi'
  const seoSource = SEO_CONFIG[layoutKey] || SEO_CONFIG['alkademi']

  const pageKey = computed(() => {
    const segments = route.matched.map(r => r.path.split('/').filter(Boolean))
    const flatSegments = segments.flat()
    const replaced = flatSegments.map(s => s.startsWith(':') ? 'slug' : s)
    return replaced.join('-') || 'index'
  })

  console.log(pageKey)

  const seoData = computed(() => {
    return seoSource[pageKey.value] || seoSource['index']
  })

  const resolveTitle = (entry) => {
    let title = resolveValue(entry, config)

    if (entry?.withSitename && title) {
      title = `${title} | ${config?.siteName || 'Alkademi'}`
    }

    return title || ''
  }

  const resolveDescription = (entry) => {
    let desc = resolveValue(entry, config)

    if (entry?.withStripHtml && typeof desc === 'string') {
      desc = stripHtml(desc)
    }

    return desc || ''
  }

  const resolveImage = (entry) => {
    let image = resolveValue(entry, config)

    if (entry?.isAddOrigin && image && typeof window !== 'undefined') {
      image = window.location.origin + image
    }

    return image || ''
  }

  const head = computed(() => {
    const meta = seoData.value
    return {
      title: resolveTitle(meta.title),
      meta: [
        { name: 'description', content: resolveDescription(meta.description) },

        { property: 'og:title', content: resolveTitle(meta.og.title) },
        { property: 'og:description', content: resolveDescription(meta.og.description) },
        { property: 'og:image', content: resolveImage(meta.og.image) },

        { name: 'twitter:title', content: resolveTitle(meta.twitter.title) },
        { name: 'twitter:description', content: resolveDescription(meta.twitter.description) },
        { name: 'twitter:image', content: resolveImage(meta.twitter.image) },

        { itemprop: 'name', content: resolveTitle(meta.itemprop.name) },
        { itemprop: 'description', content: resolveDescription(meta.itemprop.description) },
        { itemprop: 'image', content: resolveImage(meta.itemprop.image) }
      ]
    }
  })

  useHead(head)
}
