<template>
    <section class="d-flex min-vh-100 overflow-hidden" v-if="!isLoading">

        <!-- Sidebar -->
        <aside class="position-sticky top-0 vh-100 h-100 max-w-max">
            <Sidebar />
        </aside>

        <!-- Main -->
        <main class="flex-grow-1 min-vh-100">
            <TopHeader />

            <SplitterGroup direction="horizontal" class="h-100">
                <SplitterPanel :default-size="35" class="d-none d-lg-block">
                  <Viewer />
                </SplitterPanel>
                <SplitterResizeHandle class="relative d-none d-lg-flex align-items-center justify-content-center" style="width: 0;">
                    <i
                        class="resize-icon ri-more-2-fill border rounded p-1 text-xxs z-2"
                        style="transform: translateY(-50px) rotate(180deg); pointer-events: none;"
                    ></i>
                </SplitterResizeHandle>
                <SplitterPanel :min-size="20" class="overflow-auto">
                    <EditorArea />
                </SplitterPanel>
            </SplitterGroup>
        </main>

    </section>
    <ModalLoading :isLoading="isLoading" v-else />
    <transition name="fade-left">
      <div v-if="showViewerModal" class="modal-wrapper d-block position-fixed z-3 top-0 end-0 bottom-0 start-0">
        <div class="modal-content px-4 pt-2 pb-3 h-100">
          <div class="modal-header d-flex align-items-center justify-content-between gap-2">
            <h3>Front End Challenge #1 Simple Personal Portfolio Page</h3>
            <button type="button" @click="showViewerModal = false;"><i class="ri-close-fill text-2xl"></i></button>
          </div>
          <div class="w-100 h-100 mt-2">
            <Viewer />
          </div>
        </div>
      </div>
    </transition>
</template>

<script setup>
import "@/assets/css/modules/pages/compiler.module.scss";
import Sidebar from "@/components/pages/compiler/Sidebar.vue";
import TopHeader from "@/components/pages/compiler/TopHeader.vue";
import Viewer from "@/components/pages/compiler/Viewer.vue";
import EditorArea from "@/components/pages/compiler/EditorArea.vue";
import ModalLoading from "@/components/ui/modals/ModalLoading.vue";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue';

// Change the layout into blank mode
definePageMeta({
    layout: 'blank'
})

useHead({
  bodyAttrs: {
    class: 'no-scroll'
  }
})

const compilerType = ref('base');
const isDark = ref(false)
const isLoading = ref(true);
const showViewerModal = ref(false);

onMounted(() => {
  const darkMode = localStorage.getItem("dark-mode");
  isDark.value = darkMode == 'true';
  document.documentElement.classList.toggle('dark', isDark.value);
  
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
});

onBeforeRouteLeave(() => {
  localStorage.removeItem('dark-mode')
})

const toggleDark = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('dark-mode', isDark.value);
  
}

provide('isDark', isDark)
provide('compilerType', compilerType)
provide('toggleDark', toggleDark);
provide('showViewerModal', showViewerModal);

</script>

<style lang="scss" scoped>

.fade-left-enter-active,
.fade-left-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

</style>