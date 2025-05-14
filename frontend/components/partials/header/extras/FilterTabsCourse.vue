<template>
    <div class="d-flex align-items-center justify-content-between overflow-x-scroll hide-scrollbar max-w-sm xs:max-w-max">
        <ul class="d-flex align-items-center gap-4">
            <li
                v-for="{ tab, name } of tabs"
                :key="tab"
                :class="[
                    'py-3 text-sm',
                    activeTab === tab ? 'border-primary border-3 border-bottom fw-bolder' : ''
                ]"
            >
                <button type="button" @click="selectTab(tab)" :class="[activeTab === tab ? 'fw-medium' : '']">
                    {{ name.toUpperCase() }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';

const tabs = [
    {
        name: 'DRAFT',
        tab: 'draft'
    },
    {
        name: 'PUSTAKA',
        tab: 'library'
    },
    {
        name: 'MATERI SAYA',
        tab: 'myCourse'
    },
];

const store = useStore()
const activeTab = computed(() => store.getters['tabsLibrary/activeTab'])

function selectTab(tab) {
  store.dispatch('tabsLibrary/setActiveTab', tab)
}

</script>

<style scoped>

</style>