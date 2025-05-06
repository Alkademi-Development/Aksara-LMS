<template>
  <div class="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <img v-if="error?.statusCode == 404" src="@/assets/icons/404.svg" width="300" alt="404 Not Found" class="mb-4">
      <h1 v-else class="text-primary" style="font-size: 8rem;">{{ error?.statusCode }}</h1>
      <h3>{{ titleErrorMessage }}</h3>
      <NuxtLink href="/dashboard/classroom" class="fw-bolder mt-3">Kembali ke halaman utama</NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
    error: Object
})

const titleErrorMessage = computed(() => {
  switch (props?.error?.statusCode) {
    case 404:
      return "Oops... Maaf halaman tidak ditemukan"
    case 401:
      return "Akses tidak diizinkan"
    case 403:
      return "Anda tidak memiliki hak akses"
    case 500:
      return "Terjadi kesalahan pada server"
    default:
      return "Kesalahan tidak diketahui"
  }
})

// Title & Meta Tags
useHead({
  title: `${props?.error?.statusCode} - ${titleErrorMessage.value}`,
})

const handleError = () => clearError({ redirect: "/" })

</script>
