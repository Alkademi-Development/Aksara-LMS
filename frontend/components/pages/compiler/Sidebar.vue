<template>
    <nav class="block h-100 px-3 py-2">
        <img src="https://studio.alkademi.id/img/logo-alkademi.png" class="w-100 img-fluid" alt="Photo Profile" style="max-width: 30px;">
        <ul class="d-flex align-items-center justify-content-center flex-column mt-4 gap-3">
            <template v-if="compilerType === 'web' || compilerType === 'preview-web'">
                <li>
                    <button type="button" @click="compilerType = 'web'">
                        <i :class="`ri-code-s-slash-line text-xl ${compilerType === 'web' ? 'text-primary' : ''}`"></i>
                    </button>
                </li>
                <li>
                    <button type="button" @click="compilerType = 'preview-web'">
                        <i :class="`ri-computer-line text-xl ${compilerType === 'preview-web' ? 'text-primary' : ''}`"></i>
                    </button>
                </li>
            </template>
            <template v-else>
                <li>
                    <button type="button" @click="compilerType = 'base'">
                        <i :class="`ri-braces-fill text-xl text-primary ${compilerType === 'base' ? 'text-primary' : ''}`"></i>
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