<template>
  <div class="container-fluid mt-4">
          
      <div class="row">
          
          <CourseForm action="create"/>
          
      </div>

  </div>
</template>

<script>
import CourseForm from "@/components/template/micro/form/CourseForm"


export default {
layout: 'dashboard',
  components: {
    CourseForm
  },
}
</script>