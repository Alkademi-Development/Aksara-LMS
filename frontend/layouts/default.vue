<template>
    <div class="d-flex min-vh-100">
        <aside class="bg-white border-end">
            <Sidebar />
        </aside>
        <main class="flex-grow-1 min-vh-100 bg-light">
            <header class="bg-white border-bottom px-4 py-5">
                <Breadcrumb />
            </header>
            <div class="p-4">
                <slot></slot>
            </div>
        </main>
    </div>
</template>

<script setup>
import Sidebar from "@/components/partials/Sidebar.vue"
import Breadcrumb from "@/components/partials/Breadcrumb.vue"

</script>

<style>
</style>