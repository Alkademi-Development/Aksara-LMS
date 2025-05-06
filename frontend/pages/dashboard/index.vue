<template>
    <div>

    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const loading = ref(true)

// Akses state menggunakan computed
const { status, message, settings, appVersion } = computed(() => store.state.sass)

onMounted(async () => {
  await store.dispatch('sass/allSettings', { version: '1.0.0' })
  loading.value = false
})
</script>

<style scoped>

</style>