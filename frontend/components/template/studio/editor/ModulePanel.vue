<template>
  <!-- Panel Modul -->
  <div class="studio-module h-100 flex-shrink-0 d-none d-lg-block">
    <iframe
      class="module-iframe"
      :src="moduleUrl"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
import ModuleIFrame from '~/components/template/studio/ModuleIFrame.vue';

export default {
  name: 'ModulePanel',
  components: {
    ModuleIFrame
  },
  props: {
    moduleUrl: {
      type: String,
      default: ''
    },
    isModuleVisible: {
      type: Boolean,
      default: false
    },
  }
}
</script>

<style scoped>

</style>