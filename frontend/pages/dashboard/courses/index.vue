<template>
    <section class="px-1">
        <component
        :is="{
            draft: Draft,
            library: Library,
            myCourse: MyCourse
        }[activeTab] || Overview"
        />
    </section>
</template>

<script setup>
import { useStore } from 'vuex'
import Draft from "@/components/pages/dashboard/courses/Draft.vue";
import Library from "@/components/pages/dashboard/courses/Library.vue";
import MyCourse from "@/components/pages/dashboard/courses/MyCourse.vue";

const store = useStore()

onMounted(() => {
  store.dispatch('tabsLibrary/resetTab')
})

const activeTab = computed(() => store.getters['tabsLibrary/activeTab'])

</script>

<style lang="scss" scoped>

</style>