<template>
  <div>
    <Table
      :per-page="3"
      :items="items"
      :fields="fields"
      @edit="handleEdit"
      @delete="promptDelete"
    >
      <template #cell(actions)="data">
        <div class="d-flex align-items-center gap-2">
          <NuxtLink to="/dashboard/studio/compiler" class="btn btn-sm btn-info">
            <i class="ri-eye-line"></i>
          </NuxtLink>
          <button class="btn btn-sm btn-primary" @click="data.emit('edit', data.item)">Edit</button>
          <button class="btn btn-sm btn-danger" @click="data.emit('delete', data.item)">Delete</button>
        </div>
      </template>
    </Table>

    <!-- Modal Konfirmasi -->
    <ModalConfirmation
      v-model:show="showDeleteModal"
      title="Konfirmasi Hapus"
      :itemName="itemName"
      @ok="confirmDelete"
      @cancel="handleCancel"
      ok-title="Iya"
      cancel-title="Tidak"
      ok-variant="danger"
    />
  </div>
</template>

<script setup>
import Table from '@/components/ui/Table.vue'
import ModalConfirmation from '@/components/ui/modals/ModalConfirmation.vue'

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

const showDeleteModal = ref(false)
const selectedItem = ref(null)

const itemName = computed(() => {
  if (selectedItem.value) {
    return `${selectedItem.value.first_name} ${selectedItem.value.last_name}`
  }
  return ''
})

function handleEdit(item) {
  console.log('Edit:', item)
}

function handleCancel() {
  showDeleteModal.value = false
  selectedItem.value = null
}

function promptDelete(item) {
  selectedItem.value = item
  showDeleteModal.value = true
}

function confirmDelete() {
  items.value = items.value.filter(i => i.id !== selectedItem.value.id)
  showDeleteModal.value = false
  selectedItem.value = null
}
</script>
