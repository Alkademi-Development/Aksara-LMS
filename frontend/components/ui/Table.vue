<template>
  <div class="card">
    <div :class="style.tableWrapper">
        <BTable
          :items="paginatedItems"
          :fields="fields"
          small
          responsive
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotData">
            <slot
              :name="slotName"
              v-bind="{ ...slotData, emit }"
            />
          </template>
        </BTable>
    
        <BPagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          align="center"
          class="mt-3"
        />
    </div>
  </div>
</template>

<script setup>
import style from "@/assets/css/modules/ui/table.module.scss";
import { BTable, BPagination } from 'bootstrap-vue-next';

const props = defineProps({
  perPage: { type: Number, default: 3 },
  items: { type: Array, default: () => [] },
  fields: { type: Array, default: () => [] }
})

const emit = defineEmits(['edit', 'delete'])
const currentPage = ref(1)

const rows = computed(() => props.items.length)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.perPage
  return props.items.slice(start, start + props.perPage)
})
</script>
