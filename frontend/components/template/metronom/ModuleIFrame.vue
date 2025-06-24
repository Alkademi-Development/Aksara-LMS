<template>
  <div class="h-100">
    <iframe
      v-if="project?.module"
      ref="refEl"
      :src="project.module.replace('/view', '/preview')"
      frameborder="0"
      class="h-full w-full"
    ></iframe>
    <div class="d-flex align-items-center justify-content-center h-100">
      <h4>Belum ada modul</h4>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        project: {
          module: ""
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>