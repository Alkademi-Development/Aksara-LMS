<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <label class="mb-0">{{ label }} <span class="text-danger" v-if="required">*</span></label>
      <a v-if="fileUrl" class="text-primary text-decoration-none" style="cursor:pointer" 
      @click="showImageModal = true">Preview</a>
    </div>
    <div
      class="w-100 position-relative d-flex align-items-center justify-content-center flex-column"
      :class="[
        'border',
        'rounded-3',
        'bg-white',
        'transition',
      ]"
      :style="{
        borderStyle: 'dashed !important',
        minHeight: minHeight,
        cursor: 'pointer',
        outline: 'none'
      }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="d-none"
        @change="onFileChange"
      />
      <template v-if="fileUrl">
        <div class="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
          <img
            :src="fileUrl"
            alt="preview"
            class="mb-2"
            style="max-width: 180px; max-height: 180px; border-radius: 8px; object-fit: cover; box-shadow: 0 2px 12px rgba(60,60,60,0.08);"
          />
          <div class="small text-muted text-center">{{ fileName }}</div>
          <div class="mt-2">
            <b-button size="sm" variant="outline-danger" @click.stop="removeFile">Hapus</b-button>
          </div>
        </div>
      </template>
      <div v-else class="text-center py-5 w-100">
        <div class="fw-medium">{{ dropzoneText }}</div>
        <div class="mt-2">atau klik untuk upload</div>
      </div>
    </div>
    <p class="text-danger mt-2 mb-0 small" v-if="errorMessage">
        {{ errorMessage }}
    </p>
    <ModalPreviewImage 
        :show="showImageModal"
        :imageUrl="fileUrl"
        @close="showImageModal = false"
    />
  </div>
</template>

<script setup>
import ModalPreviewImage from "@/components/ui/modals/ModalPreviewImage.vue";
import { ref, computed } from "vue";

const props = defineProps({
    required: {
        type: Boolean,
        default: false
    },
    accept: {
        type: String,
        default: "image/*"
    },
    allowedExtensions: {
        type: Array,
        default: () => ['jpg', 'jpeg', 'png', 'webp', 'gif']
    },
    label: {
        type: String,
        default: "Foto Profil"
    },
    dropzoneText: {
        type: String,
        default: "Tarik dan lepaskan file di sini"
    },
    minHeight: {
        type: String,
        default: "220px"
    },
    error: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(["update:file"]);

const fileInput = ref(null);
const isDragging = ref(false);
const fileUrl = ref(null);
const fileName = ref("");
const showImageModal = ref(false);
const errorMessage = computed(() => props.error)

function triggerInput() {
  fileInput.value && fileInput.value.click();
}
function onFileChange(e) {
  const file = e.target.files[0];
  handleFile(file);
}
function onDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  handleFile(file);
}
function onDragOver() {
  isDragging.value = true;
}
function onDragLeave() {
  isDragging.value = false;
}
function handleFile(file) {
  errorMessage.value = "";
  if (!file) return;
  // Validasi ekstensi
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowed = props.allowedExtensions.map(e => e.toLowerCase());
  if (!allowed.includes(ext)) {
    errorMessage.value = `File yang diizinkan: ${allowed.join(', ')}`;
    // Reset preview jika ada file sebelumnya
    if (fileUrl.value) {
      URL.revokeObjectURL(fileUrl.value);
    }
    fileUrl.value = null;
    fileName.value = "";
    emit("update:file", null);
    return;
  }
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value);
  }
  fileUrl.value = URL.createObjectURL(file);
  fileName.value = file.name || "Gambar";
  emit("update:file", file);
}
function removeFile() {
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value);
  }
  fileUrl.value = null;
  fileName.value = "";
  emit("update:file", null);
}
function previewFile() {
  if (fileUrl.value) {
    window.open(fileUrl.value, "_blank");
  }
}
</script>