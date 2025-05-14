<template>
    <div class="w-100 max-w-lg d-flex align-items-center filter-bundle border border-primary rounded">
        <BDropdown text="Sort" variant="outline-primary" class="border-end border-secondary">
            <template #button-content>
                <div class="d-flex align-items-center gap-1">
                    <i class="ri-arrow-up-down-fill me-1"></i>
                    <span class="text-sm">Sort</span>
                    <i class="ri-arrow-down-s-line ms-1"></i>
                </div>
            </template>
            <BDropdownItem>First Action</BDropdownItem>
            <BDropdownItem>Second Action</BDropdownItem>
            <BDropdownItem>Third Action</BDropdownItem>
        </BDropdown>
        <div class="search-wrapper px-2 w-100 d-flex align-items-center">
            <i class="ri-search-line text-md"></i>
            <BFormInput v-model="text" placeholder="Cari berdasarkan nama materi" class="w-100 text-sm" />
        </div>
    </div>
</template>

<script setup>
import "@/assets/css/modules/partials/filter-search-and-sort.module.scss";
import { BDropdown, BDropdownItem, BFormInput } from "bootstrap-vue-next";

const search = ref('')
</script>

<style lang="scss" scoped>
::v-deep(.dropdown-toggle::after) {
  display: none !important;
}
</style>