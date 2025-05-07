<template>
    <div class="d-flex min-vh-100">
        <transition name="fade-right">
            <aside
                v-show="isSidebarVisible"
                :class="`${isMobile ? 'position-absolute' : 'position-relative'} bg-white border-end sidebar-transition`"
            >
                <Sidebar />
            </aside>
        </transition>
        <main class="flex-grow-1 min-vh-100 bg-light">
            <Header 
                :isSidebarVisible="isSidebarVisible"
                @toggle-sidebar="isSidebarVisible = !isSidebarVisible" 
            />
            <div class="p-4">
                <slot></slot>
            </div>
        </main>
    </div>
</template>

<script setup>
// import styles from "@/assets/css/modules/layouts/default.module.scss"
import Sidebar from "@/components/partials/Sidebar.vue"
import Header from "@/components/partials/Header.vue"

const isSidebarVisible = ref(true)

const isMobile = ref(false)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 1200
  if (window.innerWidth > 1200) isSidebarVisible.value = true;
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
.fade-right-transition {
  transition: all 0.1s ease;
}

.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.1s ease;
}
</style>