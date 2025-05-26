<template>
  <div class="profile-menu position-relative" ref="menuRef">
    <button
      type="button"
      class="w-100 d-flex align-items-center justify-content-between"
      @click="toggleMenu"
    >
      <div class="d-flex align-items-start gap-3">
        <img src="https://drive.alkademi.id/v1/upload/profile/1739443896728.png" alt="Photo Profile" width="40" class="mx-auto">
        <div class="text-start">
          <h5 class="fw-normal">Alkademi</h5>
          <p class="text-sm text-black">Super Admin</p>
        </div>
      </div>
      <i class="ri-arrow-right-s-line text-lg"></i>
    </button>
    <transition name="fade-up">
      <ul
        v-if="showMenu"
        class="w-100 position-absolute bg-white border shadow rounded overflow-hidden"
        style="top: 110%; z-index: 100;"
      >
        <li class="mb-2 py-2 border border-bottom">
          <NuxtLink to="/dashboard/profile" class="px-3 py-1 d-flex align-items-center gap-3 text-black">
            <i class="ri-user-fill text-lg"></i>
            <span>Profile</span>
          </NuxtLink>
        </li>
        <li class="py-2">
          <NuxtLink to="/dashboard/profile" class="px-3 py-1 d-flex align-items-center gap-3 text-black">
            <i class="ri-run-fill text-lg"></i>
            <span>Logout</span>
          </NuxtLink>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showMenu = ref(false);
const menuRef = ref(null);

function toggleMenu() {
  showMenu.value = !showMenu.value
}
// Native document click listener
function handleProfileMenuClick(e) {
  // Jika menu tidak terbuka, abaikan
  if (!showMenu.value) return
  // Jika klik di dalam menu, abaikan
  if (menuRef.value && menuRef.value.contains(e.target)) return
  // Jika klik di luar, tutup menu
  showMenu.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleProfileMenuClick)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleProfileMenuClick)
})

// Jika ingin lebih optimal, add/remove listener hanya saat showMenu true
watch(showMenu, (val) => {
  if (val) {
    document.addEventListener('mousedown', handleProfileMenuClick)
  } else {
    document.removeEventListener('mousedown', handleProfileMenuClick)
  }
})

</script>

<style lang="scss" scoped>
.profile-menu {
  // ... menu item hover as before ...
  ul li a {
    transition: all 0.2s ease-in;
    &:hover {
      background-color: var(--light);
      i, span { color: var(--primary); }
    }
  }
}
/* Fade-up transition */
.fade-up-enter-active, .fade-up-leave-active {
  transition: opacity 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1);
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
.fade-up-enter-to, .fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>