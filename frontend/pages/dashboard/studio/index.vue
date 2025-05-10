<template>
  <div>
    <Table
      :per-page="3"
      :items="items"
      :fields="fields"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #cell(actions)="data">
        <button class="btn btn-sm btn-primary me-1" @click="data.emit('edit', data.item)">Edit</button>
        <button class="btn btn-sm btn-danger" @click="data.emit('delete', data.item)">Delete</button>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import Table from '@/components/ui/Table.vue'

const items = ref([
  { id: 1, first_name: 'Fred', last_name: 'Flintstone' },
  { id: 2, first_name: 'Wilma', last_name: 'Flintstone' },
  { id: 3, first_name: 'Barney', last_name: 'Rubble' },
  { id: 4, first_name: 'Betty', last_name: 'Rubble' },
  { id: 5, first_name: 'Pebbles', last_name: 'Flintstone' },
  { id: 6, first_name: 'Bamm Bamm', last_name: 'Rubble' },
  { id: 7, first_name: 'The Great', last_name: 'Gazzoo' },
  { id: 8, first_name: 'Rockhead', last_name: 'Slate' },
  { id: 9, first_name: 'Pearl', last_name: 'Slaghoople' }
])

const fields = [
  { key: 'id', label: 'No' },
  { key: 'first_name', label: 'Nama Depan' },
  { key: 'last_name', label: 'Nama Belakang' },
  { key: 'actions', label: 'Aksi' }
]

function handleEdit(item: any) {
  console.log('Edit:', item)
}

function handleDelete(item: any) {
  console.log('Delete:', item)
}
</script>
