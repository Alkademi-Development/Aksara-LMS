<template>
  <div>
    <section class="container-fluid relative overflow-hidden" style="padding: 0px !important;">
      <DetailClassroom />
    </section>
  </div>
</template>

<script>
import DetailClassroom from '@/components/classrooms/pages/DetailClassroom.vue';

export default {
  layout: 'dashboard',
  components: {
    DetailClassroom
  },
}
</script>