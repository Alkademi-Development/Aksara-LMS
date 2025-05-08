<template>
    <section>
        <component
        :is="{
            overview: Overview,
            assignment: Assignment,
            activity: Activity
        }[activeTab] || Overview"
        />
    </section>
</template>

<script setup>
import { useStore } from 'vuex'

import Overview from "@/components/pages/classroom/Overview.vue";
import Assignment from "@/components/pages/classroom/Assignment.vue";
import Activity from "@/components/pages/classroom/Activity.vue";

const store = useStore()

onMounted(() => {
  store.dispatch('tabsClassroom/resetTab')
})

const activeTab = computed(() => store.getters['tabsClassroom/activeTab'])

</script>

<style scoped>

</style>