<template>
    <div class="d-flex">
    
        <transition name="fade-right">
            <aside
                :class="[
                'module-sidebar d-flex flex-column position-fixed border-end bg-white max-w-xs w-100',
                isSidebarExpanded ? 'expanded' : 'collapsed',
                ]"
            >
                <button
                    class="expand-sidebar-btn d-flex d-lg-none align-items-center justify-content-center"
                    @click="toggleSidebar"
                >
                <i
                    :class="isSidebarExpanded ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'"
                    class="text-white text-2xl"
                ></i>
                </button>
                <div class="py-5 px-4 d-flex flex-column flex-grow-1">
                    <ul class="d-flex flex-column gap-3 flex-grow-1">
                        <li>
                        <NuxtLink to="#" class="d-flex align-items-center gap-2 text-primary">
                            <i class="ri-sticky-note-line text-lg"></i>
                            <span class="fw-medium text-limit limit-1">Overview</span>
                        </NuxtLink>
                        </li>
                        <li class="d-flex align-items-center gap-2">
                        <NuxtLink to="#" class="d-flex align-items-center gap-2 text-black">
                            <i class="ri-file-list-line text-lg"></i>
                            <span class="fw-medium text-limit limit-1">BAB 1 – Yuk Kenalan dengan Algoritma!</span>
                        </NuxtLink>
                        <div class="d-flex align-items-center gap-1">
                            <button type="button"><i class="ri-pencil-line text-lg"></i></button>
                            <button type="button" class="text-danger"><i class="ri-delete-bin-line text-lg"></i></button>
                        </div>
                        </li>
                    </ul>
                <div class="mt-auto">
                    <NuxtLink to="#" class="btn btn-primary w-100">
                    Tambah Module +
                    </NuxtLink>
                </div>
                </div>
            </aside>
        </transition>
  
        <main class="module-main-content flex-grow-1 ps-4 pe-3 py-5">
            <CardOverviewCourse v-if="activeModule === 'overview'" />
            <CardModule v-else />
        </main>
    </div>
</template>

<script setup>
import CardOverviewCourse from '~/components/cards/CardOverviewCourse.vue';
import CardModule from '~/components/cards/CardModule.vue';

const activeModule = 'overview';

const isSidebarExpanded = ref(false)

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value
}

const checkScreenSize = () => {
  const tabletMediaQuery = window.matchMedia('(min-width: 992px)')
  isSidebarExpanded.value = tabletMediaQuery.matches;
}

onMounted(() => {
  checkScreenSize()

  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

</script>
  
<style lang="scss" scoped>

.expand-sidebar-btn {
  background-color: var(--primary); /* Warna tombol */
  border: none;
  border-radius: 0 15px 15px 0;
  color: white;
  width: 25px;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: absolute;
  right: -25px; /* Tetap terlihat di luar sidebar */
  top: 30%; /* Posisikan di tengah secara vertikal */
  transform: translateY(-50%);
  z-index: 15; /* Pastikan tombol di atas sidebar */

  i {
    // transform: translateX(2px);
  }
}

.module-sidebar {
    top: 16.5%; 
    height: calc(100vh - 120px);
    z-index: 10; 
    transition: transform 0.3s ease-in-out; /* Transisi hanya untuk posisi */

    &.collapsed {
        transform: translateX(-320px); /* Sidebar tersembunyi tetapi tombol tetap terlihat */
    }

    &.expanded {
        transform: translateX(0); /* Sidebar muncul sepenuhnya */
    }
}
  
.module-main-content {
    margin-left: 320px; /* Pastikan ada ruang untuk sidebar */
    transition: margin-left 0.3s ease-in-out;
    
    @media (max-width: 992px) {
        margin-left: 0px;
    }

    &.collapsed {
        margin-left: 40px; /* Jika sidebar tersembunyi */
    }
}
</style>