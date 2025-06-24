<template>
    <div class="container-fluid mt-4">
            
        <ProgramForm />
        
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import ProgramForm from "@/components/template/micro/form/ProgramForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    ProgramForm
  }

}
</script>