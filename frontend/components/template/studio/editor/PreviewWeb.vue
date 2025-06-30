<template>
  <div class="editor-preview flex-grow-1">
    <!-- Header Editor -->
    <div class="editor-header d-flex align-items-center justify-content-between px-3 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <i class="ri-code-box-line mr-2"></i>
        <h4 class="editor-language font-weight-bold">Studio</h4>
      </div>
      <ul class="editor-header-display d-flex align-items-center gap-2 m-0">
        <li>
          <button
            type="button"
            class="border-0 appearance-none"
            :class="{ active: previewDevice === 'mobile' }"
            @click="$emit('update:previewDevice', 'mobile')"
            title="Mobile"
          >
            <i class="ri-smartphone-line"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            class="border-0 appearance-none"
            :class="{ active: previewDevice === 'tablet' }"
            @click="$emit('update:previewDevice', 'tablet')"
            title="Tablet"
          >
            <i class="ri-tablet-line"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            class="border-0 appearance-none"
            :class="{ active: previewDevice === 'desktop' }"
            @click="$emit('update:previewDevice', 'desktop')"
            title="Desktop"
          >
            <i class="ri-computer-line"></i>
          </button>
        </li>
      </ul>
    </div>
    <!-- Preview Web -->
    <div
      class="preview-main h-100"
      :class="{
        'preview-mobile': previewDevice === 'mobile',
        'preview-tablet': previewDevice === 'tablet',
        'preview-desktop': previewDevice === 'desktop'
      }"
    >
      <iframe :srcdoc="executedCode" frameborder="0" width="100%" height="100%" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewWeb',
  props: {
    previewDevice: {
      type: String,
      default: ''
    },
    executedCode: {
      type: String,
      default: '',
    }
  }
}
</script>

<style scoped>

</style>