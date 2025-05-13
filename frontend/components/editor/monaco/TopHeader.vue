<template>
    <header class="pt-3 pb-4 px-3">
        <div class="d-flex align-items-center justify-content-between">
            <h3>Front End Challenge #1 Simple Personal Portfolio Page</h3>
            <div class="d-none d-lg-flex align-items-center gap-3 btn-secondary">
                <button @click="toggleDark" class="px-2 py-1 rounded">
                    <i :class="[isDark ? 'ri-moon-clear-fill text-primary' : 'ri-sun-fill text-black']" class="text-2xl"></i>
                </button>
                <button type="button">
                    <img src="https://studio.alkademi.id/img/logo-alkademi.png" height="35" class="w-100" alt="Photo Profile">
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
const isDark = inject('isDark')
const toggleDark = inject('toggleDark')

</script>

<style lang="scss" scoped>
</style>