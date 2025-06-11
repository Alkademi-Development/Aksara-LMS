<template>
  <div class="container-fluid bg-white p-4">        
      <CourseForm 
          action="create"
          customClass="pb-4" 
          :isCard="false"
      />
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