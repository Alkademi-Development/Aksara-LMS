<template>
    <div class="d-flex min-vh-100">
      <transition name="fade-right">
        <aside
          v-if="isSidebarVisible"
          :class="`position-fixed top-0 start-0 min-vh-100 h-100 bg-white border-end`"
          style="width: 250px; z-index: 100;"
        >
          <Sidebar />
        </aside>
      </transition>
  
      <main
        class="min-vh-100"
        :style="!isMobile && isSidebarVisible ? 'padding-left: 250px; padding-right: 0;' : 'padding-inline: 0;'"
      >
        <Header
          :isSidebarVisible="isSidebarVisible"
          @toggle-sidebar="isSidebarVisible = !isSidebarVisible"
        />
        <div class="position-relative">
          <slot></slot>
        </div>
      </main>
    </div>
</template>

<script setup>
// import styles from "@/assets/css/modules/layouts/default.module.scss"
import Sidebar from "@/components/partials/Sidebar.vue"
import Header from "@/components/partials/Header.vue"
import Breadcrumb from "@/components/partials/Breadcrumb.vue"
import { useStore } from 'vuex'
import { useSeo } from '~/composables/useSeo'

const store = useStore()
const settings = computed(() => store.state.sass.settings)
const classState = computed(() => store.state.class)
const courseState = computed(() => store.state.courses)

useSeo({
  layout: settings.value?.layout || 'alkademi',
  siteName: settings.value?.title || 'Alkademi',
  stores: {
    setting: settings.value || {},
    class: classState.value || {},
    course: courseState.value || {},
  }
});

const isSidebarVisible = ref(true)

const isMobile = ref(false)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 1100

  if (isMobile.value) {
    isSidebarVisible.value = false  
  } else {
    isSidebarVisible.value = true 
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style>
.fade-right-enter-active,
.fade-right-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-right-enter-to,
.fade-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>