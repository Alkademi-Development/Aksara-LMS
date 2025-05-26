<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0,0,0,0.35);"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-0">
        <div class="modal-header">
          <h5 class="modal-title">Preview</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body d-flex justify-content-center align-items-center">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Preview"
            class="img-fluid rounded"
            style="max-height:400px; object-fit:contain;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  imageUrl: String
});
const emit = defineEmits(['close']);

function close() {
  emit('close');
}
</script>