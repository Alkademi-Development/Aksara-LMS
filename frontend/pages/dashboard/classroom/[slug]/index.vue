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
import Overview from "@/components/pages/classroom/Overview.vue";
import Assignment from "@/components/pages/classroom/Assignment.vue";
import Activity from "@/components/pages/classroom/Activity.vue";
import { useStore } from 'vuex'

const store = useStore()

const status = computed(() => store.state.class.status)
const message = computed(() => store.state.class.message)
const data = computed(() => store.state.class.data)

onMounted(async () => {
  await store.dispatch('class/overview', { slug: 'fundamental-c---programming' })
})

onMounted(() => {
  store.dispatch('tabsClassroom/resetTab')
})

const activeTab = computed(() => store.getters['tabsClassroom/activeTab'])

</script>

<style scoped>

</style>