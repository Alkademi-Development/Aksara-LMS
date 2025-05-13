<template>
    <section class="d-flex min-vh-100 overflow-hidden" v-if="!isLoading">

        <!-- Sidebar -->
        <aside class="position-sticky top-0 vh-100 h-100 max-w-max">
            <Sidebar />
        </aside>

        <!-- Main -->
        <main class="flex-grow-1 min-vh-100 overflow-hidden">
            <TopHeader />

            <SplitterGroup direction="horizontal" class="h-100">
                <SplitterPanel :default-size="35" class="d-none d-lg-block">
                    <Viewer />
                </SplitterPanel>
                <SplitterResizeHandle class="relative d-none d-lg-flex align-items-center justify-content-center" style="width: 0;">
                    <i
                        class="resize-icon ri-more-2-fill border rounded p-1 text-xxs z-3"
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
</template>

<script setup>
import "@/assets/css/modules/pages/compiler.module.scss";
import Sidebar from "@/components/editor/monaco/Sidebar.vue";
import TopHeader from "@/components/editor/monaco/TopHeader.vue";
import Viewer from "@/components/editor/monaco/Viewer.vue";
import EditorArea from "@/components/editor/monaco/EditorArea.vue";
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

const isDark = ref(false)
const isLoading = ref(true);

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
provide('toggleDark', toggleDark)

</script>

<style lang="scss" scoped>
</style>