<template>
  <div>
      <section class="container-fluid relative overflow-hidden" style="padding: 0px !important;">
          <DetailModuleEditor />
      </section>
  </div>
</template>

<script>
import DetailModuleEditor from "@/components/courses/DetailModuleEditor.vue"

export default {
  layout: 'dashboard',
  components: {
      DetailModuleEditor
  },
}
</script>