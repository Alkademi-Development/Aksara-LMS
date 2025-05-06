<template>
    <div>
        <Breadcrumb />
        <slot></slot>
    </div>
</template>

<script setup>
import Breadcrumb from "@/components/partials/Breadcrumb.vue"
import { useStore } from 'vuex'
import { useSeo } from '~/composables/useSeo'

const store = useStore()
const settings = computed(() => store.state.sass.settings)
const classState = computed(() => store.state.class)
const courseState = computed(() => store.state.courses)

useSeo({
  layout: settings.value?.layout || 'alkademi',
  siteName: settings.value?.title || 'Alkademi',
  stores: {
    setting: settings.value || {},
    class: classState.value || {},
    course: courseState.value || {},
  }
})
</script>

<style>
</style>