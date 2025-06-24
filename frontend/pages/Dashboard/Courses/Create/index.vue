<template>
    <div class="container-fluid mt-4">
            
        <div class="row">
            
            <CourseForm action="create"/>
            
        </div>
        
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import CourseForm from "@/components/template/micro/form/CourseForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    CourseForm
  },

}
</script>