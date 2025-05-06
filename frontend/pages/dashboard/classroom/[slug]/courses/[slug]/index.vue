<template>
    <div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()

const status = computed(() => store.state.class.status)
const message = computed(() => store.state.class.message)
const data = computed(() => store.state.class.data)

onMounted(async () => {
  await store.dispatch('courses/getCoursesById', { slug: 1 })
})

</script>

<style scoped>

</style>