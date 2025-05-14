<template>
    <div class="output-wrapper position-relative px-3 py-2 d-none d-lg-flex flex-column gap-2">
        <div class="d-flex align-items-center gap-2">
            <span class="text-danger">~ [Mei 13, 25 10:04:31]</span>
            <span>></span>
            <span>wadidaw</span>
        </div>
        <button class="delete-console position-absolute px-2 py-1 rounded text-danger border border-danger" style="top: 10px; right: 20px;" v-if="compilerType === 'preview-web'">
            <i class="ri-delete-bin-line text-xl"></i>
        </button>
    </div>
</template>

<script setup>

const compilerType = inject('compilerType');

</script>

<style lang="scss" scoped>

</style>