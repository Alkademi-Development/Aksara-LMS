<template>
    <nav class="block h-100 px-3 py-2">
        <img src="https://studio.alkademi.id/img/logo-alkademi.png" height="35" class="w-100" alt="Photo Profile">
        <ul class="d-flex align-items-center justify-content-center flex-column mt-4 gap-3">
            <template v-if="compilerType === 'web'">
                <li>
                    <button type="button">
                        <i class="ri-code-s-slash-line text-xl text-primary"></i>
                    </button>
                </li>
                <li>
                    <button type="button">
                        <i class="ri-computer-line text-xl"></i>
                    </button>
                </li>
            </template>
            <template v-else>
                <li>
                    <button type="button">
                        <i class="ri-braces-fill text-xl text-primary"></i>
                    </button>
                </li>
            </template>
        </ul>
    </nav>
</template>

<script setup>

const compilerType = inject('compilerType');

</script>

<style lang="scss">

</style>